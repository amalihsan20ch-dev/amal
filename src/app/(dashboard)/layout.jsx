import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import CrmNav from "@/components/crm/CrmNav";

// Server-side guard for the whole group (defense in depth: middleware routes,
// this redirects, and RLS blocks data — three independent layers).
export default async function DashboardGroupLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/crm/beneficiaries");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  const staff = profile?.role === "super_admin" || profile?.role === "coordinator";
  if (!staff) redirect("/dashboard/volunteer");
  const superAdmin = profile?.role === "super_admin";

  return (
    <div className="min-h-screen bg-brand-50/40">
      <header className="border-b border-ink-line bg-white">
        <div className="container-x flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/admin" className="text-sm font-bold text-ink-soft hover:text-brand-600">
              ← لوحة الإدارة
            </Link>
            <h1 className="text-lg font-extrabold text-brand-700">السجلّ الخاص (CRM)</h1>
          </div>
          <CrmNav superAdmin={superAdmin} />
        </div>
      </header>
      <main className="container-x py-8">{children}</main>
    </div>
  );
}
