import { PostRegisterRequestBody, PostRegisterResponseBody } from "./types";
import { NextFunction, Request, Response } from "express";
import { userService } from "./service/UserService";

class AuthController {
  constructor() {}

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as PostRegisterRequestBody;
      const user = await userService.findUserByEmail(payload.email);
      if (user) {
        return res.json({ message: "The provided email is already in used." });
      }
      await userService.createNewUser(payload.email, payload.password);
      return res.json({ message: "User has been created in database" });
    } catch (error) {
      console.log(error);
      return res.json({ message: error });
    }
  }
}

export const authController = new AuthController();
