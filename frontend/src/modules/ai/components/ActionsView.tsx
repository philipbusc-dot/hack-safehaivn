import { useEffect, useState } from "react";
import { MonoLabel, Spinner, Notice } from "../../../components/ui";
import { generateActions } from "../apis/ai.api";
import { getActiveContext } from "../lib/chatStorage";
import { useAuth } from "../../auth/context/AuthContext";
import PriorityTag from "./PriorityTag";
import type { ActionsBriefing } from "../types/ai.types";

function TaskRow({
  title,
  priority,
  rationale,
  done,
  onToggle,
}: {
  title: string;
  priority: ActionsBriefing["actions"][number]["priority"];
  rationale: string;
  done: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-[13px] border border-line bg-surface px-4 py-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        onClick={onToggle}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border text-[12px] font-bold transition ${
          done
            ? "border-[#c7ee54] bg-accent text-accent-ink shadow-glow"
            : "border-line2 bg-transparent text-transparent hover:border-lime"
        }`}
      >
        ✓
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-[14.5px] font-bold ${done ? "text-faint line-through" : "text-head"}`}
          >
            {title}
          </span>
          <PriorityTag priority={priority} />
        </div>
        <p className="mt-1 text-[13px] leading-snug text-muted">{rationale}</p>
      </div>
    </div>
  );
}

export default function ActionsView() {
  const [data, setData] = useState<ActionsBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [tailored, setTailored] = useState(false);
  const scope = useAuth().user?.id ?? "anon";

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Pull recent chat context so actions reflect what the user discussed.
      const context = getActiveContext(scope);
      setTailored(context.length > 0);
      const res = await generateActions(context);
      setData(res);
      setDone({});
    } catch {
      setError("Couldn't generate actions. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-1">
          <MonoLabel className="text-faint">
            {data
              ? `PRIORITISED FOR ${data.region.toUpperCase()} · ${data.threatLevel} THREAT`
              : "PRIORITISED BRIEFING"}
          </MonoLabel>
          {tailored && (
            <span className="flex items-center gap-1.5 text-[11px] text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              Tailored to your conversation
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="flex items-center gap-2 rounded-chip border border-line2 px-3 py-1.5 text-[13px] text-muted transition hover:text-ink disabled:opacity-50"
        >
          {loading && <Spinner />} Regenerate
        </button>
      </div>

      {loading && !data ? (
        <div className="flex flex-1 items-center justify-center gap-2 py-16 text-muted">
          <Spinner /> Compiling prioritized actions…
        </div>
      ) : error ? (
        <Notice tone="danger">{error}</Notice>
      ) : data ? (
        <div className="flex flex-col gap-2.5">
          {data.actions.map((a, i) => (
            <TaskRow
              key={`${a.title}-${i}`}
              title={a.title}
              priority={a.priority}
              rationale={a.rationale}
              done={!!done[i]}
              onToggle={() => setDone((d) => ({ ...d, [i]: !d[i] }))}
            />
          ))}
          <MonoLabel className="mt-1 text-faint">
            SOURCE: {data.source} · {Object.values(done).filter(Boolean).length}/
            {data.actions.length} CLEARED
          </MonoLabel>
        </div>
      ) : null}
    </div>
  );
}
