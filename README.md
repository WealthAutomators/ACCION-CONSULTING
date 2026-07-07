# VALUE PARTNERS LLC

A production-quality, reusable ecommerce storefront built with Next.js App Router, TypeScript, and Tailwind CSS.

VALUE PARTNERS LLC is a modern marketplace selling premium electronics, home essentials, beauty, toys, gaming gear, pet supplies, and more — quality products at honest prices. Duplicate this repository and swap brand assets, colors, and data to launch new stores without rewriting components.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** (Radix primitives)
- **Lucide Icons**
- **Framer Motion** (subtle animations)
- **Embla Carousel**
- **React Context** (cart, wishlist, recently viewed)
- **localStorage** persistence (no backend)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # Production build
npm run start   # Start production server
```

## Customizing for a New Store

To rebrand this template for a new store, edit **only** these files:

| What to change | Where |
|---|---|
| Company name, contact, social | `data/company.ts` |
| Brand colors | `styles/theme.ts` + `app/globals.css` |
| Navigation & footer links | `data/navigation.ts` |
| Categories | `data/categories.ts` |
| Products | `data/products.ts` |
| Homepage content | `data/homepage.ts` |
| Testimonials | `data/testimonials.ts` |
| Logo | `public/logo/` |
| Hero images | `public/hero/` |
| Banners | `public/banners/` |
| Category images | `public/categories/` |
| Product images | `public/products/` |

Regenerate placeholder SVGs after changing products:

```bash
node scripts/generate-images.mjs
```

## Project Structure

```
app/                  # Next.js pages (App Router)
components/
  navbar/             # Sticky navigation with search
  footer/             # Four-column footer
  homepage/           # Homepage sections
  product/            # Product cards, gallery, quick view
  cart/               # Cart page
  checkout/           # Checkout flow
  shop/               # Shop with filters
  ui/                 # Reusable UI primitives
data/                 # All store content (JSON-like TS files)
lib/                  # Utilities and constants
hooks/                # Custom React hooks
context/              # Cart, wishlist, recently viewed
public/               # Static assets
styles/               # Theme color tokens
types/                # TypeScript interfaces
```

## Features

- Full homepage with 12 sections (hero, categories, deals, best sellers, etc.)
- Working cart with add/remove/quantity and localStorage persistence
- Working wishlist with localStorage persistence
- Live search filtering in navbar and shop page
- Quick view modal on product cards
- Product detail page with gallery, accordion, related products
- Shop page with sidebar filters, sorting, and pagination
- Checkout with order summary and payment form
- Fully responsive (mobile, tablet, desktop)
- 30 products across 13 departments

## Checkout

Use coupon code `SAVE10` on the cart page for a 10% discount.

## Brand Colors

- **Primary:** Charcoal `#1F2937`
- **Secondary:** Emerald `#10B981`
- **Accent:** Orange `#F97316`
