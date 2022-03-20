import { appConfig } from "./../../config/app-config";
import createError from "http-errors";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { getRedisAsync, setExRedisAsync } from "../../redis/client";

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

interface JWTPayload {
  email: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

class JwtService {
  private refreshTokenExpiry = 5;
  private accessTokenExpiry = 5;
  constructor() {}

  private signAccessToken = async ({
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
        expiresIn: duration || this.accessTokenExpiry,
        issuer: "authserver",
        audience: userId,
      });
    } catch (error) {
      console.log(error);
      throw new createError.InternalServerError();
    }
  };

  private verifyRefreshToken = async (token: string): Promise<any> => {
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
            const decodedPayload = jwt.decode(token) as JWTPayload;
            console.log("payload---", decodedPayload);
            if (decodedPayload && decodedPayload.aud) {
              const refreshedToken = await getRedisAsync(decodedPayload.aud);
              console.log(refreshedToken === token);
              if (token === refreshedToken) {
                return "";
              }
            }
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

  public verifyAccessToken = async (token: string) => {
    if (!appConfig.app.jwtSecret) {
      throw new createError.ServiceUnavailable(
        "Service is unavailable, please contact the administrator"
      );
    }
    try {
      const JWT = jwt.verify(token, appConfig.app.jwtSecret, {
        issuer: "authserver",
      });
    } catch (error) {
      console.log("hmmm", error);
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
        duration: this.refreshTokenExpiry,
        secret: appConfig.app.jwtRefreshSecret,
      });
      await setExRedisAsync(userId, refreshToken, this.refreshTokenExpiry);
      return refreshToken;
    } catch (error) {
      console.log(error);
      throw new createError.InternalServerError();
    }
  };

  public issueToken = async (email: string, userId: string) => {
    const newToken = await jwtService.signAccessToken({
      email,
      userId,
    });

    const newRefreshToken = await jwtService.signRefreshToken({
      email,
      userId,
    });
    return { newToken, newRefreshToken };
  };

  public reIssueToken = async (refreshToken: string) => {
    try {
      const jwtPayload = await jwtService.verifyRefreshToken(refreshToken);
      console.log("jwt", jwtPayload);
      return this.issueToken(jwtPayload.email, jwtPayload.aud);
    } catch (error) {
      console.log(error);
      throw new createError.InternalServerError();
    }
  };
}

class jwtServiceV2 {
  private refreshTokenExpiry = 5;
  private accessTokenExpiry = 5;
  constructor() {}
}

export const jwtService = new JwtService();
