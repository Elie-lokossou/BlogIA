"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";

export default function Navbar() {
  const pathname = usePathname();
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinkStyle = (path: string): React.CSSProperties => ({
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    color: isActive(path) ? "#7c3aed" : "#374151",
    textDecoration: "none",
    background: isActive(path) ? "#ede9fe" : "transparent",
    transition: "all .15s",
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-[0_1px_8px_0_rgba(0,0,0,0.06)]">
      {/* Top accent stripe */}
      <div className="h-[3px] bg-gradient-to-r from-violet-600 via-purple-400 to-orange-400" />

      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex items-center h-14 gap-8">

          {/* ── LEFT NAV (desktop) ── */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" style={navLinkStyle("/")}
              onMouseEnter={(e) => { if (!isActive("/")) { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; } }}
              onMouseLeave={(e) => { if (!isActive("/")) { (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
            >
              Accueil
            </Link>

            {/* Categories dropdown */}
            <div className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer border-none bg-transparent"
              >
                Catégories
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200"
                  style={{ transform: catOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {catOpen && (
                <>
                  <div onClick={() => setCatOpen(false)} className="fixed inset-0 z-40" />
                  <div className="absolute top-[calc(100%+8px)] left-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl min-w-[260px] overflow-hidden py-1.5">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categorie/${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition-colors group"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50 text-violet-600 group-hover:bg-violet-100 flex-shrink-0 transition-colors">
                          <CategoryIcon category={cat.slug} size={15} />
                        </span>
                        <div>
                          <div className="font-semibold text-gray-800 text-[13px] group-hover:text-violet-700">{cat.label}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{cat.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link href="/blog" style={navLinkStyle("/blog")}
              onMouseEnter={(e) => { if (!isActive("/blog")) { (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; } }}
              onMouseLeave={(e) => { if (!isActive("/blog")) { (e.currentTarget as HTMLElement).style.background = "transparent"; } }}
            >
              Articles
            </Link>
          </nav>

          {/* ── CENTER LOGO ── */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 no-underline">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-500 flex items-center justify-center text-white font-black text-sm shadow-[0_2px_8px_rgba(124,58,237,0.3)]">
              B
            </div>
            <span className="font-black text-xl text-gray-900 tracking-tight">
              BlogIA<span className="text-violet-600">.</span>
            </span>
          </Link>

          {/* ── RIGHT ── */}
          <div className="ml-auto flex items-center gap-2">
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer border-none text-gray-600"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile nav ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 pb-4 pt-3">
          <div className="flex flex-col gap-1">
            {[
              { label: "Accueil", href: "/" },
              { label: "Articles", href: "/blog" },
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
            <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Catégories</p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categorie/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 no-underline hover:bg-violet-50 hover:text-violet-700 transition-colors"
              >
                <span className="text-violet-600"><CategoryIcon category={cat.slug} size={15} /></span>
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
