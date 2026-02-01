import { AppError } from "../../lib/http/errors.js";
import { findTicketById } from "../tickets/tickets.model.js";
import { createEvent, findEventsByTicketId} from "./events.model.js";
import type { TicketEventType } from "./events.model.js";


export async function addTicketEvent(input: {
    ticketId: number;
    type: TicketEventType;
    message: string;
    meta?: unknown;
}) {
    const ticket = await findTicketById(input.ticketId);
    if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");

    return createEvent(input);
}

export async function listTicketEvents(ticketId: number) {
    const ticket = await findTicketById(ticketId);
    if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");

    return findEventsByTicketId(ticketId);
}
