import type { Request, Response, NextFunction } from "express";
import { notFound, validate } from "../../../lib/http";
import {
  createKnowledgeSchema,
  updateKnowledgeSchema,
  listKnowledgeQuerySchema,
} from "../schemas/knowledge.schema";
import {
  listKnowledge,
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  deleteKnowledge,
} from "../models/knowledge.model";

/** GET /knowledge — newest first, optional ?category= filter. */
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const { category } = validate(listKnowledgeQuerySchema, req.query);
    res.json(await listKnowledge(category));
  } catch (err) {
    next(err);
  }
}

/** GET /knowledge/:id */
export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await getKnowledge(req.params["id"] as string);
    if (!article) throw notFound("Article");
    res.json(article);
  } catch (err) {
    next(err);
  }
}

/** POST /knowledge */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = validate(createKnowledgeSchema, req.body);
    res.status(201).json(await createKnowledge(data));
  } catch (err) {
    next(err);
  }
}

/** PUT /knowledge/:id */
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = validate(updateKnowledgeSchema, req.body);
    const article = await updateKnowledge(req.params["id"] as string, data);
    if (!article) throw notFound("Article");
    res.json(article);
  } catch (err) {
    next(err);
  }
}

/** DELETE /knowledge/:id */
export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const article = await deleteKnowledge(req.params["id"] as string);
    if (!article) throw notFound("Article");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
