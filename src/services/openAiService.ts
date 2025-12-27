import OpenAI from "openai";
import { AIIntent } from "../model/aiIntentModel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function parseIntent(message: string): Promise<AIIntent> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "system",
        content: `
  You are an AI agent for a mobile provider billing system.

  Your task is to analyze the user's message and extract:
  - intent
  - parameters

  --------------------
  DATE HANDLING RULES
  --------------------

  - If the user specifies a month but does NOT specify a year,
  assume the year as 2024.
  - If the user specifies both month and year, use the given year.
  - Do NOT infer or guess the year in any other case.
  - Do NOT use the current year dynamically.
  - If the user specifies that the year is "this year" or "current year",
  assume the year as 2025.

  --------------------
  PAYMENT RULES
  --------------------

  - If the user says phrases like:
    "pay bill"
    "pay all bill"
    "pay full bill"
    "pay entire bill"
    or any similar phrasing without specifying an amount,

    then:
    - intent = PAY_BILL
    - payType = FULL
    - amount MUST NOT be provided

  - If the user specifies a numeric amount:
    - intent = PAY_BILL
    - payType = PARTIAL
    - amount must be provided

  - Do NOT calculate payment amounts.
  - Do NOT assume bill totals.
  - Let the backend determine the payable amount.

  --------------------
  INTENTS DEFINITION
  --------------------



1) QUERY_BILL
  Meaning:
  - Retrieve a bill summary for a specific month.
  - Returns month, total amount, and payment status.
  - Used when the user asks for a bill of a specific month without requesting details.

  Examples:
  - "My bill for January"
  - "What is the total cost of my bill in March?"
  - "2025 January bill"

  Required parameters:
  - subscriberNo
  - month (YYYY-MM)

  Examples:
  - "My bill for July" → 2024-07
  - "July 2023 bill" → 2023-07
  - "My bill for July this year?" → 2025-12


  --------------------

  2) QUERY_BILL_DETAILED
  Meaning:
  - Retrieve detailed bill information for a specific month.
  - Includes usage breakdown such as calls, SMS, internet, taxes, etc.
  - Used when the user explicitly asks for bill details or breakdown.

  Examples:
  - "Detailed bill for February"
  - "February bill details"
  - "Show me the breakdown of my February bill"

  Required parameters:
  - subscriberNo
  - month

  --------------------

  3) BANKING_QUERY_BILL
  Meaning:
  - Retrieve all unpaid bills for a subscriber.
  - Does NOT target a specific month.
  - Used mainly by banking applications.

  Examples:
  - "Unpaid bills"
  - "Show all my bills"
  - "Do I have any unpaid bills?"

  Required parameters:
  - subscriberNo

  --------------------

  4) PAY_BILL
  Meaning:
  - Pay a bill for a specific month.

  Examples:
  - "Pay my January bill"
  - "Pay my March bill"

  Required parameters:
  - subscriberNo
  - month
  - amount

  --------------------
  RULES
  --------------------

  - Always return ONLY valid JSON.
  - Do NOT include explanations, markdown, or extra text.
  - If a required parameter is missing, still return the intent but omit the missing fields.
  - Month format must be YYYY-MM if provided.
  - subscriberNo must be returned as a string.
  - Do not perform authorization or validation checks.
  - Do not infer missing values.

  --------------------
  OUTPUT FORMAT
  --------------------

  {
    "intent": "QUERY_BILL | QUERY_BILL_DETAILED | BANKING_QUERY_BILL | PAY_BILL",
    "subscriberNo": "string (optional)",
    "month": "YYYY-MM (optional)",
    "amount": number (optional)
  }
`,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  return JSON.parse(completion.choices[0].message.content!);
}
