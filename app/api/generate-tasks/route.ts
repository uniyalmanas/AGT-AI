import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { ComplianceTask } from "@/app/api/tasks/route";
import { addTasksToStore } from "@/lib/tasks-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, gstin, businessType, period } = body;

    const targetClient = clientName || "Sunrise Traders Pvt Ltd";
    const targetGstin = gstin || "27AABCU9603R1ZM";
    const targetPeriod = period || "March 2026";
    const isComposition = businessType === "Composition";

    // Dynamic statutory task rules based on entity & business type
    const generatedTasks: ComplianceTask[] = [
      {
        id: `auto-${Date.now()}-1`,
        clientName: targetClient,
        gstin: targetGstin,
        taskType: isComposition ? "GSTR-3B" : "GSTR-1",
        period: targetPeriod,
        dueDate: isComposition ? "18 Apr 2026" : "11 Apr 2026",
        assignedStaff: "Rahul Sharma (Article Clerk)",
        makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
        status: "pending_data",
        urgent: false,
      },
      {
        id: `auto-${Date.now()}-2`,
        clientName: targetClient,
        gstin: targetGstin,
        taskType: "GSTR-3B",
        period: targetPeriod,
        dueDate: "20 Apr 2026",
        assignedStaff: "Rahul Sharma (Article Clerk)",
        makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
        status: "in_progress",
        urgent: true,
      },
      {
        id: `auto-${Date.now()}-3`,
        clientName: targetClient,
        gstin: targetGstin,
        taskType: "TDS 24Q/26Q",
        period: "Q4 FY 2025-26",
        dueDate: "31 May 2026",
        assignedStaff: "Amit Verma (Tax Manager)",
        makerChecker: "Amit (Maker) → CA Sharma (Checker)",
        status: "pending_data",
        urgent: false,
      },
      {
        id: `auto-${Date.now()}-4`,
        clientName: targetClient,
        gstin: targetGstin,
        taskType: "GSTR-9",
        period: "FY 2025-26",
        dueDate: "31 Dec 2026",
        assignedStaff: "CA Rajesh Sharma (Partner)",
        makerChecker: "CA Sharma (Maker & Checker)",
        status: "pending_data",
        urgent: false,
      },
    ];

    // WRITE DIRECTLY INTO LIVE TASKS STORE
    const updatedTasksStore = addTasksToStore(generatedTasks);

    logAuditEvent({
      actorName: "Intelligent Task Engine",
      actorRole: "partner",
      action: "Tasks Created in Task OS",
      entityType: "task",
      entityId: generatedTasks[0].id,
      details: `Generated and persisted ${generatedTasks.length} statutory tasks into Task OS for ${targetClient} (${targetPeriod})`,
    });

    return NextResponse.json({
      ok: true,
      message: `Generated and stored ${generatedTasks.length} statutory tasks for ${targetClient}`,
      generatedTasks,
      totalTasksInStore: updatedTasksStore.length,
    });
  } catch (e) {
    return NextResponse.json({ error: "Task generation failed" }, { status: 500 });
  }
}
