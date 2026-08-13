import { NextRequest, NextResponse } from "next/server";
import { getTasksStore, updateTaskStatusInStore } from "@/lib/tasks-store";
import { logAuditEvent } from "@/lib/audit";

export interface ClientPortalData {
  clientName: string;
  gstin: string;
  firmName?: string;
  activeTasks: Array<{
    id: string;
    formType: string;
    period: string;
    dueDate: string;
    status: string;
    requiredDocs: string[];
  }>;
  uploadedDocuments: Array<{
    id: string;
    filename: string;
    date: string;
    size: string;
    status: string;
  }>;
  recentDocuments?: Array<{
    id: string;
    name: string;
    docType: string;
    date: string;
    size: string;
    downloadUrl: string;
  }>;
  outstandingInvoices?: Array<{
    id: string;
    invoiceNumber: string;
    service: string;
    dueDate: string;
    amount: number;
    paymentLink: string;
  }>;
}

export async function GET() {
  return NextResponse.json({
    clientName: "Sunrise Traders Pvt Ltd",
    gstin: "27AABCU9603R1ZM",
    firmName: "Sharma & Associates, CAs",
    activeTasks: [
      { id: "t1", formType: "GSTR-3B", period: "March 2026", dueDate: "20 Apr 2026", status: "pending_data", requiredDocs: ["Tally Sales Excel", "Purchase Register PDF", "Bank Statement"] },
      { id: "t2", formType: "TDS 26Q", period: "Q4 FY 2025-26", dueDate: "31 May 2026", status: "pending_data", requiredDocs: ["Form 16A Certificates", "Salary TDS Dump"] },
    ],
    uploadedDocuments: [
      { id: "doc-1", filename: "Tally_Sales_Mar2026.xlsx", date: "2026-04-02", size: "1.4 MB", status: "verified" },
      { id: "doc-2", filename: "GSTR2B_March_2026.pdf", date: "2026-04-03", size: "850 KB", status: "verified" },
    ],
    recentDocuments: [
      { id: "rd-1", name: "GSTR-3B_Filed_Acknowledgment_Feb2026.pdf", docType: "GST Return", date: "20 Feb 2026", size: "420 KB", downloadUrl: "#" },
      { id: "rd-2", name: "TDS_26Q_Q3_Receipt.pdf", docType: "TDS Return", date: "31 Jan 2026", size: "310 KB", downloadUrl: "#" },
    ],
    outstandingInvoices: [
      { id: "inv-101", invoiceNumber: "INV-2026-001", service: "GSTR-1 & GSTR-3B Preparation (SAC 9982)", dueDate: "15 Apr 2026", amount: 17700, paymentLink: "https://pay.razorpay.com/pl_99821a" },
    ],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, documentName, docType } = body;

    const targetClient = clientName || "Sunrise Traders Pvt Ltd";

    // 1. Locate active pending task for client
    const tasks = getTasksStore();
    const pendingTask = tasks.find(
      (t) => t.clientName.toLowerCase().includes(targetClient.toLowerCase()) && t.status === "pending_data"
    );

    let advancedTaskId: string | null = null;

    if (pendingTask) {
      // 2. Closed-Loop: Advance task status from "pending_data" -> "in_progress"
      updateTaskStatusInStore(pendingTask.id, "in_progress");
      advancedTaskId = pendingTask.id;
    }

    // 3. Log Audit Event
    logAuditEvent({
      actorName: `${targetClient} (Client Portal)`,
      actorRole: "client",
      action: "Document Uploaded & Task Advanced",
      entityType: "task",
      entityId: advancedTaskId || "doc-new",
      details: `Client uploaded ${documentName || "Financial Statement"}. Task ${pendingTask ? `#${pendingTask.id} (${pendingTask.taskType})` : ""} automatically moved from Data Pending → In Progress.`,
    });

    return NextResponse.json({
      ok: true,
      documentName,
      advancedTaskId,
      newStatus: "in_progress",
      message: `Document "${documentName || "File"}" uploaded successfully. Task automatically advanced to In Progress!`,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to process client upload" }, { status: 500 });
  }
}
