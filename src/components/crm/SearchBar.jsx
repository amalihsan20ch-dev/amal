// Plain GET form — server-rendered, zero client JS. Preserves extra params
// (e.g. current status filter) via hidden inputs.
export default function SearchBar({ placeholder = "بحث…", action, hidden = {}, defaultValue = "" }) {
  return (
    <form action={action} method="get" className="flex gap-2">
      {Object.entries(hidden).map(([k, v]) =>
        v ? <input key={k} type="hidden" name={k} value={v} /> : null
      )}
      <input name="q" defaultValue={defaultValue} placeholder={placeholder}
        className="w-44 rounded-xl border border-ink-line px-4 py-2 text-sm outline-none focus:border-brand-400 sm:w-56" />
      <button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">بحث</button>
    </form>
  );
}
