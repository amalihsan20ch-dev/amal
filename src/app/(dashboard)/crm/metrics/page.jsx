import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MetricCard from "@/components/crm/MetricCard";
import AddMetricDrawer from "@/components/crm/AddMetricDrawer";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/crm/metrics");

  // Super-admin ONLY — coordinators may not alter public numbers.
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "super_admin") redirect("/crm/beneficiaries");

  const { data: metrics } = await supabase
    .from("impact_metrics").select("*").order("sort");

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">مؤشرات الأثر</h2>
          <p className="text-sm text-ink-soft">
            أي تعديل يظهر فورًا في الصفحة الرئيسية العامة. {metrics?.length ?? 0} مؤشر.
          </p>
        </div>
        <AddMetricDrawer />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(metrics ?? []).map((m) => <MetricCard key={m.id} metric={m} />)}
      </div>
    </section>
  );
}
