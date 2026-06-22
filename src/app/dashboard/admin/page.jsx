import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Icon from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

const CARDS = [
  { href: "/crm/beneficiaries", icon: "hand-heart", title: "المستفيدون", desc: "سجلّ الحالات (خاص)" },
  { href: "/crm/donors", icon: "gift", title: "المتبرعون", desc: "تبرّعات وإجماليات (خاص)" },
  { href: "/crm/volunteers", icon: "users", title: "طلبات التطوّع", desc: "قبول/رفض + السير الذاتية" },
  { href: "/crm/achievements", icon: "sparkles", title: "الأعمال", desc: "معرض الموقع العام" },
  { href: "/crm/tasks", icon: "calendar", title: "المهام", desc: "إسناد المهام للمتطوّعين" },
  { href: "/crm/library", icon: "shield", title: "المكتبة", desc: "مواد تدريبية" },
];
const ADMIN_CARDS = [
  { href: "/crm/metrics", icon: "trending-up", title: "مؤشرات الأثر", desc: "أرقام الصفحة العامة" },
  { href: "/crm/settings", icon: "phone", title: "الإعدادات", desc: "ربط بوت تيليجرام" },
  { href: "/crm/activity", icon: "map", title: "سجلّ النشاط", desc: "تتبّع الإجراءات" },
];

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/admin");
  const { data: profile } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single();
  const superAdmin = profile?.role === "super_admin";

  const [{ count: pending }, { count: beneficiaries }, { count: donorsCount }] = await Promise.all([
    supabase.from("volunteers").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("beneficiaries").select("id", { count: "exact", head: true }),
    supabase.from("donors").select("id", { count: "exact", head: true }),
  ]);

  const cards = [...CARDS, ...(superAdmin ? ADMIN_CARDS : [])];

  return (
    <main className="container-x py-8">
      <h1 className="text-2xl font-extrabold text-brand-700">أهلاً، {profile?.full_name || "مدير"}</h1>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {[
          { l: "طلبات قيد المراجعة", v: pending ?? 0, href: "/crm/volunteers?status=pending" },
          { l: "مستفيدون", v: beneficiaries ?? 0, href: "/crm/beneficiaries" },
          { l: "متبرعون", v: donorsCount ?? 0, href: "/crm/donors" },
        ].map((s) => (
          <Link key={s.l} href={s.href} className="card p-4 text-center transition hover:shadow-soft">
            <p className="text-3xl font-black text-brand-600">{Number(s.v).toLocaleString("ar-EG")}</p>
            <p className="text-xs font-medium text-ink-soft">{s.l}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="card group p-5 transition hover:-translate-y-1 hover:shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
              <Icon name={c.icon} />
            </span>
            <p className="mt-3 font-extrabold text-brand-700">{c.title}</p>
            <p className="text-sm text-ink-soft">{c.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
