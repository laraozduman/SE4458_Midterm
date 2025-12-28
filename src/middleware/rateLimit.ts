import { Request, Response, NextFunction } from "express";

const requestCounts: Record<string, number> = {};

export function rateLimit(req: Request, res: Response, next: NextFunction) {
  const subscriberNo = req.query.subscriberNo as string;

  if (!subscriberNo) {
    return res.status(400).json({ message: "subscriberNo is required" });
  }

  const today = new Date().toISOString().split("T")[0];

  const key = `${subscriberNo}-${today}`;

  if (!requestCounts[key]) {
    requestCounts[key] = 1;
  } else {
    requestCounts[key] += 1;
  }

  if (requestCounts[key] > 6) {
    return res.status(429).json({
      message: "Daily limit exceeded (6 requests per day)",
    });
  }

  next();
}
