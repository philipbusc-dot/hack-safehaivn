// Shared SafeHAIVN constants used across feature modules.

export const BRAND = "SafeHAIVN";

/** Footer disclaimer — must appear on every screen (scope guardrail). */
export const DISCLAIMER =
  "SafeHAIVN summarizes & recommends — it does not diagnose or prescribe.";

/** Persistent top-right system label in the nav. */
export const SYS_LABEL = "OUTBREAK MONITOR · ACTIVE";

/** Default operating locale used across the app (design canon: Bangkok). */
export const DEFAULT_LOCATION = {
  city: "Bangkok",
  countryCode: "TH",
  countryName: "Thailand",
  latitude: 13.7563,
  longitude: 100.5018,
};

export type DangerLevel = "LOW" | "MODERATE" | "HIGH";

/** Top-nav tabs → routes. One tab per core feature. */
export const NAV_ITEMS: { label: string; to: string }[] = [
  { label: "Map", to: "/" },
  { label: "RiskFactor", to: "/risk" },
  { label: "Connect", to: "/connect" },
  { label: "AI", to: "/ai" },
];

/** Threat color scale (hex) — semantic only, never decorative. */
export const DANGER_COLORS: Record<DangerLevel, string> = {
  LOW: "#a4d233", // lime
  MODERATE: "#e0922b", // amber
  HIGH: "#e2473a", // infected-red
};

export function dangerColor(level: string): string {
  return DANGER_COLORS[(level?.toUpperCase() as DangerLevel) ?? "LOW"] ?? "#8aa399";
}

/** Tailwind text-color class for a danger level. */
export function dangerTextClass(level: string): string {
  switch (level?.toUpperCase()) {
    case "HIGH":
      return "text-danger";
    case "MODERATE":
      return "text-amber";
    case "LOW":
      return "text-lime";
    default:
      return "text-muted";
  }
}
