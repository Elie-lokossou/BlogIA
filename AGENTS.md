<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Each article must be confirmed by the user via Telegram before it is published.
- Article content must be fact-checked and drawn from reliable, verified sources.
- Articles should reflect current news; verify dates and facts against the present year.
- Prefer catchy storytelling and images that actually illustrate the topic.
- The blog must look professional and well-structured, with proper images.
- Avoid decorative CSS gradients; prefer a flat editorial magazine style.
- Communicate in French.
- Never store or reuse API tokens or secrets pasted in chat; warn the user to revoke exposed credentials and authenticate via terminal or CLI instead.

## Learned Workspace Facts

- Stack: Next.js 16 (App Router), React 19, Tailwind v4 — not Next 15.
- UI uses a light magazine theme (`#f5f5f7`), flat editorial style — no decorative gradients.
- Publishing: `npm run publish <slug>` (`scripts/publish.mjs`) sends a Telegram confirmation with ✅/❌ buttons; confirming sets `draft: false`; refuses publish without a non-empty `sources[]`.
- News pipeline: `npm run news` (`scripts/fetch-news.mjs`) scaffolds draft JSON; **Cursor Automations** (lun/mer/ven 8h UTC, prompt `.cursor/automations/news-drafts.md`) opens PRs — GitHub `news.yml` is manual fallback only (`workflow_dispatch`); publish stays local only.
- The `Article` type has an optional `sources[]` field (`ArticleSource`: `title`, `url`, optional `publisher`), rendered as a "Sources vérifiées" section at the bottom of the article page.
- Canonical URLs via `lib/site.ts`: `BLOG_URL` for production (default `https://blogia.fr`); `siteUrlForRequest()` falls back to the request host or `VERCEL_URL` on previews.
- RSS feed at `/rss.xml` with permanent redirect from `/feed.xml`; dynamic fields escaped via `escapeXml()` in `lib/utils.ts`.
- Editorial identity and contact links live in `lib/site.ts` (`AUTHOR`: John Elie LOKOSSOU, LinkedIn, portfolio jel-portfolio.netlify.app, GitHub).
- Telegram credentials (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) live in `.env.local` (gitignored); publish bot is @BlogIA20_bot — never run publish in CI.
- Images use `next/image` across components; `next.config.ts` sets `images.unoptimized: true` because remote `/_next/image` optimization timed out.
- Foundary only: use slash agents from `.cursor/agents/` only (`foundary list`); orchestration via `/core_team`; after clone run `foundary install`.
- Dépôt GitHub : `https://github.com/Elie-lokossou/BlogIA` — CI via `.github/workflows/ci.yml` on push/PR to `main`.
