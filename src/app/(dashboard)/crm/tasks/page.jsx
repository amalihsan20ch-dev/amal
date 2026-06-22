import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";
import AddTaskDrawer from "@/components/crm/AddTaskDrawer";
import TaskRowActions from "@/components/crm/TaskRowActions";

export const dynamic = "force-dynamic";
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default async function TasksPage() {
  const supabase = createClient();

  const [{ data: tasks }, { data: approved }] = await Promise.all([
    supabase.from("tasks")
      .select("id, title_ar, details_ar, status, due_on, assignee_id, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase.from("volunteers")
      .select("profile_id, profiles(full_name)").eq("status", "approved"),
  ]);

  const volunteers = (approved || [])
    .map((v) => ({ id: v.profile_id, full_name: v.profiles?.full_name || "—" }));

  const columns = [
    { key: "title_ar", header: "المهمة",
      render: (r) => (
        <div>
          <p className="font-bold text-ink">{r.title_ar}</p>
          {r.details_ar ? <p className="text-xs text-ink-soft">{r.details_ar}</p> : null}
        </div>
      ) },
    { key: "assignee", header: "المُكلَّف", render: (r) => r.profiles?.full_name || "—" },
    { key: "due_on", header: "الاستحقاق", render: (r) => fmtDate(r.due_on) },
    { key: "actions", header: "الحالة", align: "left",
      render: (r) => <TaskRowActions id={r.id} status={r.status} /> },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">المهام والحملات</h2>
          <p className="text-sm text-ink-soft">{tasks?.length ?? 0} مهمة · تُسنَد للمتطوّعين المقبولين</p>
        </div>
        <AddTaskDrawer volunteers={volunteers} />
      </div>
      <DataTable columns={columns} rows={tasks ?? []} empty="لا مهام بعد." />
    </section>
  );
}
