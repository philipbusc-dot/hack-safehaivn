import type { Request, Response, NextFunction } from "express";
import { notFound, validate } from "../../../lib/http";
import { regionInputSchema } from "../schemas/risk.schema";
import {
  listRegions,
  getRegion,
  previewRegion,
  upsertRegion,
  refreshRegion,
  deleteRegion,
} from "../models/risk.model";

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    res.json(await listRegions());
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const region = await getRegion(req.params["country"] as string);
    if (!region) throw notFound("Region");
    res.json(region);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const input = validate(regionInputSchema, req.body);
    res.status(201).json(await upsertRegion(input));
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const region = await refreshRegion(req.params["country"] as string);
    if (!region) throw notFound("Region");
    res.json(region);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const region = await deleteRegion(req.params["country"] as string);
    if (!region) throw notFound("Region");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function calculate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = validate(regionInputSchema, req.body);
    res.json(await previewRegion(input));
  } catch (err) {
    next(err);
  }
}
