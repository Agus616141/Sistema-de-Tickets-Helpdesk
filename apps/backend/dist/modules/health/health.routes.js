import { Router } from "express";
const router = Router();
router.get("/", (_req, res) => {
    res.json({
        ok: true,
        ts: Date.now(),
    });
});
export default router;
//# sourceMappingURL=health.routes.js.map