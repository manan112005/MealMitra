import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import addressRoutes from "./address.routes.js";
import cookRoutes from "./cook.routes.js";
import mealRoutes from "./meal.routes.js";
import orderRoutes from "./order.routes.js";
import subscriptionRoutes from "./subscription.routes.js";
import paymentRoutes from "./payment.routes.js";
import aiRoutes from "./ai.routes.js";

const apiV1Router = Router();

// Sub-routes under /api/v1
apiV1Router.use("/", healthRoutes);
apiV1Router.use("/auth", authRoutes);
apiV1Router.use("/users", userRoutes);
apiV1Router.use("/addresses", addressRoutes);
apiV1Router.use("/cooks", cookRoutes);
apiV1Router.use("/meals", mealRoutes);
apiV1Router.use("/orders", orderRoutes);
apiV1Router.use("/subscriptions", subscriptionRoutes);
apiV1Router.use("/payments", paymentRoutes);
apiV1Router.use("/ai", aiRoutes);

export default apiV1Router;
