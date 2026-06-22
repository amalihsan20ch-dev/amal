import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";
import ConfidentialBanner from "@/components/crm/ConfidentialBanner";
import DonorActions from "@/components/crm/DonorActions";
import SearchBar from "@/components/crm/SearchBar";
import Pagination from "@/components/crm/Pagination";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

function fmtAmount(value, currencies) {
  const n = Number(value || 0).toLocaleString("ar-EG");
  const list = currencies || [];
  const unit = list.length > 1 ? " (عملات متعددة)" : list[0] === "USD" ? " $" : " ل.س";
  return `${n}${unit}`;
}
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default async function DonorsPage({ searchParams }) {
  const q = (searchParams?.q || "").trim();
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = createClient();
  let view = supabase.from("donor_totals").select("*")
    .order("total_amount", { ascending: false }).range(from, from + PAGE_SIZE);
  if (q) view = view.ilike("donor_name", `%${q}%`);

  const [{ data }, { data: donors }] = await Promise.all([
    view,
    supabase.from("donors").select("id, donor_name").order("donor_name"),
  ]);

  const rows = (data || []).slice(0, PAGE_SIZE);
  const hasNext = (data || []).length > PAGE_SIZE;
  const params = new URLSearchParams(); if (q) params.set("q", q);
  const makeHref = (p) => { const u = new URLSearchParams(params); u.set("page", p); return `/crm/donors?${u}`; };
  const exportHref = `/crm/export/donors${q ? `?q=${encodeURIComponent(q)}` : ""}`;

  const columns = [
    { key: "donor_name", header: "المتبرّع",
      render: (r) => <Link href={`/crm/donors/${r.id}`} className="font-bold text-brand-700 hover:underline">{r.donor_name}</Link> },
    { key: "phone", header: "الهاتف", render: (r) => r.phone || "—" },
    { key: "total_amount", header: "إجمالي التبرّعات",
      render: (r) => <span className="font-bold text-brand-700">{fmtAmount(r.total_amount, r.currencies)}</span> },
    { key: "donation_count", header: "العدد", render: (r) => r.donation_count ?? 0 },
    { key: "last_donation_on", header: "آخر تبرّع", align: "left", render: (r) => <span className="text-ink-soft">{fmtDate(r.last_donation_on)}</span> },
  ];

  return (
    <section className="space-y-5">
      <ConfidentialBanner />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">المتبرعون</h2>
          <p className="text-sm text-ink-soft">صفحة {page}{hasNext ? "" : " (الأخيرة)"}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={exportHref} className="rounded-xl border border-brand-200 px-3 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50">تصدير CSV</a>
          <DonorActions donors={donors ?? []} />
        </div>
      </div>
      <div className="flex justify-end"><SearchBar placeholder="اسم المتبرّع…" defaultValue={q} /></div>
      <DataTable columns={columns} rows={rows} empty="لا متبرعين مطابقين." />
      <Pagination page={page} hasNext={hasNext} makeHref={makeHref} />
    </section>
  );
}
