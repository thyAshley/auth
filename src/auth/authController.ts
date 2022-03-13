import { NextFunction, Request, Response } from "express";
import { userService } from "./service/UserService";

class AuthController {
  constructor() {}

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      await userService.createNewUser(payload.email, payload.password);
      res.json({ message: "register" });
    } catch (error) {
      console.log(error);
      res.json({ message: error });
    }
  }
}

export const authController = new AuthController();
