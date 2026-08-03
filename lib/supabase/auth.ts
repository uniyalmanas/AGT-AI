import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface AuthContext {
  supabase: SupabaseClient;
  userId: string;
  firmId: string;
}

/**
 * Resolves the current request's authenticated user and their firm_id.
 * Returns null if the user isn't signed in or has no firm membership.
 *
 * RLS still enforces isolation on every query; firmId is needed so INSERTs can
 * set firm_id (the WITH CHECK policy requires firm_id = auth_firm_id()).
 */
export async function getAuthContext(): Promise<AuthContext | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("firm_members")
    .select("firm_id")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership) return null;

  return { supabase, userId: user.id, firmId: membership.firm_id };
}
