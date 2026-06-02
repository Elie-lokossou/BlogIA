import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import AuthorAvatar from "@/components/AuthorAvatar";
import { Article, CAT_COLORS, DEFAULT_COVER } from "@/lib/types";
import { getCategoryMeta, formatDate } from "@/lib/utils";
import CategoryIcon from "@/components/CategoryIcon";
import { AUTHOR } from "@/lib/site";

interface Props {
  article: Article;
  variant?: "default" | "compact";
}

export default function ArticleCard({ article, variant = "default" }: Props) {
  const cat = getCategoryMeta(article.category);
  const color = CAT_COLORS[article.category] ?? "#7c3aed";
  const img = article.coverImage ?? DEFAULT_COVER[article.category] ?? "";
  const isSiteAuthor = article.author.name === AUTHOR.name;

  const authorBlock = (
    <div className="flex items-center gap-1.5">
      {isSiteAuthor ? (
        <AuthorAvatar size="sm" className="!w-[22px] !h-[22px] !text-[10px] ring-0 ring-offset-0 shadow-none" />
      ) : (
        <div
          className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[10px] font-extrabold"
          style={{ backgroundColor: color }}
        >
          {article.author.name.charAt(0)}
        </div>
      )}
      <span className="text-[11px] text-white/90 font-medium">{article.author.name}</span>
    </div>
  );

  if (variant === "compact") {
    return (
      <Link href={`/blog/${article.slug}`} className="flex gap-2.5 no-underline">
        <div className="w-16 h-[52px] rounded-[10px] shrink-0 relative overflow-hidden bg-gray-100">
          <Image src={img} alt={article.title} fill sizes="64px" className="object-cover rounded-[10px]" />
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="block text-[10px] font-bold uppercase tracking-wider mb-0.5"
            style={{ color }}
          >
            {cat.label}
          </span>
          <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">
            {article.title}
          </p>
          <p className="flex items-center gap-0.5 text-[10px] text-gray-400 mt-0.5">
            <Clock size={9} /> {article.readingTime} min
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="block no-underline bg-white rounded-2xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.07)] border border-gray-100"
    >
      <div className="relative w-full h-[190px] bg-gray-100">
        <Image
          src={img}
          alt={article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-[40%] bg-black/50 pointer-events-none" />

        <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-[1]">
          <span
            className="inline-flex items-center gap-1 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ backgroundColor: color }}
          >
            <CategoryIcon category={article.category} size={11} />
            {cat.label}
          </span>
          {article.featured && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              UNE
            </span>
          )}
        </div>

        <div className="absolute bottom-2.5 left-3 z-[1]">{authorBlock}</div>
      </div>

      <div className="px-4 pt-3.5 pb-4">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {article.excerpt}
        </p>
        <div className="flex items-center pt-2.5 border-t border-gray-50">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <Clock size={11} /> {article.readingTime} min · {formatDate(article.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
