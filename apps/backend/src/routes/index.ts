import { Router } from "express";
import healthRouter  from "../modules/health/health.routes.js"
// futuros módulos:
// import ticketsRoutes from "../modules/tickets/tickets.routes";

const router = Router();

router.use("/health", healthRouter);
// router.use("/tickets", ticketsRoutes);

export default router;