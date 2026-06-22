"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Supabase fires PASSWORD_RECOVERY once the email link session is detected.
  useEffect(() => {
    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit() {
    if (password.length < 6) { setError("كلمة المرور 6 أحرف على الأقل."); return; }
    setBusy(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setError("تعذّر التحديث. أعد فتح الرابط من بريدك."); return; }
    setDone(true);
    setTimeout(() => router.replace("/login"), 1500);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-100/50 px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-soft">
        <Image src="/logo.png" alt="" width={64} height={64} className="mx-auto mb-4" />
        <h1 className="text-center text-xl font-extrabold text-brand-700">كلمة مرور جديدة</h1>
        {done ? (
          <p className="mt-5 text-center text-sm font-bold text-brand-600">تم التحديث. يجري تحويلك لتسجيل الدخول…</p>
        ) : !ready ? (
          <p className="mt-5 text-center text-sm text-ink-soft">
            افتح هذه الصفحة من رابط البريد لإتمام إعادة التعيين.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            <input type="password" placeholder="كلمة المرور الجديدة" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-ink-line px-4 py-3 outline-none focus:border-brand-400" />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button onClick={submit} disabled={busy} className="btn-primary w-full disabled:opacity-60">
              {busy ? "جارٍ الحفظ…" : "تحديث كلمة المرور"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
