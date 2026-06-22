import { createClient } from "@/lib/supabase/server";
import DataTable from "@/components/crm/DataTable";
import CvButton from "@/components/crm/CvButton";
import VolunteerStatusButtons from "@/components/crm/VolunteerStatusButtons";
import SearchBar from "@/components/crm/SearchBar";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "", label: "الكل" },
  { key: "pending", label: "قيد المراجعة" },
  { key: "approved", label: "مقبول" },
  { key: "rejected", label: "مرفوض" },
];

export default async function VolunteersPage({ searchParams }) {
  const status = searchParams?.status || "";
  const q = (searchParams?.q || "").trim();

  const supabase = createClient();
  let query = supabase
    .from("volunteers")
    .select("id, status, skills, city, cv_url, created_at, profiles(full_name, phone)")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data: rows } = await query;

  // name search is client-side over the joined profile (small datasets)
  const filtered = q
    ? (rows || []).filter((r) => (r.profiles?.full_name || "").includes(q))
    : (rows || []);

  const columns = [
    { key: "name", header: "المتطوّع",
      render: (r) => <span className="font-bold text-ink">{r.profiles?.full_name || "—"}</span> },
    { key: "phone", header: "الهاتف", render: (r) => r.profiles?.phone || "—" },
    { key: "city", header: "المدينة", render: (r) => r.city || "—" },
    { key: "skills", header: "المهارات",
      render: (r) => <span className="text-ink-soft">{(r.skills || []).join("، ") || "—"}</span> },
    { key: "cv", header: "السيرة", render: (r) => <CvButton path={r.cv_url} /> },
    { key: "status", header: "الإجراء", align: "left",
      render: (r) => <VolunteerStatusButtons id={r.id} name={r.profiles?.full_name} status={r.status} /> },
  ];

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-brand-700">طلبات التطوّع</h2>
          <p className="text-sm text-ink-soft">{filtered.length} طلب</p>
        </div>
        <SearchBar placeholder="ابحث بالاسم…" hidden={{ status }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <a key={f.key} href={`/crm/volunteers${f.key ? `?status=${f.key}` : ""}`}
            className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
              status === f.key ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-100"}`}>
            {f.label}
          </a>
        ))}
      </div>

      <DataTable columns={columns} rows={filtered} empty="لا طلبات مطابقة." />
    </section>
  );
}
