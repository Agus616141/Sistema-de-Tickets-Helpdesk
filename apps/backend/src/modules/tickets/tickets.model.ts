import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../config/db.js"; 
import type { TicketsQuery } from "./tickets.schemas.js";


export type ticketStatus = "open" | "in_progress" | "resolved" | "closed";
export type ticketPriority = "low" | "medium" | "high" | "urgent";

export type TicketRow = RowDataPacket &{
    id: number;
    title: string;
    description: string | null;
    status: ticketStatus;
    priority: ticketPriority;
    created_at: string;
    updated_at: string;
};

type CountRow = RowDataPacket & { total: number };

// Obtener todos los tickets
export async function findAllTickets(): Promise<TicketRow[]> {
    const [ rows ] = await pool.query<TicketRow[]>(
        "SELECT * FROM tickets ORDER BY id DESC"
    );
    return Array.isArray(rows) ? rows : [];
}

// Crea un nuevo Ticket
export async function createTicket (input: {
    title:string;
    description?: string | null;
    priority?: ticketPriority;
}): Promise<{ id: number }> {
    const { title, description = null, priority = "medium" } = input;

    const [ result ] = await pool.execute<ResultSetHeader>(
        "INSERT INTO tickets (title, description, priority) VALUES (?, ?, ?)",
        [title, description, priority]
    );

    return { id: Number(result.insertId)};
} 

// Buscar un ticket por su ID
export async function findTicketById(id: number): Promise<TicketRow | null> {
    const [rows] = await pool.query<TicketRow[]>(
    "SELECT * FROM tickets WHERE id = ? LIMIT 1",
    [id]
    );
    return rows[0] ?? null;
}

// Actualizar un ticket por su ID
export async function updateTicketById(
    id: number,
    patch: Partial<{
    title: string;
    description: string | null;
    status: ticketStatus;
    priority: ticketPriority;
    }>
): Promise<boolean> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (patch.title !== undefined) {
        fields.push("title = ?");
        values.push(patch.title);
    }
    if (patch.description !== undefined) {
        fields.push("description = ?");
        values.push(patch.description);
    }
    if (patch.status !== undefined) {
        fields.push("status = ?");
        values.push(patch.status);
    }
    if (patch.priority !== undefined) {
        fields.push("priority = ?");
        values.push(patch.priority);
    }

    if (fields.length === 0) return false;

    values.push(id);

    const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE tickets SET ${fields.join(", ")} WHERE id = ?`,
        values
    );

    return result.affectedRows > 0;
}

// Eliminar un ticket por su ID
export async function deleteTicketById(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(
    "DELETE FROM tickets WHERE id = ?",
    [id]
    );
    return result.affectedRows > 0;
}


const SORT_MAP: Record<TicketsQuery["sort"], string> = {
    created_at: "created_at",
    id: "id",
};


export async function findTicketsWithFilters(filters: TicketsQuery): Promise<{
    data: TicketRow[];
    meta: { page: number; limit: number; total: number; totalPages: number };
}> {
    let whereSql = " WHERE 1=1";
    const params: unknown[] = [];

    if (filters.status) {
        whereSql += " AND status = ?";
        params.push(filters.status);
    }

    if (filters.priority) {
        whereSql += " AND priority = ?";
        params.push(filters.priority);
    }

    if (filters.q) {
    // Busca por title y description (simple y útil)
    whereSql += " AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ?)";
    const like = `%${filters.q}%`;
    params.push(like, like);
    }

    if (filters.from) {
    // desde las 00:00:00
    whereSql += " AND created_at >= ?";
    params.push(`${filters.from} 00:00:00`);
    }

    if (filters.to) {
    // hasta 23:59:59
    whereSql += " AND created_at <= ?";
    params.push(`${filters.to} 23:59:59`);
    }

    // Total (para paginación)
    const [countRows] = await pool.query<CountRow[]>(
        `SELECT COUNT(*) as total FROM tickets${whereSql}`,
        params
    );
    const total = Number(countRows[0]?.total ?? 0);

    // Paginación
    const page = filters.page;
    const limit = filters.limit;
    const offset = (page - 1) * limit;

    const sortCol = SORT_MAP[filters.sort]; // whitelist
    const order = filters.order.toUpperCase(); // ASC/DESC

    const sql =
        `SELECT * FROM tickets${whereSql} ` +
        `ORDER BY ${sortCol} ${order} ` +
        `LIMIT ? OFFSET ?`;

    const [rows] = await pool.query<TicketRow[]>(sql, [...params, limit, offset]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
        data: rows,
        meta: { page, limit, total, totalPages },
    };
}