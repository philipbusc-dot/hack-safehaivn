import { useEffect, useState } from "react";
import { MonoLabel, Spinner, Notice } from "../../../components/ui";
import { generateEvacuation } from "../apis/ai.api";
import { useCountries, nearestCountry } from "../../riskScore/hooks/useCountries";
import type { EvacuationBriefing } from "../types/ai.types";

export default function EvacuationView() {
  const [data, setData] = useState<EvacuationBriefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Same live country list the Map/RiskFactor use — lets us resolve the user's
  // real-world location and plot the evacuation from where they actually are,
  // instead of the hard-coded scenario default.
  const { countries, loading: countriesLoading } = useCountries();

  useEffect(() => {
    // Wait until the country-list fetch has settled, so the very first request
    // can already be grounded in the user's location (no default→real reflow).
    if (countriesLoading) return;
    let cancelled = false;

    function generate(location?: string) {
      if (cancelled) return;
      setLoading(true);
      setError(null);
      generateEvacuation(location ? { location } : {})
        .then((d) => {
          if (!cancelled) setData(d);
        })
        .catch(() => {
          if (!cancelled)
            setError(
              "Couldn't generate the evacuation advisory. Is the backend running?"
            );
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }

    // Resolve the nearest country to the device's GPS, then plot from there.
    // On denial / timeout / no list, fall back to the server scenario default.
    if (countries.length > 0 && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const match = nearestCountry(
            countries,
            pos.coords.latitude,
            pos.coords.longitude
          );
          generate(match?.name);
        },
        () => generate(),
        { timeout: 8000, maximumAge: 5 * 60 * 1000 }
      );
    } else {
      generate();
    }

    return () => {
      cancelled = true;
    };
  }, [countries, countriesLoading]);

  if (loading && !data) {
    return (
      <div className="flex flex-1 items-center justify-center gap-2 py-16 text-muted">
        <Spinner /> Plotting evacuation corridor…
      </div>
    );
  }
  if (error) return <Notice tone="danger">{error}</Notice>;
  if (!data) return null;

  const pct = Math.min(100, Math.max(0, data.departureWindow.progressPct));

  return (
    <div className="flex flex-col gap-5">
      {/* Evac hero */}
      <div className="flex items-center gap-5 rounded-card border border-line bg-surface px-5 py-5">
        <div
          className="text-[40px] leading-none text-lime"
          style={{ textShadow: "0 0 18px rgba(164,210,51,0.45)" }}
          aria-hidden
        >
          ↗
        </div>
        <div>
          <MonoLabel className="text-faint">EVACUATE</MonoLabel>
          <div className="text-[28px] font-extrabold leading-tight text-head">
            {data.direction}
          </div>
          <p className="mt-0.5 text-[13px] text-muted">
            Recommended bearing out of {data.region} · away from the highest-exposure zone.
          </p>
        </div>
      </div>

      {/* Nearest safe zone */}
      <div className="rounded-card border border-line bg-surface px-5 py-4">
        <MonoLabel className="text-faint">NEAREST SAFE ZONE</MonoLabel>
        <div className="mt-1 text-[16px] font-semibold text-head">
          {data.safeZone.name}
        </div>
        <p className="mt-1 text-[13px] text-muted">
          {data.safeZone.meta}
          {data.safeZone.verifiedClean && (
            <>
              {" · "}
              <span className="font-semibold text-lime">Verified clean</span>
            </>
          )}
        </p>
      </div>

      {/* Route steps */}
      <div>
        <MonoLabel className="text-faint">ROUTE</MonoLabel>
        <ol className="mt-2 flex flex-col gap-3">
          {data.routeSteps.map((s, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-line2 bg-surface2 font-mono text-[11px] text-lime">
                {i + 1}
              </span>
              <p className="text-[14px] leading-snug text-ink">
                <strong className="font-semibold text-head">{s.action}</strong>
                {s.detail && (
                  <span className="text-muted"> — {s.detail}</span>
                )}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Departure window */}
      <div className="rounded-card border border-line bg-surface px-5 py-4">
        <div className="flex items-baseline justify-between">
          <MonoLabel className="text-faint">
            {data.departureWindow.label}
          </MonoLabel>
          <span className="text-[18px] font-bold text-head tabular-nums">
            {data.departureWindow.timeRemaining}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <MonoLabel className="mt-2 inline-block text-faint">
          SOURCE: {data.source}
        </MonoLabel>
      </div>
    </div>
  );
}
