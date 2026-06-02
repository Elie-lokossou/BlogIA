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
- Communicate in French.
- Never store or reuse API tokens or secrets pasted in chat; warn the user to revoke exposed credentials and authenticate via terminal or CLI instead.

## Learned Workspace Facts

- Stack: Next.js 16 (App Router), React 19, Tailwind v4 — not Next 15.
- UI uses a light magazine theme (`#f5f5f7`), not the dark `#0a0a0f` from older project rules.
- Publishing: `npm run publish <slug>` (`scripts/publish.mjs`) sends a Telegram confirmation with ✅/❌ buttons; confirming sets `draft: false`; refuses publish without a non-empty `sources[]`.
- News pipeline: `npm run news` (`scripts/fetch-news.mjs`) scaffolds draft JSON from category RSS feeds.
- The `Article` type has an optional `sources[]` field (`ArticleSource`: `title`, `url`, optional `publisher`), rendered as a "Sources vérifiées" section at the bottom of the article page.
- Telegram credentials (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) live in `.env.local` (gitignored); publish bot is @BlogIA20_bot.
- Images use `next/image` across components; `next.config.ts` sets `images.unoptimized: true` because remote `/_next/image` optimization timed out.
- `package-lock.json` was regenerated on Linux — do not reintroduce a Windows-generated lockfile.
- Foundary only: use slash agents from `.cursor/agents/` only (`foundary list`); never other Cursor subagents/plugins unless the user explicitly asks for a specific tool; orchestration via `/core_team`.
- After clone: `foundary install` (Cursor); `.foundary/` is gitignored (~14 Mo).
- Editorial workflow: `/nouvel-article` command → scripts `npm run news` → `/content_audit-article` → `npm run publish <slug>`.
- Gitignore local-only paths: `.env.local`, `.foundary/`, `.cursor/debug-*.log`, `.cursor/hooks/`.
- Dépôt GitHub : `https://github.com/Elie-lokossou/BlogIA` (John Elie LOKOSSOU) — plus d’org `BOVO-Digital`.
