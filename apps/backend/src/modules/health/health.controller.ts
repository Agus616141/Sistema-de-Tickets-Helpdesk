import { Request, Response } from "express";
import { pool } from "../../config/db.js";

export async function health(_req: Request, res: Response) {
    try {
        await pool.query("SELECT 1");
        res.json({ ok: true, db: "up", ts: Date.now() });
    } catch {
        res.status(503).json({ ok: false, db: "down", ts: Date.now() });
    }
}
