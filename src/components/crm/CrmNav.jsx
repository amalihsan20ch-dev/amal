"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CrmNav({ superAdmin = false }) {
  const path = usePathname();
  const tabs = [
    { href: "/crm/beneficiaries", label: "المستفيدون" },
    { href: "/crm/donors", label: "المتبرعون" },
    { href: "/crm/volunteers", label: "المتطوّعون" },
    { href: "/crm/achievements", label: "الأعمال" },
    { href: "/crm/tasks", label: "المهام" },
    { href: "/crm/library", label: "المكتبة" },
    { href: "/crm/activity", label: "السجل" },
    ...(superAdmin ? [
      { href: "/crm/metrics", label: "المؤشرات" },
      { href: "/crm/settings", label: "الإعدادات" },
    ] : []),
  ];
  return (
    <nav className="-mx-1 flex max-w-full gap-1 overflow-x-auto rounded-2xl bg-brand-50 p-1">
      {tabs.map((t) => {
        const active = path === t.href || path.startsWith(t.href + "/");
        return (
          <Link key={t.href} href={t.href}
            className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-bold transition ${
              active ? "bg-brand-600 text-white shadow-soft" : "text-brand-700 hover:bg-brand-100"}`}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
