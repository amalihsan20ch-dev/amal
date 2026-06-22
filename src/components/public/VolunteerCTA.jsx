import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function VolunteerCTA() {
  return (
    <section className="container-x py-16">
      <div className="relative overflow-hidden rounded-[2rem] bg-brand-700 px-6 py-12 text-center shadow-soft sm:px-12">
        <div className="blob right-0 top-0 h-56 w-56 bg-brand-500/40" />
        <div className="blob bottom-0 left-0 h-56 w-56 bg-warm-600/20" />
        <div className="relative">
          <h2 className="text-3xl font-black text-white sm:text-4xl">يدُك تصنع الفرق</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            انضمّ إلى فريق المتطوّعين وكن جزءًا من الأثر القادم — رعايةً صحية وإغاثةً وتنمية.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/volunteer/register" className="btn-warm">
              <Icon name="hand-heart" size={20} /> سجّل كمتطوّع
            </Link>
            <a href="#impact" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-5 py-3 font-bold text-white transition hover:bg-white/10">
              تصفّح أثرنا
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
