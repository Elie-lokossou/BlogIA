import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Rss, ArrowLeft } from "lucide-react";
import { AUTHOR, SITE } from "@/lib/site";
import AuthorAvatar from "@/components/AuthorAvatar";

export const metadata: Metadata = {
  title: "À propos",
  description: `Qui est ${AUTHOR.name} ? ${AUTHOR.longBio}`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-violet-600 no-underline mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l&apos;accueil
      </Link>

      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
        <AuthorAvatar size="lg" className="w-20 h-20 text-xl" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600 mb-2">
            {SITE.name}
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {AUTHOR.name}
          </h1>
          <p className="text-violet-700 font-medium mt-2">{AUTHOR.bio}</p>
        </div>
      </div>

      <div className="prose prose-violet max-w-none">
        <p>{AUTHOR.longBio}</p>
        <p>
          Sur ce blog, chaque article est rédigé avec des <strong>sources vérifiées</strong>,
          validé avant publication, et centré sur l&apos;actualité tech et IA en français.
        </p>
        <h2>Ce que vous y trouverez</h2>
        <ul>
          <li>Analyses IA et LLM (Anthropic, OpenAI, agents…)</li>
          <li>Développement web (Next.js, outils, bonnes pratiques)</li>
          <li>Cybersécurité et automatisation (n8n, workflows)</li>
          <li>Startups et tendances innovation</li>
        </ul>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <a
          href={`mailto:${AUTHOR.email}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 no-underline hover:border-violet-200 hover:text-violet-700 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Me contacter
        </a>
        <Link
          href="/rss.xml"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 no-underline hover:border-violet-200 hover:text-violet-700 transition-colors"
        >
          <Rss className="w-4 h-4" />
          Flux RSS
        </Link>
      </div>
    </div>
  );
}
