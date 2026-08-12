import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Routes that an unauthenticated visitor is allowed to reach. */
const PUBLIC_PATHS = ["/", "/about", "/pricing", "/contact", "/login", "/register", "/auth"];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

/**
 * Refreshes the Supabase auth session on every request and gates access:
 *  - unauthenticated users hitting a protected page  → redirected to /login
 *  - authenticated users hitting /login or /register → redirected to /dashboard
 *
 * Must return the `supabaseResponse` object unmodified (cookies attached) so the
 * refreshed session is persisted. See Supabase SSR docs.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // If Supabase isn't configured yet (missing or still-placeholder env vars),
  // skip auth entirely so the app still boots before real keys are added.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const configured =
    !!url && !!anonKey && !url.includes("your-project") && !anonKey.startsWith("your_");
  if (!configured) return supabaseResponse;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: do not run code between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // API routes handle their own auth and must return JSON, never an HTML
  // redirect. Let them through (session cookies are still refreshed above).
  if (pathname.startsWith("/api/")) return supabaseResponse;

  if (!user && !isPublic(pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (pathname === "/login" || pathname === "/register")) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
