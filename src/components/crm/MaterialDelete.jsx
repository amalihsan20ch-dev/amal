"use client";
import { useTransition } from "react";
import { deleteMaterial } from "@/app/(dashboard)/crm/library-actions";
export default function MaterialDelete({ id }) {
  const [pending, start] = useTransition();
  return (
    <button disabled={pending}
      onClick={() => { if (confirm("حذف المادة؟")) { const fd = new FormData(); fd.set("id", id); start(() => deleteMaterial(fd)); } }}
      className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">حذف</button>
  );
}
