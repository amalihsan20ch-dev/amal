"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signIn() {
    setBusy(true); setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError("تعذّر تسجيل الدخول. تحقّق من البريد وكلمة المرور."); setBusy(false); return; }
    router.replace(params.get("next") || "/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-brand-100/50 px-5">
      <div className="w-full max-w-sm rounded-2xl bg-white p-7 shadow-soft">
        <Image src="/logo.png" alt="" width={72} height={72} className="mx-auto mb-4" />
        <h1 className="text-center text-xl font-extrabold text-brand-700">تسجيل الدخول</h1>
        <div className="mt-6 space-y-3">
          <input
            type="email" inputMode="email" placeholder="البريد الإلكتروني"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-ink-line px-4 py-3 outline-none focus:border-brand-400"
          />
          <input
            type="password" placeholder="كلمة المرور"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-ink-line px-4 py-3 outline-none focus:border-brand-400"
          />
          {error ? <p className="text-sm text-warm-600">{error}</p> : null}
          <button onClick={signIn} disabled={busy} className="btn-primary w-full disabled:opacity-60">
            {busy ? "جارٍ الدخول…" : "دخول"}
          </button>
          <p className="text-center text-sm">
            <a href="/forgot-password" className="font-bold text-brand-600">نسيت كلمة المرور؟</a>
          </p>
        </div>
        <p className="mt-5 text-center text-sm text-ink-soft">
          متطوّع جديد؟{" "}
          <a href="/volunteer/register" className="font-bold text-brand-600">سجّل هنا</a>
        </p>
      </div>
    </main>
  );
}
