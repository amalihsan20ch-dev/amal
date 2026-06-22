"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Super-admin guard. RLS (metrics_admin_all) is the real enforcement; this
// returns a friendly message and the supabase client.
async function requireSuperAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, ok: false };
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  return { supabase, user, ok: profile?.role === "super_admin" };
}

// Refresh BOTH the manager and the public homepage so new numbers show at once.
function refresh() {
  revalidatePath("/");
  revalidatePath("/crm/metrics");
}

async function logMetric(supabase, actor, detail) {
  await supabase.from("activity_log").insert({ actor_id: actor, action: "metric:update", entity: "metric", detail });
}

export async function updateMetric(_prev, formData) {
  const { supabase, user, ok } = await requireSuperAdmin();
  if (!ok) return { ok: false, error: "هذه الصلاحية لمدير النظام فقط." };

  const id = formData.get("id");
  const value = Number(formData.get("value"));
  if (!id) return { ok: false, error: "معرّف غير صالح." };
  if (!Number.isFinite(value) || value < 0)
    return { ok: false, error: "أدخل رقمًا صحيحًا (صفر أو أكثر)." };

  const patch = { value };
  const label = formData.get("label_ar")?.toString().trim();
  const suffix = formData.get("suffix");
  if (label) patch.label_ar = label;
  if (suffix !== null) patch.suffix = suffix.toString().trim();

  const { error } = await supabase.from("impact_metrics").update(patch).eq("id", id);
  if (error) return { ok: false, error: "تعذّر التحديث." };
  await logMetric(supabase, user.id, `${patch.label_ar || ""} = ${value}`);
  refresh();
  return { ok: true };
}

export async function toggleMetricVisibility(formData) {
  const { supabase, ok } = await requireSuperAdmin();
  if (!ok) return;
  const id = formData.get("id");
  const is_public = formData.get("is_public") === "true";
  if (!id) return;
  await supabase.from("impact_metrics").update({ is_public }).eq("id", id);
  refresh();
}

export async function createMetric(_prev, formData) {
  const { supabase, ok } = await requireSuperAdmin();
  if (!ok) return { ok: false, error: "هذه الصلاحية لمدير النظام فقط." };

  const label_ar = formData.get("label_ar")?.toString().trim();
  const value = Number(formData.get("value"));
  if (!label_ar) return { ok: false, error: "وصف المؤشر مطلوب." };
  if (!Number.isFinite(value) || value < 0) return { ok: false, error: "رقم غير صالح." };

  const key = formData.get("key")?.toString().trim() || `m_${Date.now()}`;
  const { error } = await supabase.from("impact_metrics").insert({
    key, label_ar, value,
    suffix: formData.get("suffix")?.toString().trim() || "",
    icon: formData.get("icon")?.toString().trim() || "sparkles",
    sort: 99, is_public: true,
  });
  if (error) return { ok: false, error: "تعذّر الإضافة (قد يكون المفتاح مكررًا)." };
  refresh();
  return { ok: true };
}

export async function deleteMetric(formData) {
  const { supabase, ok } = await requireSuperAdmin();
  if (!ok) return;
  const id = formData.get("id");
  if (!id) return;
  await supabase.from("impact_metrics").delete().eq("id", id);
  refresh();
}
