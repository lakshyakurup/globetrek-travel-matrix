export interface Schema<T> { parse(input: unknown): T; safeParse(input: unknown): { success: true; data: T } | { success: false; error: Error }; }
export function schema<T>(guard: (input: unknown) => input is T, name: string): Schema<T> { return { parse(input) { if (!guard(input)) throw new Error(`Invalid ${name}`); return input; }, safeParse(input) { return guard(input) ? { success: true, data: input } : { success: false, error: new Error(`Invalid ${name}`) }; } }; }
export const nonEmptyString = schema((input): input is string => typeof input === "string" && input.trim().length > 0, "non-empty string");
export const positiveNumber = schema((input): input is number => typeof input === "number" && Number.isFinite(input) && input > 0, "positive number");
