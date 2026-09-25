import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import addressRoutes from "./address.routes.js";

const apiV1Router = Router();

// Sub-routes under /api/v1
apiV1Router.use("/", healthRoutes);
apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/users", userRoutes);
apiV1Router.use("/addresses", addressRoutes);

export default apiV1Router;
