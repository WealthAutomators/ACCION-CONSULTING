"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const homepageCategorySlugs = [
  "electronics",
  "home-kitchen",
  "beauty",
  "gaming",
  "sports-outdoors",
  "toys-games",
  "pet-supplies",
  "health-wellness",
];

export function CategoryCarousel() {
  const homepageCategories = homepageCategorySlugs
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is (typeof categories)[number] => Boolean(c));

  return (
    <section className="py-12 md:py-16">
      <Container>
        <SectionHeading
          title="Featured Departments"
          subtitle="Shop premium products across every category — all in one trusted store."
          centered
        />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {homepageCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative block overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent transition-colors duration-300 group-hover:from-primary/90 group-hover:via-primary/50" />
                <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
                  <span className="text-base font-semibold text-white drop-shadow-md">
                    {category.name}
                  </span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs font-medium text-white/0 transition-colors duration-300 group-hover:text-secondary">
                    Shop now <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
