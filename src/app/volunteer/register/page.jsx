"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const SKILLS = ["إغاثة ميدانية", "رعاية صحية", "تعليم", "تصوير", "لوجستيات", "إدخال بيانات"];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", phone: "", city: "", availability: "",
  });
  const [skills, setSkills] = useState([]);
  const [cv, setCv] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (s) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  async function submit() {
    setBusy(true); setError("");
    const supabase = createClient();

    // 1) create the auth user (trigger creates the profile row)
    const { data: auth, error: signErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.full_name } },
    });
    if (signErr || !auth.user) { setError("تعذّر إنشاء الحساب. قد يكون البريد مستخدمًا."); setBusy(false); return; }

    // 2) optional CV upload to the private 'cvs' bucket
    let cv_url = null;
    if (cv) {
      const path = `${auth.user.id}/${Date.now()}-${cv.name}`;
      const { error: upErr } = await supabase.storage.from("cvs").upload(path, cv);
      if (!upErr) cv_url = path;
    }

    // 3) create the volunteer application
    const { error: insErr } = await supabase.from("volunteers").insert({
      profile_id: auth.user.id,
      skills, availability: form.availability, city: form.city, cv_url,
    });
    if (insErr) { setError("تعذّر حفظ بيانات التطوّع."); setBusy(false); return; }

    router.replace("/dashboard/volunteer");
    router.refresh();
  }

  return (
    <main className="container-x max-w-lg py-10">
      <h1 className="text-2xl font-extrabold text-brand-700">التسجيل كمتطوّع</h1>
      <p className="mt-1 text-ink-soft">انضمّ إلى فريق الميدان. تُراجَع الطلبات من المنسّقين.</p>

      <div className="mt-6 space-y-4 rounded-2xl border border-ink-line bg-white p-6 shadow-card">
        <Field label="الاسم الكامل"><input className="inp" value={form.full_name} onChange={set("full_name")} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="البريد الإلكتروني"><input type="email" className="inp" value={form.email} onChange={set("email")} /></Field>
          <Field label="كلمة المرور"><input type="password" className="inp" value={form.password} onChange={set("password")} /></Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="رقم الهاتف"><input className="inp" value={form.phone} onChange={set("phone")} /></Field>
          <Field label="المدينة"><input className="inp" value={form.city} onChange={set("city")} /></Field>
        </div>

        <div>
          <p className="mb-2 text-sm font-bold text-ink-soft">المهارات</p>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((s) => (
              <button key={s} type="button" onClick={() => toggle(s)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  skills.includes(s) ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <Field label="الإتاحة (مثال: عطلة نهاية الأسبوع، مساءً)">
          <input className="inp" value={form.availability} onChange={set("availability")} />
        </Field>

        <div>
          <p className="mb-2 text-sm font-bold text-ink-soft">السيرة الذاتية (PDF، اختياري)</p>
          <input type="file" accept="application/pdf" onChange={(e) => setCv(e.target.files?.[0] || null)}
            className="block w-full text-sm text-ink-soft file:ml-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:font-bold file:text-brand-700" />
        </div>

        {error ? <p className="text-sm text-warm-600">{error}</p> : null}
        <button onClick={submit} disabled={busy} className="btn-primary w-full disabled:opacity-60">
          {busy ? "جارٍ الإرسال…" : "إرسال الطلب"}
        </button>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
