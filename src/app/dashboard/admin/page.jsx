import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

// Server Action: approve/reject a volunteer (staff only — RLS enforces it).
async function setStatus(formData) {
  "use server";
  const id = formData.get("id");
  const status = formData.get("status");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("volunteers")
    .update({ status, reviewed_by: user.id })
    .eq("id", id);
  revalidatePath("/dashboard/admin");
}

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/admin");

  // Volunteer applications joined to profile names.
  const { data: apps } = await supabase
    .from("volunteers")
    .select("id, status, skills, city, cv_url, profiles(full_name, phone)")
    .order("created_at", { ascending: false });

  const pending = (apps ?? []).filter((a) => a.status === "pending");

  return (
    <main className="container-x py-10">
      <h1 className="text-2xl font-extrabold text-brand-700">لوحة الإدارة</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <a href="/dashboard/admin/metrics" className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-bold text-brand-700">مؤشرات الأثر</p>
          <p className="text-sm text-ink-soft">تحديث الأرقام المعروضة للعامة</p>
        </a>
        <a href="/dashboard/admin/beneficiaries" className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-bold text-brand-700">المستفيدون (خاص)</p>
          <p className="text-sm text-ink-soft">سجلّ داخلي — لا يُعرض للعامة</p>
        </a>
        <a href="/dashboard/admin/donors" className="rounded-2xl border border-brand-100 bg-white p-5 shadow-card">
          <p className="font-bold text-brand-700">المتبرعون (خاص)</p>
          <p className="text-sm text-ink-soft">توثيق التفاعلات داخليًا</p>
        </a>
      </div>

      <section className="mt-10">
        <h2 className="mb-3 font-extrabold text-brand-700">
          طلبات التطوّع — قيد المراجعة ({pending.length})
        </h2>
        <div className="overflow-hidden rounded-2xl border border-ink-line bg-white shadow-card">
          {(apps ?? []).map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-line p-4 last:border-0">
              <div>
                <p className="font-bold">{a.profiles?.full_name || "—"}</p>
                <p className="text-sm text-ink-soft">
                  {a.city || "—"} · {(a.skills || []).join("، ") || "بلا مهارات مُدخلة"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {a.cv_url ? (
                  <span className="text-sm text-brand-600">سيرة مرفقة</span>
                ) : null}
                {a.status === "pending" ? (
                  <>
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value="approved" />
                      <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-bold text-white">قبول</button>
                    </form>
                    <form action={setStatus}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="status" value="rejected" />
                      <button className="rounded-lg border border-ink-line px-3 py-1.5 text-sm font-bold text-ink-soft">رفض</button>
                    </form>
                  </>
                ) : (
                  <span className="text-sm font-bold text-ink-soft">
                    {a.status === "approved" ? "مقبول" : "مرفوض"}
                  </span>
                )}
              </div>
            </div>
          ))}
          {!apps?.length ? <p className="p-5 text-ink-soft">لا طلبات بعد.</p> : null}
        </div>
      </section>
    </main>
  );
}
