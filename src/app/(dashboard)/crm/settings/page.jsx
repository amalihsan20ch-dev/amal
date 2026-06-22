import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/crm/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/crm/settings");
  const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (p?.role !== "super_admin") redirect("/crm/beneficiaries");

  const { data: rows } = await supabase.from("settings").select("key,value");
  const map = Object.fromEntries((rows || []).map((r) => [r.key, r.value]));

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-brand-700">الإعدادات</h2>
        <p className="text-sm text-ink-soft">إشعارات تيليجرام وربط البوت.</p>
      </div>

      <div className="card max-w-lg space-y-2 border-brand-100 bg-brand-50/40 p-5 text-sm text-ink-soft">
        <p className="font-bold text-brand-700">ربط بوت تيليجرام</p>
        <p>1) أنشئ بوتًا عبر <span className="font-bold">@BotFather</span> واحصل على التوكن.</p>
        <p>2) ضع <code className="rounded bg-white px-1">TELEGRAM_BOT_TOKEN</code> في إعدادات Vercel (متغيّرات البيئة).</p>
        <p>3) أضف البوت إلى مجموعتك واحصل على <code className="rounded bg-white px-1">chat_id</code> وضعه أدناه.</p>
        <p>4) من Supabase → Database → Webhooks: جدول <code className="rounded bg-white px-1">volunteers</code> حدث INSERT إلى مسار <code className="rounded bg-white px-1">/api/volunteer-webhook</code> مع ترويسة <code className="rounded bg-white px-1">x-webhook-secret</code>.</p>
      </div>

      <SettingsForm chatId={map.telegram_chat_id || ""} notify={map.notify_new_volunteer !== "false"} />
    </section>
  );
}
