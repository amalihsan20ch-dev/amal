"use client";
// Floating WhatsApp + social quick-access. Set the real numbers/links here.
const WHATSAPP = "963999999999"; // ← ضع رقم الجمعية بصيغة دولية بلا +
const FACEBOOK = "https://facebook.com/";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-3">
      <a
        href={`https://wa.me/${WHATSAPP}`}
        target="_blank" rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-soft transition hover:scale-105 focus-visible:ring-4 focus-visible:ring-green-200"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.599 5.342l-.999 3.648 3.9-1.689z"/></svg>
      </a>
      <a
        href={FACEBOOK}
        target="_blank" rel="noopener noreferrer"
        aria-label="صفحتنا على فيسبوك"
        className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-soft transition hover:scale-105 focus-visible:ring-4 focus-visible:ring-brand-200"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/></svg>
      </a>
    </div>
  );
}
