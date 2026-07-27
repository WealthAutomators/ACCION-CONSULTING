/**
 * Generates commercial packshot-style homepage assets for ACCION.
 * Usage: node scripts/generate-homepage-assets.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "public");
const GREEN = "#1B4D3E";
const GREEN_LIGHT = "#2D6A56";
const GRAY = "#9CA3AF";
const LIGHT = "#F3F4F6";

function packshot(width, height, label, shape = "box") {
  const cx = width / 2;
  const cy = height / 2 - 10;
  let shapeSvg = "";
  if (shape === "bottle") {
    shapeSvg = `
      <rect x="${cx - 28}" y="${cy - 70}" width="56" height="120" rx="8" fill="${GREEN}" opacity="0.9"/>
      <rect x="${cx - 16}" y="${cy - 90}" width="32" height="24" rx="4" fill="${GREEN_LIGHT}"/>
      <rect x="${cx - 20}" y="${cy - 40}" width="40" height="36" rx="3" fill="white" opacity="0.85"/>`;
  } else if (shape === "can") {
    shapeSvg = `
      <ellipse cx="${cx}" cy="${cy - 55}" rx="42" ry="14" fill="${GREEN_LIGHT}"/>
      <rect x="${cx - 42}" y="${cy - 55}" width="84" height="100" fill="${GREEN}"/>
      <ellipse cx="${cx}" cy="${cy + 45}" rx="42" ry="14" fill="${GREEN_LIGHT}"/>
      <rect x="${cx - 28}" y="${cy - 25}" width="56" height="40" rx="3" fill="white" opacity="0.85"/>`;
  } else if (shape === "desk") {
    shapeSvg = `
      <rect x="${cx - 90}" y="${cy - 10}" width="180" height="14" rx="2" fill="${GREEN}"/>
      <rect x="${cx - 80}" y="${cy + 4}" width="12" height="50" fill="${GREEN_LIGHT}"/>
      <rect x="${cx + 68}" y="${cy + 4}" width="12" height="50" fill="${GREEN_LIGHT}"/>
      <rect x="${cx - 40}" y="${cy - 45}" width="80" height="35" rx="2" fill="${LIGHT}" stroke="${GREEN}" stroke-width="2"/>`;
  } else if (shape === "bulb") {
    shapeSvg = `
      <circle cx="${cx}" cy="${cy - 20}" r="40" fill="${GREEN}" opacity="0.85"/>
      <rect x="${cx - 16}" y="${cy + 15}" width="32" height="28" rx="3" fill="${GRAY}"/>
      <rect x="${cx - 12}" y="${cy + 42}" width="24" height="8" rx="2" fill="${GREEN_LIGHT}"/>`;
  } else if (shape === "coffee") {
    shapeSvg = `
      <path d="M${cx - 35} ${cy - 50} L${cx + 35} ${cy - 50} L${cx + 28} ${cy + 45} L${cx - 28} ${cy + 45} Z" fill="${GREEN}"/>
      <rect x="${cx - 22}" y="${cy - 25}" width="44" height="35" rx="2" fill="white" opacity="0.85"/>
      <ellipse cx="${cx}" cy="${cy - 50}" rx="35" ry="8" fill="${GREEN_LIGHT}"/>`;
  } else if (shape === "tissue") {
    shapeSvg = `
      <rect x="${cx - 55}" y="${cy - 35}" width="110" height="70" rx="4" fill="${GREEN}"/>
      <rect x="${cx - 45}" y="${cy - 25}" width="90" height="50" rx="2" fill="white" opacity="0.9"/>
      <path d="M${cx - 20} ${cy - 35} Q${cx} ${cy - 60} ${cx + 20} ${cy - 35}" fill="white" stroke="${GRAY}" stroke-width="1"/>`;
  } else if (shape === "tech") {
    shapeSvg = `
      <ellipse cx="${cx}" cy="${cy + 10}" rx="55" ry="35" fill="${GREEN}"/>
      <ellipse cx="${cx - 15}" cy="${cy}" rx="8" ry="12" fill="${LIGHT}"/>
      <rect x="${cx + 10}" y="${cy - 5}" width="28" height="10" rx="5" fill="${GREEN_LIGHT}"/>`;
  } else {
    shapeSvg = `
      <rect x="${cx - 55}" y="${cy - 55}" width="110" height="110" rx="8" fill="${GREEN}" opacity="0.92"/>
      <rect x="${cx - 38}" y="${cy - 28}" width="76" height="50" rx="3" fill="white" opacity="0.88"/>`;
  }

  const safeLabel = label.replace(/[<>&]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#FFFFFF"/>
  ${shapeSvg}
  <text x="50%" y="${height - 28}" text-anchor="middle" fill="${GRAY}" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="600">${safeLabel}</text>
</svg>`;
}

function lifestyleBanner(width, height, title, subtitle) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#1B4D3E"/>
      <stop offset="1" stop-color="#0F2F26"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <circle cx="${width * 0.8}" cy="${height * 0.2}" r="120" fill="#2D6A56" opacity="0.35"/>
  <circle cx="${width * 0.15}" cy="${height * 0.75}" r="90" fill="#2D6A56" opacity="0.25"/>
  <text x="50%" y="46%" text-anchor="middle" fill="#FFFFFF" font-family="Inter, system-ui, sans-serif" font-size="36" font-weight="700">${title}</text>
  <text x="50%" y="56%" text-anchor="middle" fill="#FFFFFF" font-family="Inter, system-ui, sans-serif" font-size="18" opacity="0.8">${subtitle}</text>
</svg>`;
}

function heroImage(width, height, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#F8FAF9"/>
  <rect x="40" y="40" width="${width - 80}" height="${height - 80}" fill="#FFFFFF" stroke="#E5E7E6" stroke-width="1"/>
  <g transform="translate(${width / 2 - 180}, ${height / 2 - 60})">
    <rect x="0" y="20" width="70" height="100" rx="8" fill="${GREEN}"/>
    <rect x="90" y="0" width="80" height="120" rx="6" fill="${GREEN_LIGHT}"/>
    <rect x="190" y="30" width="60" height="90" rx="10" fill="${GREEN}"/>
    <rect x="270" y="10" width="90" height="110" rx="4" fill="${GREEN_LIGHT}"/>
  </g>
  <text x="50%" y="${height - 50}" text-anchor="middle" fill="${GREEN}" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="700">${label}</text>
</svg>`;
}

// Heroes
fs.mkdirSync(path.join(root, "hero"), { recursive: true });
[
  ["hero-cleaning.jpg", "Commercial Cleaning Supplies"],
  ["hero-office.jpg", "Office Essentials"],
  ["hero-breakroom.jpg", "Breakroom & Coffee"],
].forEach(([name, label]) => {
  // Write as SVG with .jpg path expected - also write .svg and copy naming for next/image
  const svgName = name.replace(".jpg", ".svg");
  fs.writeFileSync(path.join(root, "hero", svgName), heroImage(1400, 600, label));
});

// Categories
fs.mkdirSync(path.join(root, "categories"), { recursive: true });
const categoryAssets = [
  ["office.jpg", "Office", "box"],
  ["janitorial.jpg", "Janitorial", "bottle"],
  ["technology.jpg", "Technology", "tech"],
  ["furniture.jpg", "Furniture", "desk"],
  ["food.jpg", "Food", "coffee"],
  ["industrial.jpg", "Industrial", "box"],
  ["lighting.jpg", "Lighting", "bulb"],
  ["paper.jpg", "Paper", "tissue"],
  ["bathroom.jpg", "Bathroom", "bottle"],
  ["storage.jpg", "Storage", "box"],
  ["featured-disinfectant.jpg", "Disinfectant", "bottle"],
  ["featured-coffee.jpg", "Coffee", "coffee"],
  ["featured-tissues.jpg", "Tissues", "tissue"],
  ["featured-led.jpg", "LED Bulbs", "bulb"],
  ["featured-desks.jpg", "Desks", "desk"],
  ["featured-electronics.jpg", "Electronics", "tech"],
  ["featured-office.jpg", "Office", "box"],
  ["featured-industrial.jpg", "Industrial", "can"],
];
categoryAssets.forEach(([name, label, shape]) => {
  const svgName = name.replace(".jpg", ".svg");
  fs.writeFileSync(path.join(root, "categories", svgName), packshot(600, 600, label, shape));
});

// Banners
fs.mkdirSync(path.join(root, "banners"), { recursive: true });
fs.writeFileSync(
  path.join(root, "banners", "promo-dispenser.svg"),
  packshot(800, 600, "Soap Dispenser", "bottle")
);
fs.writeFileSync(
  path.join(root, "banners", "promo-wipes.svg"),
  packshot(800, 600, "Disinfecting Wipes", "can")
);
fs.writeFileSync(
  path.join(root, "banners", "newsletter.svg"),
  lifestyleBanner(1600, 700, "Join Our Newsletter", "Workplace essentials, delivered")
);
fs.writeFileSync(
  path.join(root, "banners", "featured.svg"),
  lifestyleBanner(1200, 600, "Featured Products", "Accion Collections")
);
fs.writeFileSync(
  path.join(root, "banners", "about.svg"),
  lifestyleBanner(1200, 600, "About Accion", "Office & Facility Supplies")
);

console.log("Generated homepage assets (SVG).");
