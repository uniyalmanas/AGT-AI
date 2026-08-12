import { NextRequest, NextResponse } from "next/server";
import { getTasksStore, updateTaskStatusInStore, addTasksToStore } from "@/lib/tasks-store";

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

export async function GET() {
  return NextResponse.json({ tasks: getTasksStore() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.action === "updateStatus") {
      const { taskId, newStatus } = body;
      const updated = updateTaskStatusInStore(taskId, newStatus);
      return NextResponse.json({ ok: true, tasks: updated });
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
      const updated = addTasksToStore([newTask]);
      return NextResponse.json({ ok: true, tasks: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
