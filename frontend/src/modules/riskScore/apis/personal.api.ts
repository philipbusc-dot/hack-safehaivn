import api from "../../../api";
import type {
  PersonalRiskResult,
  SurvivalStat,
  SurvivalStatInput,
} from "../types/personal.types";

export async function listStats(): Promise<SurvivalStat[]> {
  const { data } = await api.get<SurvivalStat[]>("/personal/stats");
  return data;
}

export async function addStat(
  input: SurvivalStatInput
): Promise<SurvivalStat> {
  const { data } = await api.post<SurvivalStat>("/personal/stats", input);
  return data;
}

export async function updateStat(
  id: string,
  input: Partial<SurvivalStatInput>
): Promise<SurvivalStat> {
  const { data } = await api.patch<SurvivalStat>(
    `/personal/stats/${id}`,
    input
  );
  return data;
}

export async function deleteStat(id: string): Promise<void> {
  await api.delete(`/personal/stats/${id}`);
}

export async function calculatePersonal(
  regionalScore: number
): Promise<PersonalRiskResult> {
  const { data } = await api.post<PersonalRiskResult>("/personal/calculate", {
    regionalScore,
  });
  return data;
}
