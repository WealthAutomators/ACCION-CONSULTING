/**
 * Fetches relevant product/category imagery from the Unsplash API for
 * VALUE PARTNERS LLC and saves them into /public.
 *
 * Only Unsplash API *search* calls count against the hourly rate limit
 * (50/hr on a demo key). Downloading the resulting image bytes from the
 * images.unsplash.com CDN does NOT count, so we do exactly one search per
 * product/category and pull the images we need from each response.
 *
 * Usage:
 *   UNSPLASH_ACCESS_KEY=xxxx node scripts/fetch-unsplash-api.mjs
 *   node scripts/fetch-unsplash-api.mjs <access_key>
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || process.argv[2];
if (!ACCESS_KEY) {
  console.error("Missing Unsplash access key. Pass it as env UNSPLASH_ACCESS_KEY or as the first argument.");
  process.exit(1);
}

/** Hard cap so we never blow past the hourly API budget. */
const MAX_API_CALLS = 48;
let apiCalls = 0;

/** Search query per product slug (visual relevance). */
const PRODUCT_QUERIES = {
  "wireless-earbuds": "wireless earbuds",
  "bluetooth-speaker": "portable bluetooth speaker",
  "smart-power-strip": "power strip surge protector",
  "electric-kettle": "electric glass kettle",
  "air-fryer": "air fryer kitchen",
  "coffee-grinder": "coffee grinder",
  "bath-towel-set": "folded bath towels",
  "shower-caddy-organizer": "bathroom shower organizer",
  "kids-learning-tablet": "child using tablet",
  "stem-robot-kit": "robot toy kit",
  "dog-bed": "dog bed",
  "pet-food-storage": "pet food container",
  "vitamin-c-serum-set": "skincare serum bottle",
  "hair-care-bundle": "hair care shampoo bottles",
  "yoga-mat": "yoga mat",
  "resistance-bands-set": "resistance bands workout",
  "standing-desk-lamp": "desk lamp",
  "ergonomic-mouse-pad": "desk mouse pad",
  "leather-wallet": "leather wallet",
  "sunglasses-classic": "sunglasses",
  "baby-monitor": "baby monitor camera",
  "soft-plush-blanket": "soft baby blanket",
  "building-blocks-set": "colorful building blocks",
  "board-game-family": "board game",
  "foam-roller": "foam roller fitness",
  "essential-oil-diffuser": "essential oil diffuser",
  "gaming-headset": "gaming headset",
  "wireless-gaming-mouse": "gaming mouse",
  "rgb-gaming-keyboard": "mechanical rgb keyboard",
  "controller-charging-dock": "game controller",
};

/** Search query per category slug. */
const CATEGORY_QUERIES = {
  electronics: "consumer electronics gadgets",
  "home-kitchen": "modern kitchen appliances",
  bathroom: "bathroom interior clean",
  "educational-toys": "educational toys children",
  "pet-supplies": "pet supplies accessories",
  beauty: "beauty cosmetics flat lay",
  "sports-outdoors": "fitness sports equipment",
  "office-supplies": "office desk supplies",
  "fashion-accessories": "fashion accessories flat lay",
  "baby-products": "baby products nursery",
  "toys-games": "toys and games",
  "health-wellness": "health wellness products",
  gaming: "gaming setup rgb",
};

function parseProducts() {
  const content = fs.readFileSync(path.join(ROOT, "data", "products.ts"), "utf8");
  const blocks = content.split(/\n  \{/);
  const products = [];
  for (const block of blocks.slice(1)) {
    const slug = block.match(/slug: "([^"]+)"/)?.[1];
    const categorySlug = block.match(/categorySlug: "([^"]+)"/)?.[1];
    if (slug && categorySlug) products.push({ slug, categorySlug });
  }
  return products;
}

async function searchPhotos(query, { orientation = "squarish", perPage = 8 } = {}) {
  if (apiCalls >= MAX_API_CALLS) {
    throw new Error(`API budget (${MAX_API_CALLS}) reached — stopping to respect rate limit`);
  }
  apiCalls++;
  const url =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}` +
    `&per_page=${perPage}&orientation=${orientation}&content_filter=high`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${ACCESS_KEY}`,
      "Accept-Version": "v1",
    },
  });
  const remaining = res.headers.get("x-ratelimit-remaining");
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Unsplash API ${res.status}: ${body.slice(0, 160)}`);
  }
  const data = await res.json();
  return { results: data.results || [], remaining };
}

async function downloadImage(photo, width) {
  const url = `${photo.urls.raw}&fm=jpg&q=85&w=${width}&fit=crop`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`CDN HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("file too small");
  return buf;
}

const usedPhotoIds = new Set();
const usedHashes = new Set();

function pickUnused(results) {
  return results.filter((p) => !usedPhotoIds.has(p.id));
}

async function saveTarget(file, photo, width) {
  const buf = await downloadImage(photo, width);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  if (usedHashes.has(hash)) return false;
  const dest = path.join(PUBLIC, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  usedPhotoIds.add(photo.id);
  usedHashes.add(hash);
  return true;
}

async function main() {
  const onlySlugs = process.env.ONLY_SLUGS
    ? new Set(process.env.ONLY_SLUGS.split(",").map((s) => s.trim()))
    : null;
  const products = parseProducts().filter((p) => !onlySlugs || onlySlugs.has(p.slug));
  let success = 0;
  let failed = 0;

  console.log(`Unsplash API image fetch — budget ${MAX_API_CALLS} searches\n`);

  // 1) Products (highest priority): 1 search each, take 2 unique photos.
  for (const product of products) {
    const query = PRODUCT_QUERIES[product.slug] || product.slug.replace(/-/g, " ");
    try {
      const { results, remaining } = await searchPhotos(query, {
        orientation: "squarish",
        perPage: 8,
      });
      const candidates = pickUnused(results);
      const files = [`products/${product.slug}-1.jpg`, `products/${product.slug}-2.jpg`];
      let idx = 0;
      for (const file of files) {
        let saved = false;
        while (idx < candidates.length && !saved) {
          try {
            saved = await saveTarget(file, candidates[idx], 900);
          } catch (err) {
            console.warn(`  retry ${file}: ${err.message}`);
          }
          idx++;
        }
        if (saved) {
          success++;
          console.log(`✓ ${file} ← "${query}" (api left: ${remaining})`);
        } else {
          failed++;
          console.error(`✗ ${file} — no unique photo from "${query}"`);
        }
      }
    } catch (err) {
      console.error(`✗ product ${product.slug}: ${err.message}`);
      if (err.message.includes("budget")) return finish(success, failed);
      failed += 2;
    }
  }

  if (onlySlugs) return finish(success, failed);

  // 2) Categories: 1 search each, 1 landscape photo.
  for (const [slug, query] of Object.entries(CATEGORY_QUERIES)) {
    try {
      const { results, remaining } = await searchPhotos(query, {
        orientation: "landscape",
        perPage: 6,
      });
      const candidates = pickUnused(results);
      let saved = false;
      let i = 0;
      while (i < candidates.length && !saved) {
        try {
          saved = await saveTarget(`categories/${slug}.jpg`, candidates[i], 900);
        } catch (err) {
          console.warn(`  retry categories/${slug}: ${err.message}`);
        }
        i++;
      }
      if (saved) {
        success++;
        console.log(`✓ categories/${slug}.jpg ← "${query}" (api left: ${remaining})`);
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`✗ category ${slug}: ${err.message}`);
      if (err.message.includes("budget")) return finish(success, failed);
      failed++;
    }
  }

  // 3) Hero + banners (landscape) if budget remains.
  const wide = [
    { file: "hero/hero-1.jpg", query: "modern family living room home interior", width: 1800 },
    { file: "banners/featured.jpg", query: "modern home lifestyle products", width: 1600 },
    { file: "banners/about.jpg", query: "warehouse fulfillment delivery boxes", width: 1600 },
  ];
  for (const t of wide) {
    try {
      const { results, remaining } = await searchPhotos(t.query, {
        orientation: "landscape",
        perPage: 6,
      });
      const candidates = pickUnused(results);
      let saved = false;
      let i = 0;
      while (i < candidates.length && !saved) {
        try {
          saved = await saveTarget(t.file, candidates[i], t.width);
        } catch (err) {
          console.warn(`  retry ${t.file}: ${err.message}`);
        }
        i++;
      }
      if (saved) {
        success++;
        console.log(`✓ ${t.file} ← "${t.query}" (api left: ${remaining})`);
      } else {
        failed++;
      }
    } catch (err) {
      console.error(`✗ ${t.file}: ${err.message}`);
      if (err.message.includes("budget")) return finish(success, failed);
      failed++;
    }
  }

  finish(success, failed);
}

function finish(success, failed) {
  console.log(
    `\nDone: ${success} images saved, ${failed} failed, ${usedPhotoIds.size} unique photos, ${apiCalls} API calls used.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
