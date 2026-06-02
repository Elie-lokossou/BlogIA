# BlogIA

Blog tech et IA en français — **John Elie LOKOSSOU**. Stack Next.js 16 (App Router), React 19, Tailwind CSS v4. Le contenu éditorial vit dans `content/articles/` (un fichier JSON par article).

## Prérequis

- Node.js 20+
- npm

## Installation

```bash
npm install
cp .env.example .env.local
# Éditer .env.local (voir section Variables ci-dessous)
```

## Développement

```bash
npm run dev
```

Site local : [http://localhost:3000](http://localhost:3000)

## Scripts utiles

| Commande | Rôle |
|----------|------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm run news` | Pipeline RSS → brouillons JSON (`scripts/fetch-news.mjs`) |
| `npm run publish <slug>` | Demande de publication via Telegram (✅/❌) ; refuse si `sources[]` est vide |

## Publication d’un article

1. Créer ou compléter un JSON dans `content/articles/` (`draft: true` tant que non validé).
2. Renseigner au moins deux entrées dans `sources[]` (titres + URLs réelles).
3. Lancer `npm run publish mon-slug` — le bot Telegram (@BlogIA20_bot) envoie une confirmation ; valider avec ✅ pour passer `draft: false`.

## Variables d’environnement

Voir `.env.example` :

- `BLOG_URL` — URL canonique (défaut `https://blogia.fr`)
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — publication interactive
- `GEMINI_API_KEY` — optionnel, scripts d’aide à la rédaction

## Structure

- `app/` — pages App Router (accueil, blog, catégories, tags, SEO)
- `components/` — UI magazine (thème clair `#f5f5f7`)
- `lib/` — articles, types, identité site (`lib/site.ts`)
- `scripts/` — `fetch-news.mjs`, `publish.mjs`

## Agents Cursor (Foundary)

Orchestration éditoriale via les agents dans `.cursor/agents/` (`foundary list`). Workflow type : `/nouvel-article` → `npm run news` → `/content_audit-article` → `npm run publish <slug>`.

## Auteur

**John Elie LOKOSSOU** — créateur de BlogIA · développement, IA et cybersécurité.
