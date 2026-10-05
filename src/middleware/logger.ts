import { Logger } from "@/src/core/logger";
export interface AccessRequest { method: string; path: string; ip?: string; userAgent?: string; }
export function logAccess(request: AccessRequest, status: number, durationMs: number, logger: Logger): void {
  logger.info("http.request", { ...request, status, durationMs });
}
