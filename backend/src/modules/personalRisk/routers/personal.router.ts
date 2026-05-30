import { Router } from "express";
import {
  getStats,
  createStat,
  patchStat,
  removeStat,
  calculate,
} from "../controllers/personal.controller";
import { requireAuth } from "../../../middlewares/auth";

const router = Router();

// Personal risk profile is per-user data: require a logged-in user.
router.use(requireAuth);

router.post("/calculate", calculate);

router.get("/stats", getStats);
router.post("/stats", createStat);
router.patch("/stats/:id", patchStat);
router.delete("/stats/:id", removeStat);

export default router;
