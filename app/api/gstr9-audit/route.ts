import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/ai";

const SYSTEM = `You are a senior GST Auditor and Chartered Accountant in India specializing in GSTR-9 Annual Returns and GSTR-9C Reconciliation Statements.

Your job:
1. Consolidate 12 months of GSTR-1 and GSTR-3B filings against Audited P&L Financial Statements.
2. Populate GSTR-9 Table 4 & 5 (Outward Taxable & Exempt Turnover)
3. Populate GSTR-9 Table 6, 7 & 8 (ITC Availed, Reversed & GSTR-2B comparison)
4. Compute GSTR-9C Table 5 (Audited Financial Turnover vs GSTR-9 Turnover reconciliation)
5. Calculate any short-paid tax liability and recommend DRC-03 tax payment.

Return ONLY valid JSON:
{
  "financialYear": "FY 2025-26",
  "gstin": "GSTIN number",
  "auditedTurnoverPnl": <number in rupees>,
  "gstr9DeclaredTurnover": <number in rupees>,
  "unreconciledTurnoverDiff": <number in rupees>,
  "totalItcAvailed3b": <number in rupees>,
  "totalItcAsPer2b": <number in rupees>,
  "itcDifference": <number in rupees>,
  "shortTaxPayableDrc03": <number in rupees>,
  "table4OutwardTaxable": {
    "b2b": <number>,
    "b2c": <number>,
    "exports": <number>,
    "igst": <number>,
    "cgst": <number>,
    "sgst": <number>
  },
  "table6ItcAvailed": {
    "inputs": <number>,
    "capitalGoods": <number>,
    "inputServices": <number>
  },
  "gstr9CReconciliationNotes": "Detailed audit observation note explaining turnover mismatches and GSTR-9C certification observations."
}`;

export async function POST(req: NextRequest) {
  try {
    const { annualDataText } = await req.json();

    if (!annualDataText?.trim()) {
      return NextResponse.json({ error: "Annual financial data is required" }, { status: 400 });
    }

    const jsonText = await completeJSON({
      system: SYSTEM,
      user: `Perform full-year GSTR-9 & 9C audit consolidation on this financial data:\n\n${annualDataText}`,
      maxTokens: 2048,
    });

    const parsed = JSON.parse(jsonText);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
