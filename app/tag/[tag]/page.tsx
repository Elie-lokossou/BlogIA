import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Tag, ChevronRight } from "lucide-react";
import { getArticlesByTag, getAllTagSlugs } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  return getAllTagSlugs().map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded}`,
    description: `Tous les articles tagués « ${decoded} » sur BlogIA.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const articles = getArticlesByTag(decoded);

  if (articles.length === 0) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-700 transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-gray-700 transition-colors">Articles</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-violet-600 font-medium">#{decoded}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Tag className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">#{decoded}</h1>
          <p className="text-gray-500 text-sm">
            {articles.length} article{articles.length > 1 ? "s" : ""} avec ce tag
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
