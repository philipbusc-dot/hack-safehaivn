// Feature 4 — AI Survival Briefing System. CRUD entity: KnowledgeArticle.

/** A single knowledge-base article (pandemic history / survival guide). */
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Fields accepted when creating an article. */
export interface CreateKnowledgeInput {
  title: string;
  content: string;
  category: string;
  source: string;
}

/** Fields accepted when updating an article (all optional). */
export interface UpdateKnowledgeInput {
  title?: string;
  content?: string;
  category?: string;
  source?: string;
}
