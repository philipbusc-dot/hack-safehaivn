import { useEffect, useState } from "react";
import { fetchCountries } from "../../map/apis/map.api";
import type { Country } from "../types/risk.types";

/**
 * Load the full country list from the live map data (disease.sh) so the risk
 * feature shares the exact same source as the map. Each country carries the
 * coordinates the risk API needs to score it.
 */
export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCountries()
      .then((rows) => {
        const list: Country[] = rows
          .filter(
            (r) =>
              r.countryInfo?.iso2 &&
              typeof r.countryInfo.lat === "number" &&
              typeof r.countryInfo.long === "number"
          )
          .map((r) => ({
            name: r.country,
            iso2: r.countryInfo!.iso2!,
            lat: r.countryInfo!.lat!,
            lng: r.countryInfo!.long!,
            flag: r.countryInfo!.flag,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        if (!cancelled) setCountries(list);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { countries, loading };
}

/** Great-circle distance between two coordinates, in kilometres. */
export function haversineKm(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number
): number {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const lat1 = (aLat * Math.PI) / 180;
  const lat2 = (bLat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** The country whose coordinates are closest to the given point. */
export function nearestCountry(
  countries: Country[],
  lat: number,
  lng: number
): Country | null {
  let best: Country | null = null;
  let bestDist = Infinity;
  for (const c of countries) {
    const d = haversineKm(lat, lng, c.lat, c.lng);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

/**
 * Ask the browser for the user's location once the country list is ready, then
 * resolve it to the nearest country. Returns null until (and unless) the user
 * grants permission and a match is found.
 */
export function useUserCountry(countries: Country[]): Country | null {
  const [userCountry, setUserCountry] = useState<Country | null>(null);

  useEffect(() => {
    if (countries.length === 0 || !("geolocation" in navigator)) return;
    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        const match = nearestCountry(
          countries,
          pos.coords.latitude,
          pos.coords.longitude
        );
        if (match) setUserCountry(match);
      },
      () => {
        /* permission denied or unavailable — fall back to the default */
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
    return () => {
      cancelled = true;
    };
  }, [countries]);

  return userCountry;
}
