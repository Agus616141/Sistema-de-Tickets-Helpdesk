import bcrypt from "bcrypt";
import { AppError } from "../../lib/http/errors.js";
import { createUser, findUserByEmail, findUserById } from "../users/users.model.js";
import { signAccessToken } from "./auth.jwt.js";

export async function register(email: string, password: string) {
    const existing = await findUserByEmail(email);
    if (existing) throw new AppError("Email already in use", 409, "EMAIL_IN_USE");

    const password_hash = await bcrypt.hash(password, 10);
    const created = await createUser({ email, password_hash });

    const token = signAccessToken({ sub: String(created.id), role: "user" });
    return { id: created.id, token };
}

export async function login(email: string, password: string) {
    const user = await findUserByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");

    const token = signAccessToken({ sub: String(user.id), role: user.role });
    return { id: user.id, token };
}

export async function me(userId: number) {
    const user = await findUserById(userId);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND");
    return user;
}
