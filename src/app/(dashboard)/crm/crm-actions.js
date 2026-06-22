"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Shared guard. RLS is the real enforcement; this short-circuits early with a
// friendly message and gives us the user id for created_by/logged_by.
async function requireStaff() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, staff: false };
  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  const staff = profile?.role === "super_admin" || profile?.role === "coordinator";
  return { supabase, user, staff };
}

const txt = (fd, k) => fd.get(k)?.toString().trim() || null;

async function log(supabase, actor, action, entity, entity_id, detail) {
  await supabase.from("activity_log").insert({ actor_id: actor, action, entity, entity_id, detail });
}

// ---- Beneficiaries --------------------------------------------------
export async function addBeneficiary(_prev, formData) {
  const { supabase, user, staff } = await requireStaff();
  if (!staff) return { ok: false, error: "صلاحية غير كافية." };

  const full_name = txt(formData, "full_name");
  if (!full_name) return { ok: false, error: "اسم المستفيد مطلوب." };

  const { error } = await supabase.from("beneficiaries").insert({
    full_name,
    needs: txt(formData, "needs"),
    case_type: txt(formData, "case_type"),
    governorate: txt(formData, "governorate"),
    phone: txt(formData, "phone"),
    notes: txt(formData, "notes"),
    status: "pending",
    created_by: user.id,
  });
  if (error) return { ok: false, error: "تعذّر حفظ الحالة." };
  await log(supabase, user.id, "beneficiary:add", "beneficiary", null, full_name);
  revalidatePath("/crm/beneficiaries");
  return { ok: true };
}

export async function updateBeneficiaryStatus(formData) {
  const { supabase, user, staff } = await requireStaff();
  if (!staff) return;
  const id = formData.get("id");
  const status = formData.get("status")?.toString();
  if (!id || !["pending", "assessed", "aided"].includes(status)) return;
  await supabase.from("beneficiaries").update({ status }).eq("id", id);
  await log(supabase, user.id, `beneficiary:${status}`, "beneficiary", id, null);
  revalidatePath("/crm/beneficiaries");
}

// ---- Donors & donations --------------------------------------------
export async function addDonor(_prev, formData) {
  const { supabase, user, staff } = await requireStaff();
  if (!staff) return { ok: false, error: "صلاحية غير كافية." };

  const donor_name = txt(formData, "donor_name");
  if (!donor_name) return { ok: false, error: "اسم المتبرّع مطلوب." };

  const { error } = await supabase.from("donors").insert({
    donor_name,
    phone: txt(formData, "phone"),
    email: txt(formData, "email"),
    notes: txt(formData, "notes"),
    created_by: user.id,
  });
  if (error) return { ok: false, error: "تعذّر حفظ المتبرّع." };
  await log(supabase, user.id, "donor:add", "donor", null, donor_name);
  revalidatePath("/crm/donors");
  return { ok: true };
}

export async function logDonation(_prev, formData) {
  const { supabase, user, staff } = await requireStaff();
  if (!staff) return { ok: false, error: "صلاحية غير كافية." };

  const donor_id = formData.get("donor_id")?.toString();
  const amount = Number(formData.get("amount"));
  if (!donor_id) return { ok: false, error: "اختر المتبرّع." };
  if (!Number.isFinite(amount) || amount <= 0)
    return { ok: false, error: "أدخل مبلغًا صحيحًا أكبر من صفر." };

  const { error } = await supabase.from("donations").insert({
    donor_id,
    amount,
    currency: txt(formData, "currency") || "SYP",
    channel: txt(formData, "channel"),
    occurred_on: txt(formData, "occurred_on") || undefined,
    logged_by: user.id,
  });
  if (error) return { ok: false, error: "تعذّر تسجيل التبرّع." };
  await log(supabase, user.id, "donation:add", "donor", donor_id, String(amount));
  revalidatePath("/crm/donors");
  revalidatePath(`/crm/donors/${donor_id}`);
  return { ok: true };
}
