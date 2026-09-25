export * from "./auth.types.js";
export * from "./app.types.js";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: unknown;
  timestamp: string;
}

export interface DatabaseHealthInfo {
  status: "connected" | "disconnected";
  latencyMs: number | null;
  error?: string;
}

export interface HealthCheckResult {
  status: "healthy" | "degraded" | "unhealthy";
  appName: string;
  version: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  database: DatabaseHealthInfo;
}
