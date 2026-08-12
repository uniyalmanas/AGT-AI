import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/ai";

const SYSTEM = `You are a senior Income Tax & TDS audit expert in India.
Cross-reconcile the provided Books TDS Ledger data against Form 26AS and AIS/TIS (Annual Information Statement) data.

Your job:
1. Compare TDS deducted in books vs Form 26AS vs AIS
2. Identify missing TDS credits (Tax deducted by deductor but not reflecting in 26AS)
3. Identify section mismatches (e.g. 194C Contractor vs 194J Professional)
4. Calculate total unclaimed TDS credit available for ITR refund
5. Provide a 0-100 TDS Match Score and actionable steps for the CA

Return ONLY valid JSON:
{
  "summary": "2-3 sentence plain-English summary of TDS reconciliation",
  "tdsMatchScore": <integer 0-100>,
  "totalBooksTds": <number in rupees>,
  "totalForm26ASTds": <number in rupees>,
  "totalAisTds": <number in rupees>,
  "unclaimedRefundCredit": <number in rupees>,
  "mismatches": [
    {
      "deductorName": "Name of deductor e.g. Tata Consultancy Services",
      "tan": "Deductor TAN number",
      "section": "TDS Section e.g. 194C / 194J / 194I",
      "booksAmount": "TDS in books as string e.g. ₹45,000",
      "form26ASAmount": "TDS in 26AS as string e.g. ₹38,000",
      "aisAmount": "TDS in AIS as string e.g. ₹38,000",
      "status": "missing_in_26as | section_mismatch | matched | excess_in_26as",
      "actionableFix": "Specific action e.g. Contact deductor to file GSTR/TDS quarterly correction statement Form 26Q"
    }
  ],
  "recommendations": ["ordered list of steps for the CA before ITR filing"]
}`;

export async function POST(req: NextRequest) {
  try {
    const { booksTdsData, form26asData, aisData } = await req.json();

    if (!booksTdsData || !form26asData) {
      return NextResponse.json({ error: "Books TDS data and Form 26AS data are required" }, { status: 400 });
    }

    const userPrompt = `Reconcile these Income Tax TDS records:

Books TDS Register:
${booksTdsData}

Form 26AS Statement:
${form26asData}

${aisData ? `AIS / TIS Statement:\n${aisData}` : "AIS / TIS Statement: Not provided"}`;

    const jsonText = await completeJSON({
      system: SYSTEM,
      user: userPrompt,
      maxTokens: 2048,
    });

    const parsed = JSON.parse(jsonText);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
