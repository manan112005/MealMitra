import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class UserController {
  /**
   * GET /api/v1/users/me
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getProfile(req.user!.id);
      ResponseFormatter.success(res, user, "User profile fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/users/me
   */
  static async updateMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updatedUser = await UserService.updateProfile(req.user!.id, req.body);
      ResponseFormatter.success(res, updatedUser, "User profile updated successfully", 200);
    } catch (error) {
      next(error);
    }
  }
}
