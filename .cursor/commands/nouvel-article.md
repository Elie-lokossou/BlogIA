# /nouvel-article — Créer un article (agents Foundary uniquement)

Workflow BlogIA : scripts Node + **agents Foundary** (slash commands). Ne pas utiliser d'autres subagents.

## Agents Foundary à utiliser

| Étape | Agent |
|-------|--------|
| Angle éditorial / calendrier (optionnel) | `/content_blog-strategy` |
| Orchestration si plusieurs étapes | `/core_team` |
| Audit avant publication | `/content_audit-article` |
| Titres / excerpt / distribution (optionnel) | `/core_marketer` |

## Étapes (agent principal + scripts)

1. **Actu** — `npm run news -- <categorie>` (pas un agent).
2. **Choix du sujet** — critères éditoriaux (`.cursor/rules/content-editorial.mdc`).
3. **Brouillon** — `npm run news -- --draft <categorie> <index>`.
4. **Vérification** — recherche web, **≥ 3 sources** dans `sources[]`.
5. **Rédaction** — contenu HTML, auteur `John Elie LOKOSSOU` (`lib/site.ts`), storytelling + images illustratives.
6. **Audit** — invoquer **`/content_audit-article`** avec le slug ou le JSON.
7. **Publication** — `npm run publish <slug>` → validation Telegram.

## Règles

- Contenu en français, ton magazine tech (voir `content-editorial.mdc`).
- `draft: true` jusqu'à confirmation Telegram.
- Aucun autre agent que ceux listés dans `.cursor/agents/` (Foundary).
