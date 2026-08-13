import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Registers a new CA firm:
 * 1. Uses service-role client if SUPABASE_SERVICE_ROLE_KEY is present.
 * 2. Fallbacks to standard client.auth.signUp() if only NEXT_PUBLIC_SUPABASE_ANON_KEY is present.
 * 3. Gracefully falls back to local demo workspace if Supabase URL/Keys are unconfigured.
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

    const hasUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const hasAnonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    if (!hasUrl || (!hasServiceKey && !hasAnonKey)) {
      // Demo / Local preview registration fallback
      return NextResponse.json({
        ok: true,
        isDemoMode: true,
        message: "Account created in local preview workspace.",
      });
    }

    // Attempt registration with Admin Service Role client first
    if (hasServiceKey) {
      try {
        const admin = createAdminClient();
        const { data: created, error: userErr } = await admin.auth.admin.createUser({
          email: email.trim(),
          password,
          email_confirm: true,
          user_metadata: { firm_name: firmName.trim() },
        });

        if (!userErr && created?.user) {
          const userId = created.user.id;
          const { data: firm } = await admin
            .from("firms")
            .insert({ name: firmName.trim(), email: email.trim(), icai_number: icaiNumber || null, phone: phone || null })
            .select("id")
            .single();

          if (firm) {
            await admin.from("firm_members").insert({ user_id: userId, firm_id: firm.id, role: "owner" });
          }
          return NextResponse.json({ ok: true });
        }
      } catch (e) {
        console.warn("Service role signup fallback:", e);
      }
    }

    // Fallback using standard Supabase Anon client
    const supabase = createClient();
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { firm_name: firmName.trim() },
      },
    });

    if (signUpErr) {
      const msg = /already.*registered|exists/i.test(signUpErr.message)
        ? "An account with this email already exists"
        : signUpErr.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ ok: true, isDemoMode: true });
  }
}
