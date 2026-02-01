import { Request, Response, NextFunction } from "express";
import { env } from "../config/env.js";
import { AppError } from "../lib/http/errors.js";
import { verifyAccessToken } from "../modules/auth/auth.jwt.js";

declare global {
    namespace Express {
        interface Request {
        user?: { id: number; role: string };
        }
    }
}

export function authRequired(req: Request, _res: Response, next: NextFunction) {
    const token = req.cookies?.[env.COOKIE_NAME];
    if (!token) return next(new AppError("Unauthorized", 401, "NO_TOKEN"));

    try {
        const payload = verifyAccessToken(token);
        req.user = { id: Number(payload.sub), role: payload.role };
        return next();
    } catch (err) {
        return next(new AppError("Unauthorized", 401, "INVALID_TOKEN"));
    }
}
