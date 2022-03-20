import { appConfig } from "./../../config/app-config";
import createError from "http-errors";
import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";

interface SignAccessTokenPayload {
  userId: string;
  email: string;
  secret?: string;
  duration?: number;
}

interface JWTTokenPayload {
  email: string;
  aud: string;
  iss: string;
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
        audience: userId,
      });
    } catch (error) {
      console.log(error);
      throw new createError.InternalServerError();
    }
  };

  public verifyRefreshToken = (token: string): JWTTokenPayload => {
    if (!appConfig.app.jwtRefreshSecret) {
      throw new createError.ServiceUnavailable(
        "Service is unavailable, please contact the administrator"
      );
    }
    try {
      return jwt.verify(token, appConfig.app.jwtRefreshSecret, {
        issuer: "authserver",
      }) as JWTTokenPayload;
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

  public reIssueToken = async (refreshToken: string) => {
    try {
      const jwtPayload = jwtService.verifyRefreshToken(refreshToken);
      const newToken = await jwtService.signAccessToken({
        email: jwtPayload.email,
        userId: jwtPayload.aud,
      });

      const newRefreshToken = await jwtService.signRefreshToken({
        email: jwtPayload.email,
        userId: jwtPayload.aud,
      });
      return { newToken, newRefreshToken };
    } catch (error) {
      console.log(error);
      throw new createError.InternalServerError();
    }
  };
}

export const jwtService = new JwtService();
