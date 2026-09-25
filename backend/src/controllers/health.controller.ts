import { Request, Response, NextFunction } from "express";
import { HealthService } from "../services/health.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class HealthController {
  static async getHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const healthData = await HealthService.checkHealth();
      const statusCode = healthData.status === "healthy" ? 200 : 503;
      ResponseFormatter.success(
        res,
        healthData,
        healthData.status === "healthy" ? "Service is operational" : "Service degraded",
        statusCode
      );
    } catch (error) {
      next(error);
    }
  }
}
