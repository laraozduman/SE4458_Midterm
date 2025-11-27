import { Bill } from "../model/billModel";

let bills: Bill[] = []; // Geçici in-memory storage

export async function getBill(
  subscriberNo: string,
  month: string
): Promise<Bill | null> {
  return (
    bills.find((b) => b.subscriberNo === subscriberNo && b.month === month) ||
    null
  );
}

export async function getBillsBySubscriber(
  subscriberNo: string
): Promise<Bill[]> {
  return bills.filter((b) => b.subscriberNo === subscriberNo && !b.paidStatus);
}

export async function createBill(bill: Bill): Promise<Bill> {
  if (
    bills.find(
      (b) => b.subscriberNo === bill.subscriberNo && b.month === bill.month
    )
  ) {
    return null;
  }
  bill.paidStatus = false;
  bills.push(bill);
  return bill;
}

export async function getBillDetailed(
  subscriberNo: string,
  month: string
): Promise<Bill | null> {
  return (
    bills.find((b) => b.subscriberNo === subscriberNo && b.month === month) ||
    null
  );
}

export async function payBill(
  subscriberNo: string,
  month: string,
  amount: number
): Promise<{ bill: Bill | null; error?: string }> {
  const bill = bills.find(
    (b) => b.subscriberNo === subscriberNo && b.month === month
  );
  if (!bill) return { bill: null, error: "Bill not found" };
  const remainingAmount = bill.billTotal - bill.paidAmount;
  if (amount > remainingAmount) {
    console.error(
      `Payment amount exceeds remaining bill amount. Remaining: ${remainingAmount}, Attempted payment: ${amount}`
    );
    return {
      bill: bill,
      error: `Amount exceeds remaining balance. Remaining: ${remainingAmount}`,
    };
  }

  bill.paidAmount += amount;
  if (bill.paidAmount == bill.billTotal) {
    bill.paidStatus = true;
  }

  return { bill };
}
