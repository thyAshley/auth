import { authController } from "./authController";
import { NextFunction, Request, Response, Router } from "express";
import { validationMiddleware } from "../middleware";
import { LoginSchema, RegisterSchema } from "./schema";

export const authRoute = Router();

authRoute.post(
  "/register",
  validationMiddleware(RegisterSchema),
  authController.register
);

authRoute.post(
  "/login",
  validationMiddleware(LoginSchema),
  authController.login
);

authRoute.post(
  "/refresh-token",

  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "refresh" });
  }
);

authRoute.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "logout" });
  }
);
