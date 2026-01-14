import { Request, Response, NextFunction } from "express";
import { ApiError } from "@harmony-central/types";

/**
 * Error handler middleware
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error:", err);

  const error: ApiError = {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
  };

  // Handle specific error types
  if (err.name === "ValidationError") {
    error.code = "VALIDATION_ERROR";
    error.message = err.message;
    res.status(400).json(error);
    return;
  }

  if (err.name === "NotFoundError") {
    error.code = "NOT_FOUND";
    error.message = err.message;
    res.status(404).json(error);
    return;
  }

  // Default 500 error
  res.status(500).json(error);
}

/**
 * Custom error classes
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
