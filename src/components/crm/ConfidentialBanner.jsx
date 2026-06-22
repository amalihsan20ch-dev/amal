// Prominent confidentiality reminder for the donors page. Static, no JS.
export default function ConfidentialBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor"
           strokeWidth="2" className="mt-0.5 shrink-0">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <p className="text-sm font-bold leading-relaxed">
        بيانات سرّية للغاية — أسماء المتبرعين ومبالغهم لا تُشارَك علنًا أو تُصدَّر تحت أي ظرف.
        الاطّلاع مقصورٌ على الطاقم المخوّل.
      </p>
    </div>
  );
}
