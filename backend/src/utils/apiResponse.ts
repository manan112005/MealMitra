import { Response } from "express";
import { ApiResponse } from "../types/index.js";

export class ResponseFormatter {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    message: string = "An error occurred",
    statusCode: number = 500,
    error: string = "INTERNAL_SERVER_ERROR",
    details?: unknown
  ): Response {
    const payload: ApiResponse = {
      success: false,
      message,
      error,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
