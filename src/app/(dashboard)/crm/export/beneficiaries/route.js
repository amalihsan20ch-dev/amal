import { createClient } from "@/lib/supabase/server";

function csv(rows, headers) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = headers.map((h) => esc(h.label)).join(",");
  const body = rows.map((r) => headers.map((h) => esc(h.get(r))).join(",")).join("\n");
  return "\uFEFF" + head + "\n" + body; // BOM => Excel reads Arabic correctly
}

export async function GET(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!["super_admin", "coordinator"].includes(p?.role)) return new Response("forbidden", { status: 403 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const status = searchParams.get("status") || "";

  let query = supabase.from("beneficiaries")
    .select("full_name, needs, case_type, governorate, phone, status, created_at")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (q) query = query.or(`full_name.ilike.%${q}%,needs.ilike.%${q}%,governorate.ilike.%${q}%`);
  const { data } = await query;

  const out = csv(data || [], [
    { label: "الاسم", get: (r) => r.full_name },
    { label: "الاحتياج", get: (r) => r.needs },
    { label: "النوع", get: (r) => r.case_type },
    { label: "المحافظة", get: (r) => r.governorate },
    { label: "الهاتف", get: (r) => r.phone },
    { label: "الحالة", get: (r) => r.status },
    { label: "التاريخ", get: (r) => r.created_at },
  ]);
  return new Response(out, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="beneficiaries.csv"`,
    },
  });
}
