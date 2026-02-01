import { AppError } from "../../lib/http/errors.js";
import { findTicketById } from "../tickets/tickets.model.js";
import { findCommentsByTicketId, createComment } from "./comments.model.js";

export async function listComments(ticketId: number) {
    const ticket = await findTicketById(ticketId);
    if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");

    return findCommentsByTicketId(ticketId);
}

export async function addComment(ticketId: number, body: string) {
    const ticket = await findTicketById(ticketId);
    if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");

    return createComment(ticketId, body);
}
