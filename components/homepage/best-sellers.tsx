"use client";

import { useMemo, useState } from "react";
import {
  bestSellerTabs,
  featuredCollection,
} from "@/data/homepage";
import {
  getBestsellerProducts,
  getDealProducts,
  getFeaturedProducts,
  products,
} from "@/data/products";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";

export function BestSellers() {
  const [activeTab, setActiveTab] = useState("bestsellers");

  const filtered = useMemo(() => {
    if (activeTab === "featured") return getFeaturedProducts().slice(0, 12);
    if (activeTab === "sales") return getDealProducts().slice(0, 12);
    const bestsellers = getBestsellerProducts();
    return (bestsellers.length > 0 ? bestsellers : products).slice(0, 12);
  }, [activeTab]);

  return (
    <section className="bg-white py-10 md:py-14">
      <Container>
        <div className="mb-6 text-center">
          {featuredCollection.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {featuredCollection.eyebrow}
            </p>
          )}
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
            {featuredCollection.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            {featuredCollection.description}
          </p>
        </div>

        <div className="mb-8 flex items-center justify-center gap-6 border-b border-border">
          {bestSellerTabs.map((tab) => (
            <button
              key={tab.slug}
              type="button"
              onClick={() => setActiveTab(tab.slug)}
              className={cn(
                "relative pb-3 text-xs font-bold uppercase tracking-wider transition-colors",
                activeTab === tab.slug
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.slug && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <Carousel slidesToShow={4} showArrows showDots={false} className="px-2 md:px-8">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
