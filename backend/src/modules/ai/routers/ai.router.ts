import { Router } from "express";
import { generate } from "../controllers/ai.controller";
import { requireAuth } from "../../../middlewares/auth";

const router = Router();

router.post("/generate-briefing", requireAuth, generate);

export default router;
