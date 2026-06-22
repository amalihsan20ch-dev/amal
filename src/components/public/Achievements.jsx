import Image from "next/image";

export default function Achievements({ items }) {
  if (!items?.length) return null;
  return (
    <section id="work" className="bg-gradient-to-b from-brand-50/60 to-white py-16 sm:py-20">
      <div className="container-x">
        <header className="mb-10 text-center">
          <span className="eyebrow">من الميدان</span>
          <h2 className="h-section mt-2">أبرز أعمالنا</h2>
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <article key={a.id} className="card group overflow-hidden transition hover:-translate-y-1 hover:shadow-soft">
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-200 to-brand-100">
                {a.cover_url ? (
                  <Image src={a.cover_url} alt={a.title_ar} fill className="object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="grid h-full place-items-center">
                    <Image src="/logo.png" alt="" width={96} height={96} className="opacity-80" />
                  </div>
                )}
                {a.category ? (
                  <span className="absolute right-3 top-3 rounded-full bg-warm-600 px-3 py-1 text-xs font-bold text-white shadow-soft">
                    {a.category}
                  </span>
                ) : null}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-extrabold text-brand-700">{a.title_ar}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.summary_ar}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
