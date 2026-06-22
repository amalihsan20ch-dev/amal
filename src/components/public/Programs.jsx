import Icon from "@/components/ui/Icon";

const PROGRAMS = [
  { icon: "heart-pulse", title: "الرعاية الصحية",
    desc: "عمليات جراحية بكامل التكاليف، ودعم جرعات علاج السرطان، ومعاينات طبية ميدانية.",
    tag: "256 عملية" },
  { icon: "shield", title: "الإغاثة الطارئة",
    desc: "استجابة فورية للزلازل والحرائق والفيضانات: مأوى وطعام ومياه ومستلزمات أساسية.",
    tag: "زلزال · حرائق · فيضانات" },
  { icon: "utensils", title: "المطبخ الميداني",
    desc: "برنامج قابل للتوسّع يخدم نحو 2,500 عائلة سنويًا بوجبات مطبوخة وجافة في جبلة وريفها.",
    tag: "2,500 عائلة/سنة" },
  { icon: "hand-heart", title: "التمكين والتنمية",
    desc: "تمكين المرأة وسبل العيش، وكفالة عائلات الأيتام شهريًا، وحفر آبار مياه.",
    tag: "تمكين · كفالة · آبار" },
];

export default function Programs() {
  return (
    <section id="programs" className="relative overflow-hidden bg-gradient-to-b from-white to-brand-50/60 py-16 sm:py-20">
      <div className="container-x">
        <header className="mb-10 text-center">
          <span className="eyebrow">ما نقدّمه</span>
          <h2 className="h-section mt-2">برامجنا الأساسية</h2>
        </header>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((p) => (
            <article key={p.title} className="card group p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-white shadow-soft transition group-hover:scale-105">
                <Icon name={p.icon} size={26} />
              </span>
              <h3 className="mt-4 text-lg font-extrabold text-brand-700">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.desc}</p>
              <span className="mt-4 inline-block rounded-full bg-warm-300/30 px-3 py-1 text-xs font-bold text-warm-600">
                {p.tag}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
