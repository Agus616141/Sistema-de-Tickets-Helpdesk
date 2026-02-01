import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { login, register, me } from "./auth.service.js";
import { setAuthCookie, clearAuthCookie } from "./auth.cookies.js";


// Controler para registrar un nuevo usuario
export async function postRegister(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = registerSchema.parse(req.body);
        const { id, token } = await register(email, password);
        setAuthCookie(res, token);
        res.status(201).json({ ok: true, data: { id } });
    } catch (err) {
        next(err);
    }
}

// Controler para iniciar sesion
export async function postLogin(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = loginSchema.parse(req.body);
        const { id, token } = await login(email, password);
        setAuthCookie(res, token);
        res.json({ ok: true, data: { id } });
    } catch (err) {
        next(err);
    }
}

// Contoler para cerrar sesion
export async function postLogout(_req: Request, res: Response) {
    clearAuthCookie(res);
    res.status(204).send();
}

// Controler para obtener los datos del usuario autenticado
export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user!.id;
        const user = await me(userId);
        res.json({ ok: true, data: user });
    } catch (err) {
        next(err);
    }
}
