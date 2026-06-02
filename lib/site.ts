function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function resolveSiteUrlFromEnv(): string {
  if (process.env.BLOG_URL) {
    return normalizeSiteUrl(process.env.BLOG_URL);
  }
  if (process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL.replace(/^https?:\/\//, "");
    return normalizeSiteUrl(`https://${host}`);
  }
  return "https://blogia.fr";
}

/** Identité éditoriale du site — source unique pour l’UI et les métadonnées. */
export const SITE = {
  name: "BlogIA",
  tagline: "Tech, IA & innovation en français",
  description:
    "Le blog de John Elie LOKOSSOU : intelligence artificielle, développement, cybersécurité et innovations technologiques.",
  url: resolveSiteUrlFromEnv(),
} as const;

/** URL canonique pour une requête HTTP (BLOG_URL > hôte de la requête > env Vercel > défaut). */
export function siteUrlForRequest(request?: Request): string {
  if (process.env.BLOG_URL) {
    return normalizeSiteUrl(process.env.BLOG_URL);
  }
  if (request) {
    const host = request.headers.get("host");
    if (host) {
      const proto = request.headers.get("x-forwarded-proto") ?? "http";
      return normalizeSiteUrl(`${proto}://${host}`);
    }
  }
  return SITE.url;
}

export const AUTHOR = {
  name: "John Elie LOKOSSOU",
  /** Initiales pour avatars et monogramme */
  initials: "JL",
  shortName: "John Elie LOKOSSOU",
  bio: "Créateur de BlogIA · Développement, IA & cybersécurité",
  longBio:
    "Je partage ici mes analyses sur l’IA, le développement web et la tech — avec des sources vérifiées et un regard praticien.",
  email: "contact@blogia.fr",
  linkedin: "https://www.linkedin.com/in/john-elie-lokossou-494931392/",
  portfolio: "https://jel-portfolio.netlify.app/",
  github: "https://github.com/Elie-lokossou",
  githubRepo: "https://github.com/Elie-lokossou/BlogIA",
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
