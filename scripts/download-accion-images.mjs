/**
 * Downloads packshot-style Unsplash images for Accion products.
 * Prioritizes featured/bestseller/sale products, then fills remaining budget.
 *
 * Usage: node scripts/download-accion-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public", "products");
const PRODUCTS_FILE = path.join(ROOT, "data", "products.ts");

function loadEnv() {
  if (process.env.UNSPLASH_ACCESS_KEY) return;
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^UNSPLASH_ACCESS_KEY=(.+)$/);
    if (m) process.env.UNSPLASH_ACCESS_KEY = m[1].trim();
  }
}

const CATEGORY_QUERIES = {
  office: [
    "office supplies white background",
    "stapler product white background",
    "notebook product photography",
    "ballpoint pens product",
    "binder folders office",
    "desk organizer white background",
  ],
  janitorial: [
    "cleaning spray bottle white background",
    "disinfectant wipes canister",
    "hand sanitizer bottle product",
    "soap dispenser product",
    "trash bag roll product",
    "paper towels commercial",
  ],
  technology: [
    "computer mouse white background",
    "keyboard product photography",
    "usb hub white background",
    "webcam product white background",
    "office headset product",
    "power strip product",
  ],
  furniture: [
    "office chair white background",
    "office desk product",
    "filing cabinet white background",
    "bookshelf furniture product",
  ],
  food: [
    "coffee bag product white background",
    "coffee creamers product",
    "paper cups stack product",
    "tea box product photography",
  ],
  industrial: [
    "safety gloves product",
    "hard hat white background",
    "storage tote industrial",
    "utility cart warehouse",
  ],
  lighting: [
    "led light bulb product",
    "desk lamp white background",
    "extension cord product",
    "batteries product photography",
  ],
  paper: [
    "copy paper ream product",
    "tissue box white background",
    "notebook stack product",
    "paper towels roll",
  ],
  bathroom: [
    "toilet paper pack product",
    "hand soap dispenser",
    "bathroom tissue commercial",
    "sanitizer refill bottle",
  ],
  storage: [
    "storage bin white background",
    "plastic tote box product",
    "storage organizer product",
  ],
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseProducts() {
  const content = fs.readFileSync(PRODUCTS_FILE, "utf8");
  const blocks = content.split(/\n  \{/);
  const products = [];
  for (const block of blocks.slice(1)) {
    const slug = block.match(/slug: "([^"]+)"/)?.[1];
    const name = block.match(/name: "([^"]+)"/)?.[1];
    const categorySlug = block.match(/categorySlug: "([^"]+)"/)?.[1];
    const featured = /featured: true/.test(block);
    const bestseller = /bestseller: true/.test(block);
    const sale = /salePrice:/.test(block);
    if (slug && name && categorySlug) {
      products.push({ slug, name, categorySlug, featured, bestseller, sale, block });
    }
  }
  return products;
}

async function searchPhotos(accessKey, query) {
  const params = new URLSearchParams({
    query,
    per_page: "4",
    orientation: "squarish",
    content_filter: "high",
  });
  const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Search failed ${res.status}: ${body}`);
  }
  const data = await res.json();
  return data.results || [];
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function main() {
  loadEnv();
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.error("Missing UNSPLASH_ACCESS_KEY");
    process.exit(1);
  }

  fs.mkdirSync(PUBLIC, { recursive: true });
  const products = parseProducts();

  // Prioritize visible products, cap to stay within demo rate limits
  const prioritized = [
    ...products.filter((p) => p.featured || p.bestseller || p.sale),
    ...products.filter((p) => !p.featured && !p.bestseller && !p.sale),
  ];
  const LIMIT = 60;
  const selected = prioritized.slice(0, LIMIT);

  console.log(`Downloading images for ${selected.length} products...`);

  const queryIndex = {};
  let content = fs.readFileSync(PRODUCTS_FILE, "utf8");
  let success = 0;

  for (const product of selected) {
    const queries = CATEGORY_QUERIES[product.categorySlug] || ["office supplies product"];
    const idx = queryIndex[product.categorySlug] || 0;
    queryIndex[product.categorySlug] = idx + 1;
    const query = queries[idx % queries.length];

    try {
      const photos = await searchPhotos(key, query);
      if (photos.length === 0) {
        console.warn(`No photos for ${product.slug} (${query})`);
        await sleep(1200);
        continue;
      }

      const urls = photos.slice(0, 2).map(
        (p) => `${p.urls.raw}&w=800&h=800&fit=crop&q=80`
      );
      while (urls.length < 2) urls.push(urls[0]);

      for (let i = 0; i < 2; i++) {
        const dest = path.join(PUBLIC, `${product.slug}-${i + 1}.jpg`);
        await download(urls[i], dest);
      }

      // Point product images to jpg
      const svgPattern = new RegExp(
        `images: \\["/products/${product.slug}-1\\.svg", "/products/${product.slug}-2\\.svg"\\]`
      );
      const jpgValue = `images: ["/products/${product.slug}-1.jpg", "/products/${product.slug}-2.jpg"]`;
      if (svgPattern.test(content)) {
        content = content.replace(svgPattern, jpgValue);
      } else {
        // also handle already jpg or alternate quoting
        content = content.replace(
          new RegExp(`images: \\["/products/${product.slug}-1\\.(svg|jpg)", "/products/${product.slug}-2\\.(svg|jpg)"\\]`),
          jpgValue
        );
      }

      success++;
      console.log(`[${success}/${selected.length}] ${product.slug}`);
      await sleep(1200);
    } catch (err) {
      console.error(`Failed ${product.slug}:`, err.message);
      if (String(err.message).includes("403") || String(err.message).includes("429")) {
        console.error("Rate limited — stopping early.");
        break;
      }
      await sleep(2000);
    }
  }

  fs.writeFileSync(PRODUCTS_FILE, content);
  console.log(`Done. Updated ${success} products to JPG packshots.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
