export interface Charge { id: string; travelerId: string; amount: number; category: string; timestamp: string; }
export interface Anomaly extends Charge { zScore: number; reason: string; }

export class AnomalyDetector {
  constructor(private readonly threshold = 3) {}
  detect(charges: Charge[]): Anomaly[] {
    const groups = new Map<string, Charge[]>();
    charges.forEach((charge) => groups.set(charge.category, [...(groups.get(charge.category) ?? []), charge]));
    return charges.flatMap((charge) => {
      const peers = groups.get(charge.category) ?? [];
      const mean = peers.reduce((sum, item) => sum + item.amount, 0) / peers.length;
      const deviation = Math.sqrt(peers.reduce((sum, item) => sum + (item.amount - mean) ** 2, 0) / Math.max(1, peers.length - 1));
      const zScore = deviation ? (charge.amount - mean) / deviation : 0;
      return Math.abs(zScore) >= this.threshold ? [{ ...charge, zScore, reason: `Amount is ${Math.abs(zScore).toFixed(2)} standard deviations from ${charge.category} average` }] : [];
    });
  }
}
