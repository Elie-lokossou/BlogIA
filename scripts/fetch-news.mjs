#!/usr/bin/env node
/**
 * Récupération d'actualité par domaine pour BlogIA (pipeline hybride).
 *
 * Le script fait la partie mécanique : récupérer l'actu fraîche via RSS et
 * pré-remplir un brouillon d'article. La rédaction (storytelling, vérification
 * des faits, diagramme) est ensuite finalisée par l'agent, puis validée via
 * Telegram avec `npm run publish <slug>`.
 *
 * Usage :
 *   npm run news                              → candidats récents, toutes catégories
 *   npm run news -- <categorie>               → candidats d'une seule catégorie
 *   npm run news -- --draft <categorie> <i>   → scaffolde un brouillon depuis le candidat #i
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { setDefaultResultOrder } from "node:dns";
import { readFileSync } from "fs";

// Évite la tentative IPv6 (ENETUNREACH) qui ralentit/échoue les requêtes réseau.
setDefaultResultOrder("ipv4first");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const CACHE_DIR = path.join(__dirname, "news-cache");

// ─── Chargement .env.local ────────────────────────────────────────────────────
const ENV_PATH = path.join(ROOT, ".env.local");
if (fs.existsSync(ENV_PATH)) {
  const lines = readFileSync(ENV_PATH, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ─── Catégories valides (alignées sur lib/types.ts) ───────────────────────────
const VALID_CATEGORIES = [
  "intelligence-artificielle",
  "developpement",
  "cybersecurite",
  "tech-innovation",
  "outils-productivite",
];

// ─── Carte de flux RSS par catégorie (sources francophones réputées) ──────────
// Configurable : ajoute/retire des flux selon tes préférences éditoriales.
const FEEDS = {
  "intelligence-artificielle": [
    "https://www.numerama.com/tag/intelligence-artificielle/feed/",
    "https://www.lemondeinformatique.fr/flux-rss/thematique/intelligence-artificielle/rss.xml",
  ],
  developpement: [
    "https://www.lemondeinformatique.fr/flux-rss/thematique/developpement/rss.xml",
    "https://www.journaldunet.com/rss/developpeur.xml",
  ],
  cybersecurite: [
    "https://www.lemagit.fr/rss/Securite.xml",
    "https://www.numerama.com/tag/cybersecurite/feed/",
  ],
  "tech-innovation": [
    "https://www.numerama.com/feed/",
    "https://www.journaldunet.com/rss/",
  ],
  "outils-productivite": [
    "https://www.clubic.com/feed/news.rss",
    "https://www.journaldunet.com/rss/",
  ],
};

const MAX_AGE_DAYS = 14;
const MAX_PER_CATEGORY = 8;

// ─── Réseau robuste (timeout + retries) + décodage charset ────────────────────
function decodeBuffer(buffer, contentType) {
  // Beaucoup de flux FR sont en ISO-8859-1 / windows-1252, pas en UTF-8.
  const bytes = new Uint8Array(buffer);
  const head = new TextDecoder("latin1").decode(bytes.slice(0, 200)).toLowerCase();
  let charset = "utf-8";
  const ctMatch = (contentType || "").match(/charset=([^;\s]+)/i);
  const xmlMatch = head.match(/encoding=["']([^"']+)["']/i);
  const declared = (ctMatch?.[1] || xmlMatch?.[1] || "").toLowerCase();
  if (declared.includes("8859") || declared.includes("1252") || declared.includes("latin")) {
    charset = "windows-1252";
  } else if (declared.includes("utf-8") || declared === "") {
    charset = "utf-8";
  } else {
    charset = declared;
  }
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

async function fetchText(url, { retries = 3, timeoutMs = 15000 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "BlogIA-news/1.0 (+https://blogia.fr)" },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = await res.arrayBuffer();
      return decodeBuffer(buffer, res.headers.get("content-type"));
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

// ─── Parsing RSS/Atom léger (sans dépendance) ─────────────────────────────────
function decodeEntities(str) {
  return (str || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .trim();
}

function pickTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeEntities(m[1]) : "";
}

function pickLink(block) {
  // RSS : <link>url</link> ; Atom : <link href="url" />
  const rss = block.match(/<link>([\s\S]*?)<\/link>/i);
  if (rss && rss[1].trim()) return decodeEntities(rss[1]);
  const atom = block.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/i);
  return atom ? atom[1].trim() : "";
}

function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<(item|entry)[\s\S]*?<\/(item|entry)>/gi) || [];
  for (const block of blocks) {
    const title = pickTag(block, "title");
    const link = pickLink(block);
    const rawDate =
      pickTag(block, "pubDate") ||
      pickTag(block, "dc:date") ||
      pickTag(block, "published") ||
      pickTag(block, "updated") ||
      pickTag(block, "date");
    const summary = pickTag(block, "description") || pickTag(block, "summary");
    if (!title || !link) continue;
    const date = rawDate ? new Date(rawDate) : null;
    items.push({
      title,
      link,
      publishedAt: date && !isNaN(date.getTime()) ? date.toISOString() : null,
      summary: summary.slice(0, 280),
    });
  }
  return items;
}

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// ─── Récupération des candidats d'une catégorie ───────────────────────────────
async function getCandidates(category) {
  const feeds = FEEDS[category] ?? [];
  const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
  const all = [];

  for (const feed of feeds) {
    try {
      const xml = await fetchText(feed);
      const items = parseFeed(xml).map((it) => ({ ...it, source: hostnameOf(feed) || hostnameOf(it.link) }));
      all.push(...items);
    } catch (err) {
      console.warn(`   ⚠️  Flux indisponible (${hostnameOf(feed)}) : ${err.message}`);
    }
  }

  // Récents d'abord ; on garde les items sans date mais en fin de liste.
  const recent = all
    .filter((it) => !it.publishedAt || new Date(it.publishedAt).getTime() >= cutoff)
    .sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return tb - ta;
    });

  // Déduplication par titre.
  const seen = new Set();
  const deduped = [];
  for (const it of recent) {
    const key = it.title.toLowerCase().slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(it);
  }

  return deduped.slice(0, MAX_PER_CATEGORY);
}

function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function saveCache(payload) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const file = path.join(CACHE_DIR, `candidates-${today}.json`);
  fs.writeFileSync(file, JSON.stringify(payload, null, 2) + "\n");
  return file;
}

// ─── Appel API Gemini ─────────────────────────────────────────────────────────
async function generateArticleContent(item, category) {
  console.log(`\n🤖 Demande de rédaction à l'IA Gemini en cours... (patientez)`);
  const prompt = `Tu es un rédacteur tech expert pour BlogIA, un blog francophone de référence.
Rédige un article complet et structuré au format HTML (uniquement le contenu à l'intérieur de <body>).
Sujet : ${item.title}
Résumé source : ${item.summary || "Aucun"}
Catégorie : ${category}

L'article doit :
- Être informatif, professionnel et aller à l'essentiel.
- Utiliser des balises <h2>, <h3>, <p>, <ul>, <strong>.
- Inclure une introduction accrocheuse (sans titre "Introduction").
- Faire environ 300 à 450 mots.
- Ne pas rajouter d'images ou de balises <figure>.
- NE PAS répondre avec autre chose que du JSON.

Réponds UNIQUEMENT par un objet JSON valide avec deux propriétés :
- "excerpt": un résumé accrocheur de 140 à 160 caractères (en texte brut).
- "content": le contenu HTML de l'article complet.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, response_mime_type: "application/json" }
      })
    });
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Erreur API Inconnue");
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Réponse vide de l'IA");
    
    return JSON.parse(text);
  } catch (err) {
    console.error("❌ Échec de la génération IA :", err.message);
    return null;
  }
}

// ─── Scaffolding d'un brouillon d'article ─────────────────────────────────────
async function scaffoldDraft(category, item, useAI = false) {
  const slug = slugify(item.title) || `actu-${category}-${Date.now()}`;
  const file = path.join(ARTICLES_DIR, `${slug}.json`);
  if (fs.existsSync(file)) {
    console.error(`❌  Un article existe déjà : ${slug}.json`);
    process.exit(1);
  }

  let excerpt = "À COMPLÉTER — résumé actionnable de 140-160 caractères.";
  let content = "<h2>À COMPLÉTER</h2><p>Rédiger l'article en suivant la ligne éditoriale et le storytelling. Vérifier les faits via recherche web et ajouter des sources fiables.</p>";

  if (useAI && GEMINI_API_KEY) {
    const aiResult = await generateArticleContent(item, category);
    if (aiResult) {
      excerpt = aiResult.excerpt || excerpt;
      content = aiResult.content || content;
    }
  }

  const article = {
    id: slug,
    title: item.title,
    slug,
    category,
    tags: [],
    author: { name: "John Elie LOKOSSOU", bio: "Créateur de BlogIA · Développement, IA & cybersécurité" },
    publishedAt: new Date().toISOString(),
    coverImage: "", // Laisser vide pour utiliser DEFAULT_COVER de type.ts
    readingTime: 0, // Sera auto-calculé
    featured: false,
    draft: true,
    excerpt,
    content,
    sources: [
      {
        title: item.title,
        url: item.link,
        publisher: item.source,
      },
    ],
  };

  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(article, null, 2) + "\n");
  return { slug, file, aiUsed: useAI && !!GEMINI_API_KEY };
}

// ─── Affichage ────────────────────────────────────────────────────────────────
function printCandidates(category, items) {
  console.log(`\n📰  ${category} — ${items.length} actu(s) récente(s) :`);
  if (items.length === 0) {
    console.log("    (aucune actualité trouvée sur les 14 derniers jours)");
    return;
  }
  items.forEach((it, i) => {
    const date = it.publishedAt ? it.publishedAt.slice(0, 10) : "date ?";
    console.log(`  [${i}] ${date} · ${it.source}`);
    console.log(`      ${it.title}`);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const useAI = args.includes("--write");

if (useAI && !GEMINI_API_KEY) {
  console.warn("⚠️  Option --write ignorée : GEMINI_API_KEY est manquante dans .env.local");
}

if (args.includes("--draft")) {
  const draftIndex = args.indexOf("--draft");
  const category = args[draftIndex + 1];
  const index = Number(args[draftIndex + 2]);
  if (!VALID_CATEGORIES.includes(category) || Number.isNaN(index)) {
    console.error("Usage : npm run news -- --draft <categorie> <index> [--write]");
    console.error(`Catégories : ${VALID_CATEGORIES.join(", ")}`);
    process.exit(1);
  }
  console.log(`🔎  Récupération de l'actu « ${category} »…`);
  const items = await getCandidates(category);
  const item = items[index];
  if (!item) {
    console.error(`❌  Aucun candidat à l'index ${index} (${items.length} disponibles).`);
    process.exit(1);
  }
  const { slug, file, aiUsed } = await scaffoldDraft(category, item, useAI);
  console.log(`\n✅  Brouillon créé : ${path.relative(ROOT, file)}`);
  console.log(`    Sujet : ${item.title}`);
  if (aiUsed) console.log(`    ✨ Contenu rédigé automatiquement par l'IA Gemini !`);
  console.log(`    Source pré-remplie : ${item.link}`);
  console.log(`\n👉  Étapes suivantes :`);
  console.log(`    1. Vérifier la rédaction, le formatage, et la pertinence des tags.`);
  console.log(`    2. npm run publish ${slug}`);
} else {
  // Exclure les flags pour le parsing des cibles
  const targets = args.filter(a => !a.startsWith("--"));
  const target = targets[0];
  const categories = target && VALID_CATEGORIES.includes(target) ? [target] : VALID_CATEGORIES;
  if (target && !VALID_CATEGORIES.includes(target)) {
    console.error(`❌  Catégorie inconnue : ${target}`);
    console.error(`Catégories : ${VALID_CATEGORIES.join(", ")}`);
    process.exit(1);
  }

  const payload = { generatedAt: new Date().toISOString(), categories: {} };
  for (const category of categories) {
    console.log(`🔎  ${category}…`);
    const items = await getCandidates(category);
    payload.categories[category] = items;
    printCandidates(category, items);
  }
  const cacheFile = saveCache(payload);
  console.log(`\n💾  Candidats sauvegardés : ${path.relative(ROOT, cacheFile)}`);
  console.log(`👉  Scaffolder un brouillon : npm run news -- --draft <categorie> <index>`);
}
