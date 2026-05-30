// Shared SafeHAIVN UI primitives (Plague theme). Import these in feature
// modules to keep the command-center look consistent.
import type { ReactNode } from "react";

/** Uppercase Space-Mono micro-label (corner labels, captions, tags). */
export function MonoLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono uppercase tracking-[0.18em] text-[10.5px] ${className}`}
    >
      {children}
    </span>
  );
}

/** Rounded command-center panel with the faint lime top highlight. */
export function Panel({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Optional mono corner label, e.g. "CHATBOT // CONTENT AREA". */
  label?: string;
}) {
  return (
    <div
      className={`relative rounded-panel border border-line bg-panel shadow-panel ${className}`}
      style={{ boxShadow: "var(--shadow-panel)" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-panel"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(164,210,51,0.35), transparent)",
        }}
      />
      {label && (
        <MonoLabel className="absolute right-4 top-3 text-faint">
          {label}
        </MonoLabel>
      )}
      {children}
    </div>
  );
}

/** Big lime status number / score. */
export function ScoreNumber({
  value,
  className = "",
}: {
  value: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-sans font-extrabold text-lime tabular-nums ${className}`}
    >
      {value}
    </span>
  );
}

/** Section heading used inside content panels (view H3, 23px). */
export function SectionTitle({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3 className={`text-[23px] font-bold text-head ${className}`}>{children}</h3>
  );
}

/** Threat badge pill (semantic color). */
export function ThreatBadge({ level }: { level: string }) {
  const l = level?.toUpperCase();
  const map: Record<string, string> = {
    HIGH: "bg-danger/15 text-danger border-danger/40",
    MODERATE: "bg-amber/15 text-amber border-amber/40",
    LOW: "bg-lime/15 text-lime border-lime/40",
  };
  return (
    <span
      className={`font-mono uppercase tracking-[0.14em] text-[10.5px] rounded-full border px-2.5 py-1 ${
        map[l] ?? "bg-surface text-muted border-line"
      }`}
    >
      {l} {l === "HIGH" ? "THREAT" : "RISK"}
    </span>
  );
}

/** Lightweight inline spinner. */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-line2 border-t-lime ${className}`}
      aria-label="loading"
    />
  );
}

/** Small empty / error state row. */
export function Notice({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "danger";
}) {
  return (
    <div
      className={`rounded-card border px-4 py-3 text-sm ${
        tone === "danger"
          ? "border-danger/40 bg-danger/10 text-danger"
          : "border-line bg-surface/50 text-muted"
      }`}
    >
      {children}
    </div>
  );
}
