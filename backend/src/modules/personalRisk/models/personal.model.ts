import { prisma } from "../../../db";
import { hashPassword } from "../../../lib/auth";
import {
  computeResourceMitigation,
  riskToDanger,
} from "../../../lib/formulas";
import type {
  PersonalRiskResult,
  SurvivalStatInput,
} from "../types/personal.types";
import type { StatUpdateInput } from "../schemas/personal.schema";

const DEMO_EMAIL = "demo@safehaivn.local";

async function getDemoUserId(): Promise<string> {
  const country = await prisma.country.upsert({
    where: { code: "TH" },
    update: {},
    create: {
      name: "Thailand",
      code: "TH",
      lat: 13.7563,
      lng: 100.5018,
      populationDensity: 137,
      airportTraffic: 65,
    },
  });
  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      username: "demo-survivor",
      // Demo-only internal user (never logs in); store a hashed placeholder.
      passwordHash: await hashPassword("demo"),
      countryId: country.id,
      description: "Default demo survival profile",
    },
  });
  return user.id;
}

export async function listStats() {
  const userId = await getDemoUserId();
  return prisma.survivalStat.findMany({
    where: { userId },
    orderBy: { id: "asc" },
  });
}

export async function addStat(input: SurvivalStatInput) {
  const userId = await getDemoUserId();
  return prisma.survivalStat.create({
    data: { name: input.name, value: input.value, userId },
  });
}

export async function updateStat(id: string, input: StatUpdateInput) {
  const userId = await getDemoUserId();
  const { count } = await prisma.survivalStat.updateMany({
    where: { id, userId },
    data: input,
  });
  if (count === 0) return null;
  return prisma.survivalStat.findUnique({ where: { id } });
}

export async function deleteStat(id: string): Promise<boolean> {
  const userId = await getDemoUserId();
  const { count } = await prisma.survivalStat.deleteMany({
    where: { id, userId },
  });
  return count > 0;
}

export async function calculatePersonal(
  regionalScore: number
): Promise<PersonalRiskResult> {
  const stats = await listStats();

  let limitingDays: number | null = null;
  let limitingStat: string | null = null;
  for (const s of stats) {
    if (limitingDays === null || s.value < limitingDays) {
      limitingDays = s.value;
      limitingStat = s.name;
    }
  }

  const resourceMitigation =
    limitingDays === null ? 0 : computeResourceMitigation(limitingDays);
  const psi = Math.round(Math.max(0, regionalScore - resourceMitigation) * 10) / 10;

  return {
    regionalScore,
    limitingDays,
    limitingStat,
    resourceMitigation,
    psi,
    dangerLevel: riskToDanger(psi),
    stats,
  };
}
