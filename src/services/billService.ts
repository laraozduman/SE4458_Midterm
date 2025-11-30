import { prisma } from "../lib/prisma";
import { Bill } from "@prisma/client";

export async function getBill(
  subscriberNo: string,
  month: string
): Promise<Bill | null> {
  console.log("getBill called with:", subscriberNo, month);
  const result = await prisma.bill.findFirst({
    where: { subscriberNo, month },
  });
  return result;
}

export async function getBillsBySubscriber(
  subscriberNo: string
): Promise<Bill[]> {
  console.log("getBillsBySubscriber called with:", subscriberNo);
  return prisma.bill.findMany({
    where: {
      subscriberNo,
      paidStatus: false,
    },
  });
}

export async function getBillDetailed(
  subscriberNo: string,
  month: string
): Promise<Bill | null> {
  console.log("getBillDetailed called with:", subscriberNo, month);
  return prisma.bill.findFirst({
    where: { subscriberNo, month },
  });
}

export async function payBill(
  subscriberNo: string,
  month: string,
  amount: number
): Promise<{ bill: Bill | null; error?: string }> {
  console.log("payBill called with:", subscriberNo, month, amount);
  const bill = await prisma.bill.findFirst({
    where: { subscriberNo, month },
  });

  if (!bill) return { bill: null };

  const remaining = bill.billTotal - bill.paidAmount;

  if (amount > remaining) {
    return {
      bill,
      error: `Amount exceeds remaining balance. Remaining: ${remaining}`,
    };
  }
  console.log("Updating bill with payment:", { subscriberNo, month, amount });
  const updatedBill = await prisma.bill.update({
    where: { id: bill.id },
    data: {
      paidAmount: bill.paidAmount + amount,
      paidStatus: bill.paidAmount + amount === bill.billTotal,
    },
  });

  return { bill: updatedBill };
}

export async function createBillBatch(bills: any[]) {
  console.log("createBillBatch called with bills:", bills);
  return prisma.bill.createMany({
    data: bills.map((b) => ({
      subscriberNo: b.subscriberNo,
      month: b.month,
      billTotal: Number(b.billTotal),
      paidAmount: 0,
      paidStatus: false,
      details: b.details || [],
    })),
    skipDuplicates: true,
  });
}
