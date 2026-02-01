import { createTicket ,findAllTickets } from "./tickets.model.js";
import type { CreateTicketInput, TicketsQuery } from "./tickets.schemas.js";
import { AppError } from "../../lib/http/errors.js";
import { findTicketById, updateTicketById, deleteTicketById, findTicketsWithFilters } from "./tickets.model.js"
import { addTicketEvent } from "../events/events.service.js";


export async function listTickets() {
    return findAllTickets();
}

export async function addTicket(input: CreateTicketInput) {
    return createTicket({
    ...input,
    description: input.description ?? null,
    priority: input.priority ?? "medium",
    });
}

// Obtener un ticket por su ID
export async function getTicket(id: number) {
    const ticket = await findTicketById(id);
    if (!ticket) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");
    return ticket;
}

// Actualizar un ticket por su ID
export async function patchTicket(id: number, patch: any) {
    const exists = await findTicketById(id);
    if (!exists) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");

    const updated = await updateTicketById(id, patch);

      // Auditoría mínima (solo si cambió)
    if (patch.status && patch.status !== exists.status) {
        await addTicketEvent({
            ticketId: id,
            type: "status_changed",
            message: `Estado: ${exists.status} → ${patch.status}`,
            meta: { from: exists.status, to: patch.status },
        });
    }

    if (patch.priority && patch.priority !== exists.priority) {
        await addTicketEvent({
            ticketId: id,
            type: "priority_changed",
            message: `Prioridad: ${exists.priority} → ${patch.priority}`,
            meta: { from: exists.priority, to: patch.priority },
        });
    }
    return updated;
}

// Eliminar un ticket por su ID
export async function removeTicket(id: number) {
    const deleted = await deleteTicketById(id);
    if (!deleted) throw new AppError("Ticket not found", 404, "TICKET_NOT_FOUND");
    return true;
}

// Listar tieckets con filtros
export async function listTicketsWithFilters(filters: TicketsQuery) {
  // normalizar búsqueda (opcional pero prolijo)
    const normalized = {
        ...filters,
        q: filters.q ? filters.q.trim().toLowerCase() : undefined,
    };

    return findTicketsWithFilters(normalized);
}