import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { logger } from "./utils/logger.js";

async function startServer(): Promise<void> {
  // Test database connection on startup
  const isDbConnected = await connectDatabase();
  if (isDbConnected) {
    logger.info("Successfully connected to PostgreSQL database.");
  } else {
    logger.warn(
      "Initial PostgreSQL connection attempt failed. Verify DATABASE_URL in .env if PostgreSQL is running."
    );
  }

  const server = app.listen(env.PORT, () => {
    logger.info(`MealMitra Backend Server listening on http://localhost:${env.PORT}`);
    logger.info(`Environment: [${env.NODE_ENV}]`);
    logger.info(`Health check available at: http://localhost:${env.PORT}/api/v1/health`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Closing HTTP server and database connections...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info("Server closed cleanly.");
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

startServer().catch((error) => {
  logger.error("Fatal error during server startup:", error);
  process.exit(1);
});
