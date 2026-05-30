import { Router } from "express";
import riskRouter from "./modules/riskScore/routers/risk.router";
import personalRouter from "./modules/personalRisk/routers/personal.router";

const mainRouter = Router();

mainRouter.use("/regions", riskRouter);
mainRouter.use("/personal", personalRouter);

export default mainRouter;
