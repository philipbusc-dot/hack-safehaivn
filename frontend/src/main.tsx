import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./modules/auth/context/AuthContext";
import mainRouter from "./routers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={mainRouter} />
    </AuthProvider>
  </StrictMode>
);
