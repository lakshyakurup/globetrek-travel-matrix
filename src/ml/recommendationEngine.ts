export interface DestinationVector { id: string; name: string; features: number[]; tags: string[]; }
export interface Recommendation extends DestinationVector { score: number; }

export function recommendDestinations(profile: number[], destinations: DestinationVector[], limit = 5): Recommendation[] {
  if (!profile.length) return [];
  return destinations.map((destination) => ({ ...destination, score: cosine(profile, destination.features) })).sort((a, b) => b.score - a.score).slice(0, limit);
}

function cosine(left: number[], right: number[]): number {
  const size = Math.min(left.length, right.length);
  const dot = left.slice(0, size).reduce((sum, value, index) => sum + value * right[index], 0);
  const magnitude = Math.sqrt(left.reduce((sum, value) => sum + value ** 2, 0)) * Math.sqrt(right.reduce((sum, value) => sum + value ** 2, 0));
  return magnitude ? dot / magnitude : 0;
}
