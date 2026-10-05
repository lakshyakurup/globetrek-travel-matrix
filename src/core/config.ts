export interface AppConfig {
  nodeEnv: "development" | "test" | "production";
  port: number;
  apiBaseUrl: string;
  featureFlags: Record<string, boolean>;
}

function booleanValue(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

export function loadConfig(env: Record<string, string | undefined> = process.env): AppConfig {
  const nodeEnv = env.NODE_ENV === "production" || env.NODE_ENV === "test" ? env.NODE_ENV : "development";
  const flags = Object.fromEntries((env.FEATURE_FLAGS ?? "").split(",").filter(Boolean).map((entry) => {
    const [name, value = "true"] = entry.split("=");
    return [name.trim(), booleanValue(value.trim(), true)];
  }));
  return { nodeEnv, port: Number(env.PORT ?? 3000), apiBaseUrl: env.API_BASE_URL ?? "http://localhost:3000", featureFlags: flags };
}
