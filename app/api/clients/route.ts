import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/supabase/auth";
import { validateGstin } from "@/lib/gstin";

const BUSINESS_TYPES = ["Regular", "Composition", "SEZ", "Casual"];

/** GET /api/clients — all active clients for the authenticated firm. */
export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data, error } = await ctx.supabase
    .from("clients")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients: data });
}

/** POST /api/clients — create a client (with GSTIN validation). */
export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const name = (body.name || "").trim();
  const gstin = (body.gstin || "").trim().toUpperCase();

  if (!name) return NextResponse.json({ error: "Client name is required" }, { status: 400 });

  const gstinCheck = validateGstin(gstin);
  if (!gstinCheck.valid) return NextResponse.json({ error: gstinCheck.error }, { status: 400 });

  const businessType = BUSINESS_TYPES.includes(body.business_type) ? body.business_type : "Regular";

  // Prevent duplicate GSTIN within the same firm.
  const { data: existing } = await ctx.supabase
    .from("clients")
    .select("id")
    .eq("gstin", gstin)
    .eq("is_active", true)
    .limit(1);
  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "A client with this GSTIN already exists" }, { status: 409 });
  }

  const { data, error } = await ctx.supabase
    .from("clients")
    .insert({
      firm_id: ctx.firmId,
      name,
      gstin,
      pan: (body.pan || "").trim().toUpperCase() || null,
      business_type: businessType,
      turnover: (body.turnover || "").trim() || null,
      email: (body.email || "").trim() || null,
      phone: (body.phone || "").trim() || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data }, { status: 201 });
}

/** PUT /api/clients — update an existing client (id in body). */
export async function PUT(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const id = body.id;
  if (!id) return NextResponse.json({ error: "Client id is required" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined) {
    if (!body.name.trim()) return NextResponse.json({ error: "Client name cannot be empty" }, { status: 400 });
    updates.name = body.name.trim();
  }
  if (body.gstin !== undefined) {
    const gstin = body.gstin.trim().toUpperCase();
    const check = validateGstin(gstin);
    if (!check.valid) return NextResponse.json({ error: check.error }, { status: 400 });
    updates.gstin = gstin;
  }
  if (body.pan !== undefined) updates.pan = body.pan.trim().toUpperCase() || null;
  if (body.business_type !== undefined)
    updates.business_type = BUSINESS_TYPES.includes(body.business_type) ? body.business_type : "Regular";
  if (body.turnover !== undefined) updates.turnover = body.turnover.trim() || null;
  if (body.email !== undefined) updates.email = body.email.trim() || null;
  if (body.phone !== undefined) updates.phone = body.phone.trim() || null;

  // RLS guarantees the row belongs to this firm; no manual firm_id filter needed.
  const { data, error } = await ctx.supabase
    .from("clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ client: data });
}

/** DELETE /api/clients?id=... — soft delete (is_active = false). */
export async function DELETE(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Client id is required" }, { status: 400 });

  const { error } = await ctx.supabase.from("clients").update({ is_active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
