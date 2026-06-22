"use client";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { createTask } from "@/app/(dashboard)/crm/tasks-actions";
import SubmitButton from "./SubmitButton";

export default function NewTaskForm({ volunteers, onSuccess }) {
  const [state, action] = useFormState(createTask, { ok: false });
  const ref = useRef(null);
  useEffect(() => { if (state?.ok) { ref.current?.reset(); onSuccess?.(); } }, [state, onSuccess]);
  return (
    <form ref={ref} action={action} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">عنوان المهمة *</span>
        <input name="title_ar" required className="inp" />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-bold text-ink-soft">التفاصيل</span>
        <textarea name="details_ar" rows={3} className="inp" />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">المُكلَّف</span>
          <select name="assignee_id" className="inp">
            <option value="">— غير محدّد —</option>
            {volunteers.map((v) => <option key={v.id} value={v.id}>{v.full_name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold text-ink-soft">الاستحقاق</span>
          <input name="due_on" type="date" className="inp" />
        </label>
      </div>
      {state?.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <SubmitButton>إنشاء المهمة</SubmitButton>
    </form>
  );
}
