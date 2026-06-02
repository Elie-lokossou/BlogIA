# /nouvel-article — Créer un article d'actualité

Workflow hybride pour produire un article BlogIA à partir de l'actualité d'un domaine : le script récupère l'actu et scaffolde un brouillon, l'agent finalise la rédaction (storytelling + vérification + diagramme), l'humain valide via Telegram.

## Entrée
Une catégorie (facultatif). Si absente, demander laquelle parmi :
`intelligence-artificielle`, `developpement`, `cybersecurite`, `tech-innovation`, `outils-productivite`.

## Étapes

1. **Récupérer l'actu**
   - `npm run news -- <categorie>`
   - Lire les candidats affichés (titre, date, source). Le cache est aussi écrit dans `scripts/news-cache/`.

2. **Choisir le sujet**
   - Privilégier l'actu la plus récente ET la plus pertinente pour l'audience (dev / pro tech / passionnés d'IA francophones).
   - Éviter les sujets hors périmètre éditorial (les 5 catégories sont la frontière).

3. **Scaffolder le brouillon**
   - `npm run news -- --draft <categorie> <index>`
   - Crée `content/articles/<slug>.json` en `draft: true` avec la source d'origine pré-remplie.

4. **Vérifier les faits**
   - Faire une recherche web pour confirmer les faits clés et réunir **au moins 3 sources fiables** (privilégier sources primaires + presse tech réputée).
   - Mettre à jour le tableau `sources[]` (titre, url, éditeur). Date du jour réelle (nous sommes en 2026).

5. **Rédiger (storytelling)**
   - Suivre `.cursor/rules/content-editorial.mdc` (ton, structure, storytelling, SEO).
   - Optionnel avant publication : `/content_audit-article` (agent Foundary) sur le slug ou le contenu du JSON.
   - Titre 50-60 car. accrocheur ; `excerpt` 140-160 car.
   - Arc narratif : accroche → enjeu → déroulé → exemple/chiffre → chute.
   - **Couverture** : photo Unsplash ciblée (mots-clés précis du sujet).
   - **Corps** : 1 diagramme SVG explicatif (`<figure class="diagram">`) + 1-2 photos `<figure>` + au moins 1 `<table>` ou `callout` si pertinent.
   - `readingTime` ≈ nb mots / 200, `tags` 3-5 pertinents.

6. **Valider via Telegram**
   - `npm run publish <slug>` → l'aperçu + la liste des sources s'affichent dans Telegram.
   - La publication (`draft:false`) ne se fait qu'après le clic ✅. Le script refuse de publier sans `sources[]`.

## Garde-fous
- Pas de publication sans sources vérifiées.
- Pas d'emoji dans l'UI/les composants (autorisés uniquement dans le `content` éditorial si vraiment utile — préférer les icônes/diagrammes).
- Tout le texte visible en français.
- Les articles en `draft: true` ne s'affichent jamais sur le blog.
