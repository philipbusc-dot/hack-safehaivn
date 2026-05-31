import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/context/AuthContext";

// Primary navigation. `match` lets a link stay active across nested paths
// (e.g. RiskFactor highlights for both /risk/region and /risk/yourscore).
const LINKS: { to: string; label: string; match?: string }[] = [
  { to: "/map", label: "Map" },
  { to: "/risk/region", label: "RiskFactor", match: "/risk" },
  { to: "/connect", label: "Connect" },
  { to: "/ai", label: "AI" },
];

const TempNav = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Hidden when signed out so the login / signup pages stay clean.
  if (!user) return null;

  // Full-screen views with their own layout/navigation: hide the global nav.
  if (
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/chat")
  )
    return null;

  return (
    <header className="sticky top-0 z-50 flex w-full select-none flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-neutral-800 bg-neutral-900/95 px-3 py-3 backdrop-blur sm:px-5">
      <span className="shrink-0 font-mono text-xs tracking-wide text-neutral-400">
        ☣️ SafeHAIVN
      </span>

      <nav className="flex items-center gap-4 font-mono text-xs sm:gap-6">
        {LINKS.map((l) => {
          const active = location.pathname.startsWith(l.match ?? l.to);
          return (
            <Link
              key={l.to}
              to={l.to}
              className={
                active
                  ? "font-bold text-lime-400"
                  : "font-normal text-neutral-400 transition-colors hover:text-white"
              }
            >
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-3 text-[12px]">
        <span className="hidden text-neutral-300 sm:inline">{user.username}</span>
        <span
          className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${
            user.role === "admin"
              ? "border-lime-400/40 text-lime-400"
              : "border-neutral-700 text-neutral-400"
          }`}
        >
          {user.role}
        </span>
        <button
          type="button"
          onClick={() => void logout()}
          className="rounded-full border border-neutral-700 px-3 py-1 text-neutral-400 transition hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TempNav;
