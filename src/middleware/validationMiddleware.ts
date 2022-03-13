import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";

export const validationMiddleware =
  (schema: Schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      console.log(error);
      next(new createError.BadRequest("Invalid params provided"));
    }
  };
