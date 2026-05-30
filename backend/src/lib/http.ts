import type { ZodType } from "zod";

/** Build an Error carrying an HTTP status for the central error handler. */
export function httpError(status: number, message: string): Error & {
  status: number;
} {
  return Object.assign(new Error(message), { status });
}

/** 404 helper. */
export function notFound(entity = "Resource"): Error & { status: number } {
  return httpError(404, `${entity} not found`);
}

/**
 * Validate `data` against a Zod schema, throwing a 400 with a readable
 * message on failure. Returns the parsed (typed) value on success.
 */
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
