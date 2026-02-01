import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export type JwtPayload = { sub: string; role: string };


export function signAccessToken(payload: JwtPayload): string {
    // @ts-expect-error env ya fue validado con Zod (ESM/typing)
    return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
}

export function verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

