import * as createError from "http-errors";
import { NextFunction, Request, Response } from "express";

export const errorHandlingMiddleware = (
  error: createError.HttpError,
  request: Request,
  response: Response,
  next: NextFunction
): Response => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  return response.status(status).json({ message: message });
};
