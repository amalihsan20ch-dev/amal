"use client";
import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setBusy(true); setError("");
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    setBusy(false);
    if (error) { setError("تعذّر الإرسال. تحقّق من البريد."); return; }
    setSent(true);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-100/50 px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-soft">
        <Image src="/logo.png" alt="" width={64} height={64} className="mx-auto mb-4" />
        <h1 className="text-center text-xl font-extrabold text-brand-700">استعادة كلمة المرور</h1>
        {sent ? (
          <p className="mt-5 text-center text-sm text-ink-soft">
            أرسلنا رابط إعادة التعيين إلى بريدك إن كان مسجّلًا. افتح الرابط لمتابعة التغيير.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            <input type="email" placeholder="بريدك الإلكتروني" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-ink-line px-4 py-3 outline-none focus:border-brand-400" />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button onClick={submit} disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? "جارٍ الإرسال…" : "إرسال الرابط"}
            </button>
          </div>
        )}
        <p className="mt-5 text-center text-sm text-ink-soft">
          <a href="/login" className="font-bold text-brand-600">العودة لتسجيل الدخول</a>
        </p>
      </div>
    </main>
  );
}
