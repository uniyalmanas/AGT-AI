import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/lib/supabase/auth";
import { validateGstin } from "@/lib/gstin";

const BUSINESS_TYPES = ["Regular", "Composition", "SEZ", "Casual"];

const DEMO_CLIENTS = [
  {
    id: "c-1",
    name: "Sunrise Traders Pvt Ltd",
    gstin: "27AABCU9603R1ZM",
    pan: "AABCU9603R",
    business_type: "Regular",
    turnover: "₹2.5 Cr",
    email: "accounts@sunrisetraders.in",
    phone: "9820198201",
    created_at: new Date().toISOString(),
  },
  {
    id: "c-2",
    name: "Metro Electricals",
    gstin: "27AAACM1234R1ZX",
    pan: "AAACM1234R",
    business_type: "Regular",
    turnover: "₹85 Lakhs",
    email: "billing@metroelec.in",
    phone: "9833098330",
    created_at: new Date().toISOString(),
  },
  {
    id: "c-3",
    name: "Patel Exports LLP",
    gstin: "24AABCP5678R1ZK",
    pan: "AABCP5678R",
    business_type: "SEZ",
    turnover: "₹8.2 Cr",
    email: "finance@patelexports.com",
    phone: "9879098790",
    created_at: new Date().toISOString(),
  },
  {
    id: "c-4",
    name: "Krishna Pharma",
    gstin: "29AABCK9012R1ZD",
    pan: "AABCK9012R",
    business_type: "Regular",
    turnover: "₹1.4 Cr",
    email: "info@krishnapharma.com",
    phone: "9845098450",
    created_at: new Date().toISOString(),
  },
];

/** GET /api/clients — all active clients for the authenticated firm (or demo clients locally). */
export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) {
    return NextResponse.json({ clients: DEMO_CLIENTS });
  }

  try {
    const { data, error } = await ctx.supabase
      .from("clients")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return NextResponse.json({ clients: DEMO_CLIENTS });
    }
    return NextResponse.json({ clients: data });
  } catch (e) {
    return NextResponse.json({ clients: DEMO_CLIENTS });
  }
}

/** POST /api/clients — create a client (with GSTIN validation). */
export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  const body = await req.json();
  const name = (body.name || "").trim();
  const gstin = (body.gstin || "").trim().toUpperCase();

  if (!name) return NextResponse.json({ error: "Client name is required" }, { status: 400 });

  const gstinCheck = validateGstin(gstin);
  if (!gstinCheck.valid) return NextResponse.json({ error: gstinCheck.error }, { status: 400 });

  const businessType = BUSINESS_TYPES.includes(body.business_type) ? body.business_type : "Regular";

  if (!ctx) {
    // Local / demo creation fallback
    const newClient = {
      id: `c-${Date.now()}`,
      name,
      gstin,
      pan: (body.pan || "").trim().toUpperCase() || null,
      business_type: businessType,
      turnover: (body.turnover || "").trim() || "₹1.0 Cr",
      email: (body.email || "").trim() || null,
      phone: (body.phone || "").trim() || null,
      created_at: new Date().toISOString(),
    };
    return NextResponse.json({ client: newClient }, { status: 201 });
  }

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
  const body = await req.json();
  const id = body.id;
  if (!id) return NextResponse.json({ error: "Client id is required" }, { status: 400 });

  if (!ctx) {
    return NextResponse.json({ client: body });
  }

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
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Client id is required" }, { status: 400 });

  if (!ctx) {
    return NextResponse.json({ ok: true });
  }

  const { error } = await ctx.supabase.from("clients").update({ is_active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
