export interface Expense { paidBy: string; amount: number; participants: string[]; }
export interface Settlement { from: string; to: string; amount: number; }
export function simplifyDebts(expenses: Expense[]): Settlement[] {
  const balances = new Map<string, number>();
  for (const expense of expenses) {
    if (expense.amount < 0 || expense.participants.length === 0) throw new Error("Expenses must be non-negative and include participants");
    const share = expense.amount / expense.participants.length;
    balances.set(expense.paidBy, (balances.get(expense.paidBy) ?? 0) + expense.amount);
    expense.participants.forEach((person) => balances.set(person, (balances.get(person) ?? 0) - share));
  }
  const creditors = [...balances].filter(([, amount]) => amount > 0.005).sort((a, b) => b[1] - a[1]);
  const debtors = [...balances].filter(([, amount]) => amount < -0.005).sort((a, b) => a[1] - b[1]);
  const result: Settlement[] = []; let creditorIndex = 0; let debtorIndex = 0;
  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const amount = Math.min(creditors[creditorIndex][1], -debtors[debtorIndex][1]);
    result.push({ from: debtors[debtorIndex][0], to: creditors[creditorIndex][0], amount: Math.round(amount * 100) / 100 });
    creditors[creditorIndex][1] -= amount; debtors[debtorIndex][1] += amount;
    if (creditors[creditorIndex][1] < 0.005) creditorIndex++;
    if (-debtors[debtorIndex][1] < 0.005) debtorIndex++;
  }
  return result;
}
