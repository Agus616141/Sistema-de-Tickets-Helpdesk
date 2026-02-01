import { pool } from "../../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export type CommentRow = RowDataPacket & {
    id: number;
    ticket_id: number;
    body: string;
    created_at: string;
};

export async function findCommentsByTicketId(ticketId: number): Promise<CommentRow[]> {
    const [rows] = await pool.query<CommentRow[]>(
        "SELECT * FROM ticket_comments WHERE ticket_id = ? ORDER BY created_at ASC",
        [ticketId]
    );
    return rows;
}

export async function createComment(ticketId: number, body: string): Promise<{ id: number }> {
    const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO ticket_comments (ticket_id, body) VALUES (?, ?)",
        [ticketId, body]
    );
    return { id: Number(result.insertId) };
}

