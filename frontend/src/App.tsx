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

/** Root shell: command-center backdrop + top bar + routed feature view. */import TempNav from "../public/tempnav";

const App = () => {
  return (
    <div className="min-h-screen w-full bg-bg flex justify-center items-start md:items-center p-4">
      <TempNav />
      <div className="flex-1 min-h-0 w-full flex">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
