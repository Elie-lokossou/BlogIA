#!/usr/bin/env node
/**
 * Script de publication BlogIA avec confirmation Telegram.
 *
 * Usage :
 *   npm run publish                  → liste les articles en draft
 *   npm run publish mon-article-slug → demande confirmation via Telegram
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { setDefaultResultOrder } from "node:dns";

// Évite la tentative IPv6 (ENETUNREACH) qui ralentit/échoue les appels Telegram.
setDefaultResultOrder("ipv4first");

// ─── Chargement .env.local ────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env.local");

if (fs.existsSync(ENV_PATH)) {
  const lines = readFileSync(ENV_PATH, "utf-8").split("\n");
  for (const line of lines) {
    const match = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if (match) process.env[match[1]] = match[2].trim();
  }
}

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BLOG_URL = (process.env.BLOG_URL ?? "http://localhost:3000").replace(/\/$/, "");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");

if (!BOT_TOKEN || !CHAT_ID) {
  console.error("❌  TELEGRAM_BOT_TOKEN et TELEGRAM_CHAT_ID requis dans .env.local");
  process.exit(1);
}

// ─── Helpers API Telegram ─────────────────────────────────────────────────────
// Réseau Telegram parfois lent/instable : on force un timeout généreux + retries.
async function telegramCall(method, body, { retries = 3, timeoutMs = 20000 } = {}) {
  let lastErr;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });
      return res.json();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        console.log(`   ⚠️  Tentative ${attempt}/${retries} échouée (réseau), nouvel essai…`);
      }
    }
  }
  throw lastErr;
}

async function sendMessage(text, extra = {}) {
  return telegramCall("sendMessage", { chat_id: CHAT_ID, text, parse_mode: "Markdown", ...extra });
}

async function answerCallback(callbackQueryId, text) {
  return telegramCall("answerCallbackQuery", { callback_query_id: callbackQueryId, text });
}

/** Poll getUpdates jusqu'à trouver un callback_query ou dépasser le timeout. */
async function waitForCallback(slug, timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  let offset = 0;

  while (Date.now() < deadline) {
    const data = await telegramCall("getUpdates", {
      timeout: 10,
      offset,
      allowed_updates: ["callback_query"],
    });

    if (data.result?.length) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        const cb = update.callback_query;
        if (!cb) continue;

        await answerCallback(cb.id, "");

        if (cb.data === `confirm_${slug}`) return "confirm";
        if (cb.data === `cancel_${slug}`) return "cancel";
      }
    }
  }
  return "timeout";
}

// ─── Lecture des articles ─────────────────────────────────────────────────────
function readArticle(slug) {
  const file = path.join(ARTICLES_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function getDraftArticles() {
  if (!fs.existsSync(ARTICLES_DIR)) return [];
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(ARTICLES_DIR, f), "utf-8")))
    .filter((a) => a.draft === true);
}

function publishArticle(slug) {
  const file = path.join(ARTICLES_DIR, `${slug}.json`);
  const article = JSON.parse(fs.readFileSync(file, "utf-8"));
  article.draft = false;
  article.publishedAt = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(article, null, 2) + "\n");
  return article;
}

// ─── Emojis par catégorie ─────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
  "intelligence-artificielle": "🤖",
  developpement: "💻",
  cybersecurite: "🔐",
  "tech-innovation": "🚀",
  "outils-productivite": "🛠️",
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const slug = process.argv[2];

if (!slug) {
  // Mode liste : affiche les articles en draft
  const drafts = getDraftArticles();
  if (!drafts.length) {
    console.log("✅  Aucun article en draft.");
    process.exit(0);
  }
  console.log(`📋  ${drafts.length} article(s) en draft :\n`);
  for (const a of drafts) {
    console.log(`  • ${a.slug}  —  ${a.title}`);
  }
  console.log('\nLancer : npm run publish <slug>');
  process.exit(0);
}

// Mode publication
const article = readArticle(slug);

if (!article) {
  console.error(`❌  Article introuvable : ${slug}`);
  process.exit(1);
}

if (!article.draft) {
  console.log(`ℹ️  L'article "${article.title}" est déjà publié.`);
  process.exit(0);
}

// Garde-fou : un article ne peut être publié sans sources fiables vérifiées.
const sources = Array.isArray(article.sources) ? article.sources : [];
if (sources.length === 0) {
  console.error(`❌  Publication refusée : l'article "${article.title}" n'a aucune source.`);
  console.error('    Ajoute un tableau "sources": [{ "title": "...", "url": "https://..." }] dans le JSON.');
  process.exit(1);
}

const emoji = CATEGORY_EMOJI[article.category] ?? "📝";
const sourcesList = sources
  .map((s, i) => `${i + 1}. [${s.title}](${s.url})${s.publisher ? ` — ${s.publisher}` : ""}`)
  .join("\n");
const preview =
  `${emoji} *Prêt à publier*\n\n` +
  `*${article.title}*\n\n` +
  `📂 Catégorie : ${article.category}\n` +
  `⏱ Lecture : ${article.readingTime} min\n\n` +
  `_${article.excerpt}_\n\n` +
  `🔎 *Sources (${sources.length})* — à vérifier :\n${sourcesList}\n\n` +
  `Confirmes-tu la publication ?`;

console.log(`📨  Envoi de la demande de confirmation à Telegram...`);

const sent = await sendMessage(preview, {
  disable_web_page_preview: true,
  reply_markup: {
    inline_keyboard: [
      [
        { text: "✅ Publier", callback_data: `confirm_${slug}` },
        { text: "❌ Annuler", callback_data: `cancel_${slug}` },
      ],
    ],
  },
});

if (!sent.ok) {
  console.error("❌  Échec de l'envoi Telegram :", sent.description);
  process.exit(1);
}

console.log("⏳  En attente de ta réponse sur Telegram (90 secondes)...");

const result = await waitForCallback(slug, 90_000);

if (result === "confirm") {
  const published = publishArticle(slug);
  const articleUrl = `${BLOG_URL}/blog/${published.slug}`;
  const notification =
    `${emoji} *${published.title}*\n\n` +
    `${published.excerpt}\n\n` +
    `Lire l'article → ${articleUrl}`;
  await sendMessage(notification);
  console.log(`✅  Article publié : ${slug}`);
  console.log(`🔗  ${articleUrl}`);
} else if (result === "cancel") {
  await sendMessage(`❌ Publication annulée pour :\n*${article.title}*`);
  console.log("❌  Publication annulée.");
} else {
  await sendMessage(`⏰ Délai dépassé. L'article *${article.title}* reste en draft.`);
  console.log("⏰  Timeout — article laissé en draft.");
}
