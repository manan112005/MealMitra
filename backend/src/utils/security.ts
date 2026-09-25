import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";
import { Role } from "@prisma/client";
import { JWTAccessPayload, JWTRefreshPayload, AuthTokens } from "../types/auth.types.js";

const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRY = "1h"; // 1 hour access token
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days refresh token
const ACCESS_TOKEN_EXPIRY_SECONDS = 3600;

export class SecurityUtil {
  /**
   * Hash plaintext password using bcrypt.
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  /**
   * Compare plaintext password with stored bcrypt hash.
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT Access Token.
   */
  static generateAccessToken(user: { id: string; email: string; role: Role }): string {
    const payload: JWTAccessPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      type: "access",
    };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  /**
   * Generate JWT Refresh Token.
   */
  static generateRefreshToken(userId: string, tokenId: string): { token: string; expiresAt: Date } {
    const payload: JWTRefreshPayload = {
      sub: userId,
      tokenId,
      type: "refresh",
    };
    const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });

    // 7 days from now
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return { token, expiresAt };
  }

  /**
   * Verify and decode Access Token.
   */
  static verifyAccessToken(token: string): JWTAccessPayload | null {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTAccessPayload;
      if (decoded.type !== "access") return null;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Verify and decode Refresh Token.
   */
  static verifyRefreshToken(token: string): JWTRefreshPayload | null {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTRefreshPayload;
      if (decoded.type !== "refresh") return null;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Generate a secure random hex token (for password reset, verification, etc.)
   */
  static generateRandomToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString("hex");
  }

  /**
   * Build token bundle response
   */
  static createAuthTokens(accessToken: string, refreshToken: string): AuthTokens {
    return {
      accessToken,
      refreshToken,
      expiresIn: ACCESS_TOKEN_EXPIRY_SECONDS,
      tokenType: "Bearer",
    };
  }
}
