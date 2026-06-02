import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight, Tag, Star, Share2, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";
import { XIcon, LinkedInIcon } from "@/components/SocialIcons";
import { getArticleBySlug, getAllSlugs, getRelatedArticles } from "@/lib/articles";
import { getCategoryMeta, formatDate, generateTableOfContents } from "@/lib/utils";
import { CAT_COLORS } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import ArticleCard from "@/components/ArticleCard";
import ReadingProgress from "@/components/ReadingProgress";
import TableOfContents from "@/components/TableOfContents";
import AuthorAvatar from "@/components/AuthorAvatar";
import { AUTHOR, articleUrl } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [{ url: article.coverImage, width: 1200, height: 630, alt: article.title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

const PLACEHOLDER = "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80";

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const cat = getCategoryMeta(article.category);
  const related = getRelatedArticles(article, 3);
  const color = CAT_COLORS[article.category] ?? "#7c3aed";

  const { toc, modifiedHtml } = generateTableOfContents(article.content);

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-12 items-start max-w-5xl mx-auto">
          {/* Section principale */}
          <div className="w-full min-w-0">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-gray-700 transition-colors">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href={`/categorie/${article.category}`} className="flex items-center gap-1 font-medium transition-colors hover:opacity-80" style={{ color }}>
            <CategoryIcon category={article.category} className="w-3.5 h-3.5" />
            {cat.label}
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color }}>
              <CategoryIcon category={article.category} className="w-3.5 h-3.5" />
              {cat.label}
            </span>
            {article.featured && (
              <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                <Star className="w-3 h-3" />
                À la une
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
            {article.title}
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-6">{article.excerpt}</p>

          {/* Meta barre */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-100">
            {/* Auteur */}
            <div className="flex items-center gap-3">
              {article.author.name === AUTHOR.name ? (
                <AuthorAvatar size="sm" className="w-10 h-10" />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: color }}
                >
                  {article.author.name.charAt(0)}
                </div>
              )}
              <div>
                {article.author.name === AUTHOR.name ? (
                  <Link
                    href="/a-propos"
                    className="text-sm font-semibold text-gray-900 hover:text-violet-600 transition-colors"
                  >
                    {article.author.name}
                  </Link>
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{article.author.name}</p>
                )}
                {article.author.bio && (
                  <p className="text-xs text-gray-400">{article.author.bio}</p>
                )}
              </div>
            </div>

            {/* Infos */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime} min de lecture
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                {article.tags.length} tags
              </span>
            </div>
          </div>
        </header>

        {/* Cover image — plus grande */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-10 bg-gray-100" style={{ height: "clamp(240px, 45vw, 480px)" }}>
          <Image
            src={article.coverImage || PLACEHOLDER}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <article
          className="prose max-w-none prose-violet"
          dangerouslySetInnerHTML={{ __html: modifiedHtml }}
        />

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-gray-100">
            <Tag className="w-4 h-4 text-gray-400" />
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="rounded-full px-3 py-1 text-sm text-gray-600 bg-gray-100 border border-gray-200 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Sources */}
        {article.sources && article.sources.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">
                Sources vérifiées
              </h2>
            </div>
            <ol className="space-y-2">
              {article.sources.map((source, i) => (
                <li key={source.url} className="flex items-baseline gap-2 text-sm">
                  <span className="text-gray-400 font-mono flex-shrink-0">{i + 1}.</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-600 hover:text-violet-800 hover:underline inline-flex items-center gap-1 break-words"
                  >
                    {source.title}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                  {source.publisher && (
                    <span className="text-gray-400">— {source.publisher}</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Share */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600 mr-2">Partager</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl(article.slug))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
            >
              <XIcon className="w-3.5 h-3.5" /> X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl(article.slug))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5" /> LinkedIn
            </a>
          </div>
        </div>

        {/* Auteur card */}
        <div className="mt-10 p-6 rounded-2xl border border-gray-100 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0" style={{ background: color }}>
              {article.author.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Auteur</p>
              <p className="font-bold text-gray-900 text-lg">{article.author.name}</p>
              {article.author.bio && (
                <p className="text-sm text-gray-500 mt-1">{article.author.bio}</p>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Colonne latérale (TOC) */}
      <aside className="hidden lg:block sticky top-24 pt-8">
        <TableOfContents items={toc} />
      </aside>
    </div>

    {/* Related articles */}
      {related.length > 0 && (
        <section className="mt-16 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Articles similaires</h2>
            <Link href="/blog" className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((rel) => (
              <ArticleCard key={rel.slug} article={rel} />
            ))}
          </div>
        </section>
      )}
      </div>
    </>
  );
}
