import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Article, CAT_COLORS, DEFAULT_COVER } from "@/lib/types";
import { getCategoryMeta } from "@/lib/utils";
import CategoryIcon from "@/components/CategoryIcon";
import ArticleCard from "./ArticleCard";

interface Props {
  mustRead: Article[];
  latest: Article[];
}

const cardClass =
  "bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.05)] p-[18px]";

export default function Sidebar({ mustRead, latest }: Props) {
  return (
    <div className="flex flex-col gap-3.5">
      {mustRead.length > 0 && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-bold text-gray-900 m-0">À lire</h3>
            <Link href="/blog" className="text-[11px] font-semibold text-violet-600 no-underline">
              Voir tout →
            </Link>
          </div>

          {mustRead[0] && (() => {
            const featured = mustRead[0];
            const img = featured.coverImage ?? DEFAULT_COVER[featured.category] ?? "";
            const color = CAT_COLORS[featured.category] ?? "#7c3aed";
            return (
              <Link
                href={`/blog/${featured.slug}`}
                className="block no-underline mb-3.5"
              >
                <div className="relative h-[140px] rounded-xl overflow-hidden bg-gray-100 mb-2.5">
                  <Image
                    src={img}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1280px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[45%] bg-black/50 z-[1] pointer-events-none" />
                  <span
                    className="absolute top-2 left-2 z-[2] inline-flex items-center gap-1 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider"
                    style={{ backgroundColor: color }}
                  >
                    <CategoryIcon category={featured.category} size={9} />
                    {getCategoryMeta(featured.category).label}
                  </span>
                </div>
                <p className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
                  {featured.title}
                </p>
                <p className="text-[11px] text-gray-400 leading-normal line-clamp-2">
                  {featured.excerpt}
                </p>
              </Link>
            );
          })()}

          <div className="flex flex-col gap-2.5">
            {mustRead.slice(1, 4).map((article) => {
              const img = article.coverImage ?? DEFAULT_COVER[article.category] ?? "";
              return (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="flex gap-2.5 no-underline"
                >
                  <div className="w-[52px] h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                    <Image src={img} alt={article.title} fill sizes="52px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2 mb-0.5">
                      {article.title}
                    </p>
                    <p className="flex items-center gap-0.5 text-[10px] text-gray-400">
                      <Clock size={9} /> {article.readingTime} min
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {latest.length > 0 && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 m-0">Derniers articles</h3>
            <Link href="/blog" className="text-[11px] font-semibold text-violet-600 no-underline">
              Voir tout →
            </Link>
          </div>
          <div className="flex flex-col gap-2.5">
            {latest.map((article) => (
              <ArticleCard key={article.slug} article={article} variant="compact" />
            ))}
          </div>
        </div>
      )}

      {latest.length > 0 && (
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900 m-0">Sélection</h3>
            <Link href="/blog" className="text-[11px] font-semibold text-violet-600 no-underline">
              Voir tout →
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-0.5">
            {latest.map((article) => {
              const img = article.coverImage ?? DEFAULT_COVER[article.category] ?? "";
              return (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="shrink-0 w-[100px] no-underline"
                >
                  <div className="w-[100px] h-[70px] rounded-[10px] overflow-hidden bg-gray-100 mb-1.5 relative">
                    <Image src={img} alt={article.title} fill sizes="100px" className="object-cover" />
                  </div>
                  <p className="text-[11px] font-semibold text-gray-900 leading-tight line-clamp-2">
                    {article.title}
                  </p>
                  <p className="flex items-center gap-0.5 text-[10px] text-gray-400 mt-0.5">
                    <Clock size={9} /> {article.readingTime} min
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
