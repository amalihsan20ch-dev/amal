"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createMetric } from "@/app/(dashboard)/crm/metrics-actions";
import SubmitButton from "./SubmitButton";

export default function CreateMetricForm({ onSuccess }) {
  const [state, action] = useFormState(createMetric, { ok: false });
  const ref = useRef(null);
  useEffect(() => { if (state?.ok) { ref.current?.reset(); onSuccess?.(); } }, [state, onSuccess]);

  return (
    <form ref={ref} action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">وصف المؤشر *</span>
        <input name="label_ar" required placeholder="متطوّعون نشطون" className="inp" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">القيمة *</span>
          <input name="value" type="number" min="0" step="any" required className="inp" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">اللاحقة</span>
          <input name="suffix" placeholder="+ ~" className="inp" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">الأيقونة (اختياري)</span>
        <input name="icon" placeholder="users · heart-pulse · gift …" className="inp" />
      </label>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>إضافة المؤشر</SubmitButton>
    </form>
  );
}
