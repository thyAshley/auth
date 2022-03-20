import { json, NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { jwtService } from "./service/JwtService";
import { userService } from "./service/UserService";
import { PostRegisterRequestBody } from "./types";

interface PostLoginRequestBody {
  email: string;
  password: string;
}

interface PostRefreshTokenBody {
  refreshToken: string;
}

class AuthController {
  constructor() {}

  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as PostRegisterRequestBody;
      const user = await userService.findUserByEmail(payload.email);
      if (user) {
        return next(
          new createError.BadRequest("The provided email is already in used.")
        );
      }

      await userService.createNewUser(payload.email, payload.password);
      return res.json({ message: "User has been created in database" });
    } catch (error) {
      return next(new createError.InternalServerError());
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as PostLoginRequestBody;
      const user = await userService.findAndValidateUser(
        payload.email,
        payload.password
      );

      const userId = user.id.toString();

      const { newRefreshToken, newToken } = await jwtService.issueToken(
        user.email,
        userId
      );

      return res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
      console.log(error);
      next(new createError.InternalServerError());
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as PostRefreshTokenBody;
      if (!refreshToken) {
        return next(new createError.BadRequest());
      }
      const { newRefreshToken, newToken } = await jwtService.reIssueToken(
        refreshToken
      );
      return res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
