import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { LoggerService } from "./logger.service";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    // Log request
    this.logger.logRequest(req);

    // Log response
    res.on("finish", () => {
      const responseTime = Date.now() - start;
      this.logger.logResponse(req, res, responseTime);
    });

    next();
  }
}
