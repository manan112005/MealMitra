import { Request, Response, NextFunction } from "express";
import { AddressService } from "../services/address.service.js";
import { ResponseFormatter } from "../utils/apiResponse.js";

export class AddressController {
  /**
   * GET /api/v1/addresses
   */
  static async getAddresses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const addresses = await AddressService.getUserAddresses(req.user!.id);
      ResponseFormatter.success(res, addresses, "Addresses fetched successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/addresses
   */
  static async createAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const address = await AddressService.createAddress(req.user!.id, req.body);
      ResponseFormatter.success(res, address, "Address created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/v1/addresses/:id
   */
  static async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updatedAddress = await AddressService.updateAddress(req.user!.id, addressId, req.body);
      ResponseFormatter.success(res, updatedAddress, "Address updated successfully", 200);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/addresses/:id
   */
  static async deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const addressId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await AddressService.deleteAddress(req.user!.id, addressId);
      ResponseFormatter.success(res, null, "Address deleted successfully", 200);
    } catch (error) {
      next(error);
    }
  }
}
