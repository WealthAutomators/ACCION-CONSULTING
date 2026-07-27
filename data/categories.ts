import { Category } from "@/types";

export const categories: Category[] = [
  {
    id: "1",
    slug: "office",
    name: "Office",
    image: "/categories/office.png",
    description: "Pens, binders, planners, paper, and everyday desk essentials for productive workplaces.",
    productCount: 51,
  },
  {
    id: "2",
    slug: "janitorial",
    name: "Janitorial Supplies & Cleaning",
    image: "/categories/janitorial.png",
    description: "Disinfectants, wipes, soaps, trash bags, and commercial cleaning supplies.",
    productCount: 46,
  },
  {
    id: "3",
    slug: "technology",
    name: "Technology",
    image: "/categories/technology.png",
    description: "Mice, keyboards, monitors, printers, and office electronics for modern workspaces.",
    productCount: 36,
  },
  {
    id: "4",
    slug: "furniture",
    name: "Furniture",
    image: "/categories/furniture.png",
    description: "Office chairs, desks, cabinets, shelving, and commercial workspace furniture.",
    productCount: 25,
  },
  {
    id: "5",
    slug: "food",
    name: "Food",
    image: "/categories/food.png",
    description: "Coffee, tea, creamers, cups, and breakroom essentials for the office.",
    productCount: 30,
  },
  {
    id: "6",
    slug: "industrial",
    name: "Industrial",
    image: "/categories/industrial.png",
    description: "Safety gear, warehouse supplies, utility carts, and industrial cleaning chemicals.",
    productCount: 25,
  },
  {
    id: "7",
    slug: "lighting",
    name: "Lighting",
    image: "/categories/lighting.png",
    description: "LED bulbs, desk lamps, extension cords, batteries, and lighting supplies.",
    productCount: 20,
  },
  {
    id: "8",
    slug: "paper",
    name: "Paper",
    image: "/categories/paper.png",
    description: "Copy paper, notebooks, tissues, towels, and commercial paper products.",
    productCount: 20,
  },
  {
    id: "9",
    slug: "bathroom",
    name: "Bathroom",
    image: "/categories/bathroom.png",
    description: "Toilet tissue, soap dispensers, hand sanitizer, and restroom supplies.",
    productCount: 20,
  },
  {
    id: "10",
    slug: "storage",
    name: "Storage",
    image: "/categories/storage.png",
    description: "Bins, totes, cabinets, and organizational storage for office and warehouse.",
    productCount: 15,
  },
];

export const browseCategories = [
  { label: "Trash Cans", href: "/categories/janitorial?q=trash+can" },
  { label: "Janitorial Supplies & Cleaning", href: "/categories/janitorial" },
  { label: "Tissue", href: "/categories/paper?q=tissue" },
  { label: "Toilet Tissues", href: "/categories/bathroom?q=toilet" },
  { label: "Deodorant/Anti-Perspirant", href: "/shop?search=deodorant" },
  { label: "Draw Strings And Kitchen Bags", href: "/shop?search=trash+bags" },
  { label: "Dispensers", href: "/shop?search=dispenser" },
  { label: "Hand Sanitizer", href: "/shop?search=sanitizer" },
  { label: "Trash Bags", href: "/shop?search=trash+bags" },
  { label: "Coffee", href: "/categories/food?q=coffee" },
  { label: "Paper", href: "/categories/paper" },
  { label: "Office Supplies", href: "/categories/office" },
  { label: "Lighting", href: "/categories/lighting" },
  { label: "Soap", href: "/shop?search=soap" },
  { label: "Storage", href: "/categories/storage" },
  { label: "Rubbermaid", href: "/shop?search=storage" },
];

export const featuredCategoryCards = [
  { slug: "janitorial", label: "Disinfectant", image: "/categories/featured-disinfectant.png" },
  { slug: "food", label: "Coffee", image: "/categories/featured-coffee.png" },
  { slug: "bathroom", label: "Tissues", image: "/categories/featured-tissues.png" },
  { slug: "lighting", label: "Led Bulbs", image: "/categories/featured-led.png" },
  { slug: "furniture", label: "Desks", image: "/categories/featured-desks.png" },
  { slug: "technology", label: "Electronics", image: "/categories/featured-electronics.png" },
  { slug: "office", label: "Office", image: "/categories/featured-office.png" },
  { slug: "industrial", label: "Industrial", image: "/categories/featured-industrial.png" },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
