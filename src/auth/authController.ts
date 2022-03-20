import { NextFunction, Request, Response } from "express";
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
      const token = await jwtService.signAccessToken({
        userId: user.id,
        email: user.email,
      });
      const refreshToken = await jwtService.signRefreshToken({
        userId: user.id,
        email: user.email,
      });
      return res.json({ token, refreshToken });
    } catch (error) {
      console.log(error);
      next(new createError.InternalServerError());
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as PostRefreshTokenBody;
      if (!refreshToken) {
        next(new createError.BadRequest());
      }
      jwtService.verifyRefreshToken(refreshToken);
      next();
    } catch (error) {
      console.log(error);
      next(new createError.InternalServerError());
    }
  }
}

export const authController = new AuthController();
