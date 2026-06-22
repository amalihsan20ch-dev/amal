import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/site";
import Icon from "@/components/ui/Icon";
import SiteHeader from "@/components/public/SiteHeader";
import SiteFooter from "@/components/public/SiteFooter";

export const metadata = { title: "تواصل معنا" };

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-x py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Image src="/logo.png" alt="" width={88} height={88} className="mx-auto" />
          <h1 className="mt-4 text-3xl font-black text-brand-700">تواصل معنا</h1>
          <p className="mt-3 text-ink-soft">يسعدنا تواصلكم للتطوّع أو التبرّع أو الاستفسار.</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer"
            className="card flex items-center gap-3 p-5 transition hover:shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25D366]/15 text-[#1faa52]"><Icon name="phone" /></span>
            <div><p className="font-extrabold text-brand-700">واتساب</p><p className="text-sm text-ink-soft" dir="ltr">+{SITE.whatsapp}</p></div>
          </a>
          <a href={SITE.facebook} target="_blank" rel="noreferrer"
            className="card flex items-center gap-3 p-5 transition hover:shadow-soft">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-600"><Icon name="users" /></span>
            <div><p className="font-extrabold text-brand-700">فيسبوك</p><p className="text-sm text-ink-soft">صفحتنا الرسمية</p></div>
          </a>
          <div className="card flex items-center gap-3 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-600"><Icon name="pin" /></span>
            <div><p className="font-extrabold text-brand-700">الموقع</p><p className="text-sm text-ink-soft">{SITE.city}</p></div>
          </div>
          <div className="card flex items-center gap-3 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-100 text-brand-600"><Icon name="shield" /></span>
            <div><p className="font-extrabold text-brand-700">الترخيص</p><p className="text-sm text-ink-soft">{SITE.decree}</p></div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/volunteer/register" className="btn-primary">انضمّ كمتطوّع</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
