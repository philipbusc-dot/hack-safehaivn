import type { ZodType } from "zod";

export function httpError(status: number, message: string): Error & {
  status: number;
} {
  return Object.assign(new Error(message), { status });
}

export function notFound(entity = "Resource"): Error & { status: number } {
  return httpError(404, `${entity} not found`);
}

export function validate<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues
      .map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
      .join("; ");
    throw httpError(400, msg || "Invalid request body");
  }
  return result.data;
}