import Link from "next/link";
import { FileText } from "lucide-react";
import { getFeaturedArticles, getAllArticles } from "@/lib/articles";
import { CATEGORIES, CAT_COLORS, CAT_BG } from "@/lib/types";
import HeroSlider from "@/components/HeroSlider";
import ArticleGrid from "@/components/ArticleGrid";
import Sidebar from "@/components/Sidebar";
import CategoryIcon from "@/components/CategoryIcon";


export default function HomePage() {
  const featured = getFeaturedArticles(5);
  const all = getAllArticles();
  const mustRead = [...all.filter((a) => a.featured), ...all.filter((a) => !a.featured)].slice(0, 5);
  const latest = all.slice(0, 4);

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6">

      {/* ── HERO ── */}
      <div className="pt-6 pb-8">
        {/* Tagline */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">Le blog Tech & IA en français</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Décryptez l&apos;IA,{" "}
            <span className="text-violet-600">le développement</span>
            <br className="hidden sm:block" /> et les innovations tech.
          </h1>
        </div>

        {featured.length > 0 ? (
          <HeroSlider articles={featured} />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
            <FileText size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Ajoutez vos premiers articles dans <code className="text-violet-600">content/articles/</code></p>
          </div>
        )}
      </div>

      {/* ── CATÉGORIES RAPIDES ── */}
      <div className="mb-9">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="group flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl p-2.5 no-underline shadow-sm hover:shadow-md hover:border-violet-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors"
                style={{ background: CAT_BG[cat.slug], color: CAT_COLORS[cat.slug] }}
              >
                <CategoryIcon category={cat.slug} size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-800 leading-tight group-hover:text-violet-700 transition-colors truncate">{cat.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{cat.description.split(",")[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── GRILLE + SIDEBAR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start mb-16">

        {/* Colonne gauche */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Derniers articles</h2>
            <Link href="/blog" className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors no-underline">
              Voir tout →
            </Link>
          </div>
          <ArticleGrid articles={all} />
        </div>

        {/* Sidebar — sticky uniquement sur lg */}
        <div className="lg:sticky lg:top-[74px]">
          <Sidebar mustRead={mustRead} latest={latest} />
        </div>

      </div>
    </div>
  );
}
