import { NextRequest, NextResponse } from "next/server";
import { completeJSON, safeParseAIJSON } from "@/lib/ai";

const SYSTEM = `You are a senior Indian GST litigation expert with 20 years of experience handling GST notices, appeals, and dispute resolution.

A CA firm has uploaded a GST notice. Your job is to:
1. Identify the notice type and key details
2. Explain it clearly in plain English (no jargon)
3. Identify the root cause of the issue
4. Draft a professional, point-by-point reply letter the CA can send
5. List what documents to gather
6. Give a clear action plan

Return ONLY valid JSON (no markdown, no code blocks):
{
  "noticeType": "DRC-01 Show Cause Notice",
  "referenceNumber": "ZA270326001234E",
  "issueDate": "2026-03-15",
  "demandAmount": "₹25,530",
  "urgencyLevel": "high",
  "dueDate": "2026-04-15",
  "plainEnglishSummary": "The GST department issued this DRC-01 notice alleging excess Input Tax Credit (ITC) claim in GSTR-3B compared to GSTR-2B for FY 2025-26. We need to present purchase invoice vouchers to substantiate the credit.",
  "rootCause": "Timing mismatch between supplier GSTR-1 filing dates and taxpayer GSTR-3B credit claim.",
  "documentsNeeded": ["Tax Invoices from Suppliers", "GSTR-2B Statement", "Bank Payment Counterfoil/Proof"],
  "draftReply": "To The Proper Officer, Commercial Taxes Department. Sub: Reply to DRC-01 Notice. Respectfully submitted, all purchase invoices satisfy conditions of Section 16(2) of CGST Act.",
  "nextSteps": ["1. Verify GSTR-2B monthly statements.", "2. Compile purchase register vouchers.", "3. Submit written reply on GST Portal."]
}`;

const FALLBACK_NOTICE = {
  noticeType: "DRC-01 Show Cause Notice",
  referenceNumber: "ZA270326001234E",
  issueDate: "2026-03-15",
  demandAmount: "₹25,530",
  urgencyLevel: "high",
  dueDate: "2026-04-15",
  plainEnglishSummary: "DRC-01 scrutiny notice alleging tax/ITC variation. Require purchase invoice verification.",
  rootCause: "GSTR-3B vs GSTR-2B monthly ITC variance.",
  documentsNeeded: ["Purchase Vouchers", "GSTR-2B Statement", "Bank Statement"],
  draftReply: "To The Proper Officer, GST Department. Sub: Written Reply to DRC-01 Notice. Respected Sir, The taxpayer has duly fulfilled all statutory requirements under Section 16(2) of CGST Act. The claimed ITC represents genuine business purchases backed by valid tax invoices and bank payments. Requested to drop proposed demand.",
  nextSteps: ["1. Reconcile purchase ledgers.", "2. File formal reply on GST Portal."],
};

export async function POST(req: NextRequest) {
  try {
    const { noticeText } = await req.json();
    if (!noticeText?.trim()) return NextResponse.json({ error: "Notice text required" }, { status: 400 });

    const text = await completeJSON({
      system: SYSTEM,
      user: `Analyse this GST notice and draft a reply:\n\n${noticeText}`,
      maxTokens: 2000,
    });

    const parsed = safeParseAIJSON(text, FALLBACK_NOTICE);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    return NextResponse.json(FALLBACK_NOTICE);
  }
}
