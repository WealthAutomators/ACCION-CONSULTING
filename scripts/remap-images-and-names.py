#!/usr/bin/env python3
"""
1) Rename every product whose image is a known custom/pool packshot to match that image.
2) Download targeted Unsplash packshots for remaining office/tech/cleaning products.
3) Remap leftover products onto those new images with matching names.
"""
from __future__ import annotations

import json
import os
import re
import time
import urllib.request
from pathlib import Path

ROOT = Path("/Users/solomon/Documents/LLC Websites/ACCION")
PRODUCTS = ROOT / "data" / "products.ts"
CUSTOM = ROOT / "public" / "products" / "custom"
UNSPLASH = ROOT / "public" / "products" / "unsplash"
UNSPLASH.mkdir(parents=True, exist_ok=True)

def load_key():
    env = ROOT / ".env.local"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("UNSPLASH_ACCESS_KEY="):
                return line.split("=", 1)[1].strip()
    return os.environ.get("UNSPLASH_ACCESS_KEY")

# Exact image -> product identity (name, description, category, categorySlug, specs)
IMAGE_META = {
    "pool-01.png": ("Boraxo by Dial Heavy Duty Hand Cleaner Dispenser, Orange Formula", "Wall-mount Boraxo heavy duty hand cleaner dispenser with dual scrubbers for industrial and workshop restrooms.", "Janitorial Supplies & Cleaning", "janitorial", {"Brand": "Boraxo", "Type": "Hand Cleaner Dispenser", "Formula": "Orange Heavy Duty"}),
    "pool-02.png": ("Dial Professional Manual Soap Dispenser, Smoke Front, Gray Lever", "Commercial Dial wall-mount soap dispenser with translucent front and push lever for restrooms.", "Bathroom", "bathroom", {"Brand": "Dial", "Type": "Manual Soap Dispenser", "Color": "Smoke/Gray"}),
    "pool-03.png": ("Logitech Wired Optical Mouse, Black, USB", "Logitech wired optical mouse with scroll wheel for everyday office computers.", "Technology", "technology", {"Brand": "Logitech", "Connectivity": "Wired USB", "Color": "Black"}),
    "pool-04.png": ("Boardwalk Manual Soap Dispenser, White/Gray, Wall-Mount", "Boardwalk commercial soap dispenser with fill window and push bar for facility restrooms.", "Bathroom", "bathroom", {"Brand": "Boardwalk", "Type": "Soap Dispenser", "Color": "White/Gray"}),
    "pool-05.png": ("Logitech Wireless Mouse, Charcoal, USB Receiver", "Logitech wireless mouse with ergonomic shape for office workstations.", "Technology", "technology", {"Brand": "Logitech", "Connectivity": "Wireless", "Color": "Charcoal"}),
    "pool-06.png": ("Angel Soft Professional Bath Tissue, Individually Wrapped Rolls", "Angel Soft Professional bath tissue with wrapped rolls for hospitality and commercial restrooms.", "Bathroom", "bathroom", {"Brand": "Angel Soft Professional", "Type": "Bath Tissue", "Format": "Wrapped Rolls"}),
    "pool-07.png": ("Wireless Optical Mouse with USB Nano Receiver, Black", "Sleek black wireless optical mouse with compact USB nano receiver for plug-and-play office use.", "Technology", "technology", {"Type": "Wireless Mouse", "Color": "Black", "Includes": "USB Nano Receiver"}),
    "pool-08.png": ("Dial Complete Antimicrobial Foaming Hand Wash, Original, 1.7 L Manual Refill", "Dial Complete Original antimicrobial foaming hand wash refill for 1700 Series manual dispensers. NSF E2 certified.", "Bathroom", "bathroom", {"Brand": "Dial Complete", "Size": "1.7 L", "Type": "Foaming Hand Wash"}),
    "pool-09.png": ("Scott 1000 Bath Tissue, 1000 Sheets/Roll, 20 Rolls", "Scott 1000 toilet tissue with 1000 sheets per roll. Sewer and septic safe. 20-roll pack for facilities.", "Bathroom", "bathroom", {"Brand": "Scott", "Sheets": "1000/Roll", "Pack": "20 Rolls"}),
    "pool-10.png": ("Dial Professional Antibacterial Liquid Hand Soap, 1 Liter Refill", "Dial Professional antibacterial liquid hand soap 1 L refill. Kills 99.9% of bacteria. NSF E2 certified.", "Bathroom", "bathroom", {"Brand": "Dial Professional", "Size": "1 Liter", "Type": "Liquid Hand Soap"}),
    "pool-11.png": ("Monthly Planner, Black Cover, Spiral-Bound, Jan–Dec", "Professional black spiral-bound monthly planner with full-year calendar grids for desk scheduling.", "Office", "office", {"Type": "Monthly Planner", "Color": "Black", "Binding": "Spiral"}),
    "clorox-wipes.png": ("Clorox Disinfecting Wipes, Fresh Scent, 75/Canister", "Clorox disinfecting wipes kill 99.9% of viruses and bacteria. Fresh scent for offices and facilities.", "Janitorial Supplies & Cleaning", "janitorial", {"Brand": "Clorox", "Count": "75", "Scent": "Fresh"}),
    "lysol-wipes.png": ("Lysol Disinfecting Wipes, Lemon & Lime Blossom, 80 Count", "Lysol flat-pack disinfecting wipes for cold and flu viruses in workplaces.", "Janitorial Supplies & Cleaning", "janitorial", {"Brand": "Lysol", "Count": "80", "Scent": "Lemon & Lime"}),
    "microban-spray.png": ("Microban 24 Hour Sanitizing Spray, Citrus Scent", "Microban Professional spray keeps killing 99.9% of bacteria for up to 24 hours.", "Janitorial Supplies & Cleaning", "janitorial", {"Brand": "Microban", "Scent": "Citrus"}),
    "dial-gold-soap.png": ("Dial Professional Antibacterial Liquid Hand Soap, Original Gold, 32 oz", "Dial Professional antibacterial soap refill, NSF E2, Original Gold.", "Bathroom", "bathroom", {"Brand": "Dial Professional", "Size": "32 oz"}),
    "dial-basics-soap.png": ("Dial Professional Basics Hypoallergenic Foaming Hand Wash, 1 L", "Dial Basics foaming hand wash refill with Vitamin E for manual dispensers.", "Bathroom", "bathroom", {"Brand": "Dial Professional", "Size": "1 L"}),
    "logitech-mouse.png": ("Logitech Wireless Optical Mouse, Matte Black", "Logitech ambidextrous wireless mouse for office computers.", "Technology", "technology", {"Brand": "Logitech", "Connectivity": "Wireless"}),
    "logitech-wired-mouse.png": ("Logitech B100 Wired Optical Mouse, Black", "Logitech wired optical mouse for high-volume office deployments.", "Technology", "technology", {"Brand": "Logitech", "Connectivity": "Wired"}),
    "seventh-gen-12.png": ("Seventh Generation 100% Recycled Bath Tissue, 12 Rolls, 2-Ply", "Seventh Generation recycled bath tissue, 12-roll pack.", "Bathroom", "bathroom", {"Brand": "Seventh Generation", "Rolls": "12"}),
    "seventh-gen-24.png": ("Seventh Generation 100% Recycled Bath Tissue, 24 Rolls, 2-Ply", "Seventh Generation recycled bath tissue, 24-roll bulk pack.", "Bathroom", "bathroom", {"Brand": "Seventh Generation", "Rolls": "24"}),
    "seventh-gen-roll.png": ("Seventh Generation 100% Recycled Bathroom Tissue, 500 Sheets/Roll", "Single-roll Seventh Generation recycled bathroom tissue, 500 sheets.", "Bathroom", "bathroom", {"Brand": "Seventh Generation", "Sheets": "500"}),
    "marcal-tissue.png": ("Marcal Pro Bath Tissue, 100% Recycled, Wrapped Roll", "Marcal Pro commercial wrapped bath tissue, 100% recycled.", "Bathroom", "bathroom", {"Brand": "Marcal Pro"}),
    "new-england-coffee.png": ("New England Coffee Decaffeinated Breakfast Blend Portion Packets", "New England Coffee decaf breakfast blend portion packs for office brewers.", "Food", "food", {"Brand": "New England Coffee"}),
    "day-to-day-coffee.png": ("Day to Day Whole Bean Coffee, Dark Roast, Bulk Bags", "Day to Day whole bean coffee in bulk foil bags for breakrooms.", "Food", "food", {"Brand": "Day to Day"}),
    "seattle-best-coffee.png": ("Seattle's Best Coffee French Vanilla Ground Coffee Portion Pack", "Seattle's Best French Vanilla flavored ground coffee portion pack.", "Food", "food", {"Brand": "Seattle's Best"}),
    "weekly-planner.png": ("AT-A-GLANCE Weekly/Monthly Planner, Black Twin-Wire", "Black AT-A-GLANCE weekly and monthly planner with twin-wire binding.", "Office", "office", {"Brand": "AT-A-GLANCE"}),
    "ata-glance-base.png": ("AT-A-GLANCE Base for Tear-Off Daily Desk Calendar, Black", "Matte black AT-A-GLANCE desk calendar base for daily refills.", "Office", "office", {"Brand": "AT-A-GLANCE"}),
    "zipper-pouch.png": ("Expanding Zipper Pouch, Clear/Black, Binder Compatible", "Clear expanding zipper pouch with black trim and 3-ring binder holes.", "Office", "office", {"Type": "Zipper Pouch"}),
}

# After identifying pools 07-11 from reads - update if different
# Will refine after reading results above in same turn - placeholders updated in next patch if needed

UNSPLASH_QUERIES = [
    ("ballpoint-pens", "ballpoint pens pack white background", "Ballpoint Pens, Medium Point, Black, 12/Pack", "Office", "office"),
    ("stapler", "office stapler black product white background", "Desktop Stapler, Full Strip, Black, 20-Sheet", "Office", "office"),
    ("scissors", "office scissors stainless steel white background", "Straight Scissors, 8 in, Soft Grip", "Office", "office"),
    ("binder", "ring binder office white background", "Round Ring Binder, 1 in, Letter Size", "Office", "office"),
    ("folders", "manila file folders stack white background", "Manila File Folders, Letter Size, 100/Box", "Office", "office"),
    ("notebook", "spiral notebook office white background", "Spiral Notebook, College Ruled, Letter", "Office", "office"),
    ("markers", "permanent markers pack white background", "Permanent Markers, Chisel Tip, Assorted, 12/Pack", "Office", "office"),
    ("tape", "packing tape roll white background", "Packaging Tape, Clear, 6/Pack", "Office", "office"),
    ("copy-paper", "copy paper ream stack white background", "Copy Paper, 8.5 x 11, 20 lb, 10 Reams/Carton", "Paper", "paper"),
    ("keyboard", "computer keyboard black white background", "Full-Size Wired Keyboard, USB, Black", "Technology", "technology"),
    ("monitor", "computer monitor office white background", "LED Computer Monitor, 24 in, Black", "Technology", "technology"),
    ("usb-hub", "usb hub white background product", "USB Hub, 4-Port, USB 3.0", "Technology", "technology"),
    ("webcam", "webcam computer white background", "HD Webcam with Microphone, Black", "Technology", "technology"),
    ("headset", "office headset white background", "USB Stereo Headset with Noise-Canceling Mic", "Technology", "technology"),
    ("power-strip", "power strip surge protector white background", "Surge Protector Power Strip, 6 Outlets", "Technology", "technology"),
    ("cleaning-spray", "cleaning spray bottle white background", "Multi-Surface Cleaning Spray, 32 oz", "Janitorial Supplies & Cleaning", "janitorial"),
    ("trash-bags", "trash bags roll white background", "Trash Bags, 33 Gallon, Drawstring, 100/Box", "Janitorial Supplies & Cleaning", "janitorial"),
    ("paper-towels", "paper towel roll white background", "Paper Towels, Perforated Roll, 2-Ply, 30 Rolls", "Paper", "paper"),
    ("mop-bucket", "mop bucket yellow white background", "Mop Bucket with Wringer, 35 qt, Yellow", "Janitorial Supplies & Cleaning", "janitorial"),
    ("gloves", "nitrile gloves box white background", "Nitrile Exam Gloves, Powder-Free, 100/Box", "Janitorial Supplies & Cleaning", "janitorial"),
    ("hand-sanitizer", "hand sanitizer bottle white background", "Hand Sanitizer Gel, 1 L Pump Bottle", "Bathroom", "bathroom"),
    ("office-chair", "office chair black white background", "Mesh Task Chair, Adjustable, Black", "Furniture", "furniture"),
    ("desk", "office desk white background product", "Writing Desk, 48 in, Laminate Top", "Furniture", "furniture"),
    ("filing-cabinet", "filing cabinet office white background", "Vertical Filing Cabinet, 2-Drawer, Black", "Furniture", "furniture"),
    ("led-bulb", "led light bulb white background", "LED A19 Bulb, Soft White, 8/Pack", "Lighting", "lighting"),
    ("desk-lamp", "desk lamp office white background", "LED Desk Lamp, Adjustable Arm, Black", "Lighting", "lighting"),
    ("coffee-maker", "office coffee maker white background", "Commercial Coffee Brewer, 12-Cup", "Food", "food"),
    ("paper-cups", "paper coffee cups stack white background", "Paper Hot Cups, 12 oz, 1000/Carton", "Food", "food"),
    ("hard-hat", "hard hat yellow white background", "Safety Hard Hat, Cap Style, Yellow", "Industrial", "industrial"),
    ("storage-bin", "plastic storage bin white background", "Storage Tote, 27 Gallon, Clear Lid", "Storage", "storage"),
]


def fmt_specs(specs: dict) -> str:
    return "{" + ",".join(f'"{k}":"{v}"' for k, v in specs.items()) + "}"


def search_and_download(key: str, slug: str, query: str) -> str | None:
    dest1 = UNSPLASH / f"{slug}-1.jpg"
    dest2 = UNSPLASH / f"{slug}-2.jpg"
    if dest1.exists() and dest2.exists():
        return f"/products/unsplash/{slug}-1.jpg"

    params = urllib.parse.urlencode({
        "query": query,
        "per_page": "2",
        "orientation": "squarish",
        "content_filter": "high",
    })
    req = urllib.request.Request(
        f"https://api.unsplash.com/search/photos?{params}",
        headers={"Authorization": f"Client-ID {key}", "Accept-Version": "v1"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as res:
            data = json.loads(res.read().decode())
    except Exception as e:
        print(f"search fail {slug}: {e}")
        return None

    results = data.get("results") or []
    if not results:
        print(f"no results {slug}: {query}")
        return None

    urls = []
    for r in results[:2]:
        urls.append(r["urls"]["raw"] + "&w=800&h=800&fit=crop&q=80")
    while len(urls) < 2:
        urls.append(urls[0])

    for i, url in enumerate(urls, 1):
        dest = UNSPLASH / f"{slug}-{i}.jpg"
        try:
            urllib.request.urlretrieve(url, dest)
        except Exception as e:
            print(f"dl fail {slug}-{i}: {e}")
            return None
    print(f"downloaded {slug}")
    time.sleep(1.1)
    return f"/products/unsplash/{slug}-1.jpg"


def main():
    import urllib.parse

    key = load_key()
    text = PRODUCTS.read_text()
    blocks = re.split(r"(?=\n  \{\n    id: )", text)
    header, rest = blocks[0], blocks[1:]

    # Refine pool-07..11 after visual ID - read from companion script results:
    # We'll update IMAGE_META for 07-11 based on parallel reads in this session.
    # For now if still generic dispenser, OK until refined below.

    # Pass 1: fix all products already pointing at custom images
    out = []
    custom_counts = {}
    for block in rest:
        m = re.search(r'images: \["(/products/custom/([^"]+))"', block)
        if not m:
            out.append(block)
            continue
        fname = m.group(2)
        meta = IMAGE_META.get(fname)
        if not meta:
            out.append(block)
            continue
        name, desc, cat, cat_slug, specs = meta
        n = custom_counts.get(fname, 0)
        custom_counts[fname] = n + 1
        if n > 0:
            name = f"{name} — Case {n + 1}"
        block = re.sub(r'name: "[^"]*"', f'name: "{name}"', block, count=1)
        block = re.sub(r'description: "[^"]*"', f'description: "{desc}"', block, count=1)
        block = re.sub(r'category: "[^"]*"', f'category: "{cat}"', block, count=1)
        block = re.sub(r'categorySlug: "[^"]*"', f'categorySlug: "{cat_slug}"', block, count=1)
        block = re.sub(r'specifications: \{[^}]*\}', f'specifications: {fmt_specs(specs)}', block, count=1)
        # ensure both image slots use same custom image
        path = m.group(1)
        block = re.sub(r'images: \[[^\]]+\]', f'images: ["{path}", "{path}"]', block, count=1)
        out.append(block)

    # Pass 2: download unsplash set
    downloaded = []
    if key:
        for slug, query, name, cat, cat_slug in UNSPLASH_QUERIES:
            path = search_and_download(key, slug, query)
            if path:
                downloaded.append((slug, path, name, cat, cat_slug))
    else:
        print("No Unsplash key")

    # Pass 3: remap products that still use old jpg/svg/unsplash-mismatched or non-custom
    # Prefer products whose names clearly don't match remaining custom overuse — remap by category buckets
    final = []
    unsplash_i = {q[0]: 0 for q in UNSPLASH_QUERIES}
    # Build list of unsplash assets by category
    by_cat = {}
    for slug, path, name, cat, cat_slug in downloaded:
        by_cat.setdefault(cat_slug, []).append((slug, path, name, cat, cat_slug))

    # Also products that are duplicates of custom with "— Case N" beyond 2 keep custom match (OK)
    # Remap products still pointing at /products/*.jpg (old) or svg
    remapped = 0
    for block in out:
        img = re.search(r'images: \["([^"]+)"', block)
        if not img:
            final.append(block)
            continue
        src = img.group(1)
        if src.startswith("/products/custom/"):
            final.append(block)
            continue

        cat_m = re.search(r'categorySlug: "([^"]+)"', block)
        cat_slug = cat_m.group(1) if cat_m else "office"
        options = by_cat.get(cat_slug) or by_cat.get("office") or downloaded
        if not options:
            final.append(block)
            continue
        i = unsplash_i.get(cat_slug, 0)
        unsplash_i[cat_slug] = i + 1
        slug, path, name, cat, cslug = options[i % len(options)]
        path2 = path.replace("-1.jpg", "-2.jpg")
        if i >= len(options):
            name = f"{name} — Pack {i + 1}"
        block = re.sub(r'name: "[^"]*"', f'name: "{name}"', block, count=1)
        block = re.sub(
            r'description: "[^"]*"',
            f'description: "Commercial {name.lower()} for workplace and facility purchasing."',
            block,
            count=1,
        )
        block = re.sub(r'category: "[^"]*"', f'category: "{cat}"', block, count=1)
        block = re.sub(r'categorySlug: "[^"]*"', f'categorySlug: "{cslug}"', block, count=1)
        block = re.sub(r'images: \[[^\]]+\]', f'images: ["{path}", "{path2}"]', block, count=1)
        remapped += 1
        final.append(block)

    PRODUCTS.write_text(header + "".join(final))
    print("custom image products fixed:", sum(custom_counts.values()))
    print("unsplash assets:", len(downloaded))
    print("non-custom remapped:", remapped)
    print("custom counts:", custom_counts)


if __name__ == "__main__":
    main()
