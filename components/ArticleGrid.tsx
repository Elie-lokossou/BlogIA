"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Article, CATEGORIES, CAT_COLORS } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import ArticleCard from "./ArticleCard";

interface Props {
  articles: Article[];
}

export default function ArticleGrid({ articles }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const cat = searchParams.get("cat") ?? "all";
    const q = searchParams.get("q") ?? "";
    setActiveCategory(cat);
    setSearch(q);
  }, [searchParams]);

  const syncUrl = useCallback(
    (cat: string, q: string) => {
      const params = new URLSearchParams();
      if (cat !== "all") params.set("cat", cat);
      if (q.trim()) params.set("q", q.trim());
      const query = params.toString();
      router.replace(query ? `/?${query}` : "/", { scroll: false });
    },
    [router],
  );

  const setCategory = (cat: string) => {
    setActiveCategory(cat);
    syncUrl(cat, search);
  };

  const setSearchQuery = (q: string) => {
    setSearch(q);
    syncUrl(activeCategory, q);
  };

  const filtered = articles.filter((a) => {
    const matchesCat = activeCategory === "all" || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      q === "" ||
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => setCategory("all")}
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
              type="button"
              onClick={() => setCategory(cat.slug)}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-all duration-150 ${
                active ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={active ? { backgroundColor: color } : undefined}
            >
              <CategoryIcon category={cat.slug} size={12} />
              {cat.label}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 bg-white focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
          <Search size={13} className="text-gray-400 shrink-0" />
          <input
            type="search"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-[13px] outline-none w-28 sm:w-36 text-gray-800 bg-transparent placeholder-gray-400 border-none"
            aria-label="Rechercher des articles"
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
