import Link from "next/link";
import { PenLine } from "lucide-react";
import { AUTHOR, SITE } from "@/lib/site";
import AuthorAvatar from "@/components/AuthorAvatar";

export default function AuthorIntro() {
  return (
    <section className="mb-6 rounded-2xl border border-violet-100 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <AuthorAvatar size="lg" />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-600 mb-1">
            {SITE.tagline}
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Par {AUTHOR.name}
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">
            {AUTHOR.longBio}
          </p>
        </div>
        <Link
          href="/a-propos"
          className="inline-flex items-center justify-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold no-underline hover:bg-violet-700 transition-colors shadow-sm"
        >
          <PenLine className="w-4 h-4" />
          À propos
        </Link>
      </div>
    </section>
  );
}
