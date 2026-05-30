import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  refresh,
  remove,
  calculate,
} from "../controllers/risk.controller";
import { requireAdmin } from "../../../middlewares/auth";

const router = Router();
// Pure computation + reads are public; persisting/refreshing/deleting region
// risk profiles (shared map data) is admin-only.
router.post("/calculate", calculate);

router.get("/", getAll);
router.get("/:country", getOne);
router.post("/", requireAdmin, create);
router.post("/:country/refresh", requireAdmin, refresh);
router.delete("/:country", requireAdmin, remove);

export default router;
