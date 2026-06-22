"use client";
import { useTransition } from "react";
import { setVolunteerStatus } from "@/app/(dashboard)/crm/volunteer-actions";

export default function VolunteerStatusButtons({ id, name, status }) {
  const [pending, start] = useTransition();
  function set(s) {
    const fd = new FormData();
    fd.set("id", id); fd.set("status", s); fd.set("name", name || "");
    start(() => setVolunteerStatus(fd));
  }
  if (status !== "pending") {
    return (
      <div className="flex items-center gap-2">
        <span className={`text-sm font-bold ${status === "approved" ? "text-brand-600" : "text-ink-soft"}`}>
          {status === "approved" ? "مقبول" : "مرفوض"}
        </span>
        <button onClick={() => set("pending")} disabled={pending}
          className="text-xs text-ink-soft underline hover:text-brand-600">تراجع</button>
      </div>
    );
  }
  return (
    <div className={`flex gap-2 ${pending ? "opacity-60" : ""}`}>
      <button onClick={() => set("approved")} disabled={pending}
        className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white">قبول</button>
      <button onClick={() => set("rejected")} disabled={pending}
        className="rounded-lg border border-ink-line px-3 py-1.5 text-xs font-bold text-ink-soft">رفض</button>
    </div>
  );
}
