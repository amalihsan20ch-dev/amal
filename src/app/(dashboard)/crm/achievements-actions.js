"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function staffCtx() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, staff: false };
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return { supabase, user, staff: p?.role === "super_admin" || p?.role === "coordinator" };
}
const txt = (fd, k) => fd.get(k)?.toString().trim() || null;

function refresh() { revalidatePath("/"); revalidatePath("/crm/achievements"); }

export async function createAchievement(_prev, formData) {
  const { supabase, staff } = await staffCtx();
  if (!staff) return { ok: false, error: "صلاحية غير كافية." };

  const title_ar = txt(formData, "title_ar");
  if (!title_ar) return { ok: false, error: "العنوان مطلوب." };

  // optional cover image → public 'media' bucket
  let cover_url = null;
  const file = formData.get("cover");
  if (file && typeof file === "object" && file.size > 0) {
    const ext = (file.name?.split(".").pop() || "jpg").toLowerCase();
    const path = `achievements/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("media").upload(path, file, {
      contentType: file.type || "image/jpeg", upsert: false,
    });
    if (!upErr) cover_url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
  }

  const { error } = await supabase.from("achievements").insert({
    title_ar,
    summary_ar: txt(formData, "summary_ar"),
    category: txt(formData, "category"),
    happened_on: txt(formData, "happened_on") || null,
    cover_url,
    published: formData.get("published") === "on",
  });
  if (error) return { ok: false, error: "تعذّر الحفظ." };
  refresh();
  return { ok: true };
}

export async function togglePublish(formData) {
  const { supabase, staff } = await staffCtx();
  if (!staff) return;
  const id = formData.get("id");
  const published = formData.get("published") === "true";
  if (!id) return;
  await supabase.from("achievements").update({ published }).eq("id", id);
  refresh();
}

export async function deleteAchievement(formData) {
  const { supabase, staff } = await staffCtx();
  if (!staff) return;
  const id = formData.get("id");
  if (!id) return;
  await supabase.from("achievements").delete().eq("id", id);
  refresh();
}
