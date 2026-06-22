import Image from "next/image";
import Icon from "@/components/ui/Icon";

export default function SiteFooter() {
  return (
    <footer className="border-t border-brand-100 bg-brand-700 text-brand-100">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={48} height={48} className="rounded-full bg-white" />
            <p className="text-lg font-extrabold text-white">الأمل والإحسان الخيرية</p>
          </div>
          <p className="mt-3 text-sm leading-relaxed">
            جمعية إنسانية تطوعية — الإغاثة والرعاية الصحية والتنمية للفئات الأشدّ حاجة.
          </p>
        </div>

        <div>
          <p className="mb-3 font-bold text-white">روابط</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#about" className="hover:text-white">من نحن</a></li>
            <li><a href="#programs" className="hover:text-white">برامجنا</a></li>
            <li><a href="#impact" className="hover:text-white">أثرنا</a></li>
            <li><a href="/volunteer/register" className="hover:text-white">التطوّع</a></li>
            <li><a href="/contact" className="hover:text-white">تواصل معنا</a></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 font-bold text-white">تواصل</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Icon name="pin" size={16} /> جبلة وريفها، سوريا</li>
            <li className="flex items-center gap-2"><Icon name="shield" size={16} /> مُشهرة بقرار 856 — 4/4/2022</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-100/80">
        جميع الأرقام مجمّعة — لا تُنشر أي بيانات شخصية للمتبرعين أو المستفيدين · © {new Date().getFullYear()}
      </div>
    </footer>
  );
}
