import { z } from "zod";

/** Body schema for POST /knowledge. */
export const createKnowledgeSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  content: z.string().trim().min(1, "content is required"),
  category: z.string().trim().min(1, "category is required"),
  source: z.string().trim().min(1, "source is required"),
});

/** Body schema for PUT /knowledge/:id — all fields optional. */
export const updateKnowledgeSchema = z
  .object({
    title: z.string().trim().min(1),
    content: z.string().trim().min(1),
    category: z.string().trim().min(1),
    source: z.string().trim().min(1),
  })
  .partial()
  .refine((obj) => Object.keys(obj).length > 0, {
    message: "At least one field is required",
  });

/** Query schema for GET /knowledge?category=… */
export const listKnowledgeQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),
});

export type CreateKnowledgeSchema = z.infer<typeof createKnowledgeSchema>;
export type UpdateKnowledgeSchema = z.infer<typeof updateKnowledgeSchema>;
export type ListKnowledgeQuerySchema = z.infer<typeof listKnowledgeQuerySchema>;
