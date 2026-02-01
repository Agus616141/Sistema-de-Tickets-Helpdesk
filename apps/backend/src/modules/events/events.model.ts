import { pool } from "../../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export type TicketEventType =
    | "ticket_created"
    | "status_changed"
    | "priority_changed"
    | "comment_added";

export type TicketEventRow = RowDataPacket & {
    id: number;
    ticket_id: number;
    event_type: TicketEventType;
    message: string;
    meta: any | null;
    created_at: string;
};

export async function createEvent(input: {
    ticketId: number;
    type: TicketEventType;
    message: string;
    meta?: unknown;
}): Promise<{ id: number }> {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO ticket_events (ticket_id, event_type, message, meta)
        VALUES (?, ?, ?, ?)`,
        [input.ticketId, input.type, input.message, input.meta ? JSON.stringify(input.meta) : null]
    );

    return { id: Number(result.insertId) };
}

export async function findEventsByTicketId(ticketId: number): Promise<TicketEventRow[]> {
    const [rows] = await pool.query<TicketEventRow[]>(
        `SELECT id, ticket_id, event_type, message, meta, created_at
        FROM ticket_events
        WHERE ticket_id = ?
        ORDER BY created_at ASC, id ASC`,
        [ticketId]
    );
    return rows;
}
