"use client";
import { useMemo, useState } from "react";
import { simplifyDebts, type Expense } from "@/src/utils/matrixMath";
export default function ExpenseSplitter() {
  const [expenses, setExpenses] = useState<Expense[]>([{ paidBy: "You", amount: 120, participants: ["You", "Alex", "Sam"] }]);
  const [name, setName] = useState("");
  const settlements = useMemo(() => simplifyDebts(expenses), [expenses]);
  return <section><h2>Expense splitter</h2><ul>{settlements.map((item) => <li key={`${item.from}-${item.to}`}>{item.from} pays {item.to} {item.amount.toFixed(2)}</li>)}</ul><input value={name} placeholder="Participant" onChange={(event) => setName(event.target.value)} /><button type="button" onClick={() => { if (name.trim()) { setExpenses((current) => current.map((expense) => ({ ...expense, participants: [...new Set([...expense.participants, name.trim()])] }))); setName(""); } }}>Add traveler</button></section>;
}
