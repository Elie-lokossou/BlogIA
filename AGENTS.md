<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Learned User Preferences

- Each article must be confirmed by the user via Telegram before it is published.
- Article content must be fact-checked and drawn from reliable, verified sources.
- The blog must look professional and well-structured, with proper images.
- Communicate in French.

## Learned Workspace Facts

- Publishing workflow: `npm run publish <slug>` (`scripts/publish.mjs`) sends a Telegram confirmation message with ✅/❌ buttons; confirming flips the article's `draft` to `false`.
- The publish script refuses to publish any article that lacks a non-empty `sources[]` array.
- The `Article` type has an optional `sources[]` field (`ArticleSource`: `title`, `url`, optional `publisher`), rendered as a "Sources vérifiées" section at the bottom of the article page.
- Telegram bot credentials live in `.env.local` (gitignored, never committed); no credential values belong in the repo.
- Images use `next/image` across components (`ArticleCard`, `HeroSlider`, `Sidebar`) and article covers/inline images, not CSS `backgroundImage`.
- `package-lock.json` was originally generated on Windows, causing `@rollup/rollup-win32-x64-msvc` platform errors on Linux; it was regenerated on Linux — do not reintroduce a Windows-generated lockfile.

## Foundary (StackSmart)

Foundary est installé pour ce projet (éditeur : Cursor). Après un clone : `foundary install` (choisir Cursor) ou `npx @bystacksmart/foundary install` pour recréer `.foundary/design-systems/`.

- Agents projet : `.cursor/agents/` — invoquer avec `/nom-agent` dans Cursor (ex. `/content_audit-article`, `/content_blog-strategy`).
- Design systems : `.foundary/design-systems/` — `foundary add <name>` pour copier un kit (Beacon, Slate, etc.) ; le blog a déjà son UI magazine — ne pas écraser sans demande explicite.
- Règle contexte : `.cursor/rules/foundary.md`.

### Agents utiles pour BlogIA

| Agent | Usage |
|-------|--------|
| `/content_audit-article` | Audit SEO / émotion / conversion d’un article (passer le slug ou le JSON) |
| `/content_blog-strategy` | Stratégie éditoriale, calendrier, SEO blog |
| `/core_marketer` | Titres, excerpts, distribution |
| `/core_devops` | CI/CD, déploiement (prochaine étape GitHub) |
| `/core_git-push` | Push Git sécurisé avec vérifications |
| `/core_update-docs` | Aligner README / règles avec le code |
| `/core_audit-ux` | Revue UX des pages article / homepage |

Workflow article : `/nouvel-article` (commande Cursor) → rédaction → `/content_audit-article` → `npm run publish <slug>`.
