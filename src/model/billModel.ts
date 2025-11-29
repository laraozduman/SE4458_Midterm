export interface Bill {
  subscriberNo: string;
  month: string;
  billTotal: number;
  paidAmount: number;
  paidStatus: boolean;
  details?: BillDetail[];
}

export interface BillDetail {
  description: string;
  amount: number;
  quantity?: number;
  unit?: string;
}
