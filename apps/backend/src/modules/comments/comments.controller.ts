import { Request, Response, NextFunction } from "express";
import { createCommentSchema } from "./comments.schemas.js";
import { listComments, addComment } from "./comments.service.js";
import { ticketIdParamSchema } from "../tickets/tickets.schemas.js";
import { addTicketEvent } from "../events/events.service.js";

export async function getComments(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = ticketIdParamSchema.parse(req.params);
        const comments = await listComments(Number(id));
        res.json({ ok: true, data: comments });
    } catch (err) {
        next(err);
    }
}

export async function postComment(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = ticketIdParamSchema.parse(req.params);
        const { body } = createCommentSchema.parse(req.body);
        const created = await addComment(Number(id), body);

        await addTicketEvent({
            ticketId: Number(id),
            type: "comment_added",
            message: "Comentario agregado",
            meta: { commentId: created.id },
        });

        res.status(201).json({ ok: true, data: { id: created.id } });
    } catch (err) {
        next(err);
    }
}
