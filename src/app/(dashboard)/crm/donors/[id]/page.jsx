import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";

export const dynamic = "force-dynamic";
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");
const unit = (c) => (c === "USD" ? "$" : "ل.س");

export default async function DonorDetailPage({ params }) {
  const supabase = createClient();
  const [{ data: donor }, { data: donations }] = await Promise.all([
    supabase.from("donors").select("*").eq("id", params.id).single(),
    supabase.from("donations").select("*").eq("donor_id", params.id).order("occurred_on", { ascending: false }),
  ]);
  if (!donor) notFound();

  const list = donations || [];
  const totalsByCur = list.reduce((acc, d) => {
    acc[d.currency] = (acc[d.currency] || 0) + Number(d.amount); return acc;
  }, {});

  const columns = [
    { key: "occurred_on", header: "التاريخ", render: (r) => fmtDate(r.occurred_on) },
    { key: "amount", header: "المبلغ",
      render: (r) => <span className="font-bold text-brand-700">{Number(r.amount).toLocaleString("ar-EG")} {unit(r.currency)}</span> },
    { key: "channel", header: "القناة", render: (r) => r.channel || "—" },
  ];

  return (
    <section className="space-y-5">
      <Link href="/crm/donors" className="text-sm font-bold text-ink-soft hover:text-brand-600">← كل المتبرعين</Link>

      <div className="card p-6">
        <h2 className="text-2xl font-extrabold text-brand-700">{donor.donor_name}</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {donor.phone || "—"} · {donor.email || "—"}
        </p>
        {donor.notes ? <p className="mt-2 text-sm text-ink-soft">{donor.notes}</p> : null}
        <div className="mt-4 flex flex-wrap gap-3">
          {Object.entries(totalsByCur).map(([cur, sum]) => (
            <span key={cur} className="rounded-xl bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
              {sum.toLocaleString("ar-EG")} {unit(cur)}
            </span>
          ))}
          <span className="rounded-xl bg-warm-300/30 px-4 py-2 text-sm font-bold text-warm-600">
            {list.length} تبرّع
          </span>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-extrabold text-brand-700">سجلّ التبرّعات</h3>
        <DataTable columns={columns} rows={list} empty="لا تبرّعات مسجّلة لهذا المتبرّع." />
      </div>
    </section>
  );
}
