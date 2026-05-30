// Population Density — seed half of the hybrid source.
//
// REST Countries is the live source (population / area). When it is unreachable
// or returns an unusable area, we fall back to these World-Bank-style national
// densities (people per km²), keyed by ISO alpha-2 and by lowercased name so a
// lookup works whether the caller passes "TH" or "Thailand".

export const DENSITY_SEED: Record<string, number> = {
  // ISO alpha-2
  th: 137,
  us: 36,
  cn: 153,
  in: 464,
  jp: 347,
  kr: 527,
  sg: 8358,
  hk: 6300,
  id: 151,
  gb: 281,
  fr: 119,
  de: 240,
  it: 206,
  es: 94,
  ru: 9,
  br: 25,
  mx: 66,
  ca: 4,
  au: 3,
  za: 49,
  eg: 103,
  ng: 226,
  ae: 118,
  qa: 248,
  my: 99,
  ph: 368,
  vn: 314,
  tr: 110,
  ar: 17,
  co: 46,
  pe: 26,
  nl: 521,
  nz: 19,
};

export const DEFAULT_DENSITY = 60;

export function seedDensity(countryOrCode: string): number {
  const key = countryOrCode.trim().toLowerCase();
  return DENSITY_SEED[key] ?? DEFAULT_DENSITY;
}
