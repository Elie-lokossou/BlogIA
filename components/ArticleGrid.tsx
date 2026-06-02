"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Article, CATEGORIES } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import ArticleCard from "./ArticleCard";

interface Props {
  articles: Article[];
}

const CAT_COLORS: Record<string, string> = {
  "intelligence-artificielle": "#7c3aed",
  "developpement": "#2563eb",
  "cybersecurite": "#dc2626",
  "tech-innovation": "#ea580c",
  "outils-productivite": "#16a34a",
};

export default function ArticleGrid({ articles }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = articles.filter((a) => {
    const matchesCat = activeCategory === "all" || a.category === activeCategory;
    const matchesSearch =
      search === "" ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          onClick={() => setActiveCategory("all")}
          className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-all duration-150 ${
            activeCategory === "all"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
          }`}
        >
          Tous
        </button>

        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.slug;
          const color = CAT_COLORS[cat.slug];
          return (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-all duration-150 ${
                active ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={active ? { background: color } : {}}
            >
              <CategoryIcon category={cat.slug} size={12} />
              {cat.label}
            </button>
          );
        })}

        {/* Search */}
        <div className="ml-auto flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 bg-white focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-[13px] outline-none w-28 sm:w-36 text-gray-800 bg-transparent placeholder-gray-400 border-none"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search size={32} className="mx-auto mb-3 opacity-35" />
          <p className="text-sm">Aucun article trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
