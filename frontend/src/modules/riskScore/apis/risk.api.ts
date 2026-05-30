import api from "../../../api";
import type { RegionInput, RegionRiskPreview } from "../types/risk.types";

export async function calculateRegionRisk(
  input: RegionInput
): Promise<RegionRiskPreview> {
  const { data } = await api.post<RegionRiskPreview>(
    "/regions/calculate",
    input
  );
  return data;
}
