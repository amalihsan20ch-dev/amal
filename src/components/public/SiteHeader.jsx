"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";

const LINKS = [
  { href: "#about", label: "من نحن" },
  { href: "#programs", label: "برامجنا" },
  { href: "#impact", label: "أثرنا" },
  { href: "#work", label: "أعمالنا" },
];

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition ${scrolled ? "glass shadow-card" : "bg-transparent"}`}>
      <div className="container-x flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="" width={40} height={40} className="rounded-full" />
          <span className="font-extrabold text-brand-700">الأمل والإحسان</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}
              className="rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:bg-brand-50 hover:text-brand-700">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/volunteer/register" className="hidden btn-primary !px-4 !py-2 text-sm sm:inline-flex">تطوّع معنا</Link>
          <Link href="/login" className="hidden btn-ghost !px-4 !py-2 text-sm sm:inline-flex">دخول</Link>
          <button onClick={() => setOpen((v) => !v)} aria-label="القائمة"
            className="grid h-10 w-10 place-items-center rounded-xl text-brand-700 hover:bg-brand-50 md:hidden">
            <Icon name={open ? "x" : "menu"} />
          </button>
        </div>
      </div>

      {open ? (
        <div className="glass border-t border-white/60 md:hidden">
          <nav className="container-x flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 font-bold text-ink-soft hover:bg-brand-50">{l.label}</a>
            ))}
            <div className="mt-2 flex gap-2">
              <Link href="/volunteer/register" className="btn-primary flex-1 !py-2.5 text-sm">تطوّع معنا</Link>
              <Link href="/login" className="btn-ghost !py-2.5 text-sm">دخول</Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
