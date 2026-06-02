# BlogIA

Blog tech et IA en français — **John Elie LOKOSSOU**. Stack Next.js 16 (App Router), React 19, Tailwind CSS v4. Le contenu éditorial vit dans `content/articles/` (un fichier JSON par article).

**Dépôt GitHub :** [github.com/Elie-lokossou/BlogIA](https://github.com/Elie-lokossou/BlogIA) · **Profil :** [github.com/Elie-lokossou](https://github.com/Elie-lokossou)

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

## Automatisation

| Mécanisme | Rôle |
|-----------|------|
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | À chaque push/PR sur `main` : `npm ci`, `npm run lint`, `npm run build` (aucun secret requis). |
| [`.github/workflows/news.yml`](.github/workflows/news.yml) | **Secours manuel** uniquement (*Actions → Actualité RSS → Run workflow*) : `npm run news` + PR de brouillons. Le cron GitHub est désactivé pour éviter le doublon avec Cursor. |
| [Cursor Automations](https://cursor.com/automations) | Planification principale (lun/mer/ven 8h UTC) — voir ci-dessous. |

**Publication** : `npm run publish <slug>` reste **uniquement en local** — le bot Telegram exige `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID` (`.env.local`). Ne pas les exposer dans GitHub Actions ni dans Cursor.

### Automatisation Cursor (brouillons RSS)

Environnement Cloud Agent : [`.cursor/environment.json`](.cursor/environment.json) (`npm ci` + `npm run build`). Prompt prêt à l’emploi : [`.cursor/automations/news-drafts.md`](.cursor/automations/news-drafts.md).

1. Ouvrir [cursor.com/automations](https://cursor.com/automations) → **New automation**.
2. **Schedule** : `0 8 * * 1,3,5` (lundi, mercredi, vendredi à 08:00 UTC).
3. **Repository** : `Elie-lokossou/BlogIA` — branche **`main`**.
4. **Tool** : activer **Open pull request** (ou équivalent PR).
5. Coller le bloc **Prompt** depuis [`.cursor/automations/news-drafts.md`](.cursor/automations/news-drafts.md).
6. **Cloud Agent → Secrets** (optionnel) : ajouter `GEMINI_API_KEY` pour la rédaction assistée (`--write` sur `npm run news`). Ne pas y mettre les secrets Telegram.
7. Publier l’automation. La publication d’articles reste **`npm run publish <slug>`** en local après validation Telegram.

## Agents Cursor (Foundary)

Orchestration éditoriale via les agents dans `.cursor/agents/` (`foundary list`). Workflow type : `/nouvel-article` → `npm run news` → `/content_audit-article` → `npm run publish <slug>`.

## Auteur

**John Elie LOKOSSOU** — créateur de BlogIA · développement, IA et cybersécurité · [LinkedIn](https://www.linkedin.com/in/john-elie-lokossou-494931392/) · [Portfolio](https://jel-portfolio.netlify.app/) · [GitHub](https://github.com/Elie-lokossou)

## Migration dépôt (BOVO-Digital → compte personnel)

L’ancien dépôt organisation `BOVO-Digital/BlogIA` est remplacé par le compte personnel **Elie-lokossou**. Deux options :

### Option A — Transférer le dépôt existant

1. Sur [github.com/BOVO-Digital/BlogIA](https://github.com/BOVO-Digital/BlogIA) : **Settings → General → Danger Zone → Transfer ownership**
2. Choisir le compte **Elie-lokossou** et confirmer le transfert (le repo garde l’historique).

### Option B — Nouveau dépôt vide

1. Créer un repo vide **BlogIA** sur [github.com/Elie-lokossou](https://github.com/Elie-lokossou) (sans README si vous poussez un dépôt local déjà peuplé).
2. Mettre à jour le remote local :

```bash
git remote set-url origin https://github.com/Elie-lokossou/BlogIA.git
git remote -v
```

3. Pousser la branche de travail (adapter le nom de branche si besoin) :

```bash
git push -u origin agents/project-analysis-summary
```

4. Ouvrir une PR sur `main` si nécessaire, puis merger.

### Après la migration

- **Vercel** : Project Settings → Git → reconnecter le dépôt `Elie-lokossou/BlogIA`, ou importer le projet depuis le nouveau remote.
- **Variables** : vérifier `BLOG_URL` (URL canonique du site en production, ex. `https://blogia.fr`).
- **Telegram** : `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID` inchangés dans `.env.local` / dashboard Vercel.

> Ne lancez `git remote set-url` qu’après avoir créé ou transféré le dépôt cible, sinon `git push` échouera.
