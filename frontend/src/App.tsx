import { Outlet } from "react-router-dom";
import { useAuth } from "./modules/auth/context/AuthContext";

/** Slim top bar shown only when signed in: identity + role + logout. */
function TopBar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <header className="flex items-center justify-between border-b border-line px-5 py-3">
      <span className="font-mono uppercase tracking-[0.18em] text-[11px] text-faint">
        SafeHAIVN
      </span>
      <div className="flex items-center gap-3 text-[12px]">
        <span className="text-muted">{user.username}</span>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono uppercase tracking-[0.14em] text-[10px] ${
            user.role === "admin"
              ? "border-lime/40 text-lime"
              : "border-line2 text-muted"
          }`}
        >
          {user.role}
        </span>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full border border-line2 px-3 py-1 text-muted transition hover:text-ink"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

/** Root shell: command-center backdrop + top bar + routed feature view. */
const App = () => {
  return (
    <div className="min-h-screen bg-bg font-sans text-ink antialiased">
      {/* Signature backdrop: two radial glows + a faint 30px grid.
          Fixed layer so it survives scroll. Expressed purely with
          Tailwind arbitrary background utilities. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-bg [background-image:radial-gradient(900px_600px_at_100%_0%,rgba(164,210,51,0.06),transparent_60%),radial-gradient(900px_600px_at_0%_0%,rgba(57,184,161,0.05),transparent_60%),linear-gradient(rgba(120,160,140,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,160,140,0.03)_1px,transparent_1px)] [background-size:100%_100%,100%_100%,30px_30px,30px_30px]"
      />
      <TopBar />
      <Outlet />
    </div>
  );
};

export default App;
