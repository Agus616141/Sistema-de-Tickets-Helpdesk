import { Router } from "express";
import { getTickets, postTicket, getTicketById, updateTicket, deleteTicket } from "./tickets.controller.js";
import commentsRoutes from "../comments/comments.routes.js";
import eventsRoutes from "../events/events.routes.js";

const router = Router();

router.get("/", getTickets);
router.post("/", postTicket);

router.get("/:id", getTicketById);
router.patch("/:id", updateTicket);
router.delete("/:id", deleteTicket);

router.use("/:id/comments", commentsRoutes);

router.use("/:id/events", eventsRoutes);

export default router;