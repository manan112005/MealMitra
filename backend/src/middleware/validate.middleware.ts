import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ResponseFormatter } from "../utils/apiResponse.js";

/**
 * Middleware factory to validate request body against a Zod schema.
 */
export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        ResponseFormatter.error(
          res,
          "Input validation failed",
          400,
          "VALIDATION_ERROR",
          { errors: validationErrors }
        );
        return;
      }
      next(error);
    }
  };
}
