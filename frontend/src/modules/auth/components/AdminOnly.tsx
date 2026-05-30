import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

/** True when the signed-in user has the admin role. */
export function useIsAdmin(): boolean {
  return useAuth().user?.role === "admin";
}

/**
 * Renders its children only for admins. Use to hide any client-side control
 * that mutates shared/site data (create/edit/delete). This is a UX guard —
 * the real security boundary is server-side (`requireAdmin`).
 */
export function AdminOnly({ children }: { children: ReactNode }) {
  return useIsAdmin() ? <>{children}</> : null;
}
