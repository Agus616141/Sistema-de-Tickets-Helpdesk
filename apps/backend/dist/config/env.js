import { z } from 'zod';
const envSchema = z.object({
    PORT: z
        .string()
        .transform(Number)
        .default(3000),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    CORS_ORIGIN: z
        .string()
        .default("http://localhost:5173"),
});
export const env = envSchema.parse(process.env);
//# sourceMappingURL=env.js.map