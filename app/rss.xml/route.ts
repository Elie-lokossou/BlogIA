import { getAllArticles } from "@/lib/articles";
import { AUTHOR, SITE } from "@/lib/site";

const BASE_URL = SITE.url;

export async function GET() {
  const articles = getAllArticles().slice(0, 20);

  const items = articles
    .map((a) => {
      const url = `${BASE_URL}/blog/${a.slug}`;
      const pubDate = new Date(a.publishedAt).toUTCString();
      const escaped = (s: string) =>
        s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

      return `
    <item>
      <title>${escaped(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escaped(a.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>redaction@blogia.fr (${escaped(a.author.name)})</author>
      <category>${escaped(a.category)}</category>
      ${a.coverImage ? `<enclosure url="${a.coverImage}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE.name} — ${AUTHOR.name}</title>
    <link>${BASE_URL}</link>
    <description>${SITE.description.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/favicon.ico</url>
      <title>${SITE.name}</title>
      <link>${BASE_URL}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
