import { prisma } from "../../../db";
import type {
  CreateKnowledgeInput,
  UpdateKnowledgeInput,
} from "../types/knowledge.types";

/** All articles, newest first. Optionally filtered by category. */
export function listKnowledge(category?: string) {
  return prisma.knowledgeArticle.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

/** A single article by id (or null). */
export function getKnowledge(id: string) {
  return prisma.knowledgeArticle.findUnique({ where: { id } });
}

/** Create an article. */
export function createKnowledge(input: CreateKnowledgeInput) {
  return prisma.knowledgeArticle.create({ data: input });
}

/** Update an article. Returns null if it does not exist. */
export async function updateKnowledge(id: string, input: UpdateKnowledgeInput) {
  const existing = await prisma.knowledgeArticle.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.knowledgeArticle.update({ where: { id }, data: input });
}

/** Delete an article. Returns null if it does not exist. */
export async function deleteKnowledge(id: string) {
  const existing = await prisma.knowledgeArticle.findUnique({ where: { id } });
  if (!existing) return null;
  return prisma.knowledgeArticle.delete({ where: { id } });
}
