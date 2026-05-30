// SafeHAIVN canonical survival math — single source of truth.
// Imported by the seed script AND by feature models so the numbers always
// agree. These are stylized survival heuristics, NOT real epidemiology.

/** Balancing constants for the Regional Risk formula. */
export const RISK_CONSTANTS = {
  k: 0.05, // hospital-strain sigmoid steepness
  alpha: 0.01, // airport-traffic weight (A)
  beta: 0.1, // humidity weight
};

export interface RegionRiskFactors {
  infectionRate: number; // outbreak intensity (e.g. % or per-capita index)
  populationDensity: number; // P — people per km²
  airportTraffic: number; // A — travel/activity index (0–100)
  humidity: number; // environmental humidity (0–100)
  hospitalStrain: number; // H — capacity usage (0–100+)
}

/**
 * Regional Survival Index sigmoid on hospital strain H:
 *   S(H) = 1.5 / (1 + e^(-k(H-100)))
 * Higher strain → higher S → higher risk multiplier.
 */
export function survivalIndex(hospitalStrain: number): number {
  const { k } = RISK_CONSTANTS;
  return 1.5 / (1 + Math.exp(-k * (hospitalStrain - 100)));
}

/**
 * Final Regional Risk (0–100):
 *   R = min(100, (InfectionRate · ln(P) · (1 + αA)) · S(H) + β·Humidity)
 */
export function computeRegionalRisk(f: RegionRiskFactors): number {
  const { alpha, beta } = RISK_CONSTANTS;
  const p = Math.max(1, f.populationDensity); // ln needs P >= 1
  const core =
    f.infectionRate * Math.log(p) * (1 + alpha * f.airportTraffic);
  const r = core * survivalIndex(f.hospitalStrain) + beta * f.humidity;
  return Math.round(Math.min(100, Math.max(0, r)) * 10) / 10;
}

/**
 * Personal Survival Index:
 *   PSI = max(0, R - 40·(1 - e^(-0.1·d)))
 * where d is the minimum social/contact safety value (we use distance in km).
 * Lower PSI = safer person to interact with.
 */
export function computePSI(regionalRisk: number, d: number): number {
  const reduction = 40 * (1 - Math.exp(-0.1 * Math.max(0, d)));
  return Math.round(Math.max(0, regionalRisk - reduction) * 10) / 10;
}

/** Map a regional/personal risk score to a danger level label. */
export function riskToDanger(score: number): "LOW" | "MODERATE" | "HIGH" {
  if (score >= 66) return "HIGH";
  if (score >= 33) return "MODERATE";
  return "LOW";
}

/**
 * Classify a country's outbreak danger from cumulative COVID-style metrics.
 * Composite of cases-per-million and case-fatality ratio.
 */
export function classifyCountryDanger(input: {
  infectedCount: number;
  deathCount: number;
  population?: number;
  casesPerOneMillion?: number;
}): "LOW" | "MODERATE" | "HIGH" {
  const cpm =
    input.casesPerOneMillion ??
    (input.population && input.population > 0
      ? (input.infectedCount / input.population) * 1_000_000
      : 0);
  const cfr =
    input.infectedCount > 0 ? input.deathCount / input.infectedCount : 0;

  // Weighted score: caseload (0–70) + lethality (0–30).
  const loadScore = Math.min(70, (cpm / 300_000) * 70);
  const cfrScore = Math.min(30, (cfr / 0.03) * 30);
  const score = loadScore + cfrScore;

  if (score >= 55) return "HIGH";
  if (score >= 28) return "MODERATE";
  return "LOW";
}
