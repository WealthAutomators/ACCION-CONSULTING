import {
  Feature,
  HeroSlide,
  PromoBanner,
} from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    image: "/hero/hero-2.svg",
    headline: "Shop Smarter.\nLive Better.",
    description:
      "Everything from electronics and home essentials to beauty, toys and everyday favorites.",
    ctaText: "Shop Collection",
    ctaLink: "/shop",
    secondaryCtaText: "Today's Deals",
    secondaryCtaLink: "/shop?sale=true",
  },
];

export const features: Feature[] = [
  {
    id: "1",
    icon: "truck",
    title: "Fast Shipping",
    description: "Enjoy quick delivery on everyday essentials, trend finds, and top-rated picks across the store.",
  },
  {
    id: "2",
    icon: "shield",
    title: "Secure Checkout",
    description: "Shop with confidence through a smooth, protected checkout experience on every order.",
  },
  {
    id: "3",
    icon: "star",
    title: "Premium Products",
    description: "We curate quality products that balance style, function, and everyday value.",
  },
  {
    id: "4",
    icon: "rotate",
    title: "Easy Returns",
    description: "Changed your mind? Our return process is straightforward and designed to keep shopping stress-free.",
  },
];

export const dealsEndTime = new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString();

export const homepageDealsSlugs = [
  "wireless-noise-canceling-earbuds",
  "digital-air-fryer-oven",
  "plush-memory-foam-dog-bed",
  "family-board-game-bundle",
  "smart-baby-monitor",
  "polarized-everyday-sunglasses",
] as const;

export const homepageTrendingSlugs = [
  "wireless-noise-canceling-earbuds",
  "portable-bluetooth-speaker",
  "glass-electric-kettle",
  "kids-learning-tablet",
  "vitamin-c-skincare-set",
  "wireless-gaming-headset",
  "led-desk-lamp",
  "smart-fitness-watch",
] as const;

export const homepageBestsellerSlugs = [
  "wireless-noise-canceling-earbuds",
  "portable-bluetooth-speaker",
  "digital-air-fryer-oven",
  "luxury-bath-towel-set",
  "vitamin-c-skincare-set",
  "plush-memory-foam-dog-bed",
  "wireless-gaming-headset",
  "smart-baby-monitor",
] as const;

export const homepageFeaturedSlugs = [
  "wireless-noise-canceling-earbuds",
  "glass-electric-kettle",
  "luxury-bath-towel-set",
  "kids-learning-tablet",
  "led-desk-lamp",
  "digital-air-fryer-oven",
  "non-slip-yoga-mat",
  "plush-memory-foam-dog-bed",
  "coffee-burr-grinder",
  "portable-bluetooth-speaker",
] as const;

export const homepageNewArrivalSlugs = [
  "stem-robot-builder-kit",
  "collagen-hair-care-bundle",
  "smart-baby-monitor",
  "foam-roller-recovery-kit",
  "rgb-mechanical-keyboard",
  "dual-controller-charging-dock",
] as const;

export const promotionalBanner: PromoBanner = {
  id: "1",
  title: "Everything You Need For Everyday Living",
  description:
    "Quality products across every category with prices you'll love and service you can trust.",
  buttonText: "Browse Collection",
  buttonLink: "/shop",
  image: "/banners/featured.svg",
};

export const featuredCollection = {
  title: "Featured Products",
  description:
    "Hand-picked favorites across electronics, home, beauty, and more — everything you need in one trusted store.",
  bannerImage: "/banners/featured.jpg",
  categorySlug: "electronics",
};

export const bestSellerTabs = [
  { label: "All", slug: "all" },
  { label: "Electronics", slug: "electronics" },
  { label: "Home & Kitchen", slug: "home-kitchen" },
  { label: "Beauty", slug: "beauty" },
  { label: "Gaming", slug: "gaming" },
];

export const newsletter = {
  title: "Stay Ahead Of Every Deal",
  description:
    "Subscribe for exclusive offers, new arrivals and members-only discounts.",
  placeholder: "Enter your email address",
  buttonText: "Subscribe",
};

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export const aboutSection = {
  title: "Modern Living. Better Shopping.",
  description:
    "FELI VENTURES LLC brings together smart home upgrades, lifestyle staples, beauty favorites, tech, toys, and more in one bright modern marketplace built around convenience and value.",
  checklist: [
    "Fresh finds across 12 everyday lifestyle categories",
    "Friendly shopping experience with curated picks",
    "Fast nationwide shipping on popular essentials",
    "Helpful support before and after checkout",
  ],
  buttonText: "Learn More About Us",
  buttonLink: "/about",
  image: "/banners/about.svg",
};
