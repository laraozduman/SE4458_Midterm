import { Request, Response } from "express";
import * as billService from "../services/billService";

export async function queryBill(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { subscriberNo, month } = req.query;

    if (user.role !== "admin" && user.subscriberNo !== subscriberNo) {
      return res.status(403).json({
        message: "You are not allowed to view another subscriber's bills",
      });
    }

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
    const { details, ...safeBill } = bill;
    return res.status(200).json(safeBill);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function queryBillDetailed(req: Request, res: Response) {
  try {
    const user = (req as any).user;
    const { subscriberNo, month } = req.query;

    if (user.role !== "admin" && user.subscriberNo !== subscriberNo) {
      return res.status(403).json({
        message: "You are not allowed to view another subscriber's bills",
      });
    }

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

    const details = Array.isArray(bill.details) ? bill.details : [];

    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    const start = (page - 1) * limit;
    const end = start + limit;

    const paginatedDetails = details.slice(start, end);

    return res.status(200).json({
      subscriberNo: bill.subscriberNo,
      month: bill.month,
      billTotal: bill.billTotal,
      paidAmount: bill.paidAmount,
      paidStatus: bill.paidStatus,
      totalDetails: details.length,
      page,
      limit,
      details: paginatedDetails,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
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

export async function bankingQueryBill(req: Request, res: Response) {
  try {
    const user = (req as any).user;

    const subscriberNo = req.query.subscriberNo as string;

    if (!subscriberNo) {
      return res.status(400).json({ message: "subscriberNo is required" });
    }

    if (user.role !== "admin" && user.subscriberNo !== subscriberNo) {
      return res.status(403).json({
        message: "You are not allowed to view another subscriber's bills",
      });
    }

    const bills = await billService.getBillsBySubscriber(subscriberNo);

    if (bills.length === 0) {
      return res.status(200).json({ message: "No unpaid bills found" });
    }
    return res.status(200).json(bills);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
