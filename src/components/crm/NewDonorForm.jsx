"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { addDonor } from "@/app/(dashboard)/crm/crm-actions";
import SubmitButton from "./SubmitButton";

export default function NewDonorForm({ onSuccess }) {
  const [state, action] = useFormState(addDonor, { ok: false });
  const formRef = useRef(null);
  useEffect(() => { if (state?.ok) { formRef.current?.reset(); onSuccess?.(); } }, [state, onSuccess]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">اسم المتبرّع *</span>
        <input name="donor_name" required className="inp" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">الهاتف</span>
          <input name="phone" inputMode="tel" className="inp" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">البريد</span>
          <input name="email" type="email" className="inp" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">ملاحظات</span>
        <textarea name="notes" rows={3} className="inp" />
      </label>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>حفظ المتبرّع</SubmitButton>
    </form>
  );
}
