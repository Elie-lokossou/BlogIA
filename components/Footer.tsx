import Link from "next/link";
import { CATEGORIES } from "@/lib/types";
import CategoryIcon from "@/components/CategoryIcon";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16">
      {/* Newsletter */}
      <div className="bg-gray-900 py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-sm">
            <h3 className="text-xl font-extrabold text-white mb-2">
              Restez à la pointe{" "}
              <span className="text-violet-400 underline decoration-wavy decoration-orange-400">
                de la tech.
              </span>
            </h3>
            <p className="text-sm text-gray-400">
              Les meilleurs articles IA & développement directement dans votre boîte mail. Pas de spam, désabonnement en un clic.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-[#030712] py-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="font-black text-lg text-white no-underline tracking-tight hover:text-violet-400 transition-colors">
              BlogIA<span className="text-violet-400">.</span>
            </Link>

            <div className="flex flex-wrap gap-x-5 gap-y-2 items-center">
              <Link href="/" className="text-[12px] text-gray-500 no-underline hover:text-gray-300 transition-colors">Accueil</Link>
              <Link href="/blog" className="text-[12px] text-gray-500 no-underline hover:text-gray-300 transition-colors">Articles</Link>
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categorie/${cat.slug}`}
                  className="flex items-center gap-1 text-[12px] text-gray-500 no-underline hover:text-gray-300 transition-colors"
                >
                  <CategoryIcon category={cat.slug} size={11} />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 mt-5 pt-5 flex flex-wrap justify-between items-center gap-3">
            <p className="text-[11px] text-gray-600">© {year} BlogIA. Tous droits réservés.</p>
            <p className="text-[11px] text-gray-600">
              Fait avec passion pour la tech & l&apos;IA 🤍
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
