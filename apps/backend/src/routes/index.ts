import { Router } from "express";
import healthRouter  from "../modules/health/health.routes.js"
import ticketsRoutes from "../modules/tickets/tickets.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
// futuros módulos:


const router = Router();

router.use("/health", healthRouter);

router.use("/tickets", ticketsRoutes);

router.use("/auth", authRoutes);

export default router;
