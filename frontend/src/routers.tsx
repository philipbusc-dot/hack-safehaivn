import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { RiskRouter } from "./modules/riskScore/routers/risk.router";

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [...RiskRouter],
  },
]);

export default mainRouter;
