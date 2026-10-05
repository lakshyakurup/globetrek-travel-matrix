export type LogLevel = "debug" | "info" | "warn" | "error";
export interface LogRecord { timestamp: string; level: LogLevel; message: string; context?: Record<string, unknown>; }
export type LogTransport = (record: LogRecord) => void;

export class Logger {
  constructor(private readonly transport: LogTransport = (record) => console.log(JSON.stringify(record)), private readonly fields: Record<string, unknown> = {}) {}
  child(fields: Record<string, unknown>): Logger { return new Logger(this.transport, { ...this.fields, ...fields }); }
  log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    this.transport({ timestamp: new Date().toISOString(), level, message, context: { ...this.fields, ...context } });
  }
  debug(message: string, context?: Record<string, unknown>): void { this.log("debug", message, context); }
  info(message: string, context?: Record<string, unknown>): void { this.log("info", message, context); }
  warn(message: string, context?: Record<string, unknown>): void { this.log("warn", message, context); }
  error(message: string, context?: Record<string, unknown>): void { this.log("error", message, context); }
}

export const logger = new Logger();
