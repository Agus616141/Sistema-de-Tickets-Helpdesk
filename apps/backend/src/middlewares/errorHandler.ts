import { Request, Response, NextFunction } from "express";

export function notFoundHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction, 
) {
    res.status(505).json({
        error: "Internal server error",
    });
}

