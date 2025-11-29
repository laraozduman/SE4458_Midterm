import { Bill } from "../model/billModel";
import { bills } from "../store/billStore";

export function getBillsStore() {
  return bills;
}

export async function addBill(
  bill: Bill
): Promise<{ bill?: Bill; error?: string }> {
  const exists = bills.find(
    (b) => b.subscriberNo === bill.subscriberNo && b.month === bill.month
  );

  if (exists) {
    return {
      error: `A bill already exists for ${bill.subscriberNo} in ${bill.month}`,
    };
  }

  bill.paidAmount = 0;
  bill.paidStatus = false;
  bill.details = Array.isArray(bill.details) ? bill.details : [];

  bills.push(bill);

  return { bill };
}
