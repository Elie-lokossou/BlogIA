import { getAllArticles } from "@/lib/articles";
import { AUTHOR, SITE, siteUrlForRequest } from "@/lib/site";
import { escapeXml } from "@/lib/utils";

export async function GET(request: Request) {
  const baseUrl = siteUrlForRequest(request);
  const articles = getAllArticles().slice(0, 20);

  const items = articles
    .map((a) => {
      const url = `${baseUrl}/blog/${a.slug}`;
      const pubDate = new Date(a.publishedAt).toUTCString();

      return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>redaction@blogia.fr (${escapeXml(a.author.name)})</author>
      <category>${escapeXml(a.category)}</category>
      ${a.coverImage ? `<enclosure url="${escapeXml(a.coverImage)}" type="image/jpeg" length="0" />` : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.name)} — ${escapeXml(AUTHOR.name)}</title>
    <link>${escapeXml(baseUrl)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>fr-FR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(`${baseUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <image>
      <url>${escapeXml(`${baseUrl}/favicon.ico`)}</url>
      <title>${escapeXml(SITE.name)}</title>
      <link>${escapeXml(baseUrl)}</link>
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
