import { createClient } from "@/lib/supabase/server";
import AddMaterialForm from "@/components/crm/AddMaterialForm";
import MaterialDelete from "@/components/crm/MaterialDelete";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const supabase = createClient();
  const { data: rows } = await supabase
    .from("training_materials").select("*").order("created_at", { ascending: false });

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-brand-700">المكتبة التدريبية</h2>
        <p className="text-sm text-ink-soft">متاحة للمتطوّعين المقبولين في لوحاتهم.</p>
      </div>
      <AddMaterialForm />
      <div className="card divide-y divide-ink-line">
        {(rows ?? []).length ? rows.map((m) => (
          <div key={m.id} className="flex items-center justify-between gap-3 p-4">
            <a href={m.url} target="_blank" rel="noreferrer" className="font-bold text-brand-700 hover:underline">
              {m.title_ar} <span className="text-xs text-ink-soft">· {m.kind === "video" ? "فيديو" : "PDF"}</span>
            </a>
            <MaterialDelete id={m.id} />
          </div>
        )) : <p className="p-5 text-ink-soft">لا مواد بعد.</p>}
      </div>
    </section>
  );
}
