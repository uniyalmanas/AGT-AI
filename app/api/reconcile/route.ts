import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/ai";

const SYSTEM = `You are a senior Indian GST compliance expert. Analyse the provided GSTR-1, GSTR-3B, and GSTR-2B data and identify all mismatches, ITC risks, and compliance issues.

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "summary": "2-3 sentence plain-English summary of the reconciliation result",
  "complianceScore": <integer 0-100, 100 = perfect, deduct for each issue found>,
  "mismatches": [
    {
      "field": "name of the field/category that has a mismatch",
      "gstr1": "value in GSTR-1 as string",
      "gstr3b": "value in GSTR-3B as string", 
      "gstr2b": "value in GSTR-2B or N/A",
      "severity": "high | medium | low",
      "fix": "specific actionable fix in plain English"
    }
  ],
  "itcRisks": ["list of ITC-related risks e.g. excess claim, ineligible credit, GSTR-2B mismatch"],
  "recommendations": ["ordered list of what the CA should do right now, most important first"]
}

Severity guide:
- high: will definitely trigger GST notice, or large amount at stake
- medium: likely to trigger scrutiny, moderate amount
- low: minor discrepancy, unlikely to cause immediate issue but should be fixed`;

export async function POST(req: NextRequest) {
  try {
    const { gstr1, gstr3b, gstr2b } = await req.json();
    if (!gstr1 || !gstr3b) return NextResponse.json({ error: "GSTR-1 and GSTR-3B are required" }, { status: 400 });

    const userContent = `Reconcile these GST returns:

GSTR-1:
${gstr1}

GSTR-3B:
${gstr3b}

${gstr2b ? `GSTR-2B:\n${gstr2b}` : "GSTR-2B: Not provided"}`;

    const text = await completeJSON({
      system: SYSTEM,
      user: userContent,
      maxTokens: 1500,
    });

    return NextResponse.json(JSON.parse(text));
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Server error" }, { status: 500 });
  }
}
