import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/ai";

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
  "b2bTaxable": <number in rupees>,
  "b2cTaxable": <number in rupees>,
  "exportSupplies": <number in rupees>,
  "nilExempt": <number in rupees>,
  "reverseCharge": <number in rupees>,
  "itcIGST": <number in rupees>,
  "itcCGST": <number in rupees>,
  "itcSGST": <number in rupees>,
  "igstPayable": <net IGST after ITC, minimum 0>,
  "cgstPayable": <net CGST after ITC, minimum 0>,
  "sgstPayable": <net SGST after ITC, minimum 0>,
  "interest": <number in rupees, 0 if none>,
  "lateFee": <number in rupees, 0 if none>,
  "mismatches": ["list of potential issues, empty array if none"],
  "aiNotes": "Brief explanation of key computations, ITC netting, and any important observations for the CA"
}

Rules:
- All monetary values are plain integers (no symbols, no commas)
- For domestic supplies: output tax = taxable * 0.18, split as CGST = taxable * 0.09 and SGST = taxable * 0.09
- For exports: IGST = 0 (zero-rated), include in export supplies field only
- Net payable = output tax - ITC (cannot go below 0; excess ITC carries forward)
- If ITC exceeds liability, set payable fields to 0 and mention carry-forward in aiNotes`;

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

    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
