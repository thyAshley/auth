import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { jwtService } from "../auth/service/JwtService";

export const protectMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;
  if (!auth) {
    return next(
      new createError.Unauthorized("You are not authorized to view this page")
    );
  }
  const [_, token] = auth.split(" ");
  try {
    await jwtService.verifyAccessToken(token);
    next();
  } catch (error) {
    next(error);
  }
};
