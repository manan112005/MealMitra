import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { prisma } from "../config/database.js";
import { SecurityUtil } from "../utils/security.js";
import { ResponseFormatter } from "../utils/apiResponse.js";
import { AuthenticatedUser } from "../types/auth.types.js";

/**
 * Middleware to authenticate requests using JWT Bearer access token.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      ResponseFormatter.error(
        res,
        "Authentication required: Missing or invalid Bearer token",
        401,
        "UNAUTHORIZED"
      );
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = SecurityUtil.verifyAccessToken(token);

    if (!payload) {
      ResponseFormatter.error(
        res,
        "Invalid or expired access token",
        401,
        "INVALID_TOKEN"
      );
      return;
    }

    // Verify user in database
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        customerProfile: true,
        chefProfile: {
          include: { kitchen: true },
        },
        deliveryProfile: true,
      },
    });

    if (!user) {
      ResponseFormatter.error(
        res,
        "Authenticated user no longer exists",
        401,
        "USER_NOT_FOUND"
      );
      return;
    }

    if (!user.isActive) {
      ResponseFormatter.error(
        res,
        "Your account has been deactivated. Please contact support.",
        403,
        "ACCOUNT_DEACTIVATED"
      );
      return;
    }

    // Attach user to request object (excluding passwordHash)
    const { passwordHash: _, ...safeUser } = user;
    req.user = safeUser as AuthenticatedUser;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware for Role-Based Access Control (RBAC).
 * Source of truth is the backend JWT + database role.
 */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      ResponseFormatter.error(
        res,
        "Authentication required",
        401,
        "UNAUTHORIZED"
      );
      return;
    }

    if (!roles.includes(req.user.role)) {
      ResponseFormatter.error(
        res,
        `Access forbidden: Requires one of [${roles.join(", ")}], but user is [${req.user.role}]`,
        403,
        "FORBIDDEN",
        {
          requiredRoles: roles,
          currentRole: req.user.role,
        }
      );
      return;
    }

    next();
  };
}
