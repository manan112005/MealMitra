import { Role, User } from "@prisma/client";
import { prisma } from "../config/database.js";
import { SecurityUtil } from "../utils/security.js";
import {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  ResetPasswordInput,
} from "../validators/auth.validator.js";
import { AuthResponseData, AuthTokens } from "../types/auth.types.js";

export class AuthService {
  /**
   * Register a new user (CUSTOMER, CHEF, or DELIVERY).
   * Rejects ADMIN registration attempts.
   */
  static async register(input: RegisterInput): Promise<AuthResponseData> {
    const {
      fullName,
      email,
      phone,
      password,
      role,
      dietaryPreferences,
      kitchenName,
      cuisine,
      foodType,
      vehicleType,
      vehicleNumber,
      address,
      city,
    } = input;

    // Safety check: ensure ADMIN role is impossible via registration
    if ((role as string) === "ADMIN") {
      const error: any = new Error("Creating an ADMIN account via registration is strictly forbidden");
      error.statusCode = 403;
      error.code = "FORBIDDEN_ROLE";
      throw error;
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      const error: any = new Error("An account with this email address already exists");
      error.statusCode = 409;
      error.code = "EMAIL_ALREADY_EXISTS";
      throw error;
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone } });
      if (existingPhone) {
        const error: any = new Error("An account with this phone number already exists");
        error.statusCode = 409;
        error.code = "PHONE_ALREADY_EXISTS";
        throw error;
      }
    }

    // Hash password
    const passwordHash = await SecurityUtil.hashPassword(password);

    // Create User and associated Profile in a transactional manner
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          fullName,
          email,
          phone: phone || null,
          passwordHash,
          role: role as Role,
          isActive: true,
          isVerified: false,
        },
      });

      // Initialize role-specific profile
      if (role === "CUSTOMER") {
        await tx.customerProfile.create({
          data: {
            userId: user.id,
            dietaryPreferences: dietaryPreferences || null,
          },
        });
      } else if (role === "CHEF") {
        const chef = await tx.chefProfile.create({
          data: {
            userId: user.id,
            cuisine: cuisine || null,
            foodType: foodType || "BOTH",
          },
        });

        // Initialize default kitchen
        await tx.kitchen.create({
          data: {
            chefId: chef.id,
            name: kitchenName || `${fullName}'s Kitchen`,
            address: address || "Not provided",
            serviceRadius: 5.0,
            minimumOrder: 0.0,
          },
        });
      } else if (role === "DELIVERY") {
        await tx.deliveryPartnerProfile.create({
          data: {
            userId: user.id,
            vehicleType: vehicleType || "Motorcycle",
            vehicleNumber: vehicleNumber || null,
          },
        });
      }

      // If address was provided at registration, add initial address
      if (address && city) {
        await tx.address.create({
          data: {
            userId: user.id,
            label: "HOME",
            addressLine1: address,
            city,
            state: "State",
            postalCode: "380001",
            isDefault: true,
          },
        });
      }

      return user;
    });

    // Fetch complete user with profiles
    const completeUser = await this.getCurrentUser(newUser.id);

    // Issue Tokens
    const tokens = await this.issueTokens(completeUser);

    return {
      user: completeUser,
      tokens,
    };
  }

  /**
   * Login user with email or phone + password.
   */
  static async login(input: LoginInput): Promise<AuthResponseData> {
    const { email, phone, password } = input;

    let user: User | null = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else if (phone) {
      user = await prisma.user.findUnique({ where: { phone } });
    }

    if (!user) {
      const error: any = new Error("Invalid credentials");
      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    // Verify password
    const isPasswordValid = await SecurityUtil.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      const error: any = new Error("Invalid credentials");
      error.statusCode = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    // Check account status
    if (!user.isActive) {
      const error: any = new Error("Your account has been deactivated. Please contact support.");
      error.statusCode = 403;
      error.code = "ACCOUNT_DEACTIVATED";
      throw error;
    }

    // Fetch full user with profiles
    const completeUser = await this.getCurrentUser(user.id);

    // Issue new Token Pair
    const tokens = await this.issueTokens(completeUser);

    return {
      user: completeUser,
      tokens,
    };
  }

  /**
   * Refresh access token with rotation (invalidates used refresh token).
   */
  static async refreshTokens(rawRefreshToken: string): Promise<AuthTokens> {
    const payload = SecurityUtil.verifyRefreshToken(rawRefreshToken);
    if (!payload) {
      const error: any = new Error("Invalid or expired refresh token");
      error.statusCode = 401;
      error.code = "INVALID_REFRESH_TOKEN";
      throw error;
    }

    // Check token existence in database
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: rawRefreshToken },
      include: { user: true },
    });

    if (!dbToken || dbToken.isRevoked || dbToken.expiresAt < new Date()) {
      // Possible token reuse attack - revoke all user tokens for safety
      if (dbToken && dbToken.isRevoked) {
        await prisma.refreshToken.updateMany({
          where: { userId: payload.sub },
          data: { isRevoked: true },
        });
      }

      const error: any = new Error("Refresh token is invalid or has been revoked");
      error.statusCode = 401;
      error.code = "REVOKED_REFRESH_TOKEN";
      throw error;
    }

    const user = dbToken.user;
    if (!user || !user.isActive) {
      const error: any = new Error("User account is inactive or no longer exists");
      error.statusCode = 403;
      error.code = "ACCOUNT_INACTIVE";
      throw error;
    }

    // Revoke old refresh token (Token Rotation)
    await prisma.refreshToken.update({
      where: { id: dbToken.id },
      data: { isRevoked: true },
    });

    // Issue new token pair
    return this.issueTokens(user);
  }

  /**
   * Logout user by revoking active refresh token.
   */
  static async logout(rawRefreshToken?: string, userId?: string): Promise<void> {
    if (rawRefreshToken) {
      await prisma.refreshToken.updateMany({
        where: { token: rawRefreshToken },
        data: { isRevoked: true },
      });
    } else if (userId) {
      await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    }
  }

  /**
   * Get complete user profile details without password hash.
   */
  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerProfile: true,
        chefProfile: {
          include: { kitchen: true },
        },
        deliveryProfile: true,
      },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Change user password.
   */
  static async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const { currentPassword, newPassword } = input;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    const isMatch = await SecurityUtil.comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error("Current password is incorrect");
      error.statusCode = 400;
      error.code = "INVALID_CURRENT_PASSWORD";
      throw error;
    }

    const newHash = await SecurityUtil.hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash },
      }),
      // Revoke existing refresh tokens
      prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);
  }

  /**
   * Request password reset token.
   */
  static async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return generic success to prevent email enumeration
      return { message: "If an account with that email exists, password reset instructions have been generated." };
    }

    const resetToken = SecurityUtil.generateRandomToken(32);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    return {
      message: "If an account with that email exists, password reset instructions have been generated.",
      resetToken, // Returned for dev/testing ease
    };
  }

  /**
   * Reset password using token.
   */
  static async resetPassword(input: ResetPasswordInput): Promise<void> {
    const { token, newPassword } = input;

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.isUsed || resetRecord.expiresAt < new Date()) {
      const error: any = new Error("Password reset token is invalid or has expired");
      error.statusCode = 400;
      error.code = "INVALID_RESET_TOKEN";
      throw error;
    }

    const newHash = await SecurityUtil.hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { isUsed: true },
      }),
      prisma.refreshToken.updateMany({
        where: { userId: resetRecord.userId, isRevoked: false },
        data: { isRevoked: true },
      }),
    ]);
  }

  /**
   * Helper to issue access and refresh tokens and store in DB.
   */
  private static async issueTokens(user: { id: string; email: string; role: Role }): Promise<AuthTokens> {
    const accessToken = SecurityUtil.generateAccessToken(user);
    const tokenId = SecurityUtil.generateRandomToken(16);
    const { token: refreshToken, expiresAt } = SecurityUtil.generateRefreshToken(user.id, tokenId);

    // Save refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return SecurityUtil.createAuthTokens(accessToken, refreshToken);
  }

  /**
   * Check if a phone number is already registered and return public user info.
   */
  static async checkPhone(phone: string): Promise<{ exists: boolean; user?: any }> {
    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        customerProfile: true,
        chefProfile: true,
        deliveryProfile: true,
      },
    });

    if (!user) {
      return { exists: false };
    }

    return {
      exists: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        customerProfile: user.customerProfile,
        chefProfile: user.chefProfile,
        deliveryProfile: user.deliveryProfile,
      },
    };
  }
}

