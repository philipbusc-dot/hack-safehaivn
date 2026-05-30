import { useState, useEffect } from "react";
import type { SurvivorProfile } from "../types/connect.types";
import { getSurvivors, getMatches, updateLocation } from "../apis/Connect.api";

interface UseMatchMakingFeedResult {
  survivors: SurvivorProfile[];
  matchesCount: number;
  loading: boolean;
}

export function useMatchMakingFeed(): UseMatchMakingFeedResult {
  const [survivors, setSurvivors] = useState<SurvivorProfile[]>([]);
  const [matchesCount, setMatchesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeed() {
      try {
        const data = await getSurvivors();
        if (cancelled) return;
        setSurvivors(data);
        const activeMatches = await getMatches();
        if (!cancelled) setMatchesCount(activeMatches.length);
      } catch (err) {
        console.error("Failed to load nearby survivors feed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Load the feed immediately — do NOT block on geolocation.
    loadFeed();

    // Sync real coordinates in the background, then silently refresh so the
    // distances update once location is known. Never gates the initial render.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await updateLocation(position.coords.latitude, position.coords.longitude);
            if (!cancelled) await loadFeed();
          } catch (err) {
            console.warn("Could not sync real-world coordinates with backend database", err);
          }
        },
        (error) => console.warn("Geolocation access denied or timed out:", error),
        { timeout: 8000, maximumAge: 5 * 60 * 1000 }
      );
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { survivors, matchesCount, loading };
}
