import { authController } from "./authController";
import { NextFunction, Request, Response, Router } from "express";

export const authRoute = Router();

authRoute.post("/register", authController.register);

authRoute.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "login" });
  }
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
