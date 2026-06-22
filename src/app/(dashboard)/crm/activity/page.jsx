import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";

export const dynamic = "force-dynamic";

const LABELS = {
  "beneficiary:add": "إضافة مستفيد",
  "beneficiary:pending": "تغيير حالة مستفيد → معلّق",
  "beneficiary:assessed": "تغيير حالة مستفيد → مُعايَن",
  "beneficiary:aided": "تغيير حالة مستفيد → تمّت المساعدة",
  "donor:add": "إضافة متبرّع",
  "donation:add": "تسجيل تبرّع",
  "volunteer:approved": "قبول متطوّع",
  "volunteer:rejected": "رفض متطوّع",
  "volunteer:pending": "إعادة متطوّع لقيد المراجعة",
};
const fmt = (d) => new Date(d).toLocaleString("ar-EG");

export default async function ActivityPage() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from("activity_log")
    .select("id, action, entity, detail, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  const columns = [
    { key: "action", header: "الإجراء",
      render: (r) => <span className="font-bold text-ink">{LABELS[r.action] || r.action}</span> },
    { key: "detail", header: "التفاصيل", render: (r) => r.detail || "—" },
    { key: "actor", header: "بواسطة", render: (r) => r.profiles?.full_name || "—" },
    { key: "created_at", header: "الوقت", align: "left", render: (r) => <span className="text-ink-soft">{fmt(r.created_at)}</span> },
  ];

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-brand-700">سجلّ النشاط</h2>
        <p className="text-sm text-ink-soft">آخر 100 إجراء على بيانات النظام.</p>
      </div>
      <DataTable columns={columns} rows={rows ?? []} empty="لا نشاط بعد." />
    </section>
  );
}
