export type AIIntent =
  | {
      intent: "QUERY_BILL" | "QUERY_BILL_DETAILED";
      subscriberNo: string;
      month: string;
    }
  | {
      intent: "PAY_BILL";
      subscriberNo?: string;
      month?: string;
      amount?: number;
      payType?: "FULL" | "PARTIAL";
    }
  | {
      intent: "BANKING_QUERY_BILL";
      subscriberNo: string;
    };
