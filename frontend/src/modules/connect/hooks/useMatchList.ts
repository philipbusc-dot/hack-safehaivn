import { useState, useEffect } from "react";
import type { SurvivorProfile } from "../types/connect.types";
import { getMatches } from "../apis/Connect.api";

const POLL_INTERVAL_MS = 4000;

interface UseMatchListResult {
  matches: SurvivorProfile[];
  loading: boolean;
}

/**
 * Fetches the current user's inbox contacts and keeps it live by polling every
 * few seconds, so ordering / last-message / time stay current without a reload.
 * Also re-fetches immediately when `refreshKey` changes (e.g. switching chats).
 */
export function useMatchList(refreshKey?: string): UseMatchListResult {
  const [matches, setMatches] = useState<SurvivorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadMatches(showSpinner: boolean) {
      if (showSpinner) setLoading(true);
      try {
        const data = await getMatches();
        if (!cancelled) setMatches(data);
      } catch (err) {
        console.error("Failed to load match channels from database:", err);
      } finally {
        if (showSpinner && !cancelled) setLoading(false);
      }
    }

    loadMatches(true);
    // Background refresh — silent (no spinner) so the list doesn't flicker.
    const interval = setInterval(() => loadMatches(false), POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [refreshKey]);

  return { matches, loading };
}
