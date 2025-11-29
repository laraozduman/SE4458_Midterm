import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "defaultsecret";

export function generateToken(payload: any) {
  const expiresIn = (process.env.JWT_EXPIRES ||
    "12h") as SignOptions["expiresIn"];

  return jwt.sign(payload, SECRET, {
    expiresIn,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET);
}
