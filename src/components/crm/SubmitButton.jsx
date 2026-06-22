"use client";
import { useFormStatus } from "react-dom";

// Disables itself + shows progress while the server action runs.
export default function SubmitButton({ children, className = "btn-primary w-full" }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:opacity-60`}>
      {pending ? "جارٍ الحفظ…" : children}
    </button>
  );
}
