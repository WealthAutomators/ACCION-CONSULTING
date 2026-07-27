"use client";

import Link from "next/link";
import { productCollections } from "@/data/homepage";
import { getProductsByCategory, products, searchProducts } from "@/data/products";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product/product-card";

function getCollectionProducts(
  categorySlug: string,
  searchHint?: string,
  limit = 8
) {
  if (searchHint) {
    const searched = searchProducts(searchHint).filter(
      (p) => p.categorySlug === categorySlug || p.name.toLowerCase().includes(searchHint)
    );
    if (searched.length >= 4) return searched.slice(0, limit);
  }
  const byCategory = getProductsByCategory(categorySlug);
  if (byCategory.length > 0) return byCategory.slice(0, limit);
  return products.slice(0, limit);
}

export function ProductCollections() {
  return (
    <>
      {productCollections.map((collection) => {
        const items = getCollectionProducts(
          collection.categorySlug,
          "searchHint" in collection ? collection.searchHint : undefined
        );
        if (items.length === 0) return null;

        return (
          <section key={collection.id} className="border-t border-border bg-white py-10 md:py-12">
            <Container>
              <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {collection.eyebrow}
                </p>
                <div className="mt-2 flex items-end justify-between gap-4 border-b border-border pb-3">
                  <h2 className="text-2xl font-bold text-foreground md:text-[28px]">
                    {collection.title}
                  </h2>
                  <Link
                    href={collection.viewMoreLink}
                    className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary"
                  >
                    View All
                  </Link>
                </div>
                <div className="h-0.5 w-28 -translate-y-px bg-primary" />
              </div>

              <Carousel slidesToShow={4} showArrows={false} showDots>
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </Carousel>
            </Container>
          </section>
        );
      })}
    </>
  );
}
