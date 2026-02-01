import { Router } from "express";
import { getTicketEvents } from "./events.controller.js";

const router = Router({ mergeParams: true });

router.get("/", getTicketEvents);

export default router;
