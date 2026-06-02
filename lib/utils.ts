import { CATEGORIES, Category, CategoryMeta } from "./types";

/** Calcule le temps de lecture estimé à partir du contenu HTML (~200 mots/min). */
export function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Retourne tous les tags uniques triés par ordre alphabétique. */
export function getAllTags(articles: { tags: string[] }[]): string[] {
  const set = new Set<string>();
  for (const a of articles) for (const t of a.tags) set.add(t);
  return [...set].sort((a, b) => a.localeCompare(b, "fr"));
}

export function getCategoryMeta(slug: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

export function generateTableOfContents(html: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  
  const modifiedHtml = html.replace(/<(h[23])>([\s\S]*?)<\/\1>/gi, (match, tag, textContent) => {
    const plainText = textContent.replace(/<[^>]+>/g, '').trim();
    if (!plainText) return match;

    const id = plainText
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || `heading-${headings.length}`;
      
    const level = tag.toLowerCase() === 'h2' ? 2 : 3;
    headings.push({ id, text: plainText, level });
    
    return `<${tag} id="${id}" class="scroll-mt-24 group"><a href="#${id}" class="absolute -ml-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-violet-600 hidden md:block">#</a>${textContent}</${tag}>`;
  });
  
  return { toc: headings, modifiedHtml };
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function categoryColorClass(color: string): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  const map: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    violet: {
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/20",
      badge: "bg-violet-500/20 text-violet-300",
    },
    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      badge: "bg-blue-500/20 text-blue-300",
    },
    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      badge: "bg-red-500/20 text-red-300",
    },
    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      badge: "bg-orange-500/20 text-orange-300",
    },
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
      badge: "bg-green-500/20 text-green-300",
    },
  };
  return map[color] ?? map.violet;
}
