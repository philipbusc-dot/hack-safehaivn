import { prisma } from "../../../db";
import { computeRegionalRisk, riskToDanger } from "../../../lib/formulas";
import { resolveFactors, type FactorResult } from "../services/factors.service";
import type { DangerLevel, RegionInput } from "../types/region.types";

function score(f: FactorResult["factors"]): number {
  return computeRegionalRisk({
    infectionRate: f.infectionRate,
    populationDensity: f.populationDensity,
    airportTraffic: f.airportTraffic,
    humidity: f.humidity,
    hospitalStrain: f.hospitalPressure,
  });
}

export function listRegions() {
  return prisma.regionRisk.findMany({ orderBy: { regionalScore: "desc" } });
}

export function getRegion(country: string) {
  return prisma.regionRisk.findUnique({ where: { country } });
}

export async function previewRegion(input: RegionInput): Promise<{
  factors: FactorResult["factors"];
  sources: FactorResult["sources"];
  meta: FactorResult["meta"];
  regionalScore: number;
  dangerLevel: DangerLevel;
}> {
  const resolved = await resolveFactors(input);
  const regionalScore = score(resolved.factors);
  return {
    ...resolved,
    regionalScore,
    dangerLevel: riskToDanger(regionalScore),
  };
}

export async function upsertRegion(input: RegionInput) {
  const { factors } = await resolveFactors(input);
  const regionalScore = score(factors);
  const data = {
    lat: input.lat,
    lng: input.lng,
    ...factors,
    regionalScore,
  };
  return prisma.regionRisk.upsert({
    where: { country: input.country },
    create: { country: input.country, ...data },
    update: data,
  });
}

export async function refreshRegion(country: string) {
  const existing = await prisma.regionRisk.findUnique({ where: { country } });
  if (!existing) return null;
  return upsertRegion({
    country: existing.country,
    lat: existing.lat,
    lng: existing.lng,
  });
}

export async function deleteRegion(country: string) {
  const existing = await prisma.regionRisk.findUnique({ where: { country } });
  if (!existing) return null;
  return prisma.regionRisk.delete({ where: { country } });
}
