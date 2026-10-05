import { randomUUID } from "node:crypto";
export interface SeedTrip { id: string; title: string; destination: string; travelers: string[]; }
export function generateSeed(count = 3): SeedTrip[] { return Array.from({ length: count }, (_, index) => ({ id: randomUUID(), title: `Matrix trip ${index + 1}`, destination: ["Lisbon", "Kyoto", "Patagonia"][index % 3], travelers: ["demo-user", `traveler-${index + 1}`] })); }
