"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";

function useCountUp(target, { duration = 1400 } = {}) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVal(target); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(node);
    return () => io.disconnect();
  }, [target, duration]);
  return [val, ref];
}

function MetricCard({ metric, index }) {
  const [val, ref] = useCountUp(Number(metric.value));
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      className="group card relative overflow-hidden p-5 text-center transition hover:-translate-y-1 hover:shadow-soft"
    >
      <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
        <Icon name={metric.icon} size={24} />
      </span>
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-3xl font-black tabular-nums text-brand-600 sm:text-4xl">
          {val.toLocaleString("ar-EG")}
        </span>
        {metric.suffix ? <span className="text-lg font-bold text-warm-600">{metric.suffix}</span> : null}
      </div>
      <p className="mt-1 text-sm font-medium leading-snug text-ink-soft">{metric.label_ar}</p>
    </motion.div>
  );
}

export default function ImpactDashboard({ metrics }) {
  return (
    <section id="impact" className="relative overflow-hidden py-16 sm:py-20">
      <div className="blob left-1/2 top-10 h-72 w-72 -translate-x-1/2 bg-brand-100/70" />
      <div className="container-x relative">
        <header className="mb-10 text-center">
          <span className="eyebrow">أثرنا بالأرقام</span>
          <h2 className="h-section mt-2">عطاءٌ يتراكم منذ أكثر من أربع سنوات</h2>
          <p className="mx-auto mt-3 max-w-2xl text-ink-soft">
            أرقامٌ مجمّعة من عملنا الميداني — دون أي بيانات شخصية. الثقة تُبنى بالإنجاز لا بكشف المستفيدين.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {metrics.map((m, i) => <MetricCard key={m.key} metric={m} index={i} />)}
        </div>
      </div>
    </section>
  );
}
