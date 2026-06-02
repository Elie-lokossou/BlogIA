"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import AuthorAvatar from "@/components/AuthorAvatar";
import { Article } from "@/lib/types";
import { getCategoryMeta, formatDate } from "@/lib/utils";
import CategoryIcon from "@/components/CategoryIcon";
import { AUTHOR } from "@/lib/site";

interface Props {
  articles: Article[];
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&q=80";

export default function HeroSlider({ articles }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % articles.length), 5000);
    return () => clearInterval(timer);
  }, [articles.length]);

  const article = articles[current];
  if (!article) return null;

  const cat = getCategoryMeta(article.category);
  const img = article.coverImage || PLACEHOLDER;
  const isSiteAuthor = article.author.name === AUTHOR.name;

  return (
    <div className="rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-200 bg-white">
      <div className="relative w-full h-[340px]">
        <Image
          src={img}
          alt={article.title}
          fill
          sizes="(max-width: 1280px) 100vw, 860px"
          className="object-cover"
          priority
        />

        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-black/60 z-[1] pointer-events-none" />

        <div className="absolute top-4 left-4 z-[2] flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
            <CategoryIcon category={article.category} size={12} />
            {cat.label}
          </span>
          {article.featured && (
            <span className="inline-flex items-center bg-orange-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
              À LA UNE
            </span>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-[22px] pb-5 z-[2]">
          <Link href={`/blog/${article.slug}`} className="no-underline">
            <h2 className="text-[22px] font-black text-white leading-snug mb-2 [text-shadow:0_1px_4px_rgba(0,0,0,0.3)]">
              {article.title}
            </h2>
          </Link>
          <p className="text-[13px] text-white/80 leading-normal line-clamp-2 mb-3.5">
            {article.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSiteAuthor ? (
                <AuthorAvatar size="sm" className="!w-7 !h-7 !text-[10px] ring-0 ring-offset-0 shadow-none" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-[10px] font-extrabold">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-white">{article.author.name}</p>
                <p className="text-[10px] text-white/60 flex items-center gap-0.5">
                  <Clock size={9} />
                  {formatDate(article.publishedAt)} · {article.readingTime} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrent((c) => (c - 1 + articles.length) % articles.length)}
                aria-label="Précédent"
                className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer text-white backdrop-blur-sm"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-xs font-bold text-white">
                {current + 1}
                <span className="text-white/50">/{articles.length}</span>
              </span>
              <button
                type="button"
                onClick={() => setCurrent((c) => (c + 1) % articles.length)}
                aria-label="Suivant"
                className="w-8 h-8 rounded-full bg-orange-500 border-none flex items-center justify-center cursor-pointer text-white"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 justify-center py-3 pb-2.5">
        {articles.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            aria-label={`Article ${i + 1}`}
            className={`h-1.5 rounded-sm border-none cursor-pointer p-0 transition-all duration-250 ${
              i === current ? "w-[22px] bg-violet-600" : "w-1.5 bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
