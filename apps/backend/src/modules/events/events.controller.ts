import { Request, Response, NextFunction } from "express";
import { ticketIdParamSchema } from "../tickets/tickets.schemas.js";
import { listTicketEvents } from "./events.service.js";

export async function getTicketEvents(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = ticketIdParamSchema.parse(req.params);
        const events = await listTicketEvents(Number(id));
        res.json({ ok: true, data: events });
    } catch (err) {
        next(err);
    }
}
