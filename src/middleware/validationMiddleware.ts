import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export const validationMiddleware =
  (schema: Schema, error?: createError.HttpError) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (err) {
      if (err) {
        return next(error);
      }
      return next(new createError.InternalServerError("Something went wrong"));
    }
  };
