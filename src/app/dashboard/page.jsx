import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Dashboard entry: route the user to the right area by role.
export default async function DashboardIndex() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();

  if (profile?.role === "super_admin" || profile?.role === "coordinator") {
    redirect("/dashboard/admin");
  }
  redirect("/dashboard/volunteer");
}
