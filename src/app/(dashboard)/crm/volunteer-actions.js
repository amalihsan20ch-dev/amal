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

async function log(supabase, actor, action, entity, entity_id, detail) {
  await supabase.from("activity_log").insert({ actor_id: actor, action, entity, entity_id, detail });
}

export async function setVolunteerStatus(formData) {
  const { supabase, user, staff } = await staffCtx();
  if (!staff) return;
  const id = formData.get("id");
  const status = formData.get("status")?.toString();
  const name = formData.get("name")?.toString() || "";
  if (!id || !["pending", "approved", "rejected"].includes(status)) return;
  await supabase.from("volunteers").update({ status, reviewed_by: user.id }).eq("id", id);
  await log(supabase, user.id, `volunteer:${status}`, "volunteer", id, name);
  revalidatePath("/crm/volunteers");
  revalidatePath("/dashboard/admin");
}

// Returns a short-lived signed URL for a volunteer's CV (private bucket).
export async function getCvUrl(path) {
  const { supabase, staff } = await staffCtx();
  if (!staff || !path) return { url: null };
  const { data } = await supabase.storage.from("cvs").createSignedUrl(path, 120);
  return { url: data?.signedUrl || null };
}
