import { appConfig } from "./../../config/app-config";
import createError from "http-errors";
import jwt from "jsonwebtoken";

interface SignAccessTokenPayload {
  userId: number;
  email: string;
}

class JwtService {
  constructor() {}

  public signAccessToken = async ({
    email,
    userId,
  }: SignAccessTokenPayload) => {
    console.log("here");
    const payload = {
      email,
    };
    if (!appConfig.app.jwtSecret) {
      throw new createError.ServiceUnavailable("Failed to get jwt");
    }
    try {
      return jwt.sign(payload, appConfig.app.jwtSecret, {
        expiresIn: 60 * 30,
        issuer: "authserver",
        audience: userId.toString(),
      });
    } catch (error) {
      throw new createError.InternalServerError(JSON.stringify(error));
    }
  };

  public refreshAccessToken = async () => {};
}

export const jwtService = new JwtService();
