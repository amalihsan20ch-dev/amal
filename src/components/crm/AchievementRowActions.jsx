"use client";
import { useTransition } from "react";
import { togglePublish, deleteAchievement } from "@/app/(dashboard)/crm/achievements-actions";

export default function AchievementRowActions({ id, published }) {
  const [pending, start] = useTransition();
  function toggle() {
    const fd = new FormData(); fd.set("id", id); fd.set("published", String(!published));
    start(() => togglePublish(fd));
  }
  function remove() {
    if (!confirm("حذف هذا العمل نهائيًا؟")) return;
    const fd = new FormData(); fd.set("id", id);
    start(() => deleteAchievement(fd));
  }
  return (
    <div className={`flex items-center gap-2 ${pending ? "opacity-60" : ""}`}>
      <button onClick={toggle} className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
        published ? "bg-brand-100 text-brand-700" : "border border-ink-line text-ink-soft"}`}>
        {published ? "منشور" : "مخفي"}
      </button>
      <button onClick={remove} className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">✕</button>
    </div>
  );
}
