// =====================================================================
//  Telegram notifier for new volunteer registrations (Section 6).
//  Supabase Database Webhook (INSERT on public.volunteers) → POST here.
//  We verify a shared secret header, then push a message to the bot.
//
//  Configure in Supabase: Database → Webhooks → Create:
//    Table: volunteers   Events: INSERT
//    Type: HTTP Request   Method: POST
//    URL: https://YOUR_APP.vercel.app/api/volunteer-webhook
//    HTTP Headers: x-webhook-secret = <WEBHOOK_SECRET>
// =====================================================================
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request) {
  // 1) verify the call really came from our Supabase webhook
  if (request.headers.get("x-webhook-secret") !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const row = payload?.record;
  if (!row) return NextResponse.json({ error: "no record" }, { status: 400 });

  // 2) enrich with the volunteer's name (service role bypasses RLS server-side)
  let name = "متطوّع جديد";
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const { data } = await admin
      .from("profiles").select("full_name").eq("id", row.profile_id).single();
    if (data?.full_name) name = data.full_name;
  } catch { /* non-fatal — still notify */ }

  // 3) notify Telegram
  const text =
    `🤝 طلب تطوّع جديد\n` +
    `الاسم: ${name}\n` +
    `المدينة: ${row.city || "—"}\n` +
    `المهارات: ${(row.skills || []).join("، ") || "—"}`;

  const res = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }),
    }
  );

  if (!res.ok) return NextResponse.json({ error: "telegram failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
