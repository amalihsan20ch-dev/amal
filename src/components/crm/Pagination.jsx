// Simple prev/next pager using query string. basePath keeps existing params.
export default function Pagination({ page, hasNext, makeHref }) {
  if (page <= 1 && !hasNext) return null;
  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <a aria-disabled={page <= 1}
        href={page > 1 ? makeHref(page - 1) : undefined}
        className={`rounded-xl border px-4 py-2 text-sm font-bold ${
          page > 1 ? "border-brand-200 text-brand-700 hover:bg-brand-50" : "pointer-events-none border-ink-line text-ink-line"}`}>
        السابق
      </a>
      <span className="text-sm font-bold text-ink-soft">صفحة {page}</span>
      <a aria-disabled={!hasNext}
        href={hasNext ? makeHref(page + 1) : undefined}
        className={`rounded-xl border px-4 py-2 text-sm font-bold ${
          hasNext ? "border-brand-200 text-brand-700 hover:bg-brand-50" : "pointer-events-none border-ink-line text-ink-line"}`}>
        التالي
      </a>
    </div>
  );
}
