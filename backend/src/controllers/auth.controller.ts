import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class AuthController {
  /**
   * POST /api/v1/auth/register
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      ResponseFormatter.success(
        res,
        result,
        "Account successfully registered",
        201
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/login
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      ResponseFormatter.success(
        res,
        result,
        "Login successful",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/refresh
   */
  static async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await AuthService.refreshTokens(refreshToken);
      ResponseFormatter.success(
        res,
        tokens,
        "Token refreshed successfully",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/logout
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body || {};
      const userId = req.user?.id;
      await AuthService.logout(refreshToken, userId);
      ResponseFormatter.success(
        res,
        null,
        "Successfully logged out",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/auth/me
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.getCurrentUser(req.user!.id);
      ResponseFormatter.success(
        res,
        user,
        "Current user fetched successfully",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/change-password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.changePassword(req.user!.id, req.body);
      ResponseFormatter.success(
        res,
        null,
        "Password changed successfully. Active sessions have been invalidated.",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/forgot-password
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(req.body.email);
      ResponseFormatter.success(
        res,
        result,
        result.message,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/reset-password
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await AuthService.resetPassword(req.body);
      ResponseFormatter.success(
        res,
        null,
        "Password has been reset successfully. You can now login with your new password.",
        200
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/auth/check-phone
   */
  static async checkPhone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone } = req.body;
      const result = await AuthService.checkPhone(phone);
      ResponseFormatter.success(
        res,
        result,
        result.exists ? "Phone number is registered" : "Phone number not found",
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
