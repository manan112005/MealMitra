import { Request, Response, NextFunction } from "express";
import { ResponseFormatter } from "../utils/apiResponse.js";

export function notFoundMiddleware(req: Request, res: Response, _next: NextFunction): void {
  ResponseFormatter.error(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
    "NOT_FOUND",
    {
      path: req.originalUrl,
      method: req.method,
    }
  );
}
