"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { logDonation } from "@/app/(dashboard)/crm/crm-actions";
import SubmitButton from "./SubmitButton";

// donors: [{ id, donor_name }] passed from the server page (serializable).
export default function LogDonationForm({ donors, onSuccess }) {
  const [state, action] = useFormState(logDonation, { ok: false });
  const formRef = useRef(null);
  useEffect(() => { if (state?.ok) { formRef.current?.reset(); onSuccess?.(); } }, [state, onSuccess]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">المتبرّع *</span>
        <select name="donor_id" required className="inp">
          <option value="">— اختر —</option>
          {donors.map((d) => <option key={d.id} value={d.id}>{d.donor_name}</option>)}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">المبلغ *</span>
          <input name="amount" type="number" min="1" step="any" required className="inp" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">العملة</span>
          <select name="currency" className="inp" defaultValue="SYP">
            <option value="SYP">ل.س</option>
            <option value="USD">$</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">القناة</span>
          <input name="channel" placeholder="نقدًا / تحويل…" className="inp" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">التاريخ</span>
          <input name="occurred_on" type="date" className="inp" />
        </label>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>تسجيل التبرّع</SubmitButton>
    </form>
  );
}
