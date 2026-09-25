import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { HealthCheckResult, DatabaseHealthInfo } from "../types/index.js";

const startTime = Date.now();

export class HealthService {
  static async checkHealth(): Promise<HealthCheckResult> {
    let databaseHealth: DatabaseHealthInfo;

    const dbStartTime = Date.now();
    try {
      // Test PostgreSQL connectivity using Prisma raw query
      await prisma.$queryRaw`SELECT 1`;
      const latencyMs = Date.now() - dbStartTime;
      databaseHealth = {
        status: "connected",
        latencyMs,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Database connection failed";
      databaseHealth = {
        status: "disconnected",
        latencyMs: null,
        error: errorMessage,
      };
    }

    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const isHealthy = databaseHealth.status === "connected";

    return {
      status: isHealthy ? "healthy" : "degraded",
      appName: "MealMitra Backend API",
      version: "1.0.0",
      environment: env.NODE_ENV,
      uptimeSeconds,
      timestamp: new Date().toISOString(),
      database: databaseHealth,
    };
  }
}
