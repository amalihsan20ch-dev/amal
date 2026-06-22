// =====================================================================
//  Telegram notifier for new volunteer registrations.
//  Supabase Database Webhook (INSERT on volunteers) → POST here.
//  Now: reads chat_id + toggle from `settings`, and ATTACHES the CV file
//  via a short-lived signed URL (sendDocument) instead of text-only.
// =====================================================================
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request) {
  if (request.headers.get("x-webhook-secret") !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const row = payload?.record;
  if (!row) return NextResponse.json({ error: "no record" }, { status: 400 });

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // settings: allow disabling notifications + overriding chat id from the DB
  let chatId = process.env.TELEGRAM_CHAT_ID;
  try {
    const { data: s } = await admin.from("settings").select("key,value")
      .in("key", ["notify_new_volunteer", "telegram_chat_id"]);
    const map = Object.fromEntries((s || []).map((r) => [r.key, r.value]));
    if (map.notify_new_volunteer === "false") return NextResponse.json({ ok: true, skipped: true });
    if (map.telegram_chat_id) chatId = map.telegram_chat_id;
  } catch { /* fall back to env */ }

  // enrich with the volunteer's name
  let name = "متطوّع جديد";
  try {
    const { data } = await admin.from("profiles").select("full_name").eq("id", row.profile_id).single();
    if (data?.full_name) name = data.full_name;
  } catch {}

  const caption =
    `🤝 طلب تطوّع جديد\n` +
    `الاسم: ${name}\n` +
    `المدينة: ${row.city || "—"}\n` +
    `المهارات: ${(row.skills || []).join("، ") || "—"}` +
    (row.cv_url ? "" : "\n(بدون سيرة ذاتية)");

  const base = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
  let res;

  if (row.cv_url) {
    // private bucket → signed URL Telegram can fetch for a short window
    const { data: signed } = await admin.storage.from("cvs").createSignedUrl(row.cv_url, 600);
    if (signed?.signedUrl) {
      res = await fetch(`${base}/sendDocument`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, document: signed.signedUrl, caption }),
      });
    }
  }
  if (!res) {
    res = await fetch(`${base}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: caption }),
    });
  }

  if (!res.ok) return NextResponse.json({ error: "telegram failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
