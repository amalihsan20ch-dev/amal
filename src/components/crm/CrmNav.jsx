"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CrmNav({ superAdmin = false }) {
  const path = usePathname();
  const tabs = [
    { href: "/crm/beneficiaries", label: "المستفيدون" },
    { href: "/crm/donors", label: "المتبرعون" },
    ...(superAdmin ? [{ href: "/crm/metrics", label: "مؤشرات الأثر" }] : []),
  ];
  return (
    <nav className="flex gap-1 rounded-2xl bg-brand-50 p-1">
      {tabs.map((t) => {
        const active = path === t.href;
        return (
          <Link key={t.href} href={t.href}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              active ? "bg-brand-600 text-white shadow-soft" : "text-brand-700 hover:bg-brand-100"
            }`}>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
