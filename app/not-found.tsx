import Link from "next/link";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";

export const metadata = {
  title: "Page introuvable",
  description: "Cette page n'existe pas sur BlogIA.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      {/* Icône */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto shadow-lg">
          <FileQuestion className="w-12 h-12 text-violet-400" />
        </div>
        <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-orange-500 text-white text-xl font-black flex items-center justify-center shadow-md">
          ?
        </span>
      </div>

      {/* Texte */}
      <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Erreur 404</p>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
        Page introuvable
      </h1>
      <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
        Cette page n&apos;existe pas ou a été déplacée. Voici quelques pistes pour trouver ce que vous cherchez.
      </p>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md hover:shadow-lg"
        >
          <Home className="w-4 h-4" />
          Accueil
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-violet-300 hover:bg-violet-50 text-gray-700 hover:text-violet-700 font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Tous les articles
        </Link>
      </div>

      {/* Catégories rapides */}
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Explorer par catégorie
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categorie/${cat.slug}`}
              className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:border-violet-200 hover:text-violet-700 hover:bg-violet-50 transition-all shadow-sm group"
            >
              <span className="text-violet-500 group-hover:text-violet-700 transition-colors">
                <CategoryIcon category={cat.slug} size={15} />
              </span>
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
