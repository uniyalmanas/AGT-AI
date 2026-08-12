import { NextRequest, NextResponse } from "next/server";
import { getAuditLogs, logAuditEvent } from "@/lib/audit";

export async function GET() {
  return NextResponse.json({ logs: getAuditLogs() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { actorName, actorRole, action, entityType, entityId, details } = body;

    if (!actorName || !action || !entityType) {
      return NextResponse.json({ error: "Missing required audit fields" }, { status: 400 });
    }

    const newEntry = logAuditEvent({
      actorName,
      actorRole: actorRole || "article_clerk",
      action,
      entityType,
      entityId,
      details: details || action,
    });

    return NextResponse.json({ ok: true, entry: newEntry, logs: getAuditLogs() });
  } catch (e) {
    return NextResponse.json({ error: "Audit logging error" }, { status: 500 });
  }
}
