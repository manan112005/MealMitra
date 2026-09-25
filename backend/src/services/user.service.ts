import { prisma } from "../config/database.js";
import { UpdateUserProfileInput } from "../validators/user.validator.js";
import { AuthService } from "./auth.service.js";

export class UserService {
  /**
   * Get user profile by user ID.
   */
  static async getProfile(userId: string) {
    return AuthService.getCurrentUser(userId);
  }

  /**
   * Update current user profile and role-specific details.
   */
  static async updateProfile(userId: string, input: UpdateUserProfileInput) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerProfile: true,
        chefProfile: { include: { kitchen: true } },
        deliveryProfile: true,
      },
    });

    if (!user) {
      const error: any = new Error("User not found");
      error.statusCode = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }

    // Check phone uniqueness if phone is changing
    if (input.phone && input.phone !== user.phone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone: input.phone } });
      if (existingPhone && existingPhone.id !== userId) {
        const error: any = new Error("Phone number is already in use by another account");
        error.statusCode = 409;
        error.code = "PHONE_ALREADY_EXISTS";
        throw error;
      }
    }

    await prisma.$transaction(async (tx) => {
      // 1. Update basic user details
      if (input.fullName !== undefined || input.phone !== undefined) {
        await tx.user.update({
          where: { id: userId },
          data: {
            fullName: input.fullName !== undefined ? input.fullName : undefined,
            phone: input.phone !== undefined ? input.phone : undefined,
          },
        });
      }

      // 2. Update Customer Profile
      if (user.role === "CUSTOMER" && user.customerProfile) {
        if (input.dietaryPreferences !== undefined) {
          await tx.customerProfile.update({
            where: { userId },
            data: {
              dietaryPreferences: input.dietaryPreferences,
            },
          });
        }
      }

      // 3. Update Chef Profile & Kitchen
      if (user.role === "CHEF" && user.chefProfile) {
        const chefUpdateData: any = {};
        if (input.bio !== undefined) chefUpdateData.bio = input.bio;
        if (input.cuisine !== undefined) chefUpdateData.cuisine = input.cuisine;
        if (input.foodType !== undefined) chefUpdateData.foodType = input.foodType;
        if (input.experienceYears !== undefined) chefUpdateData.experienceYears = input.experienceYears;
        if (input.profileImage !== undefined) chefUpdateData.profileImage = input.profileImage;
        if (input.fssaiLicense !== undefined) chefUpdateData.fssaiLicense = input.fssaiLicense;
        if (input.isAvailable !== undefined) chefUpdateData.isAvailable = input.isAvailable;

        if (Object.keys(chefUpdateData).length > 0) {
          await tx.chefProfile.update({
            where: { userId },
            data: chefUpdateData,
          });
        }

        // Kitchen update
        const kitchenUpdateData: any = {};
        if (input.kitchenName !== undefined) kitchenUpdateData.name = input.kitchenName;
        if (input.kitchenDescription !== undefined) kitchenUpdateData.description = input.kitchenDescription;
        if (input.kitchenAddress !== undefined) kitchenUpdateData.address = input.kitchenAddress;
        if (input.serviceRadius !== undefined) kitchenUpdateData.serviceRadius = input.serviceRadius;
        if (input.minimumOrder !== undefined) kitchenUpdateData.minimumOrder = input.minimumOrder;
        if (input.openingTime !== undefined) kitchenUpdateData.openingTime = input.openingTime;
        if (input.closingTime !== undefined) kitchenUpdateData.closingTime = input.closingTime;

        if (Object.keys(kitchenUpdateData).length > 0 && user.chefProfile.kitchen) {
          await tx.kitchen.update({
            where: { id: user.chefProfile.kitchen.id },
            data: kitchenUpdateData,
          });
        }
      }

      // 4. Update Delivery Partner Profile
      if (user.role === "DELIVERY" && user.deliveryProfile) {
        const deliveryUpdateData: any = {};
        if (input.vehicleType !== undefined) deliveryUpdateData.vehicleType = input.vehicleType;
        if (input.vehicleNumber !== undefined) deliveryUpdateData.vehicleNumber = input.vehicleNumber;
        if (input.licenseNumber !== undefined) deliveryUpdateData.licenseNumber = input.licenseNumber;
        if (input.isOnline !== undefined) deliveryUpdateData.isOnline = input.isOnline;
        if (input.currentLatitude !== undefined) deliveryUpdateData.currentLatitude = input.currentLatitude;
        if (input.currentLongitude !== undefined) deliveryUpdateData.currentLongitude = input.currentLongitude;

        if (Object.keys(deliveryUpdateData).length > 0) {
          await tx.deliveryPartnerProfile.update({
            where: { userId },
            data: deliveryUpdateData,
          });
        }
      }
    });

    return AuthService.getCurrentUser(userId);
  }
}
