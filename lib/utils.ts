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

/** Échappe les caractères spéciaux pour insertion sûre dans du XML (texte ou attribut). */
export function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}
