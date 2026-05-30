import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import { aiRoutes } from "./modules/ai/routers/ai.router";
import { authRoutes } from "./modules/auth/routers/auth.router";
import { connectRoutes } from "./modules/connect/routers/connect.router";
import { countryReportRoutes } from "./modules/countryReport/routers/countryReport.router";
import { mapRoutes } from "./modules/map/routers/map.router";
import { profileRoutes } from "./modules/profile/routers/profile.router";
import { RiskRouter } from "./modules/riskScore/routers/risk.router";

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/ai" replace /> },
      ...authRoutes,
      // Protected feature routes — require a logged-in user.
      ...aiRoutes.map((r) => ({
        ...r,
        element: <ProtectedRoute>{r.element}</ProtectedRoute>,
      })),
    ],
    children: [
      ...connectRoutes,
      ...RiskRouter,
      ...countryReportRoutes,
      ...mapRoutes,
      ...profileRoutes,
    ],
  },
]);

export default mainRouter;
