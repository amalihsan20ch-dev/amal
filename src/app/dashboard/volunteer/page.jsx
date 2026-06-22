import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const STATUS = {
  pending:  { label: "قيد المراجعة", cls: "bg-warm-300/40 text-warm-600" },
  approved: { label: "مقبول",       cls: "bg-brand-100 text-brand-700" },
  rejected: { label: "غير مقبول",    cls: "bg-ink-line text-ink-soft" },
};

export default async function VolunteerDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/volunteer");

  const { data: profile } = await supabase
    .from("profiles").select("full_name").eq("id", user.id).single();
  const { data: app } = await supabase
    .from("volunteers").select("status").eq("profile_id", user.id).single();

  const status = app?.status ?? "pending";
  const approved = status === "approved";

  // RLS guarantees these only return rows the volunteer is allowed to see.
  const [{ data: tasks }, { data: library }] = await Promise.all([
    approved ? supabase.from("tasks").select("*").eq("assignee_id", user.id) : { data: [] },
    approved ? supabase.from("training_materials").select("*").order("created_at", { ascending: false }) : { data: [] },
  ]);

  return (
    <main className="container-x py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-brand-700">
          أهلاً، {profile?.full_name || "متطوّعنا"}
        </h1>
        <span className={`rounded-full px-3 py-1 text-sm font-bold ${STATUS[status].cls}`}>
          {STATUS[status].label}
        </span>
      </div>

      {!app ? (
        <div className="mt-8 rounded-2xl border border-ink-line bg-white p-6 text-center shadow-card">
          <p className="text-ink-soft">لم تُكمل بيانات التطوّع بعد.</p>
          <a href="/volunteer/register" className="btn-primary mt-4">أكمل التسجيل</a>
        </div>
      ) : !approved ? (
        <p className="mt-8 rounded-2xl border border-ink-line bg-white p-6 text-ink-soft shadow-card">
          طلبك قيد المراجعة من المنسّقين. ستُفتح المهام والمكتبة التدريبية فور القبول.
        </p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 font-extrabold text-brand-700">مهامي</h2>
            <ul className="space-y-2">
              {(tasks ?? []).length ? tasks.map((t) => (
                <li key={t.id} className="rounded-xl border border-ink-line bg-white p-4 shadow-card">
                  <p className="font-bold">{t.title_ar}</p>
                  {t.details_ar ? <p className="text-sm text-ink-soft">{t.details_ar}</p> : null}
                </li>
              )) : <p className="text-ink-soft">لا مهام حاليًا.</p>}
            </ul>
          </section>
          <section>
            <h2 className="mb-3 font-extrabold text-brand-700">المكتبة التدريبية</h2>
            <ul className="space-y-2">
              {(library ?? []).length ? library.map((m) => (
                <li key={m.id} className="rounded-xl border border-ink-line bg-white p-4 shadow-card">
                  <a href={m.url} target="_blank" rel="noreferrer" className="font-bold text-brand-600">
                    {m.title_ar} · {m.kind === "video" ? "فيديو" : "PDF"}
                  </a>
                </li>
              )) : <p className="text-ink-soft">لا مواد بعد.</p>}
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}
