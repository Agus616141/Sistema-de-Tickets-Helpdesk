import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../lib/http/errors.js";

function isErrorWithMessage(x: unknown): x is { message: string } {
    return typeof x === "object" && x !== null && "message" in x;
}

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
  // ✅ Zod validation errors => 400
    if (err instanceof ZodError) {
        return res.status(400).json({
            ok: false,
            error: {
                code: "VALIDATION_ERROR",
                message: "Invalid request data",
                issues: err.issues.map((i) => ({
                    path: i.path.join("."),
                    message: i.message,
                })),
            },
        });
    }

    // 2) AppError => statusCode definido
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            ok: false,
            error: {
                code: err.code,
                message: err.message,
            },
        });
    }
    
    // 🔥 Unknown / generic errors => 500
    const message = err instanceof Error
            ? err.message
            : isErrorWithMessage(err)
            ? err.message
            : "Unknown error";

    console.error(err);

    
    return res.status(500).json({
        ok: false,
        error: {
            code: "INTERNAL_SERVER_ERROR",
            message: env.NODE_ENV === "development" ? message : "Internal Server Error",
        },
    });
}