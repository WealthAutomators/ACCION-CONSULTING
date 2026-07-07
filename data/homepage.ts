import {
  Feature,
  HeroSlide,
  PromoBanner,
} from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    image: "/hero/hero-1.jpg",
    headline: "Everything You Need. One Trusted Store.",
    description:
      "Shop premium electronics, home essentials, toys, beauty products and more.",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    secondaryCtaText: "Explore Deals",
    secondaryCtaLink: "/shop?sale=true",
  },
];

export const features: Feature[] = [
  {
    id: "1",
    icon: "truck",
    title: "Fast Delivery",
    description: "Free shipping on orders over $50, with most orders arriving in 3–5 business days.",
  },
  {
    id: "2",
    icon: "shield",
    title: "Secure Payments",
    description: "Checkout is protected with industry-standard encryption on every order.",
  },
  {
    id: "3",
    icon: "star",
    title: "Premium Quality",
    description: "Every product is carefully selected for quality, value, and reliability.",
  },
  {
    id: "4",
    icon: "rotate",
    title: "30-Day Returns",
    description: "Changed your mind? Enjoy hassle-free returns within 30 days of delivery.",
  },
];

export const dealsEndTime = new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString();

export const homepageDealsSlugs = [
  "wireless-earbuds",
  "electric-kettle",
  "air-fryer",
  "dog-bed",
  "bath-towel-set",
  "sunglasses-classic",
] as const;

export const homepageTrendingSlugs = [
  "wireless-earbuds",
  "bluetooth-speaker",
  "air-fryer",
  "kids-learning-tablet",
  "yoga-mat",
  "gaming-headset",
  "vitamin-c-serum-set",
  "standing-desk-lamp",
] as const;

export const homepageBestsellerSlugs = [
  "wireless-earbuds",
  "bluetooth-speaker",
  "bath-towel-set",
  "yoga-mat",
  "kids-learning-tablet",
  "coffee-grinder",
  "dog-bed",
  "electric-kettle",
] as const;

export const homepageFeaturedSlugs = [
  "wireless-earbuds",
  "electric-kettle",
  "bath-towel-set",
  "kids-learning-tablet",
  "standing-desk-lamp",
  "air-fryer",
  "yoga-mat",
  "dog-bed",
  "coffee-grinder",
  "bluetooth-speaker",
] as const;

export const homepageNewArrivalSlugs = [
  "stem-robot-kit",
  "vitamin-c-serum-set",
  "baby-monitor",
  "foam-roller",
  "rgb-gaming-keyboard",
  "controller-charging-dock",
] as const;

export const promotionalBanner: PromoBanner = {
  id: "1",
  title: "Everything For Your Everyday Life",
  description:
    "Browse thousands of carefully selected products across every category.",
  buttonText: "Start Shopping",
  buttonLink: "/shop",
  image: "/banners/featured.jpg",
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
  { label: "Sports", slug: "sports-outdoors" },
];

export const newsletter = {
  title: "Join Thousands Of Happy Shoppers",
  description:
    "Subscribe for exclusive discounts, new arrivals and members-only offers.",
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
  title: "Quality Products. Honest Prices.",
  description:
    "VALUE PARTNERS LLC brings together premium products across every category, helping families find everything they need in one trusted store. We focus on quality, honest pricing, and a smooth shopping experience from browsing to checkout.",
  checklist: [
    "Wide selection across 13+ departments",
    "Honest, transparent pricing on everyday essentials",
    "Fast, reliable shipping nationwide",
    "Dedicated customer support team",
  ],
  buttonText: "Learn More About Us",
  buttonLink: "/about",
  image: "/banners/about.jpg",
};
