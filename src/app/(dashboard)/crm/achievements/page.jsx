import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";
import AddAchievementDrawer from "@/components/crm/AddAchievementDrawer";
import AchievementRowActions from "@/components/crm/AchievementRowActions";

export const dynamic = "force-dynamic";
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default async function AchievementsPage() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from("achievements").select("*").order("happened_on", { ascending: false });

  const columns = [
    { key: "cover", header: "",
      render: (r) => (
        <div className="h-10 w-14 overflow-hidden rounded-lg bg-brand-100">
          {r.cover_url ? <Image src={r.cover_url} alt="" width={56} height={40} className="h-full w-full object-cover" /> : null}
        </div>
      ) },
    { key: "title_ar", header: "العنوان", render: (r) => <span className="font-bold text-ink">{r.title_ar}</span> },
    { key: "category", header: "التصنيف", render: (r) => r.category || "—" },
    { key: "happened_on", header: "التاريخ", render: (r) => fmtDate(r.happened_on) },
    { key: "actions", header: "الحالة", align: "left",
      render: (r) => <AchievementRowActions id={r.id} published={r.published} /> },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">الأعمال والإنجازات</h2>
          <p className="text-sm text-ink-soft">المنشور يظهر في معرض الموقع العام.</p>
        </div>
        <AddAchievementDrawer />
      </div>
      <DataTable columns={columns} rows={rows ?? []} empty="لا أعمال بعد. أضف أوّل عمل." />
    </section>
  );
}
