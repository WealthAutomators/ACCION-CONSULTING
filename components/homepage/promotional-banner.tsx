"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { promoBanners } from "@/data/homepage";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function PromotionalBanner() {
  const plugins = useMemo(
    () => [Autoplay({ delay: 7000, stopOnInteraction: true })],
    []
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="bg-white py-6 md:py-10">
      <div className="relative bg-primary">
        <Container className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {promoBanners.map((banner) => (
                <div key={banner.id} className="min-w-0 shrink-0 grow-0 basis-full">
                  <div className="grid items-center gap-6 py-8 md:grid-cols-2 md:gap-10 md:py-12">
                    <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-sm border border-white/20 bg-white/5">
                      <Image
                        src={banner.image}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                      />
                    </div>
                    <div className="text-white">
                      <h2 className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
                        {banner.title}
                      </h2>
                      {(banner.manufacturer || banner.model || banner.material) && (
                        <div className="mt-5 grid grid-cols-3 gap-3 border-y border-white/20 py-4 text-[11px] uppercase tracking-wider text-white/80">
                          <div>
                            <p className="opacity-70">Manufacturer</p>
                            <p className="mt-1 font-semibold text-white">{banner.manufacturer}</p>
                          </div>
                          <div>
                            <p className="opacity-70">Model</p>
                            <p className="mt-1 font-semibold text-white">{banner.model}</p>
                          </div>
                          <div>
                            <p className="opacity-70">Material</p>
                            <p className="mt-1 font-semibold text-white">{banner.material}</p>
                          </div>
                        </div>
                      )}
                      {banner.price && (
                        <p className="mt-5 text-3xl font-bold md:text-4xl">{banner.price}</p>
                      )}
                      <Link
                        href={banner.buttonLink}
                        className="mt-6 inline-flex border border-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-primary"
                      >
                        {banner.buttonText}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous promo"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 text-white/80 transition-colors hover:text-white md:left-0"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next promo"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-white/80 transition-colors hover:text-white md:right-0"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="flex justify-center gap-2 pb-6">
            {promoBanners.map((banner, index) => (
              <button
                key={banner.id}
                type="button"
                aria-label={`Go to promo ${index + 1}`}
                onClick={() => scrollTo(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  index === selectedIndex ? "bg-white" : "bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
