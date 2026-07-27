import { Feature, HeroSlide, PromoBanner } from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "1",
    image: "/hero/hero-cleaning.png",
    headline: "Commercial Cleaning Supplies",
    description: "Stock your facility with professional janitorial essentials.",
    ctaText: "Shop Janitorial",
    ctaLink: "/categories/janitorial",
  },
  {
    id: "2",
    image: "/hero/hero-dawn.png",
    headline: "Dawn Dish Care Essentials",
    description: "Pens, paper, planners, and everything your workplace needs.",
    ctaText: "Shop Office",
    ctaLink: "/categories/office",
  },
  {
    id: "3",
    image: "/hero/hero-stationery.png",
    headline: "Stationery Sale This Week",
    description: "Keep your team fueled with coffee, cups, and snacks.",
    ctaText: "Shop Food",
    ctaLink: "/categories/food",
  },
];

export const features: Feature[] = [
  {
    id: "1",
    icon: "truck",
    title: "Fast Delivery",
    description: "Reliable shipping on office, cleaning, and industrial supplies.",
  },
  {
    id: "2",
    icon: "shield",
    title: "Trusted Quality",
    description: "Commercial-grade products for workplaces that demand consistency.",
  },
  {
    id: "3",
    icon: "star",
    title: "Bulk Ready",
    description: "Carton and case packs sized for offices, facilities, and warehouses.",
  },
  {
    id: "4",
    icon: "rotate",
    title: "Easy Returns",
    description: "Straightforward return policies on eligible Accion orders.",
  },
];

export const dealsEndTime = new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString();

export const homepageDealsSlugs = [] as const;

export const homepageTrendingSlugs = [] as const;

export const homepageBestsellerSlugs = [] as const;

export const homepageFeaturedSlugs = [] as const;

export const homepageNewArrivalSlugs = [] as const;

export const homepageSaleSlugs = [] as const;

/** Populated after catalog generation — collections use category filters as fallback */
export const productCollections = [
  {
    id: "office",
    eyebrow: "ACCION COLLECTIONS",
    title: "Office Supplies",
    categorySlug: "office",
    viewMoreLink: "/categories/office",
  },
  {
    id: "mice-keyboards",
    eyebrow: "ACCION COMPUTER COLLECTIONS",
    title: "Mouse & Keyboards",
    categorySlug: "technology",
    searchHint: "mouse",
    viewMoreLink: "/categories/technology",
  },
  {
    id: "coffee",
    eyebrow: "ACCION COFFEE",
    title: "Coffee Collection",
    categorySlug: "food",
    searchHint: "coffee",
    viewMoreLink: "/categories/food",
  },
  {
    id: "hand-sanitizer",
    eyebrow: "ACCION COLLECTIONS",
    title: "Hand Sanitizer",
    categorySlug: "janitorial",
    searchHint: "sanitizer",
    viewMoreLink: "/categories/janitorial",
  },
  {
    id: "disinfecting",
    eyebrow: "ACCION COLLECTIONS",
    title: "Disinfecting Products",
    categorySlug: "janitorial",
    searchHint: "disinfect",
    viewMoreLink: "/categories/janitorial",
  },
  {
    id: "furniture",
    eyebrow: "ACCION COLLECTIONS",
    title: "Furniture",
    categorySlug: "furniture",
    viewMoreLink: "/categories/furniture",
  },
  {
    id: "industrial",
    eyebrow: "ACCION COLLECTIONS",
    title: "Industrial",
    categorySlug: "industrial",
    viewMoreLink: "/categories/industrial",
  },
  {
    id: "paper",
    eyebrow: "ACCION COLLECTIONS",
    title: "Paper Products",
    categorySlug: "paper",
    viewMoreLink: "/categories/paper",
  },
] as const;

export const promoBanners: Array<PromoBanner & {
  manufacturer?: string;
  model?: string;
  material?: string;
  price?: string;
}> = [
  {
    id: "1",
    title: "Tork Soap and Sanitiser Systems",
    description: "Dispense confidence with Tork Soap and Sanitiser Systems.",
    buttonText: "BUY NOW",
    buttonLink: "/categories/bathroom",
    image: "/banners/promo-tork.png",
    manufacturer: "Tork",
    model: "570020A",
    material: "PLASTIC",
    price: "$8.80",
  },
  {
    id: "2",
    title: "Rubbermaid Commercial Products",
    description: "Durable commercial waste, safety, and facility solutions.",
    buttonText: "BUY NOW",
    buttonLink: "/categories/janitorial",
    image: "/banners/promo-rubbermaid.png",
    manufacturer: "Rubbermaid",
    model: "DW-75-6",
    material: "PLASTIC",
    price: "$59.00",
  },
];

export const promotionalBanner: PromoBanner = promoBanners[0];

export const featuredCollection = {
  title: "Featured Products",
  description: "Visit our shop to see amazing creations from our designers.",
  bannerImage: "/banners/featured.jpg",
  categorySlug: "office",
  eyebrow: "ACCION PICKS",
};

export const bestSellerTabs = [
  { label: "Best Sellers", slug: "bestsellers" },
  { label: "Featured", slug: "featured" },
  { label: "Sales", slug: "sales" },
];

export const newsletter = {
  title: "Join Our Newsletter",
  description:
    "Stay updated on new arrivals, bulk pricing, and workplace supply essentials from Accion.",
  placeholder: "Enter your email address",
  buttonText: "Subscribe",
  privacyNote: "Will be used in accordance with our Privacy Policy",
  image: "/banners/newsletter.png",
};

export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export const aboutSection = {
  eyebrow: "Your Everyday Essentials, Delivered",
  title: "ABOUT OUR ACCION STORE",
  description:
    "Accion is your go-to source for quality office, cleaning, and household essentials — delivered fast and affordably. From janitorial supplies to technology and breakroom staples, we stock the products workplaces rely on every day.",
  checklist: [
    "Commercial-grade office and facility supplies",
    "Bulk and carton packaging for business needs",
    "Fast, reliable delivery across the United States",
    "Dedicated support for workplace purchasing",
  ],
  buttonText: "READ MORE",
  buttonLink: "/about",
  secondaryButtonText: "CONTACT US",
  secondaryButtonLink: "/contact",
  image: "/logo/logo.svg",
};
