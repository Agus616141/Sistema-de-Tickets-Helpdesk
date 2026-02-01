import { z } from 'zod';
import "dotenv/config";

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
    

    DB_HOST: z.string(),
    DB_PORT: z.string().transform(Number).default(3306),
    DB_USER: z.string(),
    DB_PASSWORD: z.string().default(""),
    DB_NAME: z.string(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default("7d"),
    COOKIE_NAME: z.string().default("access_token"),


});


export const env = envSchema.parse(process.env);