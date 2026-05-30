import type { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
  code?: string; // Prisma error code (e.g. "P2002", "P2025")
  meta?: { target?: string[] | string };
}

/** Map a known Prisma error code to a clean status + message. */
function mapPrismaError(
  err: AppError
): { status: number; message: string } | null {
  switch (err.code) {
    case "P2002": {
      const target = Array.isArray(err.meta?.target)
        ? err.meta?.target.join(", ")
        : err.meta?.target;
      return {
        status: 409,
        message: target
          ? `A record with that ${target} already exists`
          : "Record already exists (unique constraint)",
      };
    }
    case "P2025":
      return { status: 404, message: "Resource not found" };
    case "P2003":
      return { status: 409, message: "Related record constraint failed" };
    default:
      return err.code?.startsWith("P")
        ? { status: 400, message: "Invalid database operation" }
        : null;
  }
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const prisma = mapPrismaError(err);
  const status = prisma?.status ?? err.status ?? 500;
  const message =
    prisma?.message ??
    (err.status ? err.message : status === 500 ? "Internal server error" : err.message) ??
    "Internal server error";

  // Log the full error server-side; never leak internals to the client.
  console.error(`[${status}] ${err.message}`);

  res.status(status).json({ message });
}
