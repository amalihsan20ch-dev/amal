// Middleware: refreshes the Supabase session on every request and guards
// the dashboard routes by role (RBAC at the edge). The DATABASE (RLS) is the
// real source of truth; this layer is for clean redirects/UX, not security.
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Not signed in → bounce protected areas to /login
  if (!user && (path.startsWith("/dashboard") || path.startsWith("/crm"))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Staff-only areas require a coordinator/super_admin role
  if (user && (path.startsWith("/dashboard/admin") || path.startsWith("/crm"))) {
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    const staff = profile?.role === "super_admin" || profile?.role === "coordinator";
    if (!staff) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard/volunteer";
      return NextResponse.redirect(url);
    }
    // Metrics manager is super_admin only
    if ((path.startsWith("/crm/metrics") || path.startsWith("/crm/settings")) && profile?.role !== "super_admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/crm/beneficiaries";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  // Run on app routes, skip static assets, the SW, and icons.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|sw.js|workbox-.*|manifest.json).*)"],
};
