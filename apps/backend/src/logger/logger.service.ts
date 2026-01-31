import { Injectable, LoggerService as NestLoggerService } from "@nestjs/common";
import * as winston from "winston";
import * as Sentry from "@sentry/node";

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor() {
    // Winston logger configuration
    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json(),
      ),
      defaultMeta: { service: "socialvibe-backend" },
      transports: [
        // Console transport
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.printf((info) => {
              const timestamp = info.timestamp as string;
              const level = info.level;
              const message = info.message as string;
              const context = info.context as string | undefined;
              const trace = info.trace as string | undefined;
              const ctx = context ? `[${context}]` : "";
              return `${timestamp} ${level} ${ctx} ${message}${trace ? `\n${trace}` : ""}`;
            }),
          ),
        }),
        // File transport for errors
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        // File transport for all logs
        new winston.transports.File({
          filename: "logs/combined.log",
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    });

    // Initialize Sentry in production
    if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || "development",
        tracesSampleRate: 1.0,
      });
    }
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { context, trace });

    // Send to Sentry in production
    if (process.env.NODE_ENV === "production" && process.env.SENTRY_DSN) {
      Sentry.captureException(new Error(message));
    }
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Custom methods
  logRequest(req: {
    method: string;
    url: string;
    ip: string;
    get: (key: string) => string | undefined;
  }) {
    this.logger.info("Incoming request", {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  }

  logResponse(
    req: { method: string; url: string },
    res: { statusCode: number },
    responseTime: number,
  ) {
    this.logger.info("Outgoing response", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  }
}
