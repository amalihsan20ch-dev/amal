import { createClient } from "@/lib/supabase/server";

function csv(rows, headers) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = headers.map((h) => esc(h.label)).join(",");
  const body = rows.map((r) => headers.map((h) => esc(h.get(r))).join(",")).join("\n");
  return "\uFEFF" + head + "\n" + body;
}

export async function GET(request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response("unauthorized", { status: 401 });
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!["super_admin", "coordinator"].includes(p?.role)) return new Response("forbidden", { status: 403 });

  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  let view = supabase.from("donor_totals").select("*").order("total_amount", { ascending: false });
  if (q) view = view.ilike("donor_name", `%${q}%`);
  const { data } = await view;

  const out = csv(data || [], [
    { label: "المتبرّع", get: (r) => r.donor_name },
    { label: "الهاتف", get: (r) => r.phone },
    { label: "البريد", get: (r) => r.email },
    { label: "إجمالي التبرّعات", get: (r) => r.total_amount },
    { label: "العملات", get: (r) => (r.currencies || []).join("|") },
    { label: "عدد التبرّعات", get: (r) => r.donation_count },
    { label: "آخر تبرّع", get: (r) => r.last_donation_on },
  ]);
  return new Response(out, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="donors.csv"`,
    },
  });
}
