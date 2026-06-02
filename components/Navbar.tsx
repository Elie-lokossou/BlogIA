"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { AUTHOR, SITE } from "@/lib/site";
import CategoryIcon from "@/components/CategoryIcon";

export default function Navbar() {
  const pathname = usePathname();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinkClass = (path: string) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-all ${
      isActive(path)
        ? "bg-violet-50 text-violet-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-[0_1px_12px_0_rgba(124,58,237,0.06)]">
      <div className="h-[3px] bg-violet-600" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-[60px] gap-4 md:gap-8">
          <nav className="hidden md:flex items-center gap-0.5">
            <Link href="/" className={navLinkClass("/")}>
              Accueil
            </Link>

            <div className="relative">
              <button
                type="button"
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer border-none bg-transparent"
              >
                Catégories
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                />
              </button>

              {catOpen && (
                <>
                  <div onClick={() => setCatOpen(false)} className="fixed inset-0 z-40" aria-hidden />
                  <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl min-w-[260px] overflow-hidden py-1.5">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categorie/${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors group no-underline"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 text-violet-600 group-hover:bg-violet-100 flex-shrink-0 transition-colors">
                          <CategoryIcon category={cat.slug} size={15} />
                        </span>
                        <div>
                          <div className="font-semibold text-gray-800 text-[13px] group-hover:text-violet-700">
                            {cat.label}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{cat.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link href="/blog" className={navLinkClass("/blog")}>
              Articles
            </Link>
            <Link href="/a-propos" className={navLinkClass("/a-propos")}>
              À propos
            </Link>
          </nav>

          <Link
            href="/"
            className="flex items-center gap-2.5 no-underline md:absolute md:left-1/2 md:-translate-x-1/2 min-w-0"
          >
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_12px_rgba(124,58,237,0.35)] flex-shrink-0">
              {AUTHOR.initials}
            </div>
            <div className="min-w-0 leading-tight">
              <span className="block font-black text-lg text-gray-900 tracking-tight">
                {SITE.name}
                <span className="text-violet-600">.</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-gray-400 truncate max-w-[200px]">
                {AUTHOR.name}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden ml-auto flex items-center justify-center w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border-none text-gray-600"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-3">
          <div className="flex flex-col gap-1">
            {[
              { label: "Accueil", href: "/" },
              { label: "Articles", href: "/blog" },
              { label: "À propos", href: "/a-propos" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive(item.href) ? "bg-violet-50 text-violet-700" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-gray-100 my-2" />
            <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">
              Catégories
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 no-underline hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                <span className="text-violet-600">
                  <CategoryIcon category={cat.slug} size={15} />
                </span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
