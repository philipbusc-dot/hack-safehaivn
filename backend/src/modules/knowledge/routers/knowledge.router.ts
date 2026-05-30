import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  update,
  remove,
} from "../controllers/knowledge.controller";
import { requireAdmin } from "../../../middlewares/auth";

const router = Router();

// Reference content: public to read; admin-only to mutate.
router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", requireAdmin, create);
router.put("/:id", requireAdmin, update);
router.delete("/:id", requireAdmin, remove);

export default router;
