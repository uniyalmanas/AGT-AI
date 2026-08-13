import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";
import { ComplianceTask } from "@/app/api/tasks/route";
import { addTasksToStore } from "@/lib/tasks-store";
import { getEngagementsStore } from "@/lib/engagement-store";
import { calculateStatutoryDueDate } from "@/lib/statutory-calendar";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { period, firmId } = body;

    const engagements = getEngagementsStore();
    const targetPeriod = period || "March 2026";
    const generatedTasks: ComplianceTask[] = [];

    // Read real Engagement Profiles and create multi-tax tasks
    engagements.forEach((eng, idx) => {
      const isComposition = eng.gstFrequency === "Composition";
      const gstr1DueDate = calculateStatutoryDueDate("GSTR-1", targetPeriod, isComposition);
      const gstr3bDueDate = calculateStatutoryDueDate("GSTR-3B", targetPeriod, isComposition);

      // 1. GST Tasks
      if (!isComposition) {
        generatedTasks.push({
          id: `task-${Date.now()}-${idx}-1`,
          clientName: eng.clientName,
          gstin: eng.gstin,
          taskType: "GSTR-1",
          period: targetPeriod,
          dueDate: gstr1DueDate,
          assignedStaff: eng.assignedMaker,
          makerChecker: `${eng.assignedMaker} → ${eng.assignedChecker}`,
          status: "pending_data",
          urgent: false,
        });
      }

      generatedTasks.push({
        id: `task-${Date.now()}-${idx}-2`,
        clientName: eng.clientName,
        gstin: eng.gstin,
        taskType: "GSTR-3B",
        period: targetPeriod,
        dueDate: gstr3bDueDate,
        assignedStaff: eng.assignedMaker,
        makerChecker: `${eng.assignedMaker} → ${eng.assignedChecker}`,
        status: "in_progress",
        urgent: true,
      });

      // 2. TDS Tasks if opted
      if (eng.tdsOpted) {
        const tdsDueDate = calculateStatutoryDueDate("TDS 24Q/26Q", targetPeriod, isComposition);
        generatedTasks.push({
          id: `task-${Date.now()}-${idx}-3`,
          clientName: eng.clientName,
          gstin: eng.gstin,
          taskType: "TDS 24Q/26Q",
          period: "Q4 FY 2025-26",
          dueDate: tdsDueDate,
          assignedStaff: eng.assignedMaker,
          makerChecker: `${eng.assignedMaker} → ${eng.assignedChecker}`,
          status: "pending_data",
          urgent: false,
        });
      }

      // 3. ITR & Audit Tasks if opted
      if (eng.itrForm) {
        const itrDueDate = calculateStatutoryDueDate(eng.itrForm, targetPeriod, isComposition);
        generatedTasks.push({
          id: `task-${Date.now()}-${idx}-4`,
          clientName: eng.clientName,
          gstin: eng.gstin,
          taskType: "ITR Form 3",
          period: "AY 2026-27",
          dueDate: itrDueDate,
          assignedStaff: eng.assignedChecker,
          makerChecker: `${eng.assignedChecker} (Sign-off)`,
          status: "pending_data",
          urgent: false,
        });
      }

      // 4. ROC Tasks if opted
      if (eng.rocOpted) {
        const rocDueDate = calculateStatutoryDueDate("ROC AOC-4", targetPeriod, isComposition);
        generatedTasks.push({
          id: `task-${Date.now()}-${idx}-5`,
          clientName: eng.clientName,
          gstin: eng.gstin,
          taskType: "ROC AOC-4",
          period: "FY 2025-26",
          dueDate: rocDueDate,
          assignedStaff: eng.assignedMaker,
          makerChecker: `${eng.assignedMaker} → ${eng.assignedChecker}`,
          status: "pending_data",
          urgent: false,
        });
      }
    });

    // Write into disk-backed tasks store
    const updatedTasksStore = addTasksToStore(generatedTasks);

    let dbPersisted = false;

    // Write generated tasks into Supabase PostgreSQL tasks table
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createAdminClient();
        const rows = generatedTasks.map((t) => ({
          firm_id: firmId || "00000000-0000-0000-0000-000000000001",
          client_name: t.clientName,
          gstin: t.gstin,
          task_type: t.taskType,
          period: t.period,
          due_date: t.dueDate,
          assigned_staff: t.assignedStaff,
          maker_checker: t.makerChecker,
          status: t.status,
          urgent: t.urgent,
        }));
        const { error } = await supabase.from("tasks").insert(rows);
        if (!error) dbPersisted = true;
      } catch (e) {
        console.error("Supabase tasks insert error:", e);
      }
    }

    logAuditEvent({
      actorName: "Intelligent Task Engine",
      actorRole: "partner",
      action: "Engagement Master Tasks Generated",
      entityType: "task",
      entityId: generatedTasks[0].id,
      details: `Generated ${generatedTasks.length} statutory multi-tax tasks from Engagement Master profiles across ${engagements.length} active firm engagements`,
    });

    return NextResponse.json({
      ok: true,
      dbPersisted,
      engagementsCount: engagements.length,
      message: `Generated and stored ${generatedTasks.length} statutory multi-tax tasks across ${engagements.length} engagement profiles`,
      generatedTasks,
      totalTasksInStore: updatedTasksStore.length,
    });
  } catch (e) {
    return NextResponse.json({ error: "Task generation failed" }, { status: 500 });
  }
}
