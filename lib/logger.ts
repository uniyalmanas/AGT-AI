/**
 * GSTGenius Structured Observability Logger
 * Formats production logs as structured JSON with level, context, trace ID, and Sentry hooks.
 */

export interface LogContext {
  route?: string;
  actorName?: string;
  actorRole?: string;
  firmId?: string;
  traceId?: string;
  [key: string]: unknown;
}

function formatLog(level: "INFO" | "WARN" | "ERROR", message: string, context?: LogContext, error?: unknown) {
  const timestamp = new Date().toISOString();
  const payload = {
    timestamp,
    level,
    message,
    context: context || {},
    ...(error ? { error: error instanceof Error ? { message: error.message, stack: error.stack } : error } : {}),
  };

  const output = JSON.stringify(payload);

  if (level === "ERROR") {
    console.error(output);
  } else if (level === "WARN") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => formatLog("INFO", message, context),
  warn: (message: string, context?: LogContext, error?: unknown) => formatLog("WARN", message, context, error),
  error: (message: string, context?: LogContext, error?: unknown) => formatLog("ERROR", message, context, error),
};
