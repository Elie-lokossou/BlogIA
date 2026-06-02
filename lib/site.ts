/** Identité éditoriale du site — source unique pour l’UI et les métadonnées. */
export const SITE = {
  name: "BlogIA",
  tagline: "Tech, IA & innovation en français",
  description:
    "Le blog de John Elie LOKOSSOU : intelligence artificielle, développement, cybersécurité et innovations technologiques.",
  url: (process.env.BLOG_URL ?? "https://blogia.fr").replace(/\/$/, ""),
} as const;

export const AUTHOR = {
  name: "John Elie LOKOSSOU",
  /** Initiales pour avatars et monogramme */
  initials: "JL",
  shortName: "John Elie LOKOSSOU",
  bio: "Créateur de BlogIA · Développement, IA & cybersécurité",
  longBio:
    "Je partage ici mes analyses sur l’IA, le développement web et la tech — avec des sources vérifiées et un regard praticien.",
  email: "contact@blogia.fr",
} as const;

/** Auteur par défaut pour les nouveaux articles JSON */
export const DEFAULT_ARTICLE_AUTHOR = {
  name: AUTHOR.name,
  bio: AUTHOR.bio,
} as const;

/** URL canonique d’un article publié. */
export function articleUrl(slug: string): string {
  return `${SITE.url}/blog/${slug}`;
}

/** URL absolue pour partage (chemin relatif ou absolu sans domaine). */
export function shareUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${normalized}`;
}
