import { Router } from "express";
import {
  create,
  list,
  update,
  remove,
} from "../controllers/countryReport.controller";
import { requireAdmin } from "../../../middlewares/auth";

const countryReportRouter = Router();

// Map/world data: anyone may read; only admins may edit.
countryReportRouter.get("/", list); // Read all (public)
countryReportRouter.post("/", requireAdmin, create); // Create (admin)
countryReportRouter.put("/:id", requireAdmin, update); // Update by id (admin)
countryReportRouter.delete("/:id", requireAdmin, remove); // Delete by id (admin)

export default countryReportRouter;
