import { NextRequest, NextResponse } from "next/server";
import { getEngagementsStore, saveEngagement } from "@/lib/engagement-store";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  return NextResponse.json({ engagements: getEngagementsStore() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updatedStore = saveEngagement(body);

    logAuditEvent({
      actorName: "CA Partner",
      actorRole: "partner",
      action: "Engagement Master Updated",
      entityType: "client",
      entityId: body.clientId,
      details: `Updated service scope & fees for ${body.clientName} (Retainer: ₹${body.monthlyRetainer})`,
    });

    return NextResponse.json({ ok: true, engagements: updatedStore });
  } catch (e) {
    return NextResponse.json({ error: "Failed to save engagement master" }, { status: 500 });
  }
}
