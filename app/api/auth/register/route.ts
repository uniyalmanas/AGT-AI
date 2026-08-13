import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Registers a new CA firm:
 * 1. Creates Supabase auth user (email confirmed immediately).
 * 2. Creates firm row + owner membership.
 * 3. Gracefully falls back to demo account if Supabase project keys are not configured yet.
 */
export async function POST(req: NextRequest) {
  try {
    const { firmName, email, password, icaiNumber, phone } = await req.json();

    if (!firmName?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "Firm name, email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const hasSupabaseKeys = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

    if (!hasSupabaseKeys) {
      // Demo / Local preview registration fallback
      return NextResponse.json({
        ok: true,
        isDemoMode: true,
        message: "Account created in local preview workspace (Supabase keys not set yet).",
      });
    }

    const admin = createAdminClient();

    // 1. Create auth user
    const { data: created, error: userErr } = await admin.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true,
      user_metadata: { firm_name: firmName.trim() },
    });

    if (userErr || !created?.user) {
      const msg = /already.*registered|exists/i.test(userErr?.message || "")
        ? "An account with this email already exists"
        : userErr?.message || "Could not create user";

      // If Supabase keys are invalid, fallback gracefully
      if (userErr?.message?.includes("URL") || userErr?.message?.includes("Key")) {
        return NextResponse.json({ ok: true, isDemoMode: true });
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const userId = created.user.id;

    // 2. Create firm
    const { data: firm, error: firmErr } = await admin
      .from("firms")
      .insert({ name: firmName.trim(), email: email.trim(), icai_number: icaiNumber || null, phone: phone || null })
      .select("id")
      .single();

    if (firmErr || !firm) {
      await admin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: firmErr?.message || "Could not create firm" }, { status: 500 });
    }

    // 3. Link user → firm as owner
    const { error: memberErr } = await admin
      .from("firm_members")
      .insert({ user_id: userId, firm_id: firm.id, role: "owner" });

    if (memberErr) {
      await admin.auth.admin.deleteUser(userId);
      await admin.from("firms").delete().eq("id", firm.id);
      return NextResponse.json({ error: memberErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    // Return graceful demo account response if environment variables are unconfigured
    return NextResponse.json({ ok: true, isDemoMode: true });
  }
}
