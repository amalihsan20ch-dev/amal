import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";
import AddBeneficiaryDrawer from "@/components/crm/AddBeneficiaryDrawer";
import BeneficiaryStatusControl from "@/components/crm/BeneficiaryStatusControl";
import SearchBar from "@/components/crm/SearchBar";
import Pagination from "@/components/crm/Pagination";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;

const FILTERS = [
  { key: "", label: "الكل" },
  { key: "pending", label: "معلّق" },
  { key: "assessed", label: "مُعايَن" },
  { key: "aided", label: "تمّت المساعدة" },
];
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString("ar-EG") : "—");

export default async function BeneficiariesPage({ searchParams }) {
  const q = (searchParams?.q || "").trim();
  const status = searchParams?.status || "";
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const from = (page - 1) * PAGE_SIZE;

  const supabase = createClient();
  let query = supabase
    .from("beneficiaries")
    .select("id, full_name, needs, case_type, governorate, phone, status, created_at")
    .order("created_at", { ascending: false })
    .range(from, from + PAGE_SIZE); // fetch one extra to detect next page
  if (status) query = query.eq("status", status);
  if (q) query = query.or(`full_name.ilike.%${q}%,needs.ilike.%${q}%,governorate.ilike.%${q}%`);
  const { data } = await query;

  const rows = (data || []).slice(0, PAGE_SIZE);
  const hasNext = (data || []).length > PAGE_SIZE;
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  const makeHref = (p) => { const u = new URLSearchParams(params); u.set("page", p); return `/crm/beneficiaries?${u}`; };
  const exportHref = `/crm/export/beneficiaries${params.toString() ? `?${params}` : ""}`;

  const columns = [
    { key: "full_name", header: "المستفيد", render: (r) => <span className="font-bold text-ink">{r.full_name}</span> },
    { key: "needs", header: "الاحتياج", render: (r) => r.needs || "—" },
    { key: "case_type", header: "النوع", render: (r) => r.case_type || "—" },
    { key: "governorate", header: "المحافظة", render: (r) => r.governorate || "—" },
    { key: "status", header: "الحالة", render: (r) => <BeneficiaryStatusControl id={r.id} status={r.status} /> },
    { key: "created_at", header: "أُضيفت", align: "left", render: (r) => <span className="text-ink-soft">{fmtDate(r.created_at)}</span> },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">حالات المستفيدين</h2>
          <p className="text-sm text-ink-soft">صفحة {page}{hasNext ? "" : " (الأخيرة)"}</p>
        </div>
        <div className="flex items-center gap-2">
          <a href={exportHref} className="rounded-xl border border-brand-200 px-3 py-2 text-sm font-bold text-brand-700 hover:bg-brand-50">تصدير CSV</a>
          <AddBeneficiaryDrawer />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <a key={f.key} href={`/crm/beneficiaries${f.key ? `?status=${f.key}` : ""}`}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                status === f.key ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"}`}>
              {f.label}
            </a>
          ))}
        </div>
        <SearchBar placeholder="اسم/احتياج/محافظة…" hidden={{ status }} defaultValue={q} />
      </div>

      <DataTable columns={columns} rows={rows} empty="لا حالات مطابقة." />
      <Pagination page={page} hasNext={hasNext} makeHref={makeHref} />
    </section>
  );
}
