import { Response } from "express";
import { env } from "../../config/env.js";

export function setAuthCookie(res: Response, token: string) {
    res.cookie(env.COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
        // maxAge opcional: si querés fijo en ms
    });
}

export function clearAuthCookie(res: Response) {
    res.clearCookie(env.COOKIE_NAME, {
        httpOnly: true,
        sameSite: "lax",
        secure: env.NODE_ENV === "production",
    });
}

