import { Response } from "express";
import jwt from "jsonwebtoken";

const jwt_expiration_days = process.env.JWT_EXPIRATION_DAYS || "1";

export const generateToken = (userId: string) => {
  const jwt_secret = process.env.JWT_SECRET || "";

  // generate jwt token for userId
  const token = jwt.sign({ userId }, jwt_secret, {
    expiresIn: jwt_expiration_days + "d",
  });

  return token;
};

export const signToken = (res: Response, userId: string) => {
    const token = generateToken(userId);

    res.cookie("auth-token", token, {
        httpOnly: true,
        // secure: process.env.NODE_ENV !== "development",
        //   sameSite: "strict",
        maxAge: parseInt(jwt_expiration_days) * 24 * 60 * 60 * 1000,
    });
}