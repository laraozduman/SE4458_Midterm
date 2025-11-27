import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function login(req: Request, res: Response) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "username required" });
  }

  // Gerçek user DB yok → direkt token veriyoruz
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1d" });

  return res.status(200).json({ token });
}
