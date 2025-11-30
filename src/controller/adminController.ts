import { Request, Response } from "express";
import * as adminService from "../services/adminService";
import fs from "fs";
import { parse } from "csv-parse";

export async function addBill(req: Request, res: Response) {
  try {
    const billData = req.body;

    if (
      !billData.subscriberNo ||
      !billData.month ||
      billData.billTotal === undefined
    ) {
      return res.status(400).json({
        message: "subscriberNo, month, billTotal are required",
      });
    }

    const { bill, error } = await adminService.addBill(billData);

    if (error) {
      return res.status(400).json({ message: error });
    }

    return res.status(201).json({
      message: "Bill created",
      bill,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function addBillBatch(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const filePath = req.file.path;

    const rows: any[] = [];
    const errors: string[] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on("data", (row) => rows.push(row))
      .on("end", async () => {
        fs.unlinkSync(filePath);

        let created = 0;

        for (const row of rows) {
          const { subscriberNo, month, billTotal } = row;

          if (!subscriberNo || !month || !billTotal) {
            errors.push(
              `Missing required fields in row: ${JSON.stringify(row)}`
            );
            continue;
          }

          const { bill, error } = await adminService.addBill({
            subscriberNo,
            month,
            billTotal: Number(billTotal),
            details: [],
          });

          if (error) {
            errors.push(error);
          } else {
            created++;
          }
        }

        return res.status(200).json({
          created,
          rows,
          errors,
        });
      })
      .on("error", (error) => {
        console.error(error);
        return res.status(500).json({ message: "Error reading CSV file" });
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
