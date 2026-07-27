import { NavLink } from "@/types";

export const navigationLinks: NavLink[] = [
  { label: "Food", href: "/categories/food" },
  { label: "Furniture", href: "/categories/furniture" },
  { label: "Industrial", href: "/categories/industrial" },
  {
    label: "Janitorial Supplies & Cleaning",
    href: "/categories/janitorial",
    children: [
      { label: "Disinfectants", href: "/shop?search=disinfectant" },
      { label: "Wipes", href: "/shop?search=wipes" },
      { label: "Trash Bags", href: "/shop?search=trash+bags" },
      { label: "Soap & Sanitizer", href: "/shop?search=soap" },
    ],
  },
  {
    label: "Office",
    href: "/categories/office",
    children: [
      { label: "Pens & Writing", href: "/shop?search=pen" },
      { label: "Binders & Folders", href: "/shop?search=binder" },
      { label: "Planners", href: "/shop?search=planner" },
      { label: "Paper", href: "/categories/paper" },
    ],
  },
  {
    label: "Technology",
    href: "/categories/technology",
    children: [
      { label: "Mice & Keyboards", href: "/shop?search=mouse" },
      { label: "Monitors", href: "/shop?search=monitor" },
      { label: "Printers", href: "/shop?search=printer" },
    ],
  },
  { label: "Shop By Brands", href: "/shop" },
];

export const utilityBarLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const footerLinks = {
  policy: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Shipping policy", href: "/shipping" },
    { label: "Terms and Conditions", href: "/terms" },
    { label: "Refund and Returns Policy", href: "/refund" },
  ],
  company: [
    { label: "Shop", href: "/shop" },
    { label: "Home", href: "/" },
    { label: "About us", href: "/about" },
    { label: "Contact us", href: "/contact" },
  ],
  categories: [
    { label: "Trash Cans", href: "/shop?search=trash+can" },
    { label: "Janitorial Supplies & Cleaning", href: "/categories/janitorial" },
    { label: "Tissue", href: "/shop?search=tissue" },
    { label: "Toilet Tissues", href: "/shop?search=toilet" },
    { label: "Deodorant/Anti-Perspirant", href: "/shop?search=deodorant" },
    { label: "Draw Strings And Kitchen Bags", href: "/shop?search=trash+bags" },
    { label: "Dispensers", href: "/shop?search=dispenser" },
    { label: "Hand Sanitizer", href: "/shop?search=sanitizer" },
    { label: "Trash Bags", href: "/shop?search=trash+bags" },
    { label: "Storage", href: "/categories/storage" },
  ],
};

export const paymentMethods = [
  { name: "Visa", icon: "/payments/visa.svg" },
  { name: "Mastercard", icon: "/payments/mastercard.svg" },
  { name: "Amex", icon: "/payments/amex.svg" },
  { name: "PayPal", icon: "/payments/paypal.svg" },
  { name: "Apple Pay", icon: "/payments/apple-pay.svg" },
];

export const brandLogos = [
  { name: "3M", label: "3M" },
  { name: "AngelSoft", label: "AngelSoft" },
  { name: "Bounty", label: "Bounty" },
  { name: "Clorox", label: "CLOROX" },
  { name: "Dart", label: "DART" },
  { name: "Dial", label: "Dial" },
];
