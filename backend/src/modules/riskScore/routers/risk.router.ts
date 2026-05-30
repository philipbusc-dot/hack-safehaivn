import { Router } from "express";
import {
  getAll,
  getOne,
  create,
  refresh,
  remove,
  calculate,
} from "../controllers/risk.controller";

const router = Router();
router.post("/calculate", calculate);

router.get("/", getAll);
router.post("/", create);
router.get("/:country", getOne);
router.post("/:country/refresh", refresh);
router.delete("/:country", remove);

export default router;
