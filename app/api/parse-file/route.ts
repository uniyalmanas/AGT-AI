import { NextRequest, NextResponse } from "next/server";
import { parseUploadedFile } from "@/lib/parse-file";
import { completeJSON } from "@/lib/ai";

const GSTR3B_SYSTEM = `You are an expert Indian GST compliance assistant.
Extract all figures from the uploaded document/spreadsheet and compute GSTR-3B values:
- Outward taxable supplies (B2B, B2C, Exports, Nil)
- Reverse charge liability
- Available Input Tax Credit (IGST, CGST, SGST)
- Calculate payable tax, interest, late fees, and flag any potential mismatches.

Return ONLY a valid JSON object:
{
  "gstin": "GSTIN from document or UNKNOWN",
  "legalName": "Business name from document",
  "period": "Tax period e.g. March 2026",
  "filingType": "Monthly or Quarterly",
  "b2bTaxable": <number in rupees>,
  "b2cTaxable": <number in rupees>,
  "exportSupplies": <number in rupees>,
  "nilExempt": <number in rupees>,
  "reverseCharge": <number in rupees>,
  "itcIGST": <number in rupees>,
  "itcCGST": <number in rupees>,
  "itcSGST": <number in rupees>,
  "igstPayable": <net IGST payable>,
  "cgstPayable": <net CGST payable>,
  "sgstPayable": <net SGST payable>,
  "interest": <number in rupees>,
  "lateFee": <number in rupees>,
  "mismatches": ["list of issues found"],
  "aiNotes": "Brief explanation of key computations and ITC set-off"
}`;

const NOTICE_SYSTEM = `You are a senior Indian GST litigation expert.
Analyse the uploaded GST legal notice document/image (DRC-01, ASMT-10, etc.) and extract details to draft a formal reply letter.

Return ONLY valid JSON:
{
  "noticeType": "Notice Type e.g. DRC-01 Show Cause Notice / ASMT-10",
  "referenceNumber": "Reference number from notice",
  "issueDate": "Notice date",
  "demandAmount": "Total demand as string e.g. ₹25,530",
  "urgencyLevel": "high | medium | low",
  "dueDate": "Reply deadline",
  "plainEnglishSummary": "3-4 sentence summary of the notice for the client",
  "rootCause": "1-2 sentences on what triggered the notice",
  "documentsNeeded": ["list of documents required to reply"],
  "draftReply": "Full formal reply letter addressed to the Proper Officer under relevant CGST Act sections",
  "nextSteps": ["ordered action plan"]
}`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const target = (formData.get("target") as string) || "gstr3b";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 1. Parse the uploaded file (Excel, PDF, or Image)
    const parsed = await parseUploadedFile(file);

    // 2. Select system prompt
    const systemPrompt = target === "notice" ? NOTICE_SYSTEM : GSTR3B_SYSTEM;
    const userPrompt = target === "notice"
      ? `Analyse this uploaded GST notice document (${parsed.fileName}) and draft a legal reply:\n\n${parsed.extractedText}`
      : `Extract GSTR-3B return values from this uploaded document (${parsed.fileName}):\n\n${parsed.extractedText}`;

    // 3. Process via Gemini 2.5 Flash Multimodal Engine
    const jsonText = await completeJSON({
      system: systemPrompt,
      user: userPrompt,
      maxTokens: 2048,
      inlineData: parsed.inlineData,
    });

    const parsedJson = JSON.parse(jsonText);

    return NextResponse.json({
      fileName: parsed.fileName,
      fileType: parsed.fileType,
      rawExtractedText: parsed.extractedText.slice(0, 500) + (parsed.extractedText.length > 500 ? "..." : ""),
      data: parsedJson,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "File parsing error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
