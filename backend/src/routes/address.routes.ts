import { Router } from "express";
import { AddressController } from "../controllers/address.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "../validators/address.validator.js";

const router = Router();

// All address routes require authentication
router.use(authenticate);

router.get("/", AddressController.getAddresses);
router.post("/", validateBody(createAddressSchema), AddressController.createAddress);
router.patch("/:id", validateBody(updateAddressSchema), AddressController.updateAddress);
router.delete("/:id", AddressController.deleteAddress);

export default router;
