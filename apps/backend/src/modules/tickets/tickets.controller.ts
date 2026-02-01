import { Request, Response, NextFunction } from "express";
import { listTickets, addTicket, getTicket, patchTicket, removeTicket, listTicketsWithFilters  } from "./tickets.service.js";
import { createTicketSchame, ticketIdParamSchema, updateTicketSchema, ticketsQuerySchema  } from "./tickets.schemas.js";
import { addTicketEvent } from "../events/events.service.js";

// Controller para Obtener todos los tickets 
export async function getTickets(req: Request, res: Response, next: NextFunction) {
    try {
        const filters = ticketsQuerySchema.parse(req.query);
        const result = await listTicketsWithFilters(filters);
        res.json({ ok: true, ...result }); // { ok, data, meta }
    } catch (err) {
        next(err);
    }
}

// Controler para crear un nuevo ticket
export async function postTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const input = createTicketSchame.parse(req.body);
        const created = await addTicket(input);

        await addTicketEvent({
            ticketId: created.id,
            type: "ticket_created",
            message: "Ticket creado",
        });

        res.status(201).json({ 
            ok: true, data: created 
        });
    } catch (err) {
        next(err);
    }
}

// Controler para obtener un ticked por su ID
export async function getTicketById(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = ticketIdParamSchema.parse(req.params);
        const ticket = await getTicket(Number(id));
        res.json({ ok: true, data: ticket });
    } catch (err) {
        next(err);
    }
}

// -controler para actualizar un tickeg por su ID
export async function updateTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = ticketIdParamSchema.parse(req.params);
        const patch = updateTicketSchema.parse(req.body);

        await patchTicket(Number(id), patch);
        res.json({ ok: true });
    } catch (err) {
        next(err);
    }
}

// Controler para eliminar un ticked por su ID
export async function deleteTicket(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = ticketIdParamSchema.parse(req.params);
        await removeTicket(Number(id));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

