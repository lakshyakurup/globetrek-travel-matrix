export interface CorsPolicy { origins: string[]; methods?: string[]; headers?: string[]; credentials?: boolean; }
export function applyCors(requestOrigin: string | null, policy: CorsPolicy): Headers {
  const headers = new Headers();
  if (requestOrigin && (policy.origins.includes("*") || policy.origins.includes(requestOrigin))) {
    headers.set("Access-Control-Allow-Origin", requestOrigin);
    headers.set("Vary", "Origin");
    if (policy.credentials) headers.set("Access-Control-Allow-Credentials", "true");
  }
  headers.set("Access-Control-Allow-Methods", (policy.methods ?? ["GET", "POST", "PUT", "DELETE", "OPTIONS"]).join(", "));
  headers.set("Access-Control-Allow-Headers", (policy.headers ?? ["Content-Type", "Authorization"]).join(", "));
  return headers;
}
