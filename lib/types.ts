export type Category =
  | "intelligence-artificielle"
  | "developpement"
  | "cybersecurite"
  | "tech-innovation"
  | "outils-productivite";

export interface CategoryMeta {
  slug: Category;
  label: string;
  description: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: "intelligence-artificielle",
    label: "Intelligence Artificielle",
    description: "LLMs, agents IA, recherche et applications concrètes",
    color: "violet",
  },
  {
    slug: "developpement",
    label: "Développement",
    description: "Web, mobile, bonnes pratiques et architectures modernes",
    color: "blue",
  },
  {
    slug: "cybersecurite",
    label: "Cybersécurité",
    description: "Menaces, outils de défense et bonnes pratiques",
    color: "red",
  },
  {
    slug: "tech-innovation",
    label: "Tech & Innovation",
    description: "Startups, tendances et disruptions technologiques",
    color: "orange",
  },
  {
    slug: "outils-productivite",
    label: "Outils & Productivité",
    description: "Apps, automatisations et workflows efficaces",
    color: "green",
  },
];

export interface ArticleAuthor {
  name: string;
  avatar?: string;
  bio?: string;
}

export interface ArticleSource {
  title: string;
  url: string;
  publisher?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: Category;
  tags: string[];
  author: ArticleAuthor;
  publishedAt: string;
  updatedAt?: string;
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  content: string;
  sources?: ArticleSource[];
  featured?: boolean;
  draft?: boolean;
}

/** Couleurs primaires par catégorie (hex) */
export const CAT_COLORS: Record<Category, string> = {
  "intelligence-artificielle": "#7c3aed",
  "developpement": "#2563eb",
  "cybersecurite": "#dc2626",
  "tech-innovation": "#ea580c",
  "outils-productivite": "#16a34a",
};

/** Couleurs de fond claires par catégorie (hex) */
export const CAT_BG: Record<Category, string> = {
  "intelligence-artificielle": "#f3f0ff",
  "developpement": "#eff6ff",
  "cybersecurite": "#fef2f2",
  "tech-innovation": "#fff7ed",
  "outils-productivite": "#f0fdf4",
};

/** Images de couverture par défaut par catégorie */
export const DEFAULT_COVER: Record<Category, string> = {
  "intelligence-artificielle": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=75",
  "developpement": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75",
  "cybersecurite": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=75",
  "tech-innovation": "https://images.unsplash.com/photo-1559526324-593bc073d938?w=600&q=75",
  "outils-productivite": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=75",
};
