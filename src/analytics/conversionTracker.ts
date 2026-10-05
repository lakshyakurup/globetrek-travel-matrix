export interface FunnelStep { name: string; users: number; }
export interface FunnelResult { step: string; users: number; conversionRate: number; dropOffRate: number; }

export function calculateFunnel(steps: FunnelStep[]): FunnelResult[] {
  if (!steps.length) return [];
  return steps.map((step, index) => {
    const previous = index ? steps[index - 1].users : step.users;
    return { step: step.name, users: step.users, conversionRate: previous ? step.users / previous : 0, dropOffRate: previous ? 1 - step.users / previous : 0 };
  });
}
