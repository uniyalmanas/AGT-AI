import { readPersistentJSON, writePersistentJSON } from "@/lib/persistence";
import { getAuthContext } from "@/lib/supabase/auth";

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorRole: "partner" | "manager" | "article_clerk" | "client";
  action: string;
  entityType: "task" | "return" | "notice" | "invoice" | "client";
  entityId?: string;
  details: string;
  timestamp: string;
}

const AUDIT_FILE = "audit_logs.json";

const DEFAULT_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: "audit-1",
    actorName: "CA Rajesh Sharma",
    actorRole: "partner",
    action: "Filing Approved (Checker)",
    entityType: "task",
    entityId: "task-101",
    details: "Approved GSTR-3B return for Sunrise Traders Pvt Ltd (Mar 2026)",
    timestamp: "2026-08-12 18:45:00",
  },
  {
    id: "audit-2",
    actorName: "Rahul Sharma",
    actorRole: "article_clerk",
    action: "Return Submitted (Maker)",
    entityType: "task",
    entityId: "task-101",
    details: "Extracted Tally Excel dump and submitted GSTR-3B for CA sign-off",
    timestamp: "2026-08-12 16:30:00",
  },
  {
    id: "audit-3",
    actorName: "Razorpay Webhook Engine",
    actorRole: "partner",
    action: "Fee Payment Received",
    entityType: "invoice",
    entityId: "INV-2026-001",
    details: "Payment of ₹17,700 captured via Razorpay UPI for SAC 9982 Tax Consultation",
    timestamp: "2026-08-12 14:15:00",
  },
];

export async function getAuditLogsAsync(): Promise<AuditLogItem[]> {
  try {
    const ctx = await getAuthContext();
    if (ctx) {
      const { data } = await ctx.supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const formatted: AuditLogItem[] = data.map((d: any) => ({
          id: d.id,
          actorName: d.actor_name,
          actorRole: d.actor_role,
          action: d.action,
          entityType: d.entity_type,
          entityId: d.entity_id,
          details: typeof d.details === "string" ? d.details : JSON.stringify(d.details),
          timestamp: d.created_at ? d.created_at.replace("T", " ").substring(0, 19) : new Date().toISOString(),
        }));
        // Update disk backup cache
        writePersistentJSON(AUDIT_FILE, formatted);
        return formatted;
      }
    }
  } catch (e) {
    console.warn("Supabase audit_logs fetch fallback:", e);
  }

  return readPersistentJSON<AuditLogItem[]>(AUDIT_FILE, DEFAULT_AUDIT_LOGS);
}

export function getAuditLogs(): AuditLogItem[] {
  return readPersistentJSON<AuditLogItem[]>(AUDIT_FILE, DEFAULT_AUDIT_LOGS);
}

export async function logAuditEvent(item: Omit<AuditLogItem, "id" | "timestamp">) {
  const currentLogs = getAuditLogs();
  const newLog: AuditLogItem = {
    ...item,
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
  };
  const updated = [newLog, ...currentLogs];
  writePersistentJSON(AUDIT_FILE, updated);

  try {
    const ctx = await getAuthContext();
    if (ctx) {
      await ctx.supabase.from("audit_logs").insert({
        firm_id: ctx.firmId,
        actor_name: item.actorName,
        actor_role: item.actorRole,
        action: item.action,
        entity_type: item.entityType,
        entity_id: item.entityId || null,
        details: { text: item.details },
      });
    }
  } catch (e) {
    console.warn("Supabase audit log insert fallback:", e);
  }

  return newLog;
}
