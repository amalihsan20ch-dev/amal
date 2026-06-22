"use client";
import { useTransition } from "react";
import { getCvUrl } from "@/app/(dashboard)/crm/volunteer-actions";

// Fetches a fresh signed URL on click, then opens the CV in a new tab.
export default function CvButton({ path }) {
  const [pending, start] = useTransition();
  if (!path) return <span className="text-xs text-ink-soft">بلا سيرة</span>;
  function open() {
    start(async () => {
      const { url } = await getCvUrl(path);
      if (url) window.open(url, "_blank", "noopener");
    });
  }
  return (
    <button onClick={open} disabled={pending}
      className="rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-50 disabled:opacity-60">
      {pending ? "..." : "السيرة"}
    </button>
  );
}
