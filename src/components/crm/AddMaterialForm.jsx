"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { addMaterial } from "@/app/(dashboard)/crm/library-actions";
import SubmitButton from "./SubmitButton";

export default function AddMaterialForm() {
  const [state, action] = useFormState(addMaterial, { ok: false });
  const ref = useRef(null);
  useEffect(() => { if (state?.ok) ref.current?.reset(); }, [state]);
  return (
    <form ref={ref} action={action} className="card grid gap-3 p-4 sm:grid-cols-[1fr,1fr,auto,auto] sm:items-end">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">العنوان</span>
        <input name="title_ar" required className="inp" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">الرابط</span>
        <input name="url" type="url" required className="inp" placeholder="https://…" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">النوع</span>
        <select name="kind" className="inp"><option value="pdf">PDF</option><option value="video">فيديو</option></select>
      </label>
      <SubmitButton className="btn-primary">إضافة</SubmitButton>
      {state?.error ? <p className="text-sm text-red-600 sm:col-span-4">{state.error}</p> : null}
    </form>
  );
}
