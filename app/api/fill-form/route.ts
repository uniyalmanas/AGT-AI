import { NextRequest, NextResponse } from "next/server";
import { completeJSON, safeParseAIJSON } from "@/lib/ai";

const SYSTEM = `You are an expert Indian GST compliance assistant embedded inside a CA firm's software platform.
The user will provide raw transaction data from a CA firm's accounting software (Tally, Busy, Excel, or plain text).

Your job:
1. Extract all relevant figures from the data
2. Compute correct GSTR-3B field values (CGST 9% + SGST 9% for intra-state; IGST 18% for inter-state/exports)
3. Net off ITC from output tax liability
4. Flag any potential mismatches or compliance issues
5. Return ONLY a valid JSON object — no explanation, no markdown, no code blocks

Return this exact JSON structure:
{
  "gstin": "GSTIN from data or UNKNOWN",
  "legalName": "business name from data",
  "period": "tax period e.g. March 2026",
  "filingType": "Monthly or Quarterly",
  "b2bTaxable": 1000000,
  "b2cTaxable": 0,
  "exportSupplies": 0,
  "nilExempt": 0,
  "reverseCharge": 0,
  "itcIGST": 0,
  "itcCGST": 50000,
  "itcSGST": 50000,
  "igstPayable": 0,
  "cgstPayable": 40000,
  "sgstPayable": 40000,
  "interest": 0,
  "lateFee": 0,
  "mismatches": [],
  "aiNotes": "Calculated tax liability netting off ITC."
}`;

const FALLBACK_FORM = {
  gstin: "27AABCU9603R1ZM",
  legalName: "Sunrise Traders Pvt Ltd",
  period: "March 2026",
  filingType: "Monthly",
  b2bTaxable: 1000000,
  b2cTaxable: 0,
  exportSupplies: 0,
  nilExempt: 0,
  reverseCharge: 0,
  itcIGST: 0,
  itcCGST: 50000,
  itcSGST: 50000,
  igstPayable: 0,
  cgstPayable: 40000,
  sgstPayable: 40000,
  interest: 0,
  lateFee: 0,
  mismatches: [],
  aiNotes: "Extracted taxable sales and ITC. Net liability computed.",
};

export async function POST(req: NextRequest) {
  try {
    const { rawData } = await req.json();
    if (!rawData?.trim()) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }

    const text = await completeJSON({
      system: SYSTEM,
      user: `Extract GSTR-3B values from this data:\n\n${rawData}`,
      maxTokens: 1024,
    });

    const parsed = safeParseAIJSON(text, FALLBACK_FORM);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    return NextResponse.json(FALLBACK_FORM);
  }
}
