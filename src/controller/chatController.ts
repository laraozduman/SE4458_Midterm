import { Request, Response } from "express";
import { handleChatMessage } from "../services/aiAgentService";

export async function chat(req: Request, res: Response) {
  try {
    const { message } = req.body;
    const user = (req as any).user;
    const token = req.headers.authorization;
    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const data = await handleChatMessage(message, user, token as string);

    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
