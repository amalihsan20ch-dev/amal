"use client";
import { useEffect, useState } from "react";

// Lightweight slide-out panel (no animation libs). Trigger + right-anchored
// drawer for RTL. Closes on Escape / backdrop click / after a successful save
// (parent flips `signalClose` via key or we expose onClose).
export default function Drawer({ label, title, children, buttonClass = "btn-primary" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonClass}>{label}</button>

      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-ink/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* panel (anchored to the right for RTL) */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md overflow-y-auto bg-white shadow-soft transition-transform duration-200 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog" aria-modal="true" aria-hidden={!open}
      >
        <header className="flex items-center justify-between border-b border-ink-line p-4">
          <h3 className="text-lg font-extrabold text-brand-700">{title}</h3>
          <button onClick={() => setOpen(false)} aria-label="إغلاق"
            className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-brand-50">
            ✕
          </button>
        </header>
        <div className="p-4">
          {/* Pass a closer to children so a successful save can dismiss. */}
          {typeof children === "function" ? children(() => setOpen(false)) : children}
        </div>
      </aside>
    </>
  );
}
