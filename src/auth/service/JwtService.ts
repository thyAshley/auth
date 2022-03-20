import { appConfig } from "./../../config/app-config";
import createError from "http-errors";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

interface SignAccessTokenPayload {
  userId: number;
  email: string;
  secret?: string;
  duration?: number;
}

class JwtService {
  constructor() {}

  public signAccessToken = async ({
    email,
    userId,
    secret,
    duration,
  }: SignAccessTokenPayload): Promise<string> => {
    const payload = {
      email,
    };
    if (!appConfig.app.jwtSecret) {
      throw new createError.ServiceUnavailable(
        "Service is unavailable, please contact the administrator"
      );
    }
    try {
      return jwt.sign(payload, secret || appConfig.app.jwtSecret, {
        expiresIn: duration || 5,
        issuer: "authserver",
        audience: userId.toString(),
      });
    } catch (error) {
      console.log(error);
      throw new createError.InternalServerError();
    }
  };

  public verifyRefreshToken = (token: string) => {
    if (!appConfig.app.jwtRefreshSecret) {
      throw new createError.ServiceUnavailable(
        "Service is unavailable, please contact the administrator"
      );
    }
    try {
      jwt.verify(token, appConfig.app.jwtRefreshSecret, {
        issuer: "authserver",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof JsonWebTokenError) {
        switch (error.name) {
          case "TokenExpiredError":
            throw new createError.Unauthorized("Token has expired");
          case "JsonWebTokenError":
            throw new createError.Unauthorized(
              "You are not authorized to view this page"
            );
          default:
            throw new createError.InternalServerError();
        }
      }
      throw new createError.InternalServerError();
    }
  };

  public verifyAccessToken = (token: string) => {
    if (!appConfig.app.jwtSecret) {
      throw new createError.ServiceUnavailable(
        "Service is unavailable, please contact the administrator"
      );
    }
    try {
      jwt.verify(token, appConfig.app.jwtSecret, {
        issuer: "authserver",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof JsonWebTokenError) {
        switch (error.name) {
          case "TokenExpiredError":
            throw new createError.Unauthorized("Token has expired");
          case "JsonWebTokenError":
            throw new createError.Unauthorized(
              "You are not authorized to view this page"
            );
          default:
            throw new createError.InternalServerError();
        }
      }
      throw new createError.InternalServerError();
    }
  };

  public signRefreshToken = async ({
    email,
    userId,
  }: SignAccessTokenPayload): Promise<string> => {
    try {
      const refreshToken = await this.signAccessToken({
        email,
        userId,
        duration: 10000,
        secret: appConfig.app.jwtRefreshSecret,
      });
      return refreshToken;
    } catch (error) {
      console.log(error);
      throw new createError.InternalServerError();
    }
  };
}

export const jwtService = new JwtService();
