import { pool } from "../../config/db.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export type UserRow = RowDataPacket & {
    id: number;
    email: string;
    password_hash: string;
    role: "user" | "agent" | "admin";
    created_at: string;
};

// Bucscar usuario por email
export async function findUserByEmail(email: string): Promise<UserRow | null> {
    const [rows] = await pool.query<UserRow[]>(
        "SELECT * FROM users WHERE email = ? LIMIT 1",
        [email]
    );
    return rows[0] ?? null;
}

// Buscar usuario por ID (Solo datos publicos)
export async function findUserById(id: number): Promise<Pick<UserRow, "id" | "email" | "role" | "created_at"> | null> {
    const [rows] = await pool.query<any[]>(
        "SELECT id, email, role, created_at FROM users WHERE id = ? LIMIT 1",
        [id]
    );
    return rows[0] ?? null;
}

// Crear un nuevo usuario
export async function createUser(input: { email: string; password_hash: string; role?: UserRow["role"] }) {
    const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
        [input.email, input.password_hash, input.role ?? "user"]
    );
    return { id: Number(result.insertId) };
}
