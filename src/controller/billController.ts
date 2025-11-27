import { Request, Response } from "express";
import * as billService from "../services/billService";

export async function queryBill(req: Request, res: Response) {
  try {
    const { subscriberNo, month } = req.query;

    if (!subscriberNo || !month) {
      return res
        .status(400)
        .json({ message: "subscriberNo and month are required" });
    }

    const bill = await billService.getBill(
      subscriberNo as string,
      month as string
    );

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    return res.status(200).json(bill);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function queryBillDetailed(req: Request, res: Response) {
  try {
    const { subscriberNo, month } = req.query;

    if (!subscriberNo || !month) {
      return res
        .status(400)
        .json({ message: "subscriberNo and month are required" });
    }

    const bill = await billService.getBillDetailed(
      subscriberNo as string,
      month as string
    );

    if (!bill) return res.status(404).json({ message: "Bill not found" });

    return res.status(200).json(bill);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function payBill(req: Request, res: Response) {
  try {
    const { subscriberNo, month, amount } = req.body;

    if (!subscriberNo || !month || amount === undefined) {
      return res.status(400).json({
        message: "subscriberNo, month and amount are required",
      });
    }
    const { bill, error } = await billService.payBill(
      subscriberNo,
      month,
      Number(amount)
    );

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    if (error) {
      return res.status(400).json({ message: error });
    }

    return res.status(200).json({
      message: "Payment processed",
      bill: bill,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBill(req: Request, res: Response) {
  try {
    const billData = req.body;
    if (
      !billData.subscriberNo ||
      !billData.month ||
      billData.billTotal === undefined ||
      billData.paidAmount === undefined
    ) {
      return res.status(400).json({
        message: "subscriberNo, month, billTotal and paidAmount are required",
      });
    }

    const newBill = await billService.createBill(billData);

    return res.status(201).json(newBill);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
