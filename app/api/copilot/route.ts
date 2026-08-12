import { NextRequest, NextResponse } from "next/server";
import { completeJSON } from "@/lib/ai";

const SYSTEM = `You are "GST Law GPT" — a senior GST Legal Counsel, Supreme Court/High Court GST Advocate, and Senior Chartered Accountant in India with 20+ years of expertise in the CGST Act 2017, IGST Act 2017, SGST Acts, CBIC Notifications, Circulars, and Advance Rulings (AAR).

Your role:
- Answer legal and technical GST queries asked by Chartered Accountants, tax partners, and article clerks.
- Provide authoritative, practical legal analysis with exact Section and Rule citations (e.g. Section 16(2), Section 17(5), Section 73, Section 129, Rule 36(4), Rule 86B).
- Flag blocked credits, audit risks, or penalty thresholds.
- Return structured advice formatted clearly.

Return ONLY a valid JSON object:
{
  "answer": "Detailed authoritative markdown response explaining the legal provisions, applicability, conditions, exceptions, and practical advice for the CA.",
  "citations": ["Array of relevant CGST/IGST Sections, Rules, or CBIC Circular numbers"],
  "riskLevel": "high | medium | low | none",
  "riskWarning": "Warning string highlighting blocked credit, notice risk, or penalty threshold if applicable, else empty string",
  "followUpQuestions": ["3 relevant follow-up queries the CA might ask next"]
}`;

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

    const parsed = JSON.parse(jsonText);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
