"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createAchievement } from "@/app/(dashboard)/crm/achievements-actions";
import SubmitButton from "./SubmitButton";

export default function NewAchievementForm({ onSuccess }) {
  const [state, action] = useFormState(createAchievement, { ok: false });
  const ref = useRef(null);
  useEffect(() => { if (state?.ok) { ref.current?.reset(); onSuccess?.(); } }, [state, onSuccess]);

  return (
    <form ref={ref} action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">العنوان *</span>
        <input name="title_ar" required className="inp" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">الملخّص</span>
        <textarea name="summary_ar" rows={3} className="inp" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">التصنيف</span>
          <input name="category" placeholder="إغاثة / صحة / تنمية" className="inp" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">التاريخ</span>
          <input name="happened_on" type="date" className="inp" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">صورة الغلاف</span>
        <input name="cover" type="file" accept="image/*"
          className="block w-full text-sm text-ink-soft file:ml-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:font-bold file:text-brand-700" />
      </label>
      <label className="flex items-center gap-2">
        <input name="published" type="checkbox" defaultChecked className="h-4 w-4" />
        <span className="text-sm font-bold text-ink-soft">نشر مباشرةً على الموقع العام</span>
      </label>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>حفظ العمل</SubmitButton>
    </form>
  );
}
