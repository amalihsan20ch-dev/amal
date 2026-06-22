"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/ui/Icon";

const fade = (d = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: d },
});

export default function Hero({ teasers = [] }) {
  return (
    <section className="relative overflow-hidden">
      <div className="blob right-[-6rem] top-[-4rem] h-72 w-72 bg-brand-200/50" />
      <div className="blob left-[-5rem] top-24 h-72 w-72 bg-warm-300/30" />

      <div className="container-x relative grid items-center gap-12 py-14 sm:py-20 lg:grid-cols-2">
        <motion.div {...fade(0)} className="text-center lg:text-right">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-bold text-brand-700">
            <Icon name="pin" size={16} /> جبلة وريفها · 8 محافظات سورية
          </span>
          <h1 className="mt-4 text-4xl font-black leading-[1.15] text-brand-700 sm:text-5xl lg:text-6xl">
            نمدّ يدَ العون
            <br />
            <span className="gradient-text">حيث تشتدّ الحاجة</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0">
            جمعية إنسانية تطوعية تقدّم الإغاثة والرعاية الصحية والاجتماعية، وتبادر للاستجابة
            للكوارث منذ لحظاتها الأولى — بنموذج تطوّعي يوصل الموارد لمستحقّيها.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link href="/volunteer/register" className="btn-primary">
              <Icon name="hand-heart" size={20} /> انضمّ كمتطوّع
            </Link>
            <a href="#impact" className="btn-ghost">
              <Icon name="trending-up" size={20} /> تعرّف على أثرنا
            </a>
          </div>

          {teasers.length ? (
            <div className="mt-9 grid max-w-md grid-cols-3 gap-3">
              {teasers.map((t) => (
                <div key={t.key} className="rounded-2xl border border-brand-100 bg-white/70 p-3 backdrop-blur">
                  <p className="text-2xl font-extrabold text-brand-600">
                    {Number(t.value).toLocaleString("ar-EG")}{t.suffix}
                  </p>
                  <p className="text-xs font-medium text-ink-soft">{t.label_ar}</p>
                </div>
              ))}
            </div>
          ) : null}
        </motion.div>

        <motion.div {...fade(0.15)} className="relative mx-auto w-60 sm:w-80 lg:w-96">
          <div className="absolute inset-0 -z-10 rounded-full bg-brand-200/40 blur-2xl" />
          <Image
            src="/logo.png" alt="شعار جمعية الأمل والإحسان الخيرية"
            width={520} height={520} priority className="h-auto w-full drop-shadow-soft"
          />
        </motion.div>
      </div>
    </section>
  );
}
