import { prisma } from "../config/database.js";
import { CreateAddressInput, UpdateAddressInput } from "../validators/address.validator.js";

export class AddressService {
  /**
   * Get all addresses belonging to the authenticated user.
   */
  static async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  }

  /**
   * Create a new address for the authenticated user.
   */
  static async createAddress(userId: string, input: CreateAddressInput) {
    return prisma.$transaction(async (tx) => {
      // If setting as default, unset previous default addresses
      if (input.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          label: input.label || "HOME",
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2 || null,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          latitude: input.latitude || null,
          longitude: input.longitude || null,
          isDefault: input.isDefault || false,
        },
      });
    });
  }

  /**
   * Update an address with strict ownership verification.
   */
  static async updateAddress(userId: string, addressId: string, input: UpdateAddressInput) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      const error: any = new Error("Address not found");
      error.statusCode = 404;
      error.code = "ADDRESS_NOT_FOUND";
      throw error;
    }

    if (address.userId !== userId) {
      const error: any = new Error("Access denied: You do not own this address");
      error.statusCode = 403;
      error.code = "FORBIDDEN_ADDRESS_ACCESS";
      throw error;
    }

    return prisma.$transaction(async (tx) => {
      if (input.isDefault) {
        await tx.address.updateMany({
          where: { userId, isDefault: true, id: { not: addressId } },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id: addressId },
        data: {
          label: input.label !== undefined ? input.label : undefined,
          addressLine1: input.addressLine1 !== undefined ? input.addressLine1 : undefined,
          addressLine2: input.addressLine2 !== undefined ? input.addressLine2 : undefined,
          city: input.city !== undefined ? input.city : undefined,
          state: input.state !== undefined ? input.state : undefined,
          postalCode: input.postalCode !== undefined ? input.postalCode : undefined,
          latitude: input.latitude !== undefined ? input.latitude : undefined,
          longitude: input.longitude !== undefined ? input.longitude : undefined,
          isDefault: input.isDefault !== undefined ? input.isDefault : undefined,
        },
      });
    });
  }

  /**
   * Delete an address with strict ownership verification.
   */
  static async deleteAddress(userId: string, addressId: string) {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      const error: any = new Error("Address not found");
      error.statusCode = 404;
      error.code = "ADDRESS_NOT_FOUND";
      throw error;
    }

    if (address.userId !== userId) {
      const error: any = new Error("Access denied: You do not own this address");
      error.statusCode = 403;
      error.code = "FORBIDDEN_ADDRESS_ACCESS";
      throw error;
    }

    await prisma.address.delete({
      where: { id: addressId },
    });
  }
}
