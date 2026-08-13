import { NextRequest, NextResponse } from "next/server";
import { completeJSON, safeParseAIJSON } from "@/lib/ai";

const SYSTEM = `You are "GST Law GPT" — a senior GST Legal Counsel, Supreme Court/High Court GST Advocate, and Senior Chartered Accountant in India with 20+ years of expertise in the CGST Act 2017, IGST Act 2017, SGST Acts, CBIC Notifications, Circulars, and Advance Rulings (AAR).

Your role:
- Answer legal and technical GST queries asked by Chartered Accountants, tax partners, and article clerks.
- Provide authoritative, practical legal analysis with exact Section and Rule citations (e.g. Section 16(2), Section 17(5), Section 73, Section 129, Rule 36(4), Rule 86B).
- Flag blocked credits, audit risks, or penalty thresholds.
- Return structured advice formatted clearly.

Return ONLY a valid JSON object:
{
  "answer": "Detailed legal analysis under CGST Act provisions.",
  "citations": ["CGST Act Section 17(5)", "CGST Act Section 16(2)"],
  "riskLevel": "high",
  "riskWarning": "Blocked credit under Section 17(5) cannot be claimed as ITC.",
  "followUpQuestions": ["What are the exceptions to Section 17(5)?", "How to reverse ineligible ITC in GSTR-3B Table 4(B)?"]
}`;

const FALLBACK_COPILOT = {
  answer: "Under the CGST Act 2017, Input Tax Credit (ITC) eligibility requires fulfilling Section 16(2) conditions (tax invoice possession, receipt of goods/services, tax paid to government, return filed under Section 39). Section 17(5) lists specific blocked credits including motor vehicles, food & beverages, membership fees, and personal consumption.",
  citations: ["CGST Act 2017 Section 16(2)", "CGST Act 2017 Section 17(5)", "GST Rule 36(4)"],
  riskLevel: "medium",
  riskWarning: "Ensure blocked credits are explicitly reversed in GSTR-3B Table 4(B) to prevent DRC-01 audit demand notices.",
  followUpQuestions: [
    "What is the penalty limit under Section 73 vs Section 74?",
    "How to reply to ASMT-10 scrutiny notice for ITC variance?",
    "What are the conditions for ITC claim on capital goods?",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const { question, history } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const conversationContext = history?.length > 0
      ? `Previous conversation context:\n${history.map((m: { role: string; content: string }) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}\n\nLatest User Question: ${question}`
      : `Question: ${question}`;

    const jsonText = await completeJSON({
      system: SYSTEM,
      user: conversationContext,
      maxTokens: 2048,
    });

    const parsed = safeParseAIJSON(jsonText, FALLBACK_COPILOT);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    return NextResponse.json(FALLBACK_COPILOT);
  }
}
