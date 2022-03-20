import createError from "http-errors";
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
  validationMiddleware(
    LoginSchema,
    new createError.BadRequest("Invalid Username/Password")
  ),
  authController.login
);

authRoute.post("/refresh-token", authController.refreshToken, () => {
  console.log("wo");
});

authRoute.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "logout" });
  }
);
