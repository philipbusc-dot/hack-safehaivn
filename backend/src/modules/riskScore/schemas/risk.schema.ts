import { z } from "zod";

const regionShape = {
  country: z.string().trim().min(2, "country is required (ISO code or name)"),
  lat: z.number().min(-90, "lat must be >= -90").max(90, "lat must be <= 90"),
  lng: z
    .number()
    .min(-180, "lng must be >= -180")
    .max(180, "lng must be <= 180"),
};

export const regionInputSchema = z.object(regionShape);

export type RegionInputSchema = z.infer<typeof regionInputSchema>;
