"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CookingPot, History, Shuffle } from "lucide-react";

const links = [
  { href: "/", label: "ルーレット", icon: Shuffle },
  { href: "/recipes", label: "料理一覧", icon: BookOpen },
  { href: "/history", label: "履歴", icon: History },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="site-header">
      <div className="shell menu">
        <Link href="/" className="brand"><span className="brand-icon"><CookingPot size={21} aria-hidden="true" /></span>今日なにつくる？</Link>
        <nav aria-label="メインナビゲーション">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === href : pathname === href || pathname.startsWith(href + "/");
            return <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={active ? "active" : undefined}><Icon size={16} aria-hidden="true" />{label}</Link>;
          })}
        </nav>
      </div>
    </header>
  );
}