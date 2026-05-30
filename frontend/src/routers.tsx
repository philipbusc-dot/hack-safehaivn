import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { additionRoutes } from "./modules/addition/routers/addition.router";
import { multiplicationRoutes } from "./modules/multiplication/routers/multiplication.router";
import { countryReportRoutes } from "./modules/countryReport/routers/countryReport.router";
import { mapRoutes } from "./modules/map/routers/map.router";
import { profileRoutes } from "./modules/profile/routers/profile.router";

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      ...additionRoutes,
      ...multiplicationRoutes,
      ...countryReportRoutes,
      ...mapRoutes,
      ...profileRoutes,
    ],
  },
]);

export default mainRouter;
