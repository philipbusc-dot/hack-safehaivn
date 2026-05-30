import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import { aiRoutes } from "./modules/ai/routers/ai.router";

const mainRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/ai" replace /> },
      ...aiRoutes,
    ],
  },
]);

export default mainRouter;
