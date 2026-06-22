// Generic, server-renderable table. columns: [{ key, header, align, render }]
// render(row) lets a column draw custom cells (status control, amounts, ...).
export default function DataTable({ columns, rows, empty = "لا توجد سجلات." }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-line bg-white shadow-card">
      <table className="w-full text-right text-sm">
        <thead>
          <tr className="border-b border-ink-line bg-brand-50 text-ink-soft">
            {columns.map((c) => (
              <th key={c.key} className={`px-4 py-3 font-bold ${c.align === "left" ? "text-left" : ""}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-ink-soft">{empty}</td></tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="border-b border-ink-line/70 transition hover:bg-brand-50/60 last:border-0">
                {columns.map((c) => (
                  <td key={c.key} className={`px-4 py-3 ${c.align === "left" ? "text-left" : ""}`}>
                    {c.render ? c.render(row) : row[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
