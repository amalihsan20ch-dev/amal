"use client";
import { useTransition } from "react";
import { updateTaskStatus, deleteTask } from "@/app/(dashboard)/crm/tasks-actions";

const STEPS = [
  { v: "todo", l: "قيد الانتظار" },
  { v: "in_progress", l: "جارية" },
  { v: "done", l: "منجزة" },
];

export default function TaskRowActions({ id, status }) {
  const [pending, start] = useTransition();
  function set(v) {
    if (v === status) return;
    const fd = new FormData(); fd.set("id", id); fd.set("status", v);
    start(() => updateTaskStatus(fd));
  }
  function remove() {
    if (!confirm("حذف المهمة؟")) return;
    const fd = new FormData(); fd.set("id", id);
    start(() => deleteTask(fd));
  }
  return (
    <div className={`flex items-center gap-2 ${pending ? "opacity-60" : ""}`}>
      <div className="inline-flex overflow-hidden rounded-lg border border-ink-line">
        {STEPS.map((s) => (
          <button key={s.v} onClick={() => set(s.v)}
            className={`px-2.5 py-1 text-xs font-bold ${
              s.v === status ? (s.v === "done" ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700") : "bg-white text-ink-soft hover:bg-brand-50"}`}>
            {s.l}
          </button>
        ))}
      </div>
      <button onClick={remove} className="rounded-lg border border-red-200 px-2 py-1 text-xs font-bold text-red-500 hover:bg-red-50">✕</button>
    </div>
  );
}
