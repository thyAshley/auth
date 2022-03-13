import { NextFunction, Request, Response } from "express";

export const healthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.sendStatus(200);
};
