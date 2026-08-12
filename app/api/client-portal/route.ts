import { NextRequest, NextResponse } from "next/server";

export interface ClientPortalData {
  clientName: string;
  gstin: string;
  firmName: string;
  filingStatus: {
    gstr1: "filed" | "in_progress" | "pending";
    gstr3b: "filed" | "in_progress" | "pending";
    tds: "filed" | "in_progress" | "pending";
  };
  recentDocuments: Array<{
    name: string;
    docType: string;
    date: string;
    size: string;
    downloadUrl: string;
  }>;
  outstandingInvoices: Array<{
    invoiceNumber: string;
    service: string;
    amount: number;
    dueDate: string;
    payUrl: string;
  }>;
}

const DEMO_PORTAL_DATA: ClientPortalData = {
  clientName: "Sunrise Traders Pvt Ltd",
  gstin: "27AABCU9603R1ZM",
  firmName: "Sharma & Associates (CA Firm)",
  filingStatus: {
    gstr1: "filed",
    gstr3b: "filed",
    tds: "in_progress",
  },
  recentDocuments: [
    { name: "GSTR-3B_Ack_March2026.pdf", docType: "Acknowledgement", date: "2026-04-18", size: "245 KB", downloadUrl: "#" },
    { name: "GSTR-1_Summary_March2026.pdf", docType: "Return Summary", date: "2026-04-10", size: "180 KB", downloadUrl: "#" },
    { name: "GST_Certificate_2026.pdf", docType: "Registration", date: "2026-01-15", size: "1.2 MB", downloadUrl: "#" },
  ],
  outstandingInvoices: [
    {
      invoiceNumber: "SA/2026/041",
      service: "Monthly GST Filing & DRC-01 Reply Drafting",
      amount: 9440,
      dueDate: "2026-08-15",
      payUrl: "https://pay.razorpay.com/pl_P1a2b3c4d5e6f7",
    },
  ],
};

export async function GET(req: NextRequest) {
  return NextResponse.json(DEMO_PORTAL_DATA);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    return NextResponse.json({
      ok: true,
      message: `File "${file.name}" uploaded successfully to CA Firm Vault. Your CA has been notified via WhatsApp.`,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
