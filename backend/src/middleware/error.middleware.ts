import { Request, Response, NextFunction } from "express";
import { ResponseFormatter } from "../utils/apiResponse.js";
import { logger } from "../utils/logger.js";
import { env } from "../config/env.js";

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  logger.error(`[${req.method} ${req.originalUrl}] Error:`, err);

  const details = env.isDev
    ? {
        stack: err.stack,
        details: err.details,
      }
    : err.details;

  ResponseFormatter.error(res, message, statusCode, errorCode, details);
}
