import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/supabase/auth";
import { getTasksStore, updateTaskStatusInStore, addTasksToStore } from "@/lib/tasks-store";
import { addInvoiceToStore, getInvoicesStore } from "@/lib/billing-store";
import { logAuditEvent } from "@/lib/audit";

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
  const ctx = await getAuthContext();
  if (ctx) {
    const { data } = await ctx.supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      const formattedTasks: ComplianceTask[] = data.map((t: any) => ({
        id: t.id,
        clientName: t.client_name,
        gstin: t.gstin,
        taskType: t.task_type,
        period: t.period,
        dueDate: t.due_date,
        assignedStaff: t.assigned_staff,
        makerChecker: t.maker_checker,
        status: t.status,
        urgent: t.urgent,
      }));
      return NextResponse.json({ tasks: formattedTasks });
    }
  }

  return NextResponse.json({ tasks: getTasksStore() });
}

export async function POST(req: NextRequest) {
  try {
    const ctx = await getAuthContext();
    const body = await req.json();

    if (body.action === "updateStatus") {
      const { taskId, newStatus } = body;
      const tasksBefore = getTasksStore();
      const targetTask = tasksBefore.find((t) => t.id === taskId);
      const updated = updateTaskStatusInStore(taskId, newStatus);

      if (ctx) {
        await ctx.supabase.from("tasks").update({ status: newStatus }).eq("id", taskId);
      }

      // WORK TO BILLING CLOSED-LOOP: If status changed to "filed", generate SAC 9982 invoice
      if (newStatus === "filed" && targetTask) {
        const feeAmount = targetTask.taskType.includes("GSTR-9") ? 15000 : 5000;
        const totalTax = Math.round(feeAmount * 0.18);
        const totalAmount = feeAmount + totalTax;

        const autoInv = {
          id: `inv-${Date.now()}`,
          invoiceNumber: `INV-2026-00${getInvoicesStore().length + 1}`,
          clientName: targetTask.clientName,
          clientGstin: targetTask.gstin,
          clientPhone: "+919820098200",
          date: new Date().toISOString().split("T")[0],
          dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
          items: [{ description: `Professional Fee for ${targetTask.taskType} (${targetTask.period}) - SAC 9982`, sacCode: "9982", amount: feeAmount }],
          subtotal: feeAmount,
          cgst: Math.round(totalTax / 2),
          sgst: Math.round(totalTax / 2),
          igst: 0,
          totalAmount,
          status: "sent" as const,
          paymentLink: `https://pay.razorpay.com/pl_${Math.random().toString(36).substring(2, 10)}`,
          upiQrUrl: `upi://pay?pa=sharma.ca@okaxis&pn=SharmaAndAssociates&am=${totalAmount}&cu=INR`,
        };

        addInvoiceToStore(autoInv);

        logAuditEvent({
          actorName: "Work-to-Billing Auto-Invoice Engine",
          actorRole: "partner",
          action: "Task Filed → Invoice Auto-Generated",
          entityType: "invoice",
          entityId: autoInv.id,
          details: `Task #${taskId} (${targetTask.taskType}) filed by CA Partner. Auto-generated SAC 9982 Invoice #${autoInv.invoiceNumber} (₹${totalAmount.toLocaleString("en-IN")})`,
        });
      }

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

      if (ctx) {
        await ctx.supabase.from("tasks").insert({
          firm_id: ctx.firmId,
          client_name: newTask.clientName,
          gstin: newTask.gstin,
          task_type: newTask.taskType,
          period: newTask.period,
          due_date: newTask.dueDate,
          assigned_staff: newTask.assignedStaff,
          maker_checker: newTask.makerChecker,
          status: newTask.status,
          urgent: newTask.urgent,
        });
      }

      const updated = addTasksToStore([newTask]);
      return NextResponse.json({ ok: true, tasks: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
