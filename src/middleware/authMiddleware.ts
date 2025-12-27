import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
