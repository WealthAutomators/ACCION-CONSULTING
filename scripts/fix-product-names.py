#!/usr/bin/env python3
"""Rename products so names/descriptions match their assigned custom images."""
from pathlib import Path
import re

PRODUCTS = Path("/Users/solomon/Documents/LLC Websites/ACCION/data/products.ts")

# image basename -> list of (name, description, specs, category, categorySlug) variants
TEMPLATES = {
    "clorox-wipes": {
        "category": "Janitorial Supplies & Cleaning",
        "categorySlug": "janitorial",
        "variants": [
            ("Clorox Disinfecting Wipes, Fresh Scent, 75/Canister, 6/Carton", "Clorox disinfecting wipes kill 99.9% of viruses and bacteria. Fresh scent formula safe on finished wood, sealed granite, and stainless steel. Facility-ready canisters for offices and restrooms.", {"Brand": "Clorox", "Scent": "Fresh Scent", "Count": "75 Wipes", "Pack": "6/Carton", "Type": "Disinfecting Wipes"}),
            ("Clorox Disinfecting Wipes, Fresh Scent, 75/Canister, 12/Carton", "Bulk Clorox disinfecting wipe canisters for high-touch surfaces across commercial workplaces.", {"Brand": "Clorox", "Scent": "Fresh Scent", "Count": "75 Wipes", "Pack": "12/Carton", "Type": "Disinfecting Wipes"}),
            ("Clorox Disinfecting Wipes, Fresh Scent, Value Pack, 75 Count", "Value-size Clorox wipe canisters for everyday facility disinfection.", {"Brand": "Clorox", "Scent": "Fresh Scent", "Count": "75 Wipes", "Pack": "Canister", "Type": "Disinfecting Wipes"}),
        ],
    },
    "lysol-wipes": {
        "category": "Janitorial Supplies & Cleaning",
        "categorySlug": "janitorial",
        "variants": [
            ("Lysol Disinfecting Wipes, Lemon & Lime Blossom, 80 Wet Wipes", "Lysol flat-pack disinfecting wipes kill cold and flu viruses. Lemon & Lime Blossom scent for offices and breakrooms.", {"Brand": "Lysol", "Scent": "Lemon & Lime Blossom", "Count": "80 Wipes", "Format": "Flat Pack", "Type": "Disinfecting Wipes"}),
            ("Lysol Disinfecting Wipes, Lemon & Lime Blossom, 80 Count, 6/Carton", "Carton of Lysol soft-pack wipes for commercial cleaning carts and janitorial closets.", {"Brand": "Lysol", "Scent": "Lemon & Lime Blossom", "Count": "80 Wipes", "Pack": "6/Carton", "Type": "Disinfecting Wipes"}),
        ],
    },
    "microban-spray": {
        "category": "Janitorial Supplies & Cleaning",
        "categorySlug": "janitorial",
        "variants": [
            ("Microban 24 Hour Sanitizing Spray, Citrus Scent, Aerosol", "Microban Professional sanitizing spray keeps killing 99.9% of bacteria for up to 24 hours. Citrus scent for commercial spaces.", {"Brand": "Microban", "Scent": "Citrus", "Format": "Aerosol", "Protection": "24 Hour", "Type": "Sanitizing Spray"}),
            ("Microban Professional 24 Hour Sanitizing Spray, Citrus, 15 oz", "Facility-grade Microban spray for offices, restrooms, and shared workspaces.", {"Brand": "Microban", "Scent": "Citrus", "Size": "15 oz", "Protection": "24 Hour", "Type": "Sanitizing Spray"}),
        ],
    },
    "dial-gold-soap": {
        "category": "Bathroom",
        "categorySlug": "bathroom",
        "variants": [
            ("Dial Professional Antibacterial Liquid Hand Soap, Original Gold, 32 oz Refill", "Dial Professional antibacterial liquid hand soap refill kills 99.9% of bacteria. NSF E2 certified Original Gold formula for commercial dispensers.", {"Brand": "Dial Professional", "Scent": "Original Gold", "Size": "32 FL OZ", "Type": "Liquid Hand Soap", "Cert": "NSF E2"}),
            ("Dial Professional Antibacterial Liquid Hand Soap Refill, 32 oz, 12/Carton", "Carton of Dial Professional gold antibacterial soap refills for restroom dispensers.", {"Brand": "Dial Professional", "Size": "32 FL OZ", "Pack": "12/Carton", "Type": "Liquid Hand Soap"}),
        ],
    },
    "dial-basics-soap": {
        "category": "Bathroom",
        "categorySlug": "bathroom",
        "variants": [
            ("Dial Professional Basics Hypoallergenic Foaming Hand Wash, 1 L Manual Refill", "Dial Professional Basics hypoallergenic foaming hand wash with Vitamin E. Clear green formula for manual commercial dispensers.", {"Brand": "Dial Professional", "Line": "Basics", "Size": "1 Liter", "Type": "Foaming Hand Wash", "Cert": "EcoLogo"}),
            ("Dial Professional Basics Foaming Hand Wash Refill, Hypoallergenic, 1.0 L", "Gentle foaming hand wash refill designed for workplace restrooms and breakrooms.", {"Brand": "Dial Professional", "Line": "Basics", "Size": "1.0 L", "Type": "Foaming Hand Wash"}),
        ],
    },
    "logitech-mouse": {
        "category": "Technology",
        "categorySlug": "technology",
        "variants": [
            ("Logitech Wireless Optical Mouse, Ambidextrous, Matte Black", "Logitech wireless optical mouse with ambidextrous design, quiet clicks, and plug-and-play USB receiver for office workstations.", {"Brand": "Logitech", "Connectivity": "Wireless 2.4 GHz", "Color": "Black", "Type": "Optical Mouse"}),
            ("Logitech Silent Wireless Mouse, Black, USB Receiver", "Quiet wireless mouse for open offices and shared desks.", {"Brand": "Logitech", "Connectivity": "Wireless", "Color": "Black", "Type": "Mouse"}),
            ("Logitech Wireless Mouse, Compact Office Design, Charcoal", "Compact Logitech wireless mouse for everyday office productivity.", {"Brand": "Logitech", "Color": "Charcoal", "Type": "Wireless Mouse"}),
        ],
    },
    "logitech-wired-mouse": {
        "category": "Technology",
        "categorySlug": "technology",
        "variants": [
            ("Logitech B100 Wired Optical Mouse, Black, USB", "Reliable Logitech wired optical mouse with ambidextrous shape for high-volume office deployments.", {"Brand": "Logitech", "Connectivity": "Wired USB", "Color": "Black", "Type": "Optical Mouse"}),
            ("Logitech Wired Office Mouse, Black, Full-Size", "Full-size wired Logitech mouse for desktops and training rooms.", {"Brand": "Logitech", "Connectivity": "Wired", "Color": "Black", "Type": "Mouse"}),
        ],
    },
    "seventh-gen-12": {
        "category": "Bathroom",
        "categorySlug": "bathroom",
        "variants": [
            ("Seventh Generation 100% Recycled Bath Tissue, 12 Rolls, 2-Ply", "Seventh Generation 100% recycled bath tissue. Extra soft and strong, whitened without chlorine bleach. 12-roll pack for offices and facilities.", {"Brand": "Seventh Generation", "Rolls": "12", "Ply": "2-Ply", "Material": "100% Recycled"}),
            ("Seventh Generation Recycled Toilet Tissue, 12-Pack, Extra Soft", "Eco-friendly recycled bath tissue carton for workplace restrooms.", {"Brand": "Seventh Generation", "Rolls": "12", "Ply": "2-Ply"}),
        ],
    },
    "seventh-gen-24": {
        "category": "Bathroom",
        "categorySlug": "bathroom",
        "variants": [
            ("Seventh Generation 100% Recycled Bath Tissue, 24 Rolls, 2-Ply", "Bulk 24-roll Seventh Generation recycled bath tissue for facilities and multi-restroom buildings.", {"Brand": "Seventh Generation", "Rolls": "24", "Ply": "2-Ply", "Material": "100% Recycled"}),
        ],
    },
    "seventh-gen-roll": {
        "category": "Bathroom",
        "categorySlug": "bathroom",
        "variants": [
            ("Seventh Generation 100% Recycled Bathroom Tissue, 500 Sheets/Roll, 2-Ply", "Single-roll Seventh Generation recycled bathroom tissue with 500 two-ply sheets. Septic-safe and chlorine-bleach free whitening.", {"Brand": "Seventh Generation", "Sheets": "500", "Ply": "2-Ply", "Material": "100% Recycled"}),
        ],
    },
    "marcal-tissue": {
        "category": "Bathroom",
        "categorySlug": "bathroom",
        "variants": [
            ("Marcal Pro Bath Tissue, 100% Recycled Paper, Individually Wrapped Roll", "Marcal Pro commercial bath tissue wrapped for hospitality and facility restrooms. 100% recycled paper, septic-safe.", {"Brand": "Marcal Pro", "Material": "100% Recycled", "Format": "Wrapped Roll", "Type": "Bath Tissue"}),
        ],
    },
    "new-england-coffee": {
        "category": "Food",
        "categorySlug": "food",
        "variants": [
            ("New England Coffee Decaffeinated Breakfast Blend, Portion Packets, 42/Carton", "New England Coffee decaffeinated breakfast blend portion packets for office brewers and hospitality service.", {"Brand": "New England Coffee", "Blend": "Decaf Breakfast Blend", "Format": "Portion Packet", "Pack": "42/Carton"}),
            ("New England Coffee Decaf Breakfast Blend Packets, Case Pack", "Case of New England Coffee portion packs for breakroom coffee stations.", {"Brand": "New England Coffee", "Blend": "Decaf Breakfast Blend", "Format": "Portion Packet"}),
        ],
    },
    "day-to-day-coffee": {
        "category": "Food",
        "categorySlug": "food",
        "variants": [
            ("Day to Day Whole Bean Coffee, Dark Roast, Bulk Bags in Display Box", "Day to Day whole bean coffee in bulk foil bags. Commercial breakroom and cafe supply presentation.", {"Brand": "Day to Day", "Roast": "Dark", "Format": "Whole Bean Bags", "Type": "Coffee"}),
            ("Day to Day Coffee Beans, Bulk Foil Bags, Case", "Bulk Day to Day coffee beans for high-volume office brewing.", {"Brand": "Day to Day", "Format": "Whole Bean", "Type": "Coffee"}),
        ],
    },
    "seattle-best-coffee": {
        "category": "Food",
        "categorySlug": "food",
        "variants": [
            ("Seattle's Best Coffee French Vanilla Flavored Ground Coffee, Portion Pack", "Seattle's Best French Vanilla flavored ground coffee portion pack. Fair Trade Certified for office brewers.", {"Brand": "Seattle's Best", "Flavor": "French Vanilla", "Format": "Ground Portion Pack", "Cert": "Fair Trade"}),
        ],
    },
    "weekly-planner": {
        "category": "Office",
        "categorySlug": "office",
        "variants": [
            ("AT-A-GLANCE Weekly/Monthly Planner, Black Cover, Twin-Wire Binding", "Professional black weekly and monthly planner with twin-wire binding for desks and project tracking.", {"Brand": "AT-A-GLANCE", "Format": "Weekly/Monthly", "Color": "Black", "Binding": "Twin-Wire"}),
            ("Contemporary Academic Planner, Black, Weekly Spread", "Black weekly planner with monthly overview pages for office scheduling.", {"Brand": "AT-A-GLANCE", "Color": "Black", "Format": "Weekly"}),
        ],
    },
    "ata-glance-base": {
        "category": "Office",
        "categorySlug": "office",
        "variants": [
            ("AT-A-GLANCE Base for Tear-Off Daily Desk Calendar, Black", "Matte black AT-A-GLANCE desk calendar base with clear label window. Compatible with standard tear-off daily calendar refills.", {"Brand": "AT-A-GLANCE", "Color": "Black", "Type": "Desk Calendar Base"}),
            ("AT-A-GLANCE Desk Calendar Stand, Black, Refill Compatible", "Durable black desk calendar base for daily appointment refills.", {"Brand": "AT-A-GLANCE", "Color": "Black", "Type": "Calendar Base"}),
        ],
    },
    "zipper-pouch": {
        "category": "Office",
        "categorySlug": "office",
        "variants": [
            ("Expanding Zipper Pouch, Binder Compatible, Clear/Black, Letter Size", "Clear expanding zipper pouch with black trim and 3-ring binder grommets. Ideal for storing pens, cards, and small desk supplies.", {"Type": "Zipper Pouch", "Color": "Clear/Black", "Compatibility": "3-Ring Binder", "Size": "Letter"}),
        ],
    },
}

# Pool images - identify by reading filenames we assigned; use generic matching names from pool contents if unknown
# We'll set pool products to keep variety by rotating sensible office names based on current category

text = PRODUCTS.read_text()
blocks = re.split(r"(?=\n  \{\n    id: )", text)
header, rest = blocks[0], blocks[1:]
counters = {}
updated = 0

def fmt_specs(specs: dict) -> str:
    inner = ",".join(f'"{k}":"{v}"' for k, v in specs.items())
    return "{" + inner + "}"

out = []
for block in rest:
    img_m = re.search(r'images: \["/products/custom/([^"]+?)\.(?:png|jpg)"', block)
    if not img_m:
        out.append(block)
        continue
    key = img_m.group(1)
    # strip pool-XX stays as pool-XX
    base = key
    tmpl = TEMPLATES.get(base)
    if not tmpl:
        out.append(block)
        continue
    i = counters.get(base, 0)
    counters[base] = i + 1
    variants = tmpl["variants"]
    name, desc, specs = variants[i % len(variants)]
    # differentiate duplicates slightly
    if i >= len(variants):
        name = f"{name} (Pack {i + 1})"

    block = re.sub(r'name: "[^"]*"', f'name: "{name}"', block, count=1)
    block = re.sub(r'description: "[^"]*"', f'description: "{desc}"', block, count=1)
    block = re.sub(r'category: "[^"]*"', f'category: "{tmpl["category"]}"', block, count=1)
    block = re.sub(r'categorySlug: "[^"]*"', f'categorySlug: "{tmpl["categorySlug"]}"', block, count=1)
    block = re.sub(r'specifications: \{[^}]*\}', f'specifications: {fmt_specs(specs)}', block, count=1)
    # features stay generic but refresh first line
    block = re.sub(
        r'features: \[[^\]]*\]',
        f'features: ["Matches product imagery","Commercial packaging","Workplace ready","Bulk reorder friendly"]',
        block,
        count=1,
    )
    updated += 1
    out.append(block)

PRODUCTS.write_text(header + "".join(out))
print(f"Updated {updated} products to match images")
print("Counts:", counters)
