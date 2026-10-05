export type SentimentLabel = "positive" | "neutral" | "negative";
export interface SentimentResult { label: SentimentLabel; score: number; tokens: string[]; highlights: string[]; }

const positive = new Set(["amazing", "beautiful", "comfortable", "excellent", "friendly", "great", "memorable", "perfect", "relaxing", "wonderful"]);
const negative = new Set(["awful", "bad", "broken", "crowded", "delay", "dirty", "expensive", "late", "poor", "unsafe"]);

export function analyzeSentiment(text: string): SentimentResult {
  const tokens = text.toLowerCase().match(/[a-z]+/g) ?? [];
  let score = 0;
  for (const token of tokens) score += positive.has(token) ? 1 : negative.has(token) ? -1 : 0;
  const label: SentimentLabel = score > 0 ? "positive" : score < 0 ? "negative" : "neutral";
  return { label, score, tokens, highlights: tokens.filter((token) => positive.has(token) || negative.has(token)) };
}
