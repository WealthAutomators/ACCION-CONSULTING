#!/usr/bin/env node
/**
 * Generates ACCION B2B office-supply catalog:
 * - data/products.ts (~280–320 products)
 * - public/products/{slug}-1.svg & {slug}-2.svg packshots
 *
 * Idempotent: re-running overwrites products.ts and regenerates images.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PRODUCTS_TS = path.join(ROOT, "data", "products.ts");
const IMAGES_DIR = path.join(ROOT, "public", "products");

const CATEGORIES = {
  office: { slug: "office", name: "Office", prefix: "OF" },
  janitorial: { slug: "janitorial", name: "Janitorial Supplies & Cleaning", prefix: "JN" },
  technology: { slug: "technology", name: "Technology", prefix: "TC" },
  furniture: { slug: "furniture", name: "Furniture", prefix: "FN" },
  food: { slug: "food", name: "Food", prefix: "FD" },
  industrial: { slug: "industrial", name: "Industrial", prefix: "IN" },
  lighting: { slug: "lighting", name: "Lighting", prefix: "LT" },
  paper: { slug: "paper", name: "Paper", prefix: "PP" },
  bathroom: { slug: "bathroom", name: "Bathroom", prefix: "BA" },
  storage: { slug: "storage", name: "Storage", prefix: "ST" },
};

/** Seeded PRNG for deterministic output across runs */
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260727);

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function money(n) {
  return Math.round(n * 100) / 100;
}

function rating() {
  return money(4.0 + rand() * 0.9);
}

function reviews() {
  return 12 + Math.floor(rand() * 980);
}

function stock() {
  return 15 + Math.floor(rand() * 480);
}

function priceBetween(min, max) {
  return money(min + rand() * (max - min));
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncateLabel(name, max = 42) {
  if (name.length <= max) return name;
  return name.slice(0, max - 1).trimEnd() + "…";
}

// ─── SVG shape library (simple packshot silhouettes) ─────────────────────────

const SHAPES = {
  pen: (c) => `
    <rect x="280" y="80" width="40" height="400" rx="6" fill="${c}" opacity="0.9"/>
    <polygon points="280,480 320,480 300,540" fill="${c}"/>
    <rect x="275" y="70" width="50" height="30" rx="4" fill="#2a6b55"/>`,
  stapler: (c) => `
    <rect x="140" y="280" width="320" height="40" rx="6" fill="#d1d5db"/>
    <rect x="160" y="200" width="280" height="90" rx="10" fill="${c}"/>
    <rect x="180" y="220" width="60" height="50" rx="4" fill="#ffffff" opacity="0.3"/>`,
  scissors: (c) => `
    <circle cx="220" cy="200" r="45" fill="none" stroke="${c}" stroke-width="14"/>
    <circle cx="380" cy="200" r="45" fill="none" stroke="${c}" stroke-width="14"/>
    <line x1="250" y1="230" x2="300" y2="320" stroke="${c}" stroke-width="14" stroke-linecap="round"/>
    <line x1="350" y1="230" x2="300" y2="320" stroke="${c}" stroke-width="14" stroke-linecap="round"/>
    <line x1="300" y1="320" x2="260" y2="480" stroke="${c}" stroke-width="12" stroke-linecap="round"/>
    <line x1="300" y1="320" x2="340" y2="480" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`,
  binder: (c) => `
    <rect x="160" y="100" width="280" height="380" rx="8" fill="${c}"/>
    <rect x="180" y="130" width="240" height="320" fill="#ffffff" opacity="0.85"/>
    <rect x="140" y="160" width="30" height="50" rx="3" fill="#2a6b55"/>
    <rect x="140" y="260" width="30" height="50" rx="3" fill="#2a6b55"/>
    <rect x="140" y="360" width="30" height="50" rx="3" fill="#2a6b55"/>`,
  calendar: (c) => `
    <rect x="140" y="120" width="320" height="360" rx="10" fill="${c}"/>
    <rect x="140" y="120" width="320" height="70" rx="10" fill="#2a6b55"/>
    <circle cx="220" cy="155" r="10" fill="#fff"/>
    <circle cx="380" cy="155" r="10" fill="#fff"/>
    <rect x="170" y="220" width="60" height="50" rx="4" fill="#fff" opacity="0.9"/>
    <rect x="250" y="220" width="60" height="50" rx="4" fill="#fff" opacity="0.5"/>
    <rect x="330" y="220" width="60" height="50" rx="4" fill="#fff" opacity="0.5"/>
    <rect x="170" y="290" width="60" height="50" rx="4" fill="#fff" opacity="0.5"/>
    <rect x="250" y="290" width="60" height="50" rx="4" fill="#fff" opacity="0.9"/>
    <rect x="330" y="290" width="60" height="50" rx="4" fill="#fff" opacity="0.5"/>`,
  folder: (c) => `
    <path d="M120 180 L120 460 L480 460 L480 200 L300 200 L270 160 L120 160 Z" fill="${c}"/>
    <path d="M140 220 L460 220 L460 440 L140 440 Z" fill="#fff" opacity="0.25"/>`,
  paper: (c) => `
    <rect x="180" y="100" width="240" height="320" rx="4" fill="#e5e7eb"/>
    <rect x="195" y="130" width="240" height="320" rx="4" fill="#f3f4f6"/>
    <rect x="210" y="160" width="240" height="320" rx="4" fill="${c}" opacity="0.15"/>
    <rect x="210" y="160" width="240" height="320" rx="4" fill="none" stroke="${c}" stroke-width="3"/>
    <line x1="240" y1="220" x2="420" y2="220" stroke="${c}" stroke-width="4" opacity="0.4"/>
    <line x1="240" y1="260" x2="400" y2="260" stroke="${c}" stroke-width="4" opacity="0.35"/>
    <line x1="240" y1="300" x2="410" y2="300" stroke="${c}" stroke-width="4" opacity="0.3"/>`,
  envelope: (c) => `
    <rect x="100" y="180" width="400" height="260" rx="6" fill="${c}" opacity="0.85"/>
    <polygon points="100,180 300,320 500,180" fill="none" stroke="#fff" stroke-width="8"/>
    <polygon points="100,180 300,300 500,180" fill="#2a6b55" opacity="0.5"/>`,
  marker: (c) => `
    <rect x="270" y="100" width="60" height="320" rx="8" fill="${c}"/>
    <rect x="275" y="80" width="50" height="40" rx="4" fill="#2a6b55"/>
    <rect x="285" y="420" width="30" height="60" rx="2" fill="#374151"/>
    <polygon points="285,480 315,480 300,520" fill="#111827"/>`,
  tape: (c) => `
    <circle cx="300" cy="280" r="140" fill="${c}" opacity="0.9"/>
    <circle cx="300" cy="280" r="70" fill="#fff"/>
    <circle cx="300" cy="280" r="50" fill="#e5e7eb"/>`,
  label: (c) => `
    <rect x="140" y="200" width="320" height="180" rx="12" fill="${c}" opacity="0.2" stroke="${c}" stroke-width="4"/>
    <line x1="180" y1="260" x2="420" y2="260" stroke="${c}" stroke-width="6"/>
    <line x1="180" y1="300" x2="360" y2="300" stroke="${c}" stroke-width="6" opacity="0.5"/>`,
  clipboard: (c) => `
    <rect x="160" y="100" width="280" height="400" rx="10" fill="${c}"/>
    <rect x="180" y="160" width="240" height="300" fill="#fff"/>
    <rect x="250" y="80" width="100" height="50" rx="8" fill="#2a6b55"/>`,
  organizer: (c) => `
    <rect x="120" y="200" width="360" height="240" rx="8" fill="${c}"/>
    <rect x="140" y="160" width="80" height="260" rx="4" fill="#2a6b55"/>
    <rect x="240" y="140" width="80" height="280" rx="4" fill="#2a6b55" opacity="0.8"/>
    <rect x="340" y="180" width="120" height="240" rx="4" fill="#2a6b55" opacity="0.65"/>`,
  canister: (c) => `
    <rect x="200" y="140" width="200" height="320" rx="20" fill="${c}"/>
    <ellipse cx="300" cy="140" rx="100" ry="28" fill="#2a6b55"/>
    <rect x="230" y="220" width="140" height="120" rx="8" fill="#fff" opacity="0.25"/>`,
  spray: (c) => `
    <rect x="250" y="200" width="100" height="260" rx="12" fill="${c}"/>
    <rect x="270" y="140" width="60" height="70" fill="#374151"/>
    <rect x="290" y="100" width="20" height="50" fill="#6b7280"/>
    <path d="M310 130 Q380 120 370 160" fill="none" stroke="#6b7280" stroke-width="10"/>`,
  soap: (c) => `
    <rect x="220" y="180" width="160" height="260" rx="40" fill="${c}"/>
    <rect x="270" y="120" width="60" height="70" rx="8" fill="#2a6b55"/>
    <circle cx="300" cy="280" r="40" fill="#fff" opacity="0.2"/>`,
  gloves: (c) => `
    <path d="M200 200 Q180 160 200 140 Q220 120 240 150 L250 280 L230 420 L280 430 L300 300 L320 430 L370 420 L350 280 L360 150 Q380 120 400 140 Q420 160 400 200 Z" fill="${c}" opacity="0.85"/>`,
  mop: (c) => `
    <rect x="290" y="80" width="20" height="320" fill="#9ca3af"/>
    <ellipse cx="300" cy="420" rx="100" ry="40" fill="${c}"/>
    <rect x="200" y="400" width="200" height="30" rx="4" fill="#2a6b55"/>`,
  bucket: (c) => `
    <path d="M180 200 L200 460 L400 460 L420 200 Z" fill="${c}"/>
    <ellipse cx="300" cy="200" rx="120" ry="30" fill="#2a6b55"/>
    <path d="M180 200 Q300 120 420 200" fill="none" stroke="#9ca3af" stroke-width="10"/>`,
  trashBag: (c) => `
    <rect x="180" y="160" width="40" height="280" rx="6" fill="${c}" opacity="0.3" stroke="${c}" stroke-width="3"/>
    <rect x="240" y="140" width="40" height="300" rx="6" fill="${c}" opacity="0.5" stroke="${c}" stroke-width="3"/>
    <rect x="300" y="120" width="40" height="320" rx="6" fill="${c}" opacity="0.7" stroke="${c}" stroke-width="3"/>
    <rect x="360" y="150" width="40" height="290" rx="6" fill="${c}" opacity="0.4" stroke="${c}" stroke-width="3"/>`,
  trashCan: (c) => `
    <path d="M200 180 L220 460 L380 460 L400 180 Z" fill="${c}"/>
    <rect x="180" y="160" width="240" height="30" rx="6" fill="#2a6b55"/>
    <rect x="270" y="200" width="60" height="20" rx="4" fill="#fff" opacity="0.3"/>`,
  paperTowel: (c) => `
    <rect x="180" y="160" width="240" height="280" rx="8" fill="${c}" opacity="0.3"/>
    <rect x="200" y="140" width="200" height="300" rx="6" fill="#fff" stroke="${c}" stroke-width="4"/>
    <ellipse cx="300" cy="140" rx="100" ry="24" fill="${c}"/>`,
  tissue: (c) => `
    <rect x="160" y="200" width="280" height="220" rx="12" fill="${c}"/>
    <rect x="200" y="160" width="200" height="50" rx="6" fill="#2a6b55"/>
    <path d="M260 160 Q300 100 340 160" fill="#fff" opacity="0.8"/>`,
  mouse: (c) => `
    <ellipse cx="300" cy="280" rx="90" ry="130" fill="${c}"/>
    <line x1="300" y1="180" x2="300" y2="280" stroke="#fff" stroke-width="4" opacity="0.5"/>
    <ellipse cx="300" cy="200" rx="20" ry="12" fill="#2a6b55"/>`,
  keyboard: (c) => `
    <rect x="80" y="220" width="440" height="160" rx="12" fill="${c}"/>
    <g fill="#fff" opacity="0.7">${Array.from({ length: 5 }, (_, r) =>
      Array.from({ length: 12 }, (_, c2) => {
        const x = 100 + c2 * 34;
        const y = 240 + r * 28;
        return `<rect x="${x}" y="${y}" width="28" height="22" rx="3"/>`;
      }).join("")
    ).join("")}</g>`,
  usbHub: (c) => `
    <rect x="160" y="240" width="280" height="100" rx="16" fill="${c}"/>
    <rect x="190" y="265" width="40" height="24" rx="3" fill="#111"/>
    <rect x="250" y="265" width="40" height="24" rx="3" fill="#111"/>
    <rect x="310" y="265" width="40" height="24" rx="3" fill="#111"/>
    <rect x="370" y="265" width="40" height="24" rx="3" fill="#111"/>`,
  monitor: (c) => `
    <rect x="120" y="120" width="360" height="260" rx="10" fill="${c}"/>
    <rect x="140" y="140" width="320" height="220" fill="#111"/>
    <rect x="270" y="380" width="60" height="40" fill="#6b7280"/>
    <rect x="220" y="420" width="160" height="16" rx="4" fill="#9ca3af"/>`,
  webcam: (c) => `
    <circle cx="300" cy="260" r="90" fill="${c}"/>
    <circle cx="300" cy="260" r="50" fill="#111"/>
    <circle cx="300" cy="260" r="20" fill="#374151"/>
    <rect x="260" y="350" width="80" height="30" rx="6" fill="#6b7280"/>`,
  headset: (c) => `
    <path d="M160 280 Q160 140 300 140 Q440 140 440 280" fill="none" stroke="${c}" stroke-width="20"/>
    <rect x="130" y="260" width="50" height="100" rx="12" fill="${c}"/>
    <rect x="420" y="260" width="50" height="100" rx="12" fill="${c}"/>
    <path d="M180 340 Q240 400 300 360" fill="none" stroke="#2a6b55" stroke-width="10"/>`,
  mousePad: (c) => `
    <rect x="100" y="180" width="400" height="260" rx="20" fill="${c}" opacity="0.85"/>
    <circle cx="400" cy="300" r="40" fill="#fff" opacity="0.15"/>`,
  powerStrip: (c) => `
    <rect x="100" y="240" width="400" height="100" rx="16" fill="${c}"/>
    <rect x="140" y="265" width="50" height="30" rx="4" fill="#111"/>
    <rect x="210" y="265" width="50" height="30" rx="4" fill="#111"/>
    <rect x="280" y="265" width="50" height="30" rx="4" fill="#111"/>
    <rect x="350" y="265" width="50" height="30" rx="4" fill="#111"/>
    <rect x="80" y="270" width="30" height="40" fill="#6b7280"/>`,
  printer: (c) => `
    <rect x="140" y="200" width="320" height="180" rx="12" fill="${c}"/>
    <rect x="180" y="140" width="240" height="80" rx="8" fill="#2a6b55"/>
    <rect x="200" y="250" width="200" height="80" fill="#fff" opacity="0.3"/>
    <rect x="220" y="380" width="160" height="20" rx="2" fill="#e5e7eb"/>`,
  chair: (c) => `
    <rect x="180" y="140" width="240" height="160" rx="20" fill="${c}"/>
    <rect x="160" y="300" width="280" height="40" rx="8" fill="#2a6b55"/>
    <line x1="300" y1="340" x2="300" y2="420" stroke="#6b7280" stroke-width="16"/>
    <line x1="220" y1="460" x2="380" y2="460" stroke="#6b7280" stroke-width="12"/>
    <line x1="240" y1="420" x2="220" y2="460" stroke="#6b7280" stroke-width="10"/>
    <line x1="360" y1="420" x2="380" y2="460" stroke="#6b7280" stroke-width="10"/>`,
  desk: (c) => `
    <rect x="80" y="220" width="440" height="30" rx="4" fill="${c}"/>
    <rect x="100" y="250" width="30" height="180" fill="#6b7280"/>
    <rect x="470" y="250" width="30" height="180" fill="#6b7280"/>
    <rect x="120" y="270" width="100" height="80" rx="4" fill="#2a6b55" opacity="0.7"/>`,
  cabinet: (c) => `
    <rect x="160" y="100" width="280" height="400" rx="6" fill="${c}"/>
    <rect x="180" y="130" width="240" height="100" rx="4" fill="#fff" opacity="0.15"/>
    <rect x="180" y="250" width="240" height="100" rx="4" fill="#fff" opacity="0.15"/>
    <rect x="180" y="370" width="240" height="100" rx="4" fill="#fff" opacity="0.15"/>
    <circle cx="400" cy="180" r="8" fill="#fff"/>
    <circle cx="400" cy="300" r="8" fill="#fff"/>
    <circle cx="400" cy="420" r="8" fill="#fff"/>`,
  shelf: (c) => `
    <rect x="120" y="140" width="360" height="16" fill="${c}"/>
    <rect x="120" y="240" width="360" height="16" fill="${c}"/>
    <rect x="120" y="340" width="360" height="16" fill="${c}"/>
    <rect x="120" y="440" width="360" height="16" fill="${c}"/>
    <rect x="120" y="140" width="16" height="316" fill="#2a6b55"/>
    <rect x="464" y="140" width="16" height="316" fill="#2a6b55"/>`,
  coffee: (c) => `
    <rect x="180" y="180" width="240" height="260" rx="8" fill="${c}"/>
    <ellipse cx="300" cy="180" rx="120" ry="30" fill="#2a6b55"/>
    <rect x="220" y="240" width="160" height="120" rx="6" fill="#fff" opacity="0.2"/>`,
  cup: (c) => `
    <path d="M200 180 L220 420 L380 420 L400 180 Z" fill="${c}" opacity="0.85"/>
    <ellipse cx="300" cy="180" rx="100" ry="24" fill="#2a6b55"/>
    <path d="M400 220 Q460 260 400 340" fill="none" stroke="${c}" stroke-width="16"/>`,
  napkin: (c) => `
    <rect x="160" y="160" width="280" height="280" rx="8" fill="${c}" opacity="0.25"/>
    <rect x="180" y="180" width="240" height="240" rx="4" fill="#fff" stroke="${c}" stroke-width="3"/>
    <line x1="180" y1="300" x2="420" y2="300" stroke="${c}" stroke-width="2" opacity="0.4"/>
    <line x1="300" y1="180" x2="300" y2="420" stroke="${c}" stroke-width="2" opacity="0.4"/>`,
  hardHat: (c) => `
    <ellipse cx="300" cy="320" rx="160" ry="40" fill="#2a6b55"/>
    <path d="M160 320 Q160 160 300 140 Q440 160 440 320" fill="${c}"/>
    <rect x="280" y="160" width="40" height="40" rx="4" fill="#fff" opacity="0.3"/>`,
  container: (c) => `
    <rect x="160" y="160" width="280" height="300" rx="12" fill="${c}" opacity="0.7"/>
    <rect x="160" y="160" width="280" height="40" rx="12" fill="#2a6b55"/>
    <rect x="200" y="240" width="200" height="140" rx="6" fill="#fff" opacity="0.2"/>`,
  cart: (c) => `
    <rect x="140" y="180" width="320" height="200" rx="8" fill="${c}" opacity="0.3" stroke="${c}" stroke-width="6"/>
    <rect x="140" y="280" width="320" height="16" fill="${c}"/>
    <circle cx="180" cy="420" r="30" fill="#374151"/>
    <circle cx="420" cy="420" r="30" fill="#374151"/>
    <line x1="140" y1="180" x2="100" y2="120" stroke="#6b7280" stroke-width="10"/>`,
  bulb: (c) => `
    <circle cx="300" cy="240" r="100" fill="${c}" opacity="0.85"/>
    <rect x="270" y="330" width="60" height="50" fill="#9ca3af"/>
    <rect x="275" y="380" width="50" height="40" rx="4" fill="#6b7280"/>
    <line x1="260" y1="200" x2="200" y2="160" stroke="${c}" stroke-width="6" opacity="0.5"/>
    <line x1="340" y1="200" x2="400" y2="160" stroke="${c}" stroke-width="6" opacity="0.5"/>`,
  cord: (c) => `
    <rect x="200" y="200" width="200" height="200" rx="20" fill="${c}" opacity="0.8"/>
    <circle cx="300" cy="300" r="60" fill="#fff"/>
    <path d="M300 240 Q360 300 300 360 Q240 300 300 240" fill="none" stroke="${c}" stroke-width="16"/>`,
  battery: (c) => `
    <rect x="220" y="160" width="160" height="280" rx="16" fill="${c}"/>
    <rect x="260" y="130" width="80" height="40" rx="6" fill="#6b7280"/>
    <rect x="250" y="220" width="100" height="80" rx="6" fill="#fff" opacity="0.25"/>
    <text x="300" y="360" text-anchor="middle" fill="#fff" font-size="36" font-family="system-ui" font-weight="700">+</text>`,
  lamp: (c) => `
    <path d="M200 280 L300 160 L400 280 Z" fill="${c}" opacity="0.9"/>
    <rect x="285" y="280" width="30" height="140" fill="#6b7280"/>
    <ellipse cx="300" cy="430" rx="80" ry="16" fill="#2a6b55"/>`,
  notebook: (c) => `
    <rect x="160" y="100" width="280" height="400" rx="6" fill="${c}"/>
    <rect x="200" y="100" width="240" height="400" fill="#fff" opacity="0.9"/>
    <line x1="230" y1="160" x2="400" y2="160" stroke="${c}" stroke-width="3" opacity="0.3"/>
    <line x1="230" y1="200" x2="400" y2="200" stroke="${c}" stroke-width="3" opacity="0.3"/>
    <line x1="230" y1="240" x2="380" y2="240" stroke="${c}" stroke-width="3" opacity="0.3"/>
    <rect x="160" y="100" width="40" height="400" fill="#2a6b55"/>`,
  bin: (c) => `
    <path d="M160 180 L180 440 L420 440 L440 180 Z" fill="${c}" opacity="0.8"/>
    <rect x="150" y="160" width="300" height="40" rx="8" fill="#2a6b55"/>
    <rect x="220" y="240" width="160" height="120" rx="6" fill="#fff" opacity="0.2"/>`,
  tote: (c) => `
    <path d="M140 200 L160 440 L440 440 L460 200 Z" fill="${c}"/>
    <path d="M200 200 Q300 120 400 200" fill="none" stroke="#2a6b55" stroke-width="16"/>
    <rect x="200" y="260" width="200" height="100" rx="6" fill="#fff" opacity="0.2"/>`,
  dispenser: (c) => `
    <rect x="220" y="140" width="160" height="320" rx="16" fill="${c}"/>
    <rect x="250" y="180" width="100" height="140" rx="8" fill="#fff" opacity="0.25"/>
    <rect x="270" y="400" width="60" height="30" rx="6" fill="#2a6b55"/>`,
  sanitizer: (c) => `
    <rect x="240" y="200" width="120" height="240" rx="20" fill="${c}"/>
    <rect x="270" y="140" width="60" height="70" rx="8" fill="#2a6b55"/>
    <circle cx="300" cy="300" r="30" fill="#fff" opacity="0.25"/>`,
  box: (c) => `
    <rect x="140" y="200" width="320" height="220" rx="4" fill="${c}" opacity="0.85"/>
    <polygon points="140,200 300,140 460,200 300,260" fill="#2a6b55"/>
    <line x1="300" y1="260" x2="300" y2="420" stroke="#fff" stroke-width="3" opacity="0.4"/>`,
  default: (c) => `
    <rect x="180" y="160" width="240" height="280" rx="16" fill="${c}" opacity="0.85"/>
    <circle cx="300" cy="300" r="50" fill="#fff" opacity="0.2"/>`,
};

function makeSvg(label, shapeKey, variant = 1) {
  const c = "#1B4D3E";
  const shapeFn = SHAPES[shapeKey] || SHAPES.default;
  const shape = shapeFn(c);
  const yOffset = variant === 2 ? 8 : 0;
  const scale = variant === 2 ? 0.92 : 1;
  const tx = variant === 2 ? 24 : 0;
  const ty = variant === 2 ? 20 : 0;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <rect width="600" height="600" fill="#FFFFFF"/>
  <g transform="translate(${tx},${ty + yOffset}) scale(${scale})">
    ${shape}
  </g>
  <text x="300" y="560" text-anchor="middle" fill="#6B7280" font-family="system-ui, -apple-system, sans-serif" font-size="14">${escapeXml(truncateLabel(label))}</text>
</svg>
`;
}

// ─── Catalog blueprint ───────────────────────────────────────────────────────
// Each entry: { shape, brand?, base, specs?, features?, desc?, price:[min,max], variants? }
// variants expand into multiple products (color, scent, pack size, etc.)

function expand(entry, categoryKey) {
  const cat = CATEGORIES[categoryKey];
  const variants = entry.variants || [{}];
  return variants.map((v) => {
    const name = typeof entry.name === "function" ? entry.name(v) : interpolate(entry.name, v);
    const specs = { ...(entry.specs || {}), ...(v.specs || {}) };
    if (v.color) specs.Color = v.color;
    if (v.scent) specs.Scent = v.scent;
    if (v.pack) specs["Pack Size"] = v.pack;
    if (v.size) specs.Size = v.size;
    if (!specs.Manufacturer) specs.Manufacturer = entry.brand || pick(["OfficePro", "WorkDesk", "ProClean", "CleanForce", "TechEase", "SupplyCore", "DeskMate", "FacilityMax"]);
    if (!specs.Model) specs.Model = `MDL-${Math.floor(1000 + rand() * 9000)}`;
    if (!specs.Material && entry.material) specs.Material = entry.material;

    const features = (entry.features || defaultFeatures(categoryKey)).slice(0, 3 + Math.floor(rand() * 3));
    const [pMin, pMax] = entry.price || [8, 48];
    const price = priceBetween(pMin, pMax);

    return {
      name,
      category: cat.name,
      categorySlug: cat.slug,
      skuPrefix: cat.prefix,
      shape: entry.shape || "default",
      description:
        entry.desc ||
        `${name}. Commercial-grade ${cat.name.toLowerCase()} product for offices, facilities, and wholesale buyers. Bulk-ready packaging for predictable reorder cycles.`,
      features,
      specifications: trimSpecs(specs),
      price,
      material: entry.material,
    };
  });
}

function interpolate(template, v) {
  return template
    .replace(/\{color\}/g, v.color || "")
    .replace(/\{scent\}/g, v.scent || "")
    .replace(/\{pack\}/g, v.pack || "")
    .replace(/\{size\}/g, v.size || "")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function trimSpecs(specs) {
  const keys = Object.keys(specs).slice(0, 5);
  const out = {};
  for (const k of keys) out[k] = String(specs[k]);
  return out;
}

function defaultFeatures(categoryKey) {
  const map = {
    office: ["Office-ready durability", "Bulk carton packaging", "Consistent reorder sizing", "Compatible with standard supplies", "Smooth everyday use"],
    janitorial: ["Commercial-strength formula", "Facility-ready packaging", "High-capacity refill", "Low-residue finish", "Bulk case savings"],
    technology: ["Plug-and-play setup", "Office workstation ready", "Reliable daily-duty cycle", "Compact desk footprint", "Warranty-backed hardware"],
    furniture: ["Commercial-grade frame", "Easy assembly hardware included", "Ergonomic workplace design", "Durable finish", "Facility-ready footprint"],
    food: ["Breakroom-ready packaging", "Bulk case count", "Consistent taste profile", "Shelf-stable storage", "High-volume service"],
    industrial: ["Job-site durable", "Safety-compliant design", "High-visibility options", "Warehouse-ready pack", "Heavy-duty construction"],
    lighting: ["Energy-efficient LED", "Long rated lifespan", "Standard base compatibility", "Bright consistent output", "Facility bulk pack"],
    paper: ["Bright white finish", "Jam-resistant feed", "Bulk ream/carton pack", "Consistent sheet quality", "Office multipurpose use"],
    bathroom: ["Restroom-ready refill", "High-capacity design", "Touch-free compatible", "Commercial dispenser fit", "Bulk facility pack"],
    storage: ["Stackable design", "Durable bin walls", "Label-ready surface", "Warehouse aisle fit", "Heavy load rating"],
  };
  return map[categoryKey] || map.office;
}

const COLORS = ["Black", "White", "Blue", "Gray", "Green", "Red", "Clear", "Assorted"];
const SCENTS = ["Fresh Scent", "Lemon", "Lavender", "Unscented", "Citrus", "Ocean Breeze"];

// ─── Product definitions by category ─────────────────────────────────────────

const OFFICE = [
  { shape: "pen", brand: "OfficePro", name: "Ballpoint Pens, Medium Point, {color}, 1.0 mm, 12/Pack, 12 Packs/Carton", price: [6, 28], material: "Plastic/Ink", variants: COLORS.slice(0, 4).map((color) => ({ color, pack: "144/Carton" })) },
  { shape: "pen", brand: "DeskMate", name: "Gel Pens, Fine Point, {color}, 0.7 mm, 12/Pack", price: [8, 22], variants: ["Black", "Blue", "Red"].map((color) => ({ color, pack: "12/Pack" })) },
  { shape: "pen", brand: "OfficePro", name: "Retractable Ballpoint Pens, Soft Grip, Black, 1.0 mm, 36/Pack", price: [10, 24], variants: [{ color: "Black", pack: "36/Pack" }] },
  { shape: "stapler", brand: "DeskMate", name: "Desktop Stapler, Full Strip, {color}, 20-Sheet Capacity", price: [8, 32], variants: ["Black", "Gray", "Blue"].map((color) => ({ color })) },
  { shape: "stapler", brand: "OfficePro", name: "Heavy-Duty Stapler, 100-Sheet Capacity, Gray", price: [28, 65], variants: [{ color: "Gray", size: "100-Sheet" }] },
  { shape: "stapler", brand: "SupplyCore", name: "Standard Staples, 1/4 in Leg, 5000/Box, 5 Boxes/Pack", price: [4, 14], variants: [{ pack: "25,000/Pack" }] },
  { shape: "scissors", brand: "OfficePro", name: "Straight Scissors, 8 in, Stainless Steel, Soft Grip, {color}", price: [5, 18], variants: ["Black", "Blue", "Gray"].map((color) => ({ color, size: "8 in" })) },
  { shape: "scissors", brand: "DeskMate", name: "Titanium Bonded Scissors, 7 in, Gray/Yellow Accents", price: [9, 22], variants: [{ size: "7 in", color: "Gray" }] },
  { shape: "binder", brand: "OfficePro", name: "Round Ring Binder, 1 in, {color}, Letter Size, 12/Carton", price: [18, 42], variants: ["Black", "White", "Blue", "Red"].map((color) => ({ color, size: "1 in", pack: "12/Carton" })) },
  { shape: "binder", brand: "SupplyCore", name: "D-Ring View Binder, 2 in, {color}, Letter, 6/Carton", price: [24, 55], variants: ["White", "Black"].map((color) => ({ color, size: "2 in", pack: "6/Carton" })) },
  { shape: "binder", brand: "DeskMate", name: "Heavy-Duty Binder, 3 in, Black, Letter Size", price: [8, 16], variants: [{ color: "Black", size: "3 in" }] },
  { shape: "calendar", brand: "DeskMate", name: "Desk Calendar Pad, 3.5 x 6, White, Jan–Dec", price: [6, 18], variants: [{ size: "3.5 x 6", color: "White" }] },
  { shape: "calendar", brand: "OfficePro", name: "Wall Calendar, Monthly, 12 x 17, Wirebound", price: [8, 22], variants: [{ size: "12 x 17" }] },
  { shape: "calendar", brand: "WorkDesk", name: "Daily Appointment Book, 8.5 x 11, Black Cover", price: [12, 28], variants: [{ color: "Black", size: "8.5 x 11" }] },
  { shape: "folder", brand: "OfficePro", name: "Manila File Folders, Letter Size, 1/3-Cut, 100/Box", price: [10, 28], variants: [{ color: "Manila", pack: "100/Box", size: "Letter" }] },
  { shape: "folder", brand: "SupplyCore", name: "Colored File Folders, Letter, Assorted, 100/Box", price: [14, 32], variants: [{ color: "Assorted", pack: "100/Box" }] },
  { shape: "folder", brand: "DeskMate", name: "Hanging File Folders, Letter, Green, 25/Box", price: [12, 26], variants: [{ color: "Green", pack: "25/Box" }] },
  { shape: "paper", brand: "OfficePro", name: "Copy Paper, 8.5 x 11, 20 lb, 92 Bright, 500 Sheets/Ream, 10 Reams/Carton", price: [38, 62], variants: [{ size: "Letter", pack: "10 Reams/Carton" }] },
  { shape: "envelope", brand: "SupplyCore", name: "Business Envelopes, #10, White, 24 lb, 500/Box", price: [14, 32], variants: [{ color: "White", pack: "500/Box", size: "#10" }] },
  { shape: "envelope", brand: "OfficePro", name: "Catalog Envelopes, 9 x 12, Brown Kraft, 100/Box", price: [12, 28], variants: [{ color: "Brown Kraft", pack: "100/Box", size: "9 x 12" }] },
  { shape: "marker", brand: "DeskMate", name: "Permanent Markers, Chisel Tip, {color}, 12/Pack", price: [6, 18], variants: ["Black", "Assorted"].map((color) => ({ color, pack: "12/Pack" })) },
  { shape: "marker", brand: "OfficePro", name: "Dry-Erase Markers, Fine Tip, Assorted, 8/Pack, 3 Packs/Carton", price: [10, 26], variants: [{ color: "Assorted", pack: "24/Carton" }] },
  { shape: "marker", brand: "WorkDesk", name: "Highlighters, Chisel Tip, Assorted Fluorescent, 12/Pack", price: [5, 16], variants: [{ color: "Assorted", pack: "12/Pack" }] },
  { shape: "tape", brand: "OfficePro", name: "Transparent Tape, 3/4 in x 1000 in, Clear, 6/Pack", price: [6, 18], variants: [{ color: "Clear", pack: "6/Pack", size: '3/4"' }] },
  { shape: "tape", brand: "SupplyCore", name: "Packaging Tape, 1.88 in x 54.6 yd, Clear, 6/Pack", price: [12, 28], variants: [{ color: "Clear", pack: "6/Pack" }] },
  { shape: "tape", brand: "DeskMate", name: "Desktop Tape Dispenser, Weighted Base, Black", price: [5, 16], variants: [{ color: "Black" }] },
  { shape: "label", brand: "OfficePro", name: "Address Labels, 1 x 2-5/8, White, 30/Sheet, 750/Pack", price: [10, 28], variants: [{ color: "White", pack: "750/Pack", size: "1 x 2-5/8" }] },
  { shape: "label", brand: "SupplyCore", name: "File Folder Labels, Assorted Colors, 252/Pack", price: [6, 16], variants: [{ color: "Assorted", pack: "252/Pack" }] },
  { shape: "clipboard", brand: "DeskMate", name: "Hardboard Clipboard, Letter Size, Low-Profile Clip, {color}", price: [3, 12], variants: ["Brown", "Black"].map((color) => ({ color, size: "Letter" })) },
  { shape: "organizer", brand: "WorkDesk", name: "Desktop Organizer, Mesh, 6 Compartments, {color}", price: [12, 34], variants: ["Black", "Silver"].map((color) => ({ color })) },
  { shape: "organizer", brand: "OfficePro", name: "Drawer Organizer Tray, Plastic, 5 Compartments, Clear", price: [6, 18], variants: [{ color: "Clear" }] },
  { shape: "paper", brand: "DeskMate", name: "Sticky Notes, 3 x 3, Yellow, 100 Sheets/Pad, 12 Pads/Pack", price: [8, 20], variants: [{ color: "Yellow", pack: "12 Pads", size: "3 x 3" }] },
  { shape: "paper", brand: "OfficePro", name: "Sticky Notes, 3 x 3, Assorted Pastel, 100 Sheets/Pad, 24 Pads/Pack", price: [14, 32], variants: [{ color: "Assorted", pack: "24 Pads" }] },
  { shape: "binder", brand: "SupplyCore", name: "Sheet Protectors, Top Load, Letter, Clear, 100/Box", price: [8, 22], variants: [{ color: "Clear", pack: "100/Box" }] },
  { shape: "paper", brand: "OfficePro", name: "Legal Pads, 8.5 x 11.75, Canary, 50 Sheets, 12/Pack", price: [10, 24], variants: [{ color: "Canary", pack: "12/Pack" }] },
];

const JANITORIAL = [
  { shape: "canister", brand: "ProClean", name: "Disinfecting Wipes, 1-Ply, 7 x 8, {scent}, White, 75/Canister, 6/Carton", price: [18, 42], variants: SCENTS.slice(0, 4).map((scent) => ({ scent, pack: "6/Carton", color: "White" })) },
  { shape: "canister", brand: "CleanForce", name: "Disinfecting Wipes, Fresh Scent, 80/Canister, 12/Carton", price: [28, 55], variants: [{ scent: "Fresh Scent", pack: "12/Carton" }] },
  { shape: "spray", brand: "ProClean", name: "Multi-Surface Disinfectant Spray, {scent}, 19 oz, 12/Carton", price: [32, 58], variants: ["Lemon", "Fresh Scent", "Unscented"].map((scent) => ({ scent, pack: "12/Carton", size: "19 oz" })) },
  { shape: "spray", brand: "CleanForce", name: "Glass Cleaner Spray, Ammonia-Free, 32 oz, 12/Carton", price: [24, 48], variants: [{ scent: "Ammonia-Free", pack: "12/Carton", size: "32 oz" }] },
  { shape: "spray", brand: "FacilityMax", name: "Bathroom Disinfectant Cleaner, 32 oz Trigger, 12/Carton", price: [28, 52], variants: [{ pack: "12/Carton", size: "32 oz" }] },
  { shape: "soap", brand: "ProClean", name: "Foam Hand Soap Refill, {scent}, 1200 mL, 4/Carton", price: [28, 55], variants: ["Fresh Scent", "Unscented"].map((scent) => ({ scent, pack: "4/Carton", size: "1200 mL" })) },
  { shape: "dispenser", brand: "FacilityMax", name: "Manual Soap Dispenser, Wall-Mount, {color}, 1000 mL", price: [12, 32], variants: ["White", "Black", "Gray"].map((color) => ({ color, size: "1000 mL" })) },
  { shape: "sanitizer", brand: "CleanForce", name: "Hand Sanitizer Gel, 70% Alcohol, 8 oz Pump, 12/Carton", price: [22, 48], variants: [{ pack: "12/Carton", size: "8 oz" }] },
  { shape: "sanitizer", brand: "ProClean", name: "Hand Sanitizer Refill, 1 gal, 4/Carton", price: [36, 68], variants: [{ pack: "4/Carton", size: "1 gal" }] },
  { shape: "gloves", brand: "FacilityMax", name: "Nitrile Exam Gloves, Powder-Free, {size}, Blue, 100/Box, 10 Boxes/Carton", price: [48, 95], variants: ["S", "M", "L", "XL"].map((size) => ({ size, color: "Blue", pack: "1000/Carton" })) },
  { shape: "gloves", brand: "CleanForce", name: "Vinyl Gloves, Powder-Free, Large, Clear, 100/Box", price: [8, 18], variants: [{ size: "L", color: "Clear", pack: "100/Box" }] },
  { shape: "mop", brand: "FacilityMax", name: "Wet Mop Head, Cotton, 24 oz, White, 12/Carton", price: [28, 52], variants: [{ color: "White", pack: "12/Carton", size: "24 oz" }] },
  { shape: "mop", brand: "ProClean", name: "Microfiber Flat Mop Kit, Frame + 2 Pads, Blue", price: [18, 38], variants: [{ color: "Blue" }] },
  { shape: "mop", brand: "CleanForce", name: "Dust Mop Handle, Aluminum, 60 in, Threaded Tip", price: [10, 24], variants: [{ size: "60 in" }] },
  { shape: "bucket", brand: "FacilityMax", name: "Mop Bucket with Wringer, 35 qt, Yellow", price: [32, 68], variants: [{ color: "Yellow", size: "35 qt" }] },
  { shape: "bucket", brand: "ProClean", name: "Utility Bucket, 5 gal, Plastic, {color}", price: [8, 22], variants: ["Blue", "Red", "Gray"].map((color) => ({ color, size: "5 gal" })) },
  { shape: "trashBag", brand: "CleanForce", name: "Trash Bags, Linear Low-Density, 40 x 46, 45 gal, Black, 100/Case", price: [28, 58], variants: [{ color: "Black", pack: "100/Case", size: "45 gal" }] },
  { shape: "trashBag", brand: "FacilityMax", name: "Trash Bags, High-Density, 24 x 33, 12–16 gal, Clear, 500/Case", price: [32, 62], variants: [{ color: "Clear", pack: "500/Case", size: "12–16 gal" }] },
  { shape: "trashBag", brand: "ProClean", name: "Trash Bags, 33 x 39, 33 gal, Black, 250/Case", price: [36, 68], variants: [{ color: "Black", pack: "250/Case", size: "33 gal" }] },
  { shape: "trashCan", brand: "FacilityMax", name: "Wastebasket, 7 gal, Plastic, {color}", price: [6, 18], variants: ["Black", "Gray", "Beige"].map((color) => ({ color, size: "7 gal" })) },
  { shape: "trashCan", brand: "CleanForce", name: "Square Trash Can, 23 gal, Gray, with Lid", price: [28, 58], variants: [{ color: "Gray", size: "23 gal" }] },
  { shape: "paperTowel", brand: "ProClean", name: "Hardwound Paper Towels, 8 in x 800 ft, White, 6 Rolls/Carton", price: [28, 52], variants: [{ color: "White", pack: "6/Carton" }] },
  { shape: "paperTowel", brand: "FacilityMax", name: "Multifold Paper Towels, 9.2 x 9.4, White, 250/Pack, 16 Packs/Carton", price: [32, 58], variants: [{ color: "White", pack: "4000/Carton" }] },
  { shape: "tissue", brand: "CleanForce", name: "Toilet Tissue, 2-Ply, 500 Sheets/Roll, White, 96 Rolls/Carton", price: [42, 78], variants: [{ color: "White", pack: "96/Carton" }] },
  { shape: "tissue", brand: "ProClean", name: "Jumbo Roll Toilet Tissue, 2-Ply, 12 in, White, 12 Rolls/Carton", price: [38, 72], variants: [{ color: "White", pack: "12/Carton", size: "12 in" }] },
  { shape: "spray", brand: "FacilityMax", name: "All-Purpose Cleaner Concentrate, Lemon, 1 gal, 4/Carton", price: [24, 48], variants: [{ scent: "Lemon", pack: "4/Carton", size: "1 gal" }] },
  { shape: "canister", brand: "CleanForce", name: "Disinfectant Tablets, Effervescent, 120/Bottle, 6/Carton", price: [48, 88], variants: [{ pack: "6/Carton" }] },
  { shape: "mop", brand: "ProClean", name: "Floor Squeegee, 24 in Blade, Rubber, with Handle", price: [14, 32], variants: [{ size: "24 in" }] },
  { shape: "spray", brand: "CleanForce", name: "Stainless Steel Cleaner Polish, 19 oz Aerosol, 12/Carton", price: [28, 52], variants: [{ pack: "12/Carton", size: "19 oz" }] },
  { shape: "canister", brand: "FacilityMax", name: "Disinfecting Wipes Refill Pack, Fresh Scent, 75/Pack, 6/Carton", price: [16, 36], variants: [{ scent: "Fresh Scent", pack: "6/Carton" }] },
  { shape: "gloves", brand: "ProClean", name: "Latex Cleaning Gloves, Flock-Lined, Large, Yellow, 12 Pair/Pack", price: [10, 24], variants: [{ size: "L", color: "Yellow", pack: "12 Pair" }] },
];

const TECHNOLOGY = [
  { shape: "mouse", brand: "TechEase", name: "Wireless Optical Mouse, 2.4 GHz, {color}, USB Receiver", price: [12, 32], variants: ["Black", "Gray", "White"].map((color) => ({ color })) },
  { shape: "mouse", brand: "TechEase", name: "Ergonomic Vertical Mouse, Wired, Black, USB-A", price: [22, 48], variants: [{ color: "Black" }] },
  { shape: "mouse", brand: "WorkDesk", name: "Bluetooth Mouse, Rechargeable, Silent Click, {color}", price: [18, 42], variants: ["Black", "Silver"].map((color) => ({ color })) },
  { shape: "keyboard", brand: "TechEase", name: "Full-Size Keyboard, Wired, USB, {color}", price: [14, 36], variants: ["Black", "White"].map((color) => ({ color })) },
  { shape: "keyboard", brand: "WorkDesk", name: "Wireless Keyboard & Mouse Combo, Black, 2.4 GHz", price: [28, 58], variants: [{ color: "Black" }] },
  { shape: "keyboard", brand: "TechEase", name: "Compact Wireless Keyboard, Quiet Keys, Gray", price: [24, 52], variants: [{ color: "Gray" }] },
  { shape: "usbHub", brand: "TechEase", name: "USB-C Hub, 7-Port, HDMI + USB-A + SD, Aluminum", price: [32, 72], variants: [{ color: "Silver" }] },
  { shape: "usbHub", brand: "WorkDesk", name: "USB 3.0 Hub, 4-Port, Powered, Black", price: [16, 38], variants: [{ color: "Black" }] },
  { shape: "usbHub", brand: "TechEase", name: "USB-C Multiport Adapter, HDMI 4K, Ethernet, Silver", price: [28, 64], variants: [{ color: "Silver" }] },
  { shape: "monitor", brand: "TechEase", name: "LED Monitor, 24 in, Full HD 1080p, HDMI/VGA, Black", price: [98, 168], variants: [{ size: "24 in", color: "Black" }] },
  { shape: "monitor", brand: "WorkDesk", name: "LED Monitor, 27 in, QHD 1440p, IPS, USB-C, Black", price: [168, 289], variants: [{ size: "27 in", color: "Black" }] },
  { shape: "monitor", brand: "TechEase", name: "Ultrawide Monitor, 34 in, 1440p, Curved, Black", price: [289, 449], variants: [{ size: "34 in", color: "Black" }] },
  { shape: "webcam", brand: "TechEase", name: "HD Webcam, 1080p, Auto-Focus, Built-in Mic, Black", price: [28, 68], variants: [{ color: "Black" }] },
  { shape: "webcam", brand: "WorkDesk", name: "4K Webcam, Privacy Shutter, Dual Mic, Black", price: [68, 128], variants: [{ color: "Black" }] },
  { shape: "headset", brand: "TechEase", name: "USB Headset, Stereo, Noise-Canceling Mic, Black", price: [32, 72], variants: [{ color: "Black" }] },
  { shape: "headset", brand: "WorkDesk", name: "Wireless Headset, Bluetooth, Over-Ear, Black", price: [48, 98], variants: [{ color: "Black" }] },
  { shape: "headset", brand: "TechEase", name: "Call Center Headset, Mono, RJ9/USB Adapter, Black", price: [38, 78], variants: [{ color: "Black" }] },
  { shape: "mousePad", brand: "WorkDesk", name: "Mouse Pad, Non-Slip Base, {size}, {color}", price: [4, 16], variants: [
    { size: "9 x 7", color: "Black" },
    { size: "12 x 10", color: "Black" },
    { size: "Extended 31 x 12", color: "Black" },
  ] },
  { shape: "powerStrip", brand: "TechEase", name: "Surge Protector Power Strip, 6 Outlets, 4 ft Cord, Black", price: [12, 28], variants: [{ color: "Black", size: "4 ft" }] },
  { shape: "powerStrip", brand: "WorkDesk", name: "Surge Protector, 8 Outlets + 4 USB, 6 ft Cord, White", price: [22, 48], variants: [{ color: "White", size: "6 ft" }] },
  { shape: "powerStrip", brand: "TechEase", name: "Heavy-Duty Power Strip, 12 Outlets, 15 ft Cord, Gray", price: [28, 58], variants: [{ color: "Gray", size: "15 ft" }] },
  { shape: "printer", brand: "TechEase", name: "Laser Printer, Monochrome, Wireless, Duplex, White", price: [128, 229], variants: [{ color: "White" }] },
  { shape: "printer", brand: "WorkDesk", name: "Inkjet All-in-One Printer, Color, Scan/Copy, Black", price: [98, 189], variants: [{ color: "Black" }] },
  { shape: "printer", brand: "TechEase", name: "Toner Cartridge Compatible, Black, High Yield, 1/Pack", price: [32, 68], variants: [{ color: "Black", pack: "1/Pack" }] },
  { shape: "usbHub", brand: "TechEase", name: "USB Flash Drive, 64 GB, USB 3.0, {color}", price: [8, 22], variants: ["Black", "Silver"].map((color) => ({ color, size: "64 GB" })) },
  { shape: "monitor", brand: "WorkDesk", name: "Monitor Arm Mount, Single, Gas Spring, Clamp, Black", price: [38, 78], variants: [{ color: "Black" }] },
  { shape: "keyboard", brand: "TechEase", name: "Numeric Keypad, Wired USB, Black", price: [12, 28], variants: [{ color: "Black" }] },
  { shape: "webcam", brand: "TechEase", name: "Laptop Webcam Privacy Cover Slide, 3-Pack, Black", price: [4, 12], variants: [{ color: "Black", pack: "3/Pack" }] },
  { shape: "headset", brand: "WorkDesk", name: "USB Headset Stand, Weighted Base, Aluminum, Silver", price: [14, 32], variants: [{ color: "Silver" }] },
];

const FURNITURE = [
  { shape: "chair", brand: "WorkDesk", name: "Task Chair, Mesh Back, Adjustable Arms, {color}", price: [89, 189], variants: ["Black", "Gray"].map((color) => ({ color })) },
  { shape: "chair", brand: "FacilityMax", name: "Executive Office Chair, Leatherette, High-Back, Black", price: [148, 289], variants: [{ color: "Black" }] },
  { shape: "chair", brand: "WorkDesk", name: "Guest Chair, Stackable, Fabric Seat, {color}", price: [58, 118], variants: ["Black", "Blue", "Gray"].map((color) => ({ color })) },
  { shape: "chair", brand: "SupplyCore", name: "Drafting Stool, Adjustable Height, Footrest, Black", price: [78, 148], variants: [{ color: "Black" }] },
  { shape: "desk", brand: "WorkDesk", name: "Writing Desk, 48 in W, Laminate Top, {color}", price: [118, 229], variants: ["Espresso", "White", "Gray"].map((color) => ({ color, size: "48 in" })) },
  { shape: "desk", brand: "FacilityMax", name: "L-Shaped Desk, 60 in, Corner Workstation, Gray", price: [198, 349], variants: [{ color: "Gray", size: "60 in" }] },
  { shape: "desk", brand: "WorkDesk", name: "Standing Desk Converter, 32 in, Dual Monitor Ready, Black", price: [98, 189], variants: [{ color: "Black", size: "32 in" }] },
  { shape: "desk", brand: "SupplyCore", name: "Adjustable Height Desk, Electric, 55 in, White", price: [249, 449], variants: [{ color: "White", size: "55 in" }] },
  { shape: "cabinet", brand: "FacilityMax", name: "Lateral File Cabinet, 2-Drawer, Letter/Legal, {color}", price: [168, 298], variants: ["Black", "Putty", "Gray"].map((color) => ({ color })) },
  { shape: "cabinet", brand: "WorkDesk", name: "Vertical File Cabinet, 4-Drawer, Letter, Black", price: [148, 268], variants: [{ color: "Black" }] },
  { shape: "cabinet", brand: "SupplyCore", name: "Storage Cabinet, Steel, 2 Doors, 72 in H, Gray", price: [198, 348], variants: [{ color: "Gray", size: "72 in" }] },
  { shape: "shelf", brand: "FacilityMax", name: "Bookcase, 5-Shelf, 36 in W, Laminate, {color}", price: [98, 198], variants: ["Espresso", "White"].map((color) => ({ color, size: "36 in" })) },
  { shape: "shelf", brand: "WorkDesk", name: "Wire Shelving Unit, 4-Tier, Chrome, 48 x 18 x 72", price: [78, 158], variants: [{ color: "Chrome", size: "48 x 18 x 72" }] },
  { shape: "shelf", brand: "SupplyCore", name: "Wall Shelf Set, 3-Piece, Floating, Black", price: [28, 68], variants: [{ color: "Black", pack: "3/Set" }] },
  { shape: "cabinet", brand: "WorkDesk", name: "Mobile Pedestal File, 3-Drawer, Under-Desk, Black", price: [118, 218], variants: [{ color: "Black" }] },
  { shape: "chair", brand: "FacilityMax", name: "Folding Chair, Steel Frame, Fabric Seat, Gray, 4/Carton", price: [68, 128], variants: [{ color: "Gray", pack: "4/Carton" }] },
  { shape: "desk", brand: "SupplyCore", name: "Conference Table, 72 in Oval, Laminate, Espresso", price: [289, 489], variants: [{ color: "Espresso", size: "72 in" }] },
];

const FOOD = [
  { shape: "coffee", brand: "BreakRoom+", name: "Ground Coffee, Medium Roast, 100% Arabica, 32 oz, 6/Carton", price: [48, 88], variants: [{ pack: "6/Carton", size: "32 oz", scent: "Medium Roast" }] },
  { shape: "coffee", brand: "BreakRoom+", name: "Ground Coffee, Dark Roast, 32 oz Can, 6/Carton", price: [48, 88], variants: [{ pack: "6/Carton", size: "32 oz", scent: "Dark Roast" }] },
  { shape: "coffee", brand: "FacilityMax", name: "Coffee Pods, Medium Roast, 72/Box, Compatible Brewers", price: [28, 52], variants: [{ pack: "72/Box", scent: "Medium Roast" }] },
  { shape: "coffee", brand: "BreakRoom+", name: "Coffee Pods, Variety Pack, 48/Box", price: [24, 48], variants: [{ pack: "48/Box" }] },
  { shape: "coffee", brand: "SupplyCore", name: "Instant Coffee Crystals, Regular, 8 oz Jar, 6/Carton", price: [22, 42], variants: [{ pack: "6/Carton", size: "8 oz" }] },
  { shape: "coffee", brand: "BreakRoom+", name: "Black Tea Bags, 100/Box, 6 Boxes/Carton", price: [18, 36], variants: [{ pack: "600/Carton" }] },
  { shape: "coffee", brand: "FacilityMax", name: "Green Tea Bags, 100/Box", price: [8, 18], variants: [{ pack: "100/Box" }] },
  { shape: "coffee", brand: "BreakRoom+", name: "Herbal Tea Assortment, 64 Bags/Box", price: [10, 22], variants: [{ pack: "64/Box" }] },
  { shape: "canister", brand: "SupplyCore", name: "Non-Dairy Creamer Powder, Original, 35 oz Canister, 6/Carton", price: [28, 52], variants: [{ pack: "6/Carton", size: "35 oz" }] },
  { shape: "canister", brand: "BreakRoom+", name: "Liquid Coffee Creamer Cups, French Vanilla, 180/Carton", price: [18, 36], variants: [{ pack: "180/Carton", scent: "French Vanilla" }] },
  { shape: "canister", brand: "FacilityMax", name: "Liquid Coffee Creamer Cups, Original, 180/Carton", price: [16, 34], variants: [{ pack: "180/Carton", scent: "Original" }] },
  { shape: "box", brand: "SupplyCore", name: "Sugar Packets, White, 0.1 oz, 2000/Carton", price: [14, 28], variants: [{ pack: "2000/Carton", color: "White" }] },
  { shape: "box", brand: "BreakRoom+", name: "Sugar Substitute Packets, Aspartame, 1000/Carton", price: [12, 26], variants: [{ pack: "1000/Carton" }] },
  { shape: "box", brand: "FacilityMax", name: "Raw Sugar Packets, Turbinado, 500/Carton", price: [10, 22], variants: [{ pack: "500/Carton" }] },
  { shape: "cup", brand: "BreakRoom+", name: "Paper Hot Cups, 8 oz, White, 50/Pack, 20 Packs/Carton", price: [32, 58], variants: [{ pack: "1000/Carton", size: "8 oz", color: "White" }] },
  { shape: "cup", brand: "FacilityMax", name: "Paper Hot Cups, 12 oz, White, 1000/Carton", price: [38, 68], variants: [{ pack: "1000/Carton", size: "12 oz", color: "White" }] },
  { shape: "cup", brand: "SupplyCore", name: "Plastic Cold Cups, 16 oz, Clear, 1000/Carton", price: [42, 78], variants: [{ pack: "1000/Carton", size: "16 oz", color: "Clear" }] },
  { shape: "cup", brand: "BreakRoom+", name: "Cup Lids, Compatible 8–12 oz Hot Cups, White, 1000/Carton", price: [18, 36], variants: [{ pack: "1000/Carton", color: "White" }] },
  { shape: "napkin", brand: "FacilityMax", name: "Dinner Napkins, 2-Ply, White, 15 x 17, 150/Pack, 16 Packs/Carton", price: [28, 52], variants: [{ pack: "2400/Carton", color: "White" }] },
  { shape: "napkin", brand: "BreakRoom+", name: "Beverage Napkins, 1-Ply, White, 500/Pack, 8 Packs/Carton", price: [18, 36], variants: [{ pack: "4000/Carton", color: "White" }] },
  { shape: "box", brand: "SupplyCore", name: "Basket Coffee Filters, 8–12 Cup, White, 1000/Pack", price: [8, 18], variants: [{ pack: "1000/Pack", color: "White" }] },
  { shape: "box", brand: "BreakRoom+", name: "Cone Coffee Filters, #4, Natural, 200/Pack, 6 Packs/Carton", price: [12, 26], variants: [{ pack: "1200/Carton" }] },
  { shape: "cup", brand: "FacilityMax", name: "Stir Sticks, Wood, 5.5 in, 1000/Box, 10 Boxes/Carton", price: [14, 28], variants: [{ pack: "10,000/Carton", size: "5.5 in" }] },
  { shape: "box", brand: "BreakRoom+", name: "Bottled Water, 16.9 oz, 24/Case, 2 Cases/Carton", price: [12, 24], variants: [{ pack: "48/Carton", size: "16.9 oz" }] },
  { shape: "box", brand: "SupplyCore", name: "Soft Drink Assortment Cans, 12 oz, 24/Case", price: [14, 28], variants: [{ pack: "24/Case", size: "12 oz" }] },
  { shape: "box", brand: "FacilityMax", name: "Snack Variety Pack, Chips & Crackers, 30 Count", price: [16, 32], variants: [{ pack: "30 Count" }] },
  { shape: "canister", brand: "BreakRoom+", name: "Hot Cocoa Mix Packets, Milk Chocolate, 50/Box, 6 Boxes/Carton", price: [28, 52], variants: [{ pack: "300/Carton", scent: "Milk Chocolate" }] },
  { shape: "cup", brand: "SupplyCore", name: "Foam Hot Cups, 8 oz, White, 1000/Carton", price: [28, 52], variants: [{ pack: "1000/Carton", size: "8 oz", color: "White" }] },
  { shape: "box", brand: "BreakRoom+", name: "Granola Bar Variety Pack, 48 Count", price: [18, 36], variants: [{ pack: "48 Count" }] },
  { shape: "coffee", brand: "FacilityMax", name: "Decaf Ground Coffee, Medium Roast, 32 oz, 6/Carton", price: [48, 88], variants: [{ pack: "6/Carton", size: "32 oz", scent: "Decaf Medium" }] },
];

const INDUSTRIAL = [
  { shape: "gloves", brand: "FacilityMax", name: "Leather Palm Work Gloves, {size}, Gray/Yellow, 12 Pair/Pack", price: [22, 48], variants: ["M", "L", "XL"].map((size) => ({ size, color: "Gray/Yellow", pack: "12 Pair" })) },
  { shape: "gloves", brand: "SupplyCore", name: "Cut-Resistant Gloves, Level A3, Black, Large, 12 Pair/Pack", price: [38, 72], variants: [{ size: "L", color: "Black", pack: "12 Pair" }] },
  { shape: "hardHat", brand: "FacilityMax", name: "Hard Hat, Cap Style, 4-Point Ratchet, {color}", price: [12, 28], variants: ["Yellow", "White", "Orange"].map((color) => ({ color })) },
  { shape: "hardHat", brand: "SupplyCore", name: "Hard Hat, Full Brim, 6-Point Suspension, White", price: [18, 36], variants: [{ color: "White" }] },
  { shape: "container", brand: "FacilityMax", name: "Storage Drum, 30 gal, Plastic, Blue, Open Head", price: [48, 98], variants: [{ color: "Blue", size: "30 gal" }] },
  { shape: "container", brand: "SupplyCore", name: "Storage Drum, 55 gal, Plastic, Blue, Closed Head", price: [68, 128], variants: [{ color: "Blue", size: "55 gal" }] },
  { shape: "cart", brand: "FacilityMax", name: "Utility Cart, 2-Shelf, 500 lb Capacity, {color}", price: [78, 158], variants: ["Black", "Gray", "Blue"].map((color) => ({ color })) },
  { shape: "cart", brand: "SupplyCore", name: "Platform Truck, 27 x 54, 1000 lb, Wood Deck, Red Handle", price: [128, 248], variants: [{ color: "Red", size: "27 x 54" }] },
  { shape: "cart", brand: "FacilityMax", name: "Hand Truck, Convertible, 800 lb, Pneumatic Tires", price: [98, 189], variants: [{ color: "Blue" }] },
  { shape: "spray", brand: "CleanForce", name: "Industrial Degreaser, Concentrate, 1 gal, 4/Carton", price: [42, 78], variants: [{ pack: "4/Carton", size: "1 gal" }] },
  { shape: "spray", brand: "ProClean", name: "Concrete Floor Cleaner, Alkaline, 5 gal Pail", price: [48, 88], variants: [{ size: "5 gal" }] },
  { shape: "canister", brand: "FacilityMax", name: "Absorbant Granules, Clay, 40 lb Bag, 50 Bags/Pallet", price: [12, 28], variants: [{ pack: "40 lb Bag" }] },
  { shape: "box", brand: "SupplyCore", name: "Safety Glasses, Clear Lens, Anti-Fog, 12/Box", price: [18, 36], variants: [{ color: "Clear", pack: "12/Box" }] },
  { shape: "box", brand: "FacilityMax", name: "Ear Plugs, Foam, Uncorded, 200 Pair/Box", price: [14, 28], variants: [{ pack: "200 Pair/Box", color: "Orange" }] },
  { shape: "box", brand: "SupplyCore", name: "High-Visibility Vest, Mesh, Class 2, {color}, L/XL", price: [8, 18], variants: ["Lime", "Orange"].map((color) => ({ color, size: "L/XL" })) },
  { shape: "container", brand: "FacilityMax", name: "Parts Bin Organizer, Plastic, 24 Compartment, Blue", price: [28, 58], variants: [{ color: "Blue" }] },
  { shape: "mop", brand: "CleanForce", name: "Industrial Floor Scrub Brush, 10 in, Stiff Bristle", price: [12, 28], variants: [{ size: "10 in" }] },
  { shape: "bucket", brand: "FacilityMax", name: "Chemical-Resistant Pail, 5 gal, White, Graduated", price: [10, 24], variants: [{ color: "White", size: "5 gal" }] },
];

const LIGHTING = [
  { shape: "bulb", brand: "TechEase", name: "LED A19 Bulb, 60W Equivalent, Soft White 2700K, 6/Pack", price: [8, 18], variants: [{ pack: "6/Pack", size: "60W Eq" }] },
  { shape: "bulb", brand: "SupplyCore", name: "LED A19 Bulb, 60W Equivalent, Daylight 5000K, 8/Pack", price: [10, 22], variants: [{ pack: "8/Pack", size: "60W Eq" }] },
  { shape: "bulb", brand: "TechEase", name: "LED A19 Bulb, 100W Equivalent, Soft White, 4/Pack", price: [10, 24], variants: [{ pack: "4/Pack", size: "100W Eq" }] },
  { shape: "bulb", brand: "FacilityMax", name: "LED BR30 Flood Bulb, 65W Equivalent, Soft White, 6/Pack", price: [14, 32], variants: [{ pack: "6/Pack" }] },
  { shape: "bulb", brand: "TechEase", name: "LED T8 Tube, 4 ft, 18W, Daylight, Ballast Compatible, 10/Pack", price: [32, 68], variants: [{ pack: "10/Pack", size: "4 ft" }] },
  { shape: "bulb", brand: "SupplyCore", name: "LED PAR38 Outdoor Bulb, 90W Equivalent, 3000K, 4/Pack", price: [18, 38], variants: [{ pack: "4/Pack" }] },
  { shape: "cord", brand: "FacilityMax", name: "Extension Cord, Indoor, 16/3, {size}, Orange", price: [8, 28], variants: ["25 ft", "50 ft"].map((size) => ({ size, color: "Orange" })) },
  { shape: "cord", brand: "SupplyCore", name: "Extension Cord, Outdoor, 14/3, 100 ft, Yellow", price: [38, 78], variants: [{ size: "100 ft", color: "Yellow" }] },
  { shape: "cord", brand: "TechEase", name: "Extension Cord Reel, 50 ft, 12/3, Triple Tap, Green", price: [48, 98], variants: [{ size: "50 ft", color: "Green" }] },
  { shape: "battery", brand: "SupplyCore", name: "Alkaline Batteries, AA, 24/Pack", price: [10, 22], variants: [{ pack: "24/Pack", size: "AA" }] },
  { shape: "battery", brand: "TechEase", name: "Alkaline Batteries, AAA, 24/Pack", price: [10, 22], variants: [{ pack: "24/Pack", size: "AAA" }] },
  { shape: "battery", brand: "FacilityMax", name: "Alkaline Batteries, 9V, 8/Pack", price: [12, 26], variants: [{ pack: "8/Pack", size: "9V" }] },
  { shape: "battery", brand: "SupplyCore", name: "Alkaline Batteries, D Cell, 12/Pack", price: [14, 28], variants: [{ pack: "12/Pack", size: "D" }] },
  { shape: "lamp", brand: "WorkDesk", name: "LED Desk Lamp, Adjustable Arm, USB Port, {color}", price: [22, 48], variants: ["Black", "White", "Silver"].map((color) => ({ color })) },
  { shape: "lamp", brand: "TechEase", name: "Clamp Desk Lamp, LED, Dimmable, Black", price: [18, 42], variants: [{ color: "Black" }] },
  { shape: "lamp", brand: "FacilityMax", name: "Floor Lamp, LED Torchiere, Dimmer, Silver", price: [38, 78], variants: [{ color: "Silver" }] },
  { shape: "bulb", brand: "SupplyCore", name: "LED Exit Sign, Red Letter, Universal Mount, Battery Backup", price: [28, 58], variants: [{ color: "Red" }] },
];

const PAPER = [
  { shape: "paper", brand: "OfficePro", name: "Copy Paper, Letter, 20 lb, 92 Bright, 500/Ream, 5 Reams/Carton", price: [22, 42], variants: [{ size: "Letter", pack: "5 Reams" }] },
  { shape: "paper", brand: "SupplyCore", name: "Copy Paper, Letter, 20 lb, 96 Bright, 500/Ream, 10 Reams/Carton", price: [38, 68], variants: [{ size: "Letter", pack: "10 Reams" }] },
  { shape: "paper", brand: "OfficePro", name: "Copy Paper, Legal, 20 lb, 92 Bright, 500/Ream, 10 Reams/Carton", price: [42, 72], variants: [{ size: "Legal", pack: "10 Reams" }] },
  { shape: "paper", brand: "FacilityMax", name: "Card Stock, Letter, 65 lb, White, 250 Sheets/Pack", price: [12, 28], variants: [{ color: "White", pack: "250/Pack", size: "Letter" }] },
  { shape: "paper", brand: "OfficePro", name: "Card Stock, Letter, 65 lb, Assorted Colors, 250 Sheets/Pack", price: [14, 32], variants: [{ color: "Assorted", pack: "250/Pack" }] },
  { shape: "tissue", brand: "ProClean", name: "Facial Tissue, 2-Ply, Flat Box, 100 Sheets/Box, 30 Boxes/Carton", price: [28, 52], variants: [{ pack: "30/Carton", color: "White" }] },
  { shape: "tissue", brand: "CleanForce", name: "Facial Tissue, 2-Ply, Cube Box, 85 Sheets/Box, 36 Boxes/Carton", price: [32, 58], variants: [{ pack: "36/Carton", color: "White" }] },
  { shape: "paperTowel", brand: "ProClean", name: "Paper Towels, Perforated Roll, 2-Ply, 85 Sheets, 30 Rolls/Carton", price: [28, 52], variants: [{ pack: "30/Carton", color: "White" }] },
  { shape: "paperTowel", brand: "FacilityMax", name: "Shop Towels, Heavy-Duty, Blue, 200 Sheets/Box, 8 Boxes/Carton", price: [42, 78], variants: [{ color: "Blue", pack: "8/Carton" }] },
  { shape: "notebook", brand: "DeskMate", name: "Spiral Notebook, 1-Subject, College Ruled, 70 Sheets, {color}, 12/Pack", price: [14, 28], variants: ["Blue", "Red", "Green", "Black"].map((color) => ({ color, pack: "12/Pack" })) },
  { shape: "notebook", brand: "OfficePro", name: "Composition Book, Wide Ruled, 100 Sheets, Black Marble, 12/Pack", price: [16, 32], variants: [{ color: "Black Marble", pack: "12/Pack" }] },
  { shape: "notebook", brand: "WorkDesk", name: "Steno Pad, Gregg Ruled, 6 x 9, Green Tint, 80 Sheets, 12/Pack", price: [12, 26], variants: [{ color: "Green Tint", pack: "12/Pack", size: "6 x 9" }] },
  { shape: "paper", brand: "SupplyCore", name: "Graph Paper Pad, 8.5 x 11, 4x4 Quad, 50 Sheets, 12/Pack", price: [14, 28], variants: [{ size: "8.5 x 11", pack: "12/Pack" }] },
  { shape: "paper", brand: "OfficePro", name: "Printer Paper, Photo Glossy, Letter, 50 Sheets/Pack", price: [8, 18], variants: [{ size: "Letter", pack: "50/Pack" }] },
  { shape: "paper", brand: "SupplyCore", name: "Copy Paper, Tabloid 11 x 17, 20 lb, 92 Bright, 5 Reams/Carton", price: [42, 78], variants: [{ size: "11 x 17", pack: "5 Reams" }] },
  { shape: "notebook", brand: "DeskMate", name: "Wirebound Notebook, 3-Subject, College Ruled, 150 Sheets, Blue, 6/Pack", price: [18, 36], variants: [{ color: "Blue", pack: "6/Pack" }] },
  { shape: "tissue", brand: "ProClean", name: "Industrial Wiper Rolls, 2-Ply, White, 900 ft, 6 Rolls/Carton", price: [48, 88], variants: [{ color: "White", pack: "6/Carton" }] },
];

const BATHROOM = [
  { shape: "soap", brand: "ProClean", name: "Liquid Hand Soap Refill, {scent}, 1 gal, 4/Carton", price: [28, 55], variants: ["Fresh Scent", "Aloe", "Unscented"].map((scent) => ({ scent, pack: "4/Carton", size: "1 gal" })) },
  { shape: "soap", brand: "CleanForce", name: "Foam Soap Refill Cartridge, 1000 mL, 6/Carton", price: [36, 68], variants: [{ pack: "6/Carton", size: "1000 mL" }] },
  { shape: "sanitizer", brand: "ProClean", name: "Hand Sanitizer Refill Cartridge, 1200 mL, 4/Carton", price: [32, 62], variants: [{ pack: "4/Carton", size: "1200 mL" }] },
  { shape: "sanitizer", brand: "FacilityMax", name: "Hand Sanitizer Gel Pump Bottle, 1 L, 8/Carton", price: [28, 52], variants: [{ pack: "8/Carton", size: "1 L" }] },
  { shape: "dispenser", brand: "FacilityMax", name: "Soap Dispenser, Manual Push, Wall-Mount, {color}", price: [10, 28], variants: ["White", "Chrome", "Black"].map((color) => ({ color })) },
  { shape: "dispenser", brand: "CleanForce", name: "Touch-Free Soap Dispenser, Sensor, White, 1000 mL", price: [38, 78], variants: [{ color: "White", size: "1000 mL" }] },
  { shape: "dispenser", brand: "ProClean", name: "Toilet Tissue Dispenser, Jumbo Roll, Twin, Black", price: [28, 58], variants: [{ color: "Black" }] },
  { shape: "dispenser", brand: "FacilityMax", name: "Paper Towel Dispenser, Multifold, Wall-Mount, White", price: [22, 48], variants: [{ color: "White" }] },
  { shape: "tissue", brand: "ProClean", name: "Toilet Tissue, 2-Ply, Standard Roll, 500 Sheets, 48 Rolls/Carton", price: [28, 52], variants: [{ pack: "48/Carton", color: "White" }] },
  { shape: "tissue", brand: "CleanForce", name: "Toilet Tissue, 2-Ply, Standard Roll, 500 Sheets, 96 Rolls/Carton", price: [48, 88], variants: [{ pack: "96/Carton", color: "White" }] },
  { shape: "tissue", brand: "FacilityMax", name: "Seat Cover Dispenser Refills, Half-Fold, 250/Pack, 20 Packs/Carton", price: [32, 58], variants: [{ pack: "5000/Carton" }] },
  { shape: "dispenser", brand: "SupplyCore", name: "Toilet Seat Cover Dispenser, Wall-Mount, White", price: [18, 38], variants: [{ color: "White" }] },
  { shape: "spray", brand: "ProClean", name: "Restroom Air Freshener Refill, {scent}, Metered, 12/Carton", price: [28, 52], variants: ["Citrus", "Ocean Breeze"].map((scent) => ({ scent, pack: "12/Carton" })) },
  { shape: "canister", brand: "CleanForce", name: "Urinal Screens, Deodorizing, Fresh Scent, 12/Box", price: [14, 32], variants: [{ scent: "Fresh Scent", pack: "12/Box" }] },
  { shape: "trashCan", brand: "FacilityMax", name: "Sanitary Napkin Receptacle, Wall-Mount, White", price: [22, 48], variants: [{ color: "White" }] },
];

const STORAGE = [
  { shape: "bin", brand: "SupplyCore", name: "Storage Bin with Lid, Plastic, {size}, {color}", price: [8, 28], variants: [
    { size: "5 gal", color: "Clear" },
    { size: "10 gal", color: "Clear" },
    { size: "20 gal", color: "Blue" },
  ] },
  { shape: "tote", brand: "FacilityMax", name: "Heavy-Duty Tote, Latch Lid, {size}, Gray", price: [12, 36], variants: [
    { size: "27 gal", color: "Gray" },
    { size: "35 gal", color: "Gray" },
  ] },
  { shape: "bin", brand: "WorkDesk", name: "Stackable Storage Bin, Open Front, {size}, Blue", price: [6, 22], variants: [
    { size: "Small", color: "Blue" },
    { size: "Medium", color: "Blue" },
    { size: "Large", color: "Blue" },
  ] },
  { shape: "shelf", brand: "SupplyCore", name: "Wire Shelf Clip Set, Compatible 4-Post Shelving, 8/Pack", price: [8, 18], variants: [{ pack: "8/Pack", color: "Chrome" }] },
  { shape: "shelf", brand: "FacilityMax", name: "Shelf Divider Set, Wire, 12 in, Chrome, 6/Pack", price: [14, 32], variants: [{ pack: "6/Pack", size: "12 in", color: "Chrome" }] },
  { shape: "bin", brand: "WorkDesk", name: "Under-Desk Storage Drawer, Plastic, Mesh Front, Black", price: [16, 36], variants: [{ color: "Black" }] },
  { shape: "tote", brand: "SupplyCore", name: "File Tote Box, Letter/Legal, Plastic Lid, Clear", price: [10, 24], variants: [{ color: "Clear", size: "Letter/Legal" }] },
  { shape: "container", brand: "FacilityMax", name: "Corrugated Storage Box, Letter/Legal, Lift-Off Lid, 12/Carton", price: [28, 52], variants: [{ pack: "12/Carton", color: "Kraft" }] },
  { shape: "bin", brand: "WorkDesk", name: "Cube Storage Bin, Fabric, Foldable, {color}, 6/Pack", price: [18, 38], variants: ["Gray", "Black"].map((color) => ({ color, pack: "6/Pack" })) },
];

const CATALOG = [
  ["office", OFFICE],
  ["janitorial", JANITORIAL],
  ["technology", TECHNOLOGY],
  ["furniture", FURNITURE],
  ["food", FOOD],
  ["industrial", INDUSTRIAL],
  ["lighting", LIGHTING],
  ["paper", PAPER],
  ["bathroom", BATHROOM],
  ["storage", STORAGE],
];

const HELPERS = `
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsBySlugs(slugs: readonly string[]): Product[] {
  return slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is Product => p !== undefined);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestsellerProducts(): Product[] {
  return products.filter((p) => p.bestseller);
}

export function getNewArrivals(): Product[] {
  return products.filter((p) => p.newArrival);
}

export function getDealProducts(): Product[] {
  return products.filter((p) => p.salePrice);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
  );
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function getEffectivePrice(product: Product): number {
  return product.salePrice ?? product.price;
}
`.trimStart();

function serializeProduct(p) {
  const lines = [];
  lines.push("  {");
  lines.push(`    id: ${JSON.stringify(p.id)},`);
  lines.push(`    slug: ${JSON.stringify(p.slug)},`);
  lines.push(`    name: ${JSON.stringify(p.name)},`);
  lines.push(`    category: ${JSON.stringify(p.category)},`);
  lines.push(`    categorySlug: ${JSON.stringify(p.categorySlug)},`);
  lines.push(`    images: ${JSON.stringify(p.images)},`);
  lines.push(`    description: ${JSON.stringify(p.description)},`);
  lines.push(`    features: ${JSON.stringify(p.features)},`);
  lines.push(`    specifications: ${JSON.stringify(p.specifications)},`);
  lines.push(`    price: ${p.price},`);
  if (p.salePrice != null) lines.push(`    salePrice: ${p.salePrice},`);
  lines.push(`    rating: ${p.rating},`);
  lines.push(`    reviews: ${p.reviews},`);
  lines.push(`    stock: ${p.stock},`);
  if (p.badge) lines.push(`    badge: ${JSON.stringify(p.badge)},`);
  if (p.featured) lines.push(`    featured: true,`);
  if (p.bestseller) lines.push(`    bestseller: true,`);
  if (p.newArrival) lines.push(`    newArrival: true,`);
  lines.push(`    sku: ${JSON.stringify(p.sku)},`);
  lines.push("  }");
  return lines.join("\n");
}

function buildProducts() {
  const raw = [];
  for (const [key, defs] of CATALOG) {
    for (const def of defs) {
      raw.push(...expand(def, key).map((p) => ({ ...p, shape: def.shape || "default" })));
    }
  }

  // Deduplicate slugs
  const usedSlugs = new Set();
  const products = [];
  let skuCounters = {};

  for (let i = 0; i < raw.length; i++) {
    const r = raw[i];
    let base = slugify(r.name);
    let slug = base;
    let n = 2;
    while (usedSlugs.has(slug)) {
      slug = `${base}-${n++}`;
    }
    usedSlugs.add(slug);

    const prefix = r.skuPrefix;
    skuCounters[prefix] = (skuCounters[prefix] || 0) + 1;
    const sku = `ACC-${prefix}-${String(skuCounters[prefix]).padStart(3, "0")}`;

    products.push({
      id: `p${i + 1}`,
      slug,
      name: r.name,
      category: r.category,
      categorySlug: r.categorySlug,
      images: [`/products/${slug}-1.svg`, `/products/${slug}-2.svg`],
      description: r.description,
      features: r.features,
      specifications: r.specifications,
      price: r.price,
      rating: rating(),
      reviews: reviews(),
      stock: stock(),
      sku,
      shape: r.shape,
    });
  }

  // Assign sale (~20%), featured (~40), bestseller (~40), newArrival (~25)
  const indices = products.map((_, i) => i);
  // shuffle with seeded rand
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const saleCount = Math.round(products.length * 0.2);
  const featuredCount = 40;
  const bestsellerCount = 40;
  const newArrivalCount = 25;

  for (let i = 0; i < saleCount; i++) {
    const p = products[indices[i]];
    p.salePrice = money(p.price * (0.72 + rand() * 0.18));
    p.badge = "Sale";
  }
  for (let i = 0; i < featuredCount; i++) {
    products[indices[(saleCount + i) % products.length]].featured = true;
  }
  for (let i = 0; i < bestsellerCount; i++) {
    products[indices[(saleCount + featuredCount + i) % products.length]].bestseller = true;
  }
  for (let i = 0; i < newArrivalCount; i++) {
    products[indices[(saleCount + featuredCount + bestsellerCount + i) % products.length]].newArrival = true;
  }

  return products;
}

function writeProductsTs(products) {
  const body = products.map(serializeProduct).join(",\n");
  const content = `import { Product } from "@/types";

export const products: Product[] = [
${body},
];

${HELPERS}`;
  fs.writeFileSync(PRODUCTS_TS, content, "utf8");
}

function clearOldProductImages(keepSlugs) {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
    return;
  }
  const keep = new Set();
  for (const slug of keepSlugs) {
    keep.add(`${slug}-1.svg`);
    keep.add(`${slug}-2.svg`);
  }
  // Preserve non-product assets like review-photo.svg
  keep.add("review-photo.svg");

  for (const file of fs.readdirSync(IMAGES_DIR)) {
    if (!file.endsWith(".svg") && !file.endsWith(".jpg") && !file.endsWith(".png") && !file.endsWith(".webp")) {
      continue;
    }
    if (file === "review-photo.svg") continue;
    // Clear old catalog images; regenerating SVGs anyway
    if (!keep.has(file)) {
      try {
        fs.unlinkSync(path.join(IMAGES_DIR, file));
      } catch {
        /* ignore */
      }
    }
  }
}

function writeImages(products) {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  for (const p of products) {
    const svg1 = makeSvg(p.name, p.shape, 1);
    const svg2 = makeSvg(p.name, p.shape, 2);
    fs.writeFileSync(path.join(IMAGES_DIR, `${p.slug}-1.svg`), svg1, "utf8");
    fs.writeFileSync(path.join(IMAGES_DIR, `${p.slug}-2.svg`), svg2, "utf8");
  }
}

function main() {
  console.log("Generating ACCION catalog…");
  const products = buildProducts();
  const count = products.length;
  console.log(`Built ${count} products`);

  const byCat = {};
  for (const p of products) {
    byCat[p.categorySlug] = (byCat[p.categorySlug] || 0) + 1;
  }
  for (const [k, v] of Object.entries(byCat)) {
    console.log(`  ${k}: ${v}`);
  }
  console.log(`  sale: ${products.filter((p) => p.salePrice).length}`);
  console.log(`  featured: ${products.filter((p) => p.featured).length}`);
  console.log(`  bestseller: ${products.filter((p) => p.bestseller).length}`);
  console.log(`  newArrival: ${products.filter((p) => p.newArrival).length}`);

  if (count < 280 || count > 320) {
    console.warn(`WARNING: product count ${count} outside target 280–320`);
  }

  clearOldProductImages(products.map((p) => p.slug));
  writeProductsTs(products);
  writeImages(products);

  console.log(`Wrote ${PRODUCTS_TS}`);
  console.log(`Wrote ${count * 2} SVGs to ${IMAGES_DIR}`);
  console.log("Done.");
}

main();
