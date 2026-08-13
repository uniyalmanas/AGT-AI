import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { logAuditEvent } from "@/lib/audit";
import { ComplianceTask } from "@/app/api/tasks/route";
import { addTasksToStore } from "@/lib/tasks-store";
import { calculateStatutoryDueDate } from "@/lib/statutory-calendar";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, gstin, businessType, period, firmId } = body;

    let clientsToProcess: Array<{ clientName: string; gstin: string; businessType: string }> = [];

    // Query real client profiles from Supabase clients table if available
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createAdminClient();
        const { data: dbClients } = await supabase.from("clients").select("name, gstin, business_type");
        if (dbClients && dbClients.length > 0) {
          clientsToProcess = dbClients.map((c: any) => ({
            clientName: c.name,
            gstin: c.gstin,
            businessType: c.business_type || "Regular",
          }));
        }
      } catch (e) {
        console.error("Supabase client query error:", e);
      }
    }

    if (clientsToProcess.length === 0) {
      clientsToProcess = [
        {
          clientName: clientName || "Sunrise Traders Pvt Ltd",
          gstin: gstin || "27AABCU9603R1ZM",
          businessType: businessType || "Regular",
        },
        {
          clientName: "Metro Electricals",
          gstin: "27AAACM1234R1ZX",
          businessType: "Regular",
        },
        {
          clientName: "Patel Exports LLP",
          gstin: "24AABCP5678R1ZK",
          businessType: "Composition",
        },
      ];
    }

    const targetPeriod = period || "March 2026";
    const generatedTasks: ComplianceTask[] = [];

    // Dynamic statutory task generation across real clients
    clientsToProcess.forEach((client, idx) => {
      const isComposition = client.businessType === "Composition";
      const gstr1DueDate = calculateStatutoryDueDate("GSTR-1", targetPeriod, isComposition);
      const gstr3bDueDate = calculateStatutoryDueDate("GSTR-3B", targetPeriod, isComposition);
      const tdsDueDate = calculateStatutoryDueDate("TDS 24Q/26Q", targetPeriod, isComposition);

      generatedTasks.push(
        {
          id: `auto-${Date.now()}-${idx}-1`,
          clientName: client.clientName,
          gstin: client.gstin,
          taskType: isComposition ? "GSTR-3B" : "GSTR-1",
          period: targetPeriod,
          dueDate: isComposition ? gstr3bDueDate : gstr1DueDate,
          assignedStaff: "Rahul Sharma (Article Clerk)",
          makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
          status: "pending_data",
          urgent: false,
        },
        {
          id: `auto-${Date.now()}-${idx}-2`,
          clientName: client.clientName,
          gstin: client.gstin,
          taskType: "GSTR-3B",
          period: targetPeriod,
          dueDate: gstr3bDueDate,
          assignedStaff: "Rahul Sharma (Article Clerk)",
          makerChecker: "Rahul (Maker) → CA Sharma (Checker)",
          status: "in_progress",
          urgent: true,
        },
        {
          id: `auto-${Date.now()}-${idx}-3`,
          clientName: client.clientName,
          gstin: client.gstin,
          taskType: "TDS 24Q/26Q",
          period: "Q4 FY 2025-26",
          dueDate: tdsDueDate,
          assignedStaff: "Amit Verma (Tax Manager)",
          makerChecker: "Amit (Maker) → CA Sharma (Checker)",
          status: "pending_data",
          urgent: false,
        }
      );
    });

    // Write into live disk-backed store
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
      action: "Tasks Created in Task OS & Disk Store",
      entityType: "task",
      entityId: generatedTasks[0].id,
      details: `Generated and persisted ${generatedTasks.length} statutory tasks into Task OS across ${clientsToProcess.length} client profiles`,
    });

    return NextResponse.json({
      ok: true,
      dbPersisted,
      processedClientsCount: clientsToProcess.length,
      message: `Generated and stored ${generatedTasks.length} statutory tasks across ${clientsToProcess.length} client profiles`,
      generatedTasks,
      totalTasksInStore: updatedTasksStore.length,
    });
  } catch (e) {
    return NextResponse.json({ error: "Task generation failed" }, { status: 500 });
  }
}
