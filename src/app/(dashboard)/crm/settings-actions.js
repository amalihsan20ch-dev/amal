"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function saveSettings(_prev, formData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "غير مصرّح." };
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (p?.role !== "super_admin") return { ok: false, error: "لمدير النظام فقط." };

  const rows = [
    { key: "telegram_chat_id", value: formData.get("telegram_chat_id")?.toString().trim() || "" },
    { key: "notify_new_volunteer", value: formData.get("notify_new_volunteer") === "on" ? "true" : "false" },
    { key: "updated", value: new Date().toISOString() },
  ].map((r) => ({ ...r, updated_by: user.id }));

  const { error } = await supabase.from("settings").upsert(rows, { onConflict: "key" });
  if (error) return { ok: false, error: "تعذّر الحفظ." };
  revalidatePath("/crm/settings");
  return { ok: true };
}
