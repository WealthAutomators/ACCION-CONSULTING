#!/usr/bin/env python3
"""Apply user-provided Accion packshots/banners and remap product/homepage images."""
from pathlib import Path
import re
import shutil

ASSETS = Path("/Users/solomon/.cursor/projects/Users-solomon-Documents-LLC-Websites-ACCION/assets")
ROOT = Path("/Users/solomon/Documents/LLC Websites/ACCION")
PUB = ROOT / "public"
PRODUCTS = ROOT / "data" / "products.ts"
HOMEPAGE = ROOT / "data" / "homepage.ts"
CATEGORIES = ROOT / "data" / "categories.ts"

for d in [PUB / "hero", PUB / "banners", PUB / "categories", PUB / "products" / "custom"]:
    d.mkdir(parents=True, exist_ok=True)

# source filename -> list of destinations relative to public/
COPIES = [
    ("Untitled-design-41-e336d37c-01b8-490b-9de1-cddd87dfa492.png", "hero/hero-cleaning.png"),
    ("Untitled-design-39-6f7a2929-8b56-4b43-b41b-381c17db6066.png", "hero/hero-dawn.png"),
    ("Untitled-design-40-55b96569-6c4d-47cb-8ac6-21100faefa08.png", "hero/hero-stationery.png"),
    ("imgi_24_banner_630x387-81bf7adc-1dd8-4776-98ae-5840d7d40c5d.png", "banners/promo-tork.png"),
    ("imgi_25_Untitled_design_9_630x387-83e24467-b638-4366-9321-edddf146754c.png", "banners/promo-rubbermaid.png"),
    ("Untitled-design-41-e336d37c-01b8-490b-9de1-cddd87dfa492.png", "banners/newsletter.png"),
    ("807759-87a96243-223b-4a1c-b1f0-767252d48011.png", "categories/featured-disinfectant.png"),
    ("192711-617484d4-4ff1-4a0e-8372-ab087b379c6c.png", "categories/featured-coffee.png"),
    ("720222-59ce8f70-6ada-47e9-99ef-82e2e3868402.png", "categories/featured-tissues.png"),
    ("816931-24e3b752-aaf1-46f2-b3cc-1274a2b06734.png", "categories/featured-electronics.png"),
    ("18738-3e0947c8-a980-4c66-9249-212ac8479e23.png", "categories/featured-office.png"),
    ("imgi_25_Untitled_design_9_630x387-83e24467-b638-4366-9321-edddf146754c.png", "categories/featured-industrial.png"),
    ("673757-6b7c630a-5de6-46f3-914b-39ea878ebc3b.png", "products/custom/clorox-wipes.png"),
    ("807759-87a96243-223b-4a1c-b1f0-767252d48011.png", "products/custom/lysol-wipes.png"),
    ("727584-7c73699f-cbc3-481b-bc5a-ede39b85a04d.png", "products/custom/dial-gold-soap.png"),
    ("748318-b4c52efc-6672-49cf-b01c-6ea46d8626de.png", "products/custom/dial-basics-soap.png"),
    ("816931-24e3b752-aaf1-46f2-b3cc-1274a2b06734.png", "products/custom/logitech-mouse.png"),
    ("234855-fb747259-8eac-4f42-a81d-5f0a611d1cec.png", "products/custom/logitech-wired-mouse.png"),
    ("720222-59ce8f70-6ada-47e9-99ef-82e2e3868402.png", "products/custom/seventh-gen-12.png"),
    ("720115-f8065f19-31cd-4b93-896e-e0a2d8e7d00f.png", "products/custom/seventh-gen-roll.png"),
    ("719537-2e7907cd-924c-4a68-87c0-24509b4334a8.png", "products/custom/seventh-gen-24.png"),
    ("192711-617484d4-4ff1-4a0e-8372-ab087b379c6c.png", "products/custom/new-england-coffee.png"),
    ("261355_d3dd6d94-218b-457e-90a1-868869b8f1f2-91030cc7-22d4-49cb-ba85-07fd49d6d204.png", "products/custom/day-to-day-coffee.png"),
    ("146114-cc6b4e89-deb6-4c80-9fb5-4b8586962690.png", "products/custom/seattle-best-coffee.png"),
    ("18738-3e0947c8-a980-4c66-9249-212ac8479e23.png", "products/custom/zipper-pouch.png"),
    ("318787-6fae8685-fd74-4094-8dd0-b9dafdf57f21.png", "products/custom/marcal-tissue.png"),
    ("623696-7d50129c-30fd-47b3-803c-95bb309033e2.png", "products/custom/microban-spray.png"),
    ("771517-7528c210-ebcf-4655-b65c-cae0df9e32f0.png", "products/custom/weekly-planner.png"),
    ("image_525117fb-88ba-4533-ae52-14871cdb457e-d0a93b7d-7499-45a8-a0f1-370c2c0ad792.png", "products/custom/ata-glance-base.png"),
]

copied = 0
used_sources = set()
for src_name, dest_rel in COPIES:
    src = ASSETS / src_name
    if not src.exists():
        print("MISSING", src_name)
        continue
    dest = PUB / dest_rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dest)
    used_sources.add(src_name)
    copied += 1

shutil.copy2(PUB / "products/custom/ata-glance-base.png", PUB / "categories/featured-desks.png")
shutil.copy2(PUB / "products/custom/logitech-mouse.png", PUB / "categories/featured-led.png")

# Copy remaining assets into pool
pool_i = 1
for f in sorted(ASSETS.glob("*.png")):
    if f.name.startswith("Screenshot_"):
        continue
    if f.name in used_sources:
        continue
    dest = PUB / f"products/custom/pool-{pool_i:02d}.png"
    shutil.copy2(f, dest)
    pool_i += 1

print(f"Copied {copied} named assets, pool extras={pool_i-1}")

# Keyword -> custom image (first match wins for primary assignment)
KEYWORD_IMAGES = [
    (["lysol"], "/products/custom/lysol-wipes.png"),
    (["clorox"], "/products/custom/clorox-wipes.png"),
    (["microban", "sanitizing spray"], "/products/custom/microban-spray.png"),
    (["disinfecting wipe", "wipe"], "/products/custom/clorox-wipes.png"),
    (["basics", "hypoallergenic"], "/products/custom/dial-basics-soap.png"),
    (["hand soap", "soap refill", "foaming hand", "liquid hand", "soap dispenser"], "/products/custom/dial-gold-soap.png"),
    (["mouse", "mice"], "/products/custom/logitech-mouse.png"),
    (["keyboard"], "/products/custom/logitech-wired-mouse.png"),
    (["bath tissue", "toilet tissue", "bathroom tissue", "toilet paper"], "/products/custom/seventh-gen-12.png"),
    (["coffee", "creamer", "roast", "tea"], "/products/custom/new-england-coffee.png"),
    (["planner", "calendar", "desk calendar"], "/products/custom/weekly-planner.png"),
    (["clipboard", "nameplate", "label holder", "at-a-glance"], "/products/custom/ata-glance-base.png"),
    (["pouch", "zipper", "binder pouch", "pencil case"], "/products/custom/zipper-pouch.png"),
    (["folder", "binder", "stapler", "scissors", "pen", "marker", "tape", "label"], "/products/custom/zipper-pouch.png"),
]

CATEGORY_FALLBACK = {
    "office": [
        "/products/custom/zipper-pouch.png",
        "/products/custom/weekly-planner.png",
        "/products/custom/ata-glance-base.png",
    ],
    "janitorial": [
        "/products/custom/clorox-wipes.png",
        "/products/custom/lysol-wipes.png",
        "/products/custom/microban-spray.png",
        "/products/custom/dial-gold-soap.png",
        "/products/custom/dial-basics-soap.png",
    ],
    "technology": [
        "/products/custom/logitech-mouse.png",
        "/products/custom/logitech-wired-mouse.png",
    ],
    "food": [
        "/products/custom/new-england-coffee.png",
        "/products/custom/day-to-day-coffee.png",
        "/products/custom/seattle-best-coffee.png",
    ],
    "bathroom": [
        "/products/custom/seventh-gen-12.png",
        "/products/custom/seventh-gen-roll.png",
        "/products/custom/marcal-tissue.png",
        "/products/custom/seventh-gen-24.png",
        "/products/custom/dial-basics-soap.png",
    ],
    "paper": [
        "/products/custom/seventh-gen-12.png",
        "/products/custom/marcal-tissue.png",
        "/products/custom/seventh-gen-24.png",
    ],
    "furniture": [
        "/products/custom/ata-glance-base.png",
        "/products/custom/weekly-planner.png",
    ],
    "industrial": [
        "/products/custom/microban-spray.png",
        "/products/custom/clorox-wipes.png",
    ],
    "lighting": [
        "/products/custom/logitech-mouse.png",
    ],
    "storage": [
        "/products/custom/zipper-pouch.png",
        "/products/custom/ata-glance-base.png",
    ],
}

# Collect pool images for leftover fill
pool = sorted((PUB / "products/custom").glob("pool-*.png"))
pool_paths = [f"/products/custom/{p.name}" for p in pool]

text = PRODUCTS.read_text()
blocks = re.split(r"(?=\n  \{\n    id: )", text)
header = blocks[0]
product_blocks = blocks[1:]

cat_counters = {k: 0 for k in CATEGORY_FALLBACK}
updated = 0

def pick_image(name: str, category: str) -> str:
    lower = name.lower()
    for keys, img in KEYWORD_IMAGES:
        if any(k in lower for k in keys):
            return img
    fallbacks = CATEGORY_FALLBACK.get(category, [])
    if fallbacks:
        i = cat_counters[category] % len(fallbacks)
        cat_counters[category] += 1
        return fallbacks[i]
    if pool_paths:
        i = updated % len(pool_paths)
        return pool_paths[i]
    return "/products/custom/clorox-wipes.png"

new_blocks = []
for block in product_blocks:
    name_m = re.search(r'name: "([^"]+)"', block)
    cat_m = re.search(r'categorySlug: "([^"]+)"', block)
    if not name_m or not cat_m:
        new_blocks.append(block)
        continue
    img = pick_image(name_m.group(1), cat_m.group(1))
    # also use a secondary variant if available
    secondary = img
    if "mouse" in img and "wired" not in img:
        secondary = "/products/custom/logitech-wired-mouse.png"
    elif "seventh-gen-12" in img:
        secondary = "/products/custom/seventh-gen-roll.png"
    elif "clorox" in img:
        secondary = "/products/custom/lysol-wipes.png"
    elif "dial-gold" in img:
        secondary = "/products/custom/dial-basics-soap.png"
    elif "new-england" in img:
        secondary = "/products/custom/day-to-day-coffee.png"

    block2, n = re.subn(
        r'images: \[[^\]]+\]',
        f'images: ["{img}", "{secondary}"]',
        block,
        count=1,
    )
    if n:
        updated += 1
    new_blocks.append(block2)

PRODUCTS.write_text(header + "".join(new_blocks))
print(f"Updated {updated} product image refs")

# Update homepage heroes + promos + newsletter
hp = HOMEPAGE.read_text()
hp = hp.replace('"/hero/hero-cleaning.svg"', '"/hero/hero-cleaning.png"')
hp = hp.replace('"/hero/hero-office.svg"', '"/hero/hero-dawn.png"')
hp = hp.replace('"/hero/hero-breakroom.svg"', '"/hero/hero-stationery.png"')
hp = hp.replace('"/banners/promo-dispenser.svg"', '"/banners/promo-tork.png"')
hp = hp.replace('"/banners/promo-wipes.svg"', '"/banners/promo-rubbermaid.png"')
hp = hp.replace('"/banners/newsletter.svg"', '"/banners/newsletter.png"')

# Update hero copy to match banners
hp = re.sub(
    r'(id: "1",\n    image: "/hero/hero-cleaning.png",\n    headline: )"[^"]+"',
    r'\1"Commercial Cleaning Supplies"',
    hp,
)
hp = re.sub(
    r'(id: "2",\n    image: "/hero/hero-dawn.png",\n    headline: )"[^"]+"',
    r'\1"Dawn Dish Care Essentials"',
    hp,
)
hp = re.sub(
    r'(id: "3",\n    image: "/hero/hero-stationery.png",\n    headline: )"[^"]+"',
    r'\1"Stationery Sale This Week"',
    hp,
)

# Update promo banners titles to match images
hp = hp.replace(
    'title: "Elevation Liquid Skincare Dispenser"',
    'title: "Tork Soap and Sanitiser Systems"',
)
hp = hp.replace(
    'description: "Dispense confidence with professional soap and sanitiser systems."',
    'description: "Dispense confidence with Tork Soap and Sanitiser Systems."',
)
hp = hp.replace('manufacturer: "Accion"', 'manufacturer: "Tork"', 1)
hp = hp.replace(
    'title: "Commercial Disinfecting Wipes Carton"',
    'title: "Rubbermaid Commercial Products"',
)
hp = hp.replace(
    'description: "Facility-ready wipe canisters for high-touch surfaces."',
    'description: "Durable commercial waste, safety, and facility solutions."',
)
hp = hp.replace('manufacturer: "ProClean"', 'manufacturer: "Rubbermaid"')
HOMEPAGE.write_text(hp)

# Update featured category image paths to png
cat = CATEGORIES.read_text()
cat = cat.replace(".svg", ".png")
# category list images that may not exist as png - create from custom
for slug, src in [
    ("office", "products/custom/zipper-pouch.png"),
    ("janitorial", "products/custom/clorox-wipes.png"),
    ("technology", "products/custom/logitech-mouse.png"),
    ("furniture", "products/custom/ata-glance-base.png"),
    ("food", "products/custom/new-england-coffee.png"),
    ("industrial", "products/custom/microban-spray.png"),
    ("lighting", "products/custom/logitech-wired-mouse.png"),
    ("paper", "products/custom/seventh-gen-12.png"),
    ("bathroom", "products/custom/seventh-gen-roll.png"),
    ("storage", "products/custom/zipper-pouch.png"),
]:
    shutil.copy2(PUB / src, PUB / f"categories/{slug}.png")

CATEGORIES.write_text(cat)
print("Homepage + categories updated")
print("Done")
