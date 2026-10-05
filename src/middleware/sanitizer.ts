const htmlEntities: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;" };
export function escapeHtml(value: string): string { return value.replace(/[&<>"']/g, (character) => htmlEntities[character]); }
export function scrubText(value: string): string {
  return escapeHtml(value.replace(/(?:--|\/\*|\*\/|;|\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)\b)/gi, " ").replace(/\s+/g, " ").trim());
}
export function sanitizeRecord<T extends Record<string, unknown>>(record: T): T {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [key, typeof value === "string" ? scrubText(value) : value])) as T;
}
