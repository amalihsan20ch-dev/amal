"use client";
import { useTransition } from "react";
import { updateBeneficiaryStatus } from "@/app/(dashboard)/crm/crm-actions";

const STEPS = [
  { value: "pending",  label: "معلّق" },
  { value: "assessed", label: "مُعايَن" },
  { value: "aided",    label: "تمّت المساعدة" },
];

// Segmented control: tap a segment to set that status immediately.
export default function BeneficiaryStatusControl({ id, status }) {
  const [pending, start] = useTransition();

  function set(value) {
    if (value === status || pending) return;
    const fd = new FormData();
    fd.set("id", id);
    fd.set("status", value);
    start(() => updateBeneficiaryStatus(fd));
  }

  return (
    <div className={`inline-flex overflow-hidden rounded-lg border border-ink-line ${pending ? "opacity-60" : ""}`}>
      {STEPS.map((s) => {
        const active = s.value === status;
        return (
          <button
            key={s.value}
            onClick={() => set(s.value)}
            className={`px-2.5 py-1 text-xs font-bold transition ${
              active
                ? s.value === "aided"
                  ? "bg-brand-600 text-white"
                  : s.value === "assessed"
                  ? "bg-brand-200 text-brand-800"
                  : "bg-warm-300/50 text-warm-600"
                : "bg-white text-ink-soft hover:bg-brand-50"
            }`}
          >
            {s.label}
          </button>
        );
      })}
    </div>
  );
}
