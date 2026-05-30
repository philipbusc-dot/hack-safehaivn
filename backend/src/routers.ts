import { Router } from "express";
import connectRouter from "./modules/connect/routers/connect.router";
import countryReportRouter from "./modules/countryReport/routers/countryReport.router";
import riskRouter from "./modules/riskScore/routers/risk.router";
import personalRouter from "./modules/personalRisk/routers/personal.router";

const mainRouter = Router();

mainRouter.use("/regions", riskRouter);
mainRouter.use("/personal", personalRouter);
mainRouter.use("/connect", connectRouter);
mainRouter.use("/country-reports", countryReportRouter);

export default mainRouter;
