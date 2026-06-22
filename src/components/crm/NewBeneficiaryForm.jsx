"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { addBeneficiary } from "@/app/(dashboard)/crm/crm-actions";
import SubmitButton from "./SubmitButton";

export default function NewBeneficiaryForm({ onSuccess }) {
  const [state, action] = useFormState(addBeneficiary, { ok: false });
  const formRef = useRef(null);

  useEffect(() => {
    if (state?.ok) { formRef.current?.reset(); onSuccess?.(); }
  }, [state, onSuccess]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">اسم المستفيد *</span>
        <input name="full_name" required className="inp" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">الاحتياج</span>
        <input name="needs" placeholder="سلة غذائية، دعم طبي…" className="inp" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">نوع الحالة</span>
          <input name="case_type" placeholder="أيتام / صحي…" className="inp" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">المحافظة</span>
          <input name="governorate" className="inp" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">الهاتف</span>
        <input name="phone" inputMode="tel" className="inp" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">ملاحظات</span>
        <textarea name="notes" rows={3} className="inp" />
      </label>

      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>حفظ الحالة</SubmitButton>
    </form>
  );
}
