"use client";

import Image from "next/image";
import Link from "next/link";
import { featuredCategoryCards } from "@/data/categories";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";

export function CategoryCarousel() {
  return (
    <section className="bg-white py-10 md:py-14">
      <Container>
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Accion COLLECTIONS
          </p>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-wide text-foreground md:text-3xl">
            Featured Categories
          </h2>
        </div>

        <Carousel slidesToShow={4} showArrows={false} showDots autoplay autoplayDelay={6000}>
          {featuredCategoryCards.map((card) => (
            <Link
              key={card.slug + card.label}
              href={`/categories/${card.slug}`}
              className="group relative block aspect-square overflow-hidden rounded-md bg-primary"
            >
              <Image
                src={card.image}
                alt={card.label}
                fill
                className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 pt-10">
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                  {card.label}
                </span>
              </div>
            </Link>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
