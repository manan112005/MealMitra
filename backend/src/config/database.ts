import { PrismaClient } from "@prisma/client";
import { env } from "./env.js";

// Global Prisma Client instance to avoid multiple connection pools in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isDev ? ["warn", "error"] : ["error"],
  });

if (env.isDev) {
  globalForPrisma.prisma = prisma;
}

export async function connectDatabase(): Promise<boolean> {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    return false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
