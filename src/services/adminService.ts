import { prisma } from "../lib/prisma";

export async function addBill(data: {
  subscriberNo: string;
  month: string;
  billTotal: number;
  details?: any[];
}): Promise<{ bill?: any; error?: string }> {
  try {
    console.log("addBill called with data:", data);
    const exists = await prisma.bill.findFirst({
      where: {
        subscriberNo: data.subscriberNo,
        month: data.month,
      },
    });

    if (exists) {
      return {
        error: `A bill already exists for ${data.subscriberNo} in ${data.month}`,
      };
    }
    console.log("Creating bill with data:", data);
    const bill = await prisma.bill.create({
      data: {
        subscriberNo: data.subscriberNo,
        month: data.month,
        billTotal: data.billTotal,
        paidAmount: 0,
        paidStatus: false,
        details: Array.isArray(data.details) ? data.details : [],
      },
    });

    return { bill };
  } catch (error) {
    console.error("addBill DB error:", error);
    return { error: "Database error while adding bill" };
  }
}
