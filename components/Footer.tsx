import Link from "next/link";
import { ExternalLink, Globe, Heart, Mail } from "lucide-react";
import { CATEGORIES } from "@/lib/types";
import { AUTHOR, SITE } from "@/lib/site";
import CategoryIcon from "@/components/CategoryIcon";
import NewsletterForm from "@/components/NewsletterForm";
import AuthorAvatar from "@/components/AuthorAvatar";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-gray-100">
      <div className="bg-gray-50 py-14 border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AuthorAvatar size="md" />
              <div>
                <p className="text-gray-900 font-bold text-lg leading-tight">{AUTHOR.name}</p>
                <p className="text-gray-600 text-sm">{AUTHOR.bio}</p>
              </div>
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">
              Restez à la pointe{" "}
              <span className="text-violet-600 underline decoration-wavy decoration-orange-400/90">
                de la tech.
              </span>
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Analyses IA, dev et cybersécurité — par {AUTHOR.name}. Newsletter bientôt disponible.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="bg-white py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/"
              className="font-black text-lg text-gray-900 no-underline tracking-tight hover:text-violet-600 transition-colors"
            >
              {SITE.name}
              <span className="text-violet-600">.</span>
            </Link>

            <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
              <Link href="/" className="text-[12px] text-gray-500 no-underline hover:text-violet-600 transition-colors">
                Accueil
              </Link>
              <Link href="/blog" className="text-[12px] text-gray-500 no-underline hover:text-violet-600 transition-colors">
                Articles
              </Link>
              <Link href="/a-propos" className="text-[12px] text-gray-500 no-underline hover:text-violet-600 transition-colors">
                À propos
              </Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorie/${cat.slug}`}
                  className="flex items-center gap-1 text-[12px] text-gray-500 no-underline hover:text-violet-600 transition-colors"
                >
                  <CategoryIcon category={cat.slug} size={11} />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 mt-5 pt-5 flex flex-wrap justify-between items-center gap-3">
            <p className="text-[11px] text-gray-500">
              © {year} {AUTHOR.name} · {SITE.name}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={AUTHOR.linkedin}
                rel="noopener noreferrer"
                target="_blank"
                className="text-[11px] text-gray-500 no-underline hover:text-violet-600 transition-colors inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" aria-hidden />
                LinkedIn
              </a>
              <a
                href={AUTHOR.portfolio}
                rel="noopener noreferrer"
                target="_blank"
                className="text-[11px] text-gray-500 no-underline hover:text-violet-600 transition-colors inline-flex items-center gap-1"
              >
                <Globe className="w-3 h-3" aria-hidden />
                Portfolio
              </a>
              <a
                href={AUTHOR.github}
                rel="noopener noreferrer"
                target="_blank"
                className="text-[11px] text-gray-500 no-underline hover:text-violet-600 transition-colors inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" aria-hidden />
                GitHub
              </a>
              <a
                href={`mailto:${AUTHOR.email}`}
                className="text-[11px] text-gray-500 no-underline hover:text-violet-600 transition-colors inline-flex items-center gap-1"
              >
                <Mail className="w-3 h-3" aria-hidden />
                Email
              </a>
              <p className="text-[11px] text-gray-500 flex items-center gap-1">
                Fait avec
                <Heart className="w-3 h-3 text-orange-400 fill-orange-400/30" aria-hidden />
                pour la tech & l&apos;IA
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
