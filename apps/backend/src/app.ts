import morgan from "morgan";
import express, { json } from "express";
import cors from "cors";
import router from "./routes/index.js";

import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import { env } from "./config/env.js";

import cookieParser from "cookie-parser";

import helmet from "helmet";
import rateLimit from "express-rate-limit";


export function createApp() {
    const app = express();


    // middlewares globales
    // Helmet
    app.use(helmet());

    const limiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 min
            limit: 200,               // 200 requests por IP / ventana
            standardHeaders: true,
            legacyHeaders: false,
        });
    
    app.use("/health", (req, res, next) => next());
    app.use(limiter);

    // 1 logs

    if (env.NODE_ENV === "development"){
        app.use(morgan("dev"));
    }

    if (env.NODE_ENV === "production"){
        app.use(morgan("combined"));
    }

    // 2 cors (Por ahora abierto luego los restringimos con env)
    const allowedOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());
    app.use(
        cors({
            origin: (origin, cb) => {
            // Permitir requests sin origin (Thunder, curl, server-to-server)
            if (!origin) return cb(null, true);

            if (allowedOrigins.includes(origin)) return cb(null, true);
            return cb(new Error("Not allowed by CORS"));
            },
            credentials: true,
        })
    );

    // 3 JSON body parser
    app.use(express.json());

    // 4 cookie parser
    app.use(cookieParser());
    
    //router
    app.use(router);
    
    

    
    app.use(notFound);


    app.use(errorHandler);


    

    return app; 
}