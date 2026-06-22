import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";
import AddBeneficiaryDrawer from "@/components/crm/AddBeneficiaryDrawer";
import BeneficiaryStatusControl from "@/components/crm/BeneficiaryStatusControl";

export const dynamic = "force-dynamic"; // always fresh internal data

function fmtDate(d) {
  return d ? new Date(d).toLocaleDateString("ar-EG") : "—";
}

export default async function BeneficiariesPage() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from("beneficiaries")
    .select("id, full_name, needs, case_type, governorate, phone, status, created_at")
    .order("created_at", { ascending: false });

  const columns = [
    { key: "full_name", header: "المستفيد",
      render: (r) => <span className="font-bold text-ink">{r.full_name}</span> },
    { key: "needs", header: "الاحتياج", render: (r) => r.needs || "—" },
    { key: "case_type", header: "النوع", render: (r) => r.case_type || "—" },
    { key: "governorate", header: "المحافظة", render: (r) => r.governorate || "—" },
    { key: "status", header: "الحالة",
      render: (r) => <BeneficiaryStatusControl id={r.id} status={r.status} /> },
    { key: "created_at", header: "أُضيفت", align: "left",
      render: (r) => <span className="text-ink-soft">{fmtDate(r.created_at)}</span> },
  ];

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">حالات المستفيدين</h2>
          <p className="text-sm text-ink-soft">{rows?.length ?? 0} حالة مسجّلة</p>
        </div>
        <AddBeneficiaryDrawer />
      </div>
      <DataTable columns={columns} rows={rows ?? []} empty="لا حالات بعد. ابدأ بإضافة حالة." />
    </section>
  );
}
