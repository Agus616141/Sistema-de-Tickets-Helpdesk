import { Router } from "express";
import { getComments, postComment } from "./comments.controller.js";

const router = Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", postComment);

export default router;
