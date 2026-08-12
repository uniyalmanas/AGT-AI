import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getAuditLogs, logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        const formattedLogs = data.map((d: any) => ({
          id: d.id,
          actorName: d.actor_name,
          actorRole: d.actor_role,
          action: d.action,
          entityType: d.entity_type,
          entityId: d.entity_id,
          details: typeof d.details === "string" ? d.details : JSON.stringify(d.details || {}),
          timestamp: new Date(d.created_at).toISOString().replace("T", " ").substring(0, 19),
        }));
        return NextResponse.json({ logs: formattedLogs });
      }
    }
  } catch (e) {
    console.error("Supabase audit log query error:", e);
  }

  // Graceful fallback to in-memory store
  return NextResponse.json({ logs: getAuditLogs() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actorName, actorRole, action, entityType, entityId, details, firmId } = body;

    if (!actorName || !action || !entityType) {
      return NextResponse.json({ error: "Missing required audit fields" }, { status: 400 });
    }

    let dbInserted = false;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createAdminClient();
      const { error } = await supabase.from("audit_logs").insert({
        firm_id: firmId || "00000000-0000-0000-0000-000000000001",
        actor_name: actorName,
        actor_role: actorRole || "article_clerk",
        action,
        entity_type: entityType,
        entity_id: entityId,
        details: typeof details === "object" ? details : { text: details || action },
      });
      if (!error) dbInserted = true;
    }

    const newEntry = logAuditEvent({
      actorName,
      actorRole: actorRole || "article_clerk",
      action,
      entityType,
      entityId,
      details: details || action,
    });

    return NextResponse.json({ ok: true, dbInserted, entry: newEntry, logs: getAuditLogs() });
  } catch (e) {
    return NextResponse.json({ error: "Audit logging error" }, { status: 500 });
  }
}
