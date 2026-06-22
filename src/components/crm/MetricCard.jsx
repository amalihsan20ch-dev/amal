"use client";
import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { updateMetric, toggleMetricVisibility, deleteMetric } from "@/app/(dashboard)/crm/metrics-actions";
import SubmitButton from "./SubmitButton";
import Icon from "@/components/ui/Icon";

export default function MetricCard({ metric }) {
  const [editing, setEditing] = useState(false);
  const [state, action] = useFormState(updateMetric, { ok: false });
  const [pending, start] = useTransition();
  useEffect(() => { if (state?.ok) setEditing(false); }, [state]);

  function toggle() {
    const fd = new FormData();
    fd.set("id", metric.id); fd.set("is_public", String(!metric.is_public));
    start(() => toggleMetricVisibility(fd));
  }
  function remove() {
    if (!confirm("حذف هذا المؤشر نهائيًا؟")) return;
    const fd = new FormData(); fd.set("id", metric.id);
    start(() => deleteMetric(fd));
  }

  if (editing) {
    return (
      <form action={action} className="rounded-3xl border-2 border-brand-400 bg-white p-5 shadow-card">
        <input type="hidden" name="id" value={metric.id} />
        <label className="block text-sm font-bold text-ink-soft">الوصف</label>
        <input name="label_ar" defaultValue={metric.label_ar} className="inp mt-1" />
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <label className="block text-sm font-bold text-ink-soft">القيمة</label>
            <input name="value" type="number" min="0" step="any" defaultValue={metric.value} className="inp mt-1" />
          </div>
          <div>
            <label className="block text-sm font-bold text-ink-soft">اللاحقة</label>
            <input name="suffix" defaultValue={metric.suffix || ""} placeholder="+ ~" className="inp mt-1" />
          </div>
        </div>
        {state?.error ? <p className="mt-2 text-sm text-red-600">{state.error}</p> : null}
        <div className="mt-4 flex gap-2">
          <SubmitButton className="btn-primary flex-1 !py-2 text-sm">حفظ</SubmitButton>
          <button type="button" onClick={() => setEditing(false)}
            className="rounded-xl border border-ink-line px-4 py-2 text-sm font-bold text-ink-soft">إلغاء</button>
        </div>
      </form>
    );
  }

  return (
    <div className={`group relative overflow-hidden rounded-3xl border p-5 shadow-card transition hover:shadow-soft ${
      metric.is_public ? "border-brand-100 bg-white" : "border-ink-line bg-brand-50/50"}`}>
      <div className="mb-3 flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-100 text-brand-600">
          <Icon name={metric.icon} size={22} />
        </span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
          metric.is_public ? "bg-brand-100 text-brand-700" : "bg-ink-line text-ink-soft"}`}>
          {metric.is_public ? "ظاهر" : "مخفي"}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tabular-nums text-brand-600">
          {Number(metric.value).toLocaleString("ar-EG")}
        </span>
        {metric.suffix ? <span className="text-lg font-bold text-warm-600">{metric.suffix}</span> : null}
      </div>
      <p className="mt-1 text-sm font-medium leading-snug text-ink-soft">{metric.label_ar}</p>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => setEditing(true)} className="btn-primary flex-1 !py-2 text-sm">تعديل</button>
        <button onClick={toggle} disabled={pending}
          className="rounded-xl border border-ink-line px-3 py-2 text-sm font-bold text-ink-soft hover:bg-brand-50">
          {metric.is_public ? "إخفاء" : "إظهار"}
        </button>
        <button onClick={remove} disabled={pending} aria-label="حذف"
          className="rounded-xl border border-red-200 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50">✕</button>
      </div>
    </div>
  );
}
