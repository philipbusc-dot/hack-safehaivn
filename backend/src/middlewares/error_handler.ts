import type { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const status = err.status ?? 500;
  const message = err.message ?? "Internal server error";

  console.error(`[${status}] ${message}`);

  res.status(status).json({ message });
}
