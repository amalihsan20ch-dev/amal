import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";
import ConfidentialBanner from "@/components/crm/ConfidentialBanner";
import DonorActions from "@/components/crm/DonorActions";

export const dynamic = "force-dynamic";

function fmtAmount(value, currencies) {
  const n = Number(value || 0).toLocaleString("ar-EG");
  // org default is SYP; show the unit, and flag if mixed currencies exist
  const cur = (currencies || []).length > 1 ? "" : (currencies?.[0] === "USD" ? " $" : " ل.س");
  const mixed = (currencies || []).length > 1 ? " (عملات متعددة)" : "";
  return `${n}${cur}${mixed}`;
}
function fmtDate(d) { return d ? new Date(d).toLocaleDateString("ar-EG") : "—"; }

export default async function DonorsPage() {
  const supabase = createClient();
  const [{ data: rows }, { data: donors }] = await Promise.all([
    supabase.from("donor_totals").select("*").order("total_amount", { ascending: false }),
    supabase.from("donors").select("id, donor_name").order("donor_name"),
  ]);

  const columns = [
    { key: "donor_name", header: "المتبرّع",
      render: (r) => <span className="font-bold text-ink">{r.donor_name}</span> },
    { key: "phone", header: "الهاتف", render: (r) => r.phone || "—" },
    { key: "email", header: "البريد", render: (r) => r.email || "—" },
    { key: "total_amount", header: "إجمالي التبرّعات",
      render: (r) => <span className="font-bold text-brand-700">{fmtAmount(r.total_amount, r.currencies)}</span> },
    { key: "donation_count", header: "عدد التبرّعات", render: (r) => r.donation_count ?? 0 },
    { key: "last_donation_on", header: "آخر تبرّع", align: "left",
      render: (r) => <span className="text-ink-soft">{fmtDate(r.last_donation_on)}</span> },
  ];

  return (
    <section className="space-y-5">
      <ConfidentialBanner />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">المتبرعون</h2>
          <p className="text-sm text-ink-soft">{rows?.length ?? 0} متبرّع</p>
        </div>
        <DonorActions donors={donors ?? []} />
      </div>
      <DataTable columns={columns} rows={rows ?? []} empty="لا متبرعين بعد. أضف متبرّعًا ثم سجّل تبرّعه." />
    </section>
  );
}
