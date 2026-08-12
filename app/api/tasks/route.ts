import { NextRequest, NextResponse } from "next/server";

export interface ComplianceTask {
  id: string;
  clientName: string;
  gstin: string;
  taskType: "GSTR-1" | "GSTR-3B" | "GSTR-9" | "TDS 24Q/26Q" | "ITR Form 3" | "ROC AOC-4" | "ITR" | "ROC";
  period: string;
  dueDate: string;
  assignedStaff: string;
  makerChecker: string;
  status: "pending_data" | "in_progress" | "review" | "filed";
  urgent: boolean;
}

let INITIAL_TASKS: ComplianceTask[] = [
  {
    id: "1",
    clientName: "Sunrise Traders Pvt Ltd",
    gstin: "27AABCU9603R1ZM",
    taskType: "GSTR-3B",
    period: "March 2026",
    dueDate: "20 Jul 2026",
    assignedStaff: "Rahul Sharma (Article Clerk)",
    makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
    status: "review",
    urgent: true,
  },
  {
    id: "2",
    clientName: "Metro Electricals",
    gstin: "27AAACM1234R1ZX",
    taskType: "GSTR-1",
    period: "March 2026",
    dueDate: "11 Jul 2026",
    assignedStaff: "Priya Patel (Senior Assistant)",
    makerChecker: "Priya (Maker) → CA Sharma (Checker)",
    status: "in_progress",
    urgent: false,
  },
  {
    id: "3",
    clientName: "Patel Exports LLP",
    gstin: "24AABCP5678R1ZK",
    taskType: "TDS 24Q/26Q",
    period: "Q4 FY 2025-26",
    dueDate: "31 May 2026",
    assignedStaff: "Rahul Sharma (Article Clerk)",
    makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
    status: "pending_data",
    urgent: true,
  },
  {
    id: "4",
    clientName: "Krishna Pharma",
    gstin: "29AABCK9012R1ZD",
    taskType: "ITR Form 3",
    period: "AY 2026-27",
    dueDate: "31 Oct 2026",
    assignedStaff: "Amit Verma (Tax Manager)",
    makerChecker: "Amit (Maker) → CA Sharma (Checker)",
    status: "filed",
    urgent: false,
  },
  {
    id: "5",
    clientName: "Global Fashions",
    gstin: "06AABCG3456R1ZP",
    taskType: "ROC AOC-4",
    period: "FY 2025-26",
    dueDate: "30 Oct 2026",
    assignedStaff: "Priya Patel (Senior Assistant)",
    makerChecker: "Priya (Maker) → CA Sharma (Checker)",
    status: "pending_data",
    urgent: false,
  },
];

export async function GET() {
  return NextResponse.json({ tasks: INITIAL_TASKS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "updateStatus") {
      const { taskId, newStatus } = body;
      INITIAL_TASKS = INITIAL_TASKS.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      return NextResponse.json({ ok: true, tasks: INITIAL_TASKS });
    }

    if (body.action === "createTask") {
      const newTask: ComplianceTask = {
        id: Date.now().toString(),
        clientName: body.clientName || "New Client",
        gstin: body.gstin || "27AABCU9603R1ZM",
        taskType: body.taskType || "GSTR-3B",
        period: body.period || "March 2026",
        dueDate: body.dueDate || "20 Jul 2026",
        assignedStaff: body.assignedStaff || "Article Clerk",
        makerChecker: `${body.assignedStaff || "Staff"} → CA Partner`,
        status: "pending_data",
        urgent: false,
      };
      INITIAL_TASKS.unshift(newTask);
      return NextResponse.json({ ok: true, tasks: INITIAL_TASKS });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
