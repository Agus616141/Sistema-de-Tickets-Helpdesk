import { Router } from "express";
import { postLogin, postRegister, postLogout, getMe } from "./auth.controller.js";
import { authRequired } from "../../middlewares/authRequired.js";

const router = Router();

router.post("/register", postRegister);
router.post("/login", postLogin);
router.post("/logout", postLogout);
router.get("/me", authRequired, getMe);

export default router;
