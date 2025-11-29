import { Request, Response } from "express";
import { generateToken } from "../services/authService";

export function adminLogin(req: Request, res: Response) {
  const { username, password } = req.body;
  console.log(username, password);
  if ((username as string) === "admin" && (password as string) === "1234") {
    const token = generateToken({ role: "admin", username });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: "Invalid admin credentials" });
}

export function userLogin(req: Request, res: Response) {
  const { subscriberNo } = req.body;

  if (!subscriberNo) {
    return res.status(400).json({ message: "subscriberNo required" });
  }

  const token = generateToken({ role: "user", subscriberNo });

  return res.status(200).json({ token });
}
