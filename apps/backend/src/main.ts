import { createApp } from "./app.js";
import { env } from "./config/env.js";


const app = createApp();

const server = app.listen(env.PORT, () => {
    console.log(`Server esta corriendo en el puerto ${env.PORT}`); 
});

function shutdown(signal: string) {
    console.log(`Recibido ${signal}, Apagadose correctamente...`);

    server.close((err) => {
        if (err) {
            console.error("Error al cerrar el servidor", err);
            process.exit(1);
        }
        console.log("Servidor cerrado correctamente");
        process.exit(0);

    });

    setTimeout(() => {
        console.error("Forzando el cierre del servidor");
        process.exit(1);
        
    }, 10_000).unref();
}

process.on("SIGINT", () => shutdown("SINGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
