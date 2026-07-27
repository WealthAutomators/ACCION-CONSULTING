"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { browseCategories } from "@/data/categories";
import { heroSlides } from "@/data/homepage";
import { Container } from "@/components/ui/container";
import { Carousel } from "@/components/ui/carousel";

export function HeroBanner() {
  return (
    <section className="border-b border-border bg-white py-4 md:py-6">
      <Container>
        <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-5">
          <aside className="hidden lg:block">
            <div className="overflow-hidden rounded-sm border border-border">
              <div className="flex items-center gap-2.5 bg-primary px-4 py-3 text-sm font-bold uppercase tracking-wide text-white">
                <Menu className="h-4 w-4" />
                Browse Categories
              </div>
              <ul className="max-h-[420px] overflow-y-auto bg-white">
                {browseCategories.map((item) => (
                  <li key={item.label} className="border-b border-border last:border-b-0">
                    <Link
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0">
            <Carousel
              autoplay
              autoplayDelay={5000}
              showArrows
              showDots
              slidesToShow={1}
              className="overflow-hidden rounded-sm border border-border bg-white"
              slideClassName="px-0"
            >
              {heroSlides.map((slide) => (
                <Link
                  key={slide.id}
                  href={slide.ctaLink}
                  className="relative block aspect-[16/9] w-full bg-muted sm:aspect-[21/9] lg:aspect-[2.4/1]"
                >
                  <Image
                    src={slide.image}
                    alt={slide.headline}
                    fill
                    priority={slide.id === "1"}
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 70vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 max-w-md text-white drop-shadow-md">
                    <h2 className="text-xl font-bold uppercase tracking-wide sm:text-2xl lg:text-3xl">
                      {slide.headline}
                    </h2>
                    <p className="mt-2 text-sm text-white/90 sm:text-base">{slide.description}</p>
                  </div>
                </Link>
              ))}
            </Carousel>
          </div>
        </div>
      </Container>
    </section>
  );
}
