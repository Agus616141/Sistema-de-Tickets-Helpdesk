import morgan from "morgan";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { notFound } from "./middlewares/notFound.js";
import { notFoundHandler } from "./middlewares/errorHandler.js";
import { env } from "./config/env.js";
export function createApp() {
    const app = express();
    // middlewares globales
    // 1 logs
    if (env.NODE_ENV === "development") {
        app.use(morgan("dev"));
    }
    if (env.NODE_ENV === "production") {
        app.use(morgan("combined"));
    }
    // 2 cors (Por ahora abierto luego los restringimos con env)
    app.use(cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
    }));
    // 3 JSON body parser
    app.use(express.json());
    //router
    app.use(router);
    app.use(notFound);
    app.use(notFoundHandler);
    return app;
}
//# sourceMappingURL=app.js.map