import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_jwt_access_secret_min_32_chars",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_jwt_refresh_secret_min_32_chars",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5714",
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || "http://localhost:5714,http://localhost:5173,http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  isDev: (process.env.NODE_ENV || "development") === "development",
  isProd: process.env.NODE_ENV === "production",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_test_MealMitraDemoKey",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "MealMitraSecretDevKey_2026",
};
