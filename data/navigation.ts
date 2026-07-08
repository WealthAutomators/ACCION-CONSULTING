import { NavLink } from "@/types";

export const navigationLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Trending", href: "/shop?sort=rating" },
  { label: "Electronics", href: "/categories/electronics" },
  { label: "Home", href: "/categories/home-kitchen" },
  { label: "Fashion", href: "/categories/fashion-accessories" },
  { label: "Deals", href: "/shop?sale=true" },
  { label: "Contact", href: "/contact" },
];

export const utilityBarLinks = [
  { label: "New Weekly Deals", href: "/shop?sale=true" },
  { label: "Free Shipping Over $75", href: "/shipping" },
  { label: "Easy Returns", href: "/returns" },
];

export const footerLinks = {
  shop: [
    { label: "Shop All", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Electronics", href: "/categories/electronics" },
    { label: "Home & Kitchen", href: "/categories/home-kitchen" },
    { label: "Fashion", href: "/categories/fashion-accessories" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "Deals", href: "/shop?sale=true" },
  ],
  customerCare: [
    { label: "Contact Us", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
    { label: "FAQs", href: "/faq" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
  ],
  policies: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "About Us", href: "/about" },
  ],
};

export const paymentMethods = [
  { name: "Visa", icon: "/payments/visa.svg" },
  { name: "Mastercard", icon: "/payments/mastercard.svg" },
  { name: "Amex", icon: "/payments/amex.svg" },
  { name: "PayPal", icon: "/payments/paypal.svg" },
  { name: "Apple Pay", icon: "/payments/apple-pay.svg" },
];
