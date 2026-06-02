import fs from "fs";
import path from "path";
import { Article, Category } from "./types";
import { calculateReadingTime } from "./utils";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

function parseArticle(raw: string): Article {
  const a = JSON.parse(raw) as Article;
  // Calcul automatique du temps de lecture si absent ou 0
  if (!a.readingTime || a.readingTime === 0) {
    a.readingTime = calculateReadingTime(a.content);
  }
  return a;
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"));

  const articles = files
    .map((file) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf-8");
      return parseArticle(raw);
    })
    .filter((a) => !a.draft)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  const articles = getAllArticles();
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: Category): Article[] {
  return getAllArticles().filter((a) => a.category === category);
}

export function getArticlesByTag(tag: string): Article[] {
  return getAllArticles().filter((a) =>
    a.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getFeaturedArticles(limit = 3): Article[] {
  const all = getAllArticles();
  const featured = all.filter((a) => a.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  const rest = all.filter((a) => !a.featured);
  return [...featured, ...rest].slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter(
      (a) =>
        a.slug !== article.slug &&
        (a.category === article.category ||
          a.tags.some((t) => article.tags.includes(t)))
    )
    .slice(0, limit);
}

export function getAllSlugs(): string[] {
  return getAllArticles().map((a) => a.slug);
}

export function getAllTagSlugs(): string[] {
  const tags = new Set<string>();
  for (const a of getAllArticles()) {
    for (const t of a.tags) tags.add(t);
  }
  return [...tags];
}

