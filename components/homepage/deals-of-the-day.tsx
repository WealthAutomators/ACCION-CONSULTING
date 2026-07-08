"use client";

import { Zap } from "lucide-react";
import { dealsEndTime, homepageDealsSlugs } from "@/data/homepage";
import { getProductsBySlugs } from "@/data/products";
import { Container } from "@/components/ui/container";
import { CountdownTimer } from "@/components/ui/countdown-timer";
import { Carousel } from "@/components/ui/carousel";
import { ProductCard } from "@/components/product/product-card";

export function DealsOfTheDay() {
  const deals = getProductsBySlugs(homepageDealsSlugs);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="overflow-hidden rounded-[28px] border border-secondary/20 bg-gradient-to-r from-secondary/10 via-white to-primary/10 p-6 shadow-sm md:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
                <Zap className="h-3.5 w-3.5" /> Limited Time
              </span>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Flash Deals</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                Save on popular picks across tech, home, family, and lifestyle essentials before the clock runs out.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Ends in:</span>
              <CountdownTimer endTime={dealsEndTime} />
            </div>
          </div>
          <Carousel slidesToShow={4} className="px-8">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
