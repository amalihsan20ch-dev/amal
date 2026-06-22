import Icon from "@/components/ui/Icon";

const CHIPS = [
  { icon: "calendar", t: "أكثر من 4 سنوات", s: "عمل ميداني متواصل" },
  { icon: "shield", t: "مُشهرة رسميًا", s: "قرار 856 — 4/4/2022" },
  { icon: "map", t: "8 محافظات", s: "اتّساع نطاق التغطية" },
  { icon: "users", t: "نموذج تطوّعي", s: "وصول أعلى للموارد" },
];

export default function About() {
  return (
    <section id="about" className="container-x py-16 sm:py-20">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <span className="eyebrow">من نحن</span>
          <h2 className="h-section mt-2">إنسانٌ يبادر منذ اللحظة الأولى</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            جمعية الأمل والإحسان الخيرية جمعية إنسانية تطوعية تعمل على تقديم العون والإغاثة
            والرعاية الصحية والاجتماعية للفئات الأشدّ حاجة، وتستجيب للكوارث والأزمات منذ
            لحظاتها الأولى — من الزلازل إلى الحرائق والفيضانات — بمزيجٍ من الإغاثة الطارئة
            والرعاية الصحية وبرامج التنمية المستدامة.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {CHIPS.map((c) => (
            <div key={c.t} className="card p-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-600">
                <Icon name={c.icon} />
              </span>
              <p className="mt-3 font-extrabold text-brand-700">{c.t}</p>
              <p className="text-sm text-ink-soft">{c.s}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
