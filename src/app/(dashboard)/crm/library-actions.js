"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function staff() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, ok: false };
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { supabase, ok: p?.role === "super_admin" || p?.role === "coordinator" };
}

export async function addMaterial(_prev, formData) {
  const { supabase, ok } = await staff();
  if (!ok) return { ok: false, error: "صلاحية غير كافية." };
  const title_ar = formData.get("title_ar")?.toString().trim();
  const url = formData.get("url")?.toString().trim();
  if (!title_ar || !url) return { ok: false, error: "العنوان والرابط مطلوبان." };
  const { error } = await supabase.from("training_materials").insert({
    title_ar, url, kind: formData.get("kind")?.toString() || "pdf",
  });
  if (error) return { ok: false, error: "تعذّر الإضافة." };
  revalidatePath("/crm/library");
  return { ok: true };
}

export async function deleteMaterial(formData) {
  const { supabase, ok } = await staff();
  if (!ok) return;
  const id = formData.get("id");
  if (!id) return;
  await supabase.from("training_materials").delete().eq("id", id);
  revalidatePath("/crm/library");
}
