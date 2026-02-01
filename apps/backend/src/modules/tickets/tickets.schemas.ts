import { z } from "zod";

export const createTicketSchame = z.object({
    title: z.string().min(3).max(125),
    description : z.string().max(1000).optional(),
    priority : z.enum(["low", "medium", "high", "urgent"]).optional(),

});

export type CreateTicketInput = z.infer<typeof createTicketSchame>;


export const ticketIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "El id debe ser un número"),
});

export const updateTicketSchema = z.object({
    title: z.string().min(3).max(120).optional(),
    description: z.string().max(2000).nullable().optional(),
    status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: "Se debe completar al menos un campo",
});


export const ticketsQuerySchema = z.object({
    status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),

    q: z.string().trim().min(1).max(120).optional(),

    from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "from must be YYYY-MM-DD").optional(),
    to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "to must be YYYY-MM-DD").optional(),

    sort: z.enum(["created_at", "id"]).default("created_at"),
    order: z.enum(["asc", "desc"]).default("desc"),

    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    }).refine(
    (v) => !(v.from && v.to && v.from > v.to),
    { message: "Invalid date range (from > to)", path: ["from"] }
);

export type TicketsQuery = z.infer<typeof ticketsQuerySchema>;