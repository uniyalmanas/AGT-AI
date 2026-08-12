import { NextRequest, NextResponse } from "next/server";

export interface LitigationNotice {
  id: string;
  clientName: string;
  gstin: string;
  noticeType: "DRC-01" | "ASMT-10" | "DRC-07" | "Income Tax 143(1)" | "Summons";
  referenceNumber: string;
  demandAmount: string;
  issueDate: string;
  dueDate: string;
  daysRemaining: number;
  stage: "received" | "evidence_gathering" | "reply_drafted" | "submitted" | "dropped";
  assignedPartner: string;
  urgency: "high" | "medium" | "low";
  summary: string;
}

let INITIAL_NOTICES: LitigationNotice[] = [
  {
    id: "not-1",
    clientName: "Sunrise Traders Pvt Ltd",
    gstin: "27AABCU9603R1ZM",
    noticeType: "DRC-01",
    referenceNumber: "GST/DRC-01/2026/884",
    demandAmount: "₹25,530",
    issueDate: "2026-08-01",
    dueDate: "2026-08-18",
    daysRemaining: 5,
    stage: "reply_drafted",
    assignedPartner: "CA Sharma",
    urgency: "high",
    summary: "Short payment of tax due to GSTR-1 vs 3B mismatch and excess ITC in 3B vs 2B.",
  },
  {
    id: "not-2",
    clientName: "Patel Exports LLP",
    gstin: "24AABCP5678R1ZK",
    noticeType: "ASMT-10",
    referenceNumber: "ASMT-10/2026/102",
    demandAmount: "₹1,45,000",
    issueDate: "2026-08-05",
    dueDate: "2026-08-20",
    daysRemaining: 7,
    stage: "evidence_gathering",
    assignedPartner: "Amit Verma (Senior)",
    urgency: "high",
    summary: "Scrutiny notice regarding zero-rated export refund claim and LUT validity.",
  },
  {
    id: "not-3",
    clientName: "Metro Electricals",
    gstin: "27AAACM1234R1ZX",
    noticeType: "Income Tax 143(1)",
    referenceNumber: "ITR/143-1/AY25-26",
    demandAmount: "₹12,400",
    issueDate: "2026-07-25",
    dueDate: "2026-08-25",
    daysRemaining: 12,
    stage: "received",
    assignedPartner: "CA Sharma",
    urgency: "medium",
    summary: "Tax demand proposed due to mismatch in TDS claimed in ITR vs 26AS.",
  },
  {
    id: "not-4",
    clientName: "Krishna Pharma",
    gstin: "29AABCK9012R1ZD",
    noticeType: "DRC-07",
    referenceNumber: "DRC-07/2026/009",
    demandAmount: "₹8,900",
    issueDate: "2026-06-10",
    dueDate: "2026-07-10",
    daysRemaining: 0,
    stage: "dropped",
    assignedPartner: "Priya Patel",
    urgency: "low",
    summary: "Summary of order issued — demand fully dropped after submission of valid purchase invoices.",
  },
];

export async function GET() {
  return NextResponse.json({ notices: INITIAL_NOTICES });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "updateStage") {
      const { noticeId, newStage } = body;
      INITIAL_NOTICES = INITIAL_NOTICES.map((n) =>
        n.id === noticeId ? { ...n, stage: newStage } : n
      );
      return NextResponse.json({ ok: true, notices: INITIAL_NOTICES });
    }

    if (body.action === "createNotice") {
      const newNotice: LitigationNotice = {
        id: `not-${Date.now()}`,
        clientName: body.clientName || "Client",
        gstin: body.gstin || "27AABCU9603R1ZM",
        noticeType: body.noticeType || "DRC-01",
        referenceNumber: body.referenceNumber || `REF-${Date.now().toString().slice(-4)}`,
        demandAmount: body.demandAmount || "₹0",
        issueDate: new Date().toISOString().split("T")[0],
        dueDate: body.dueDate || "2026-08-30",
        daysRemaining: 14,
        stage: "received",
        assignedPartner: body.assignedPartner || "CA Partner",
        urgency: body.urgency || "high",
        summary: body.summary || "Notice received and added to litigation board.",
      };
      INITIAL_NOTICES.unshift(newNotice);
      return NextResponse.json({ ok: true, notices: INITIAL_NOTICES });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
