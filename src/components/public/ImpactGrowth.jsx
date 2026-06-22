"use client";
import { useEffect, useRef, useState } from "react";

// Cumulative surgeries 2023→mid-2026 (real figures from the report).
// Pure SVG so we add zero chart-library weight on budget devices.
const DATA = [
  { year: "2023", v: 90 },
  { year: "2024", v: 185 },
  { year: "2025", v: 237 },
  { year: "2026*", v: 256 },
];

const W = 640, H = 280, PAD = 40;
const max = 260;
const x = (i) => PAD + (i * (W - PAD * 2)) / (DATA.length - 1);
const y = (v) => H - PAD - (v / max) * (H - PAD * 2);

export default function ImpactGrowth() {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const n = ref.current; if (!n) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShow(true); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(n);
    return () => io.disconnect();
  }, []);

  const line = DATA.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.v)}`).join(" ");
  const area = `${line} L${x(DATA.length - 1)},${H - PAD} L${x(0)},${H - PAD} Z`;

  return (
    <section className="container-x py-16 sm:py-20">
      <div className="card overflow-hidden p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="eyebrow">منحنى تصاعدي</span>
            <h2 className="mt-1 text-2xl font-extrabold text-brand-700">العمليات الجراحية التراكمية</h2>
            <p className="text-sm text-ink-soft">إجمالي المنفّذ منذ 2023 حتى منتصف 2026.</p>
          </div>
          <p className="text-4xl font-black text-brand-600">256<span className="text-warm-600">+</span></p>
        </div>

        <div ref={ref} className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[520px]">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#205C90" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#205C90" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 65, 130, 195, 260].map((g) => (
              <g key={g}>
                <line x1={PAD} x2={W - PAD} y1={y(g)} y2={y(g)} stroke="#E2E9EE" strokeWidth="1" />
                <text x={PAD - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#52636E">{g}</text>
              </g>
            ))}
            <path d={area} fill="url(#g)"
              style={{ opacity: show ? 1 : 0, transition: "opacity .8s ease" }} />
            <path d={line} fill="none" stroke="#205C90" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
              style={{
                strokeDasharray: 1000, strokeDashoffset: show ? 0 : 1000,
                transition: "stroke-dashoffset 1.4s ease",
              }} />
            {DATA.map((d, i) => (
              <g key={d.year}>
                <circle cx={x(i)} cy={y(d.v)} r="5" fill="#fff" stroke="#205C90" strokeWidth="3" />
                <text x={x(i)} y={y(d.v) - 14} textAnchor="middle" fontSize="13" fontWeight="800" fill="#285373">{d.v}</text>
                <text x={x(i)} y={H - PAD + 20} textAnchor="middle" fontSize="12" fill="#52636E">{d.year}</text>
              </g>
            ))}
          </svg>
        </div>
        <p className="mt-3 text-xs text-ink-soft">* أرقام 2026 محسوبة حتى منتصف العام، والعمل مستمر.</p>
      </div>
    </section>
  );
}
