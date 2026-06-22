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

export async function createTask(_prev, formData) {
  const { supabase, user, staff } = await staffCtx();
  if (!staff) return { ok: false, error: "صلاحية غير كافية." };
  const title_ar = txt(formData, "title_ar");
  if (!title_ar) return { ok: false, error: "عنوان المهمة مطلوب." };
  const { error } = await supabase.from("tasks").insert({
    title_ar,
    details_ar: txt(formData, "details_ar"),
    assignee_id: txt(formData, "assignee_id"),
    due_on: txt(formData, "due_on") || null,
    created_by: user.id,
  });
  if (error) return { ok: false, error: "تعذّر إنشاء المهمة." };
  revalidatePath("/crm/tasks");
  return { ok: true };
}

export async function updateTaskStatus(formData) {
  const { supabase, staff } = await staffCtx();
  if (!staff) return;
  const id = formData.get("id");
  const status = formData.get("status")?.toString();
  if (!id || !["todo", "in_progress", "done"].includes(status)) return;
  await supabase.from("tasks").update({ status }).eq("id", id);
  revalidatePath("/crm/tasks");
}

export async function deleteTask(formData) {
  const { supabase, staff } = await staffCtx();
  if (!staff) return;
  const id = formData.get("id");
  if (!id) return;
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/crm/tasks");
}
