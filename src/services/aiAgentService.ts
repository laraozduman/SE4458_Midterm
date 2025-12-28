import axios from "axios";
import { parseIntent } from "./openAiService";
import { AIIntent } from "../model/aiIntentModel";
import { error } from "console";

const GATEWAY_BASE_URL =
  process.env.GATEWAY_BASE_URL ||
  "https://se4458-webapp-c9bhapdya4esc8hr.francecentral-01.azurewebsites.net/api/v1";

interface AuthUser {
  id: string;
  role: "admin" | "user";
  subscriberNo?: string;
}

export async function handleChatMessage(
  message: string,
  user: AuthUser,
  token: string
) {
  try {
    const intent: AIIntent = await parseIntent(message);

    if (user.role !== "admin") {
      intent.subscriberNo = user.subscriberNo!;
    }
    const axiosConfig = {
      headers: {
        Authorization: token,
      },
    };

    let result;
    switch (intent.intent) {
      case "QUERY_BILL":
        result = await axios.get(`${GATEWAY_BASE_URL}/bills/query`, {
          params: {
            subscriberNo: intent.subscriberNo,
            month: intent.month,
          },
          ...axiosConfig,
        });

        return {
          type: "success",
          message: `your bill for ${intent.month} is successfully retrieved.`,
          data: result.data,
        };

      case "QUERY_BILL_DETAILED":
        return (
          await axios.get(`${GATEWAY_BASE_URL}/bills/detailed`, {
            params: {
              subscriberNo: intent.subscriberNo,
              month: intent.month,
            },
            ...axiosConfig,
          })
        ).data;

      case "PAY_BILL":
        const billResponse = await axios.get(
          `${GATEWAY_BASE_URL}/bills/query`,
          {
            params: {
              subscriberNo: intent.subscriberNo,
              month: intent.month,
            },
            ...axiosConfig,
          }
        );

        const bill = billResponse.data;
        let amountToPay = intent.amount;
        console.log("Bill to pay:", bill);
        console.log("Initial amount to pay:", amountToPay);
        console.log("Pay type:", intent.payType);
        if (amountToPay !== undefined && amountToPay !== 0) {
          amountToPay = bill.billTotal - bill.paidAmount;
        }

        const payResponse = await axios.post(
          `${GATEWAY_BASE_URL}/bills/pay`,
          {
            subscriberNo: intent.subscriberNo,
            month: intent.month,
            amount: amountToPay,
          },
          axiosConfig
        );
        return {
          type: "success",
          message:
            intent.payType === "FULL"
              ? "All your bill has been paid successfully."
              : "Payment completed successfully.",
          data: payResponse.data,
        };

      case "BANKING_QUERY_BILL":
        return (
          await axios.get(`${GATEWAY_BASE_URL}/bills/bankingQuery`, {
            params: {
              subscriberNo: intent.subscriberNo,
            },
            ...axiosConfig,
          })
        ).data;

      default:
        throw new Error("Unsupported intent");
    }
  } catch (err) {
    return mapChatError(err);
  }
}

function mapChatError(err: any) {
  if (axios.isAxiosError(err) && err.response) {
    const status = err.response.status;
    const backendMessage = err.response.data?.message;

    if (status === 404) {
      return {
        type: "info",
        message:
          "There are no bills for the specified month. Would you like to look for another bill?",
      };
    }

    if (status === 400) {
      return {
        type: "warning",
        message:
          backendMessage ||
          "There was an error processing your request. Please check your information.",
      };
    }

    if (status === 403) {
      return {
        type: "error",
        message: "You do not have permission to view this bill.",
      };
    }

    if (status === 401) {
      return {
        type: "error",
        message: "Your session is invalid or has expired. Please log in again.",
      };
    }
    if (status === 422) {
      return {
        type: "warning",
        message: "The bill amount is invalid or missing.",
      };
    }
    if (status === 429) {
      return {
        type: "error",
        message:
          "You have exceeded the allowed number of requests. Please try again later.",
      };
    }
  }
  return {
    type: "error",
    error: err,
    errorMessage: err.message,
    errorStatus: err.status,
    message: "An unexpected error occurred. Please try again later.",
  };
}
