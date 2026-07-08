"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { heroSlides } from "@/data/homepage";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function HeroBanner() {
  const slide = heroSlides[0];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-white to-accent/10">
      <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
      <Container className="relative py-14 md:py-18">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Modern Living. Better Shopping.
            </span>
            <h1 className="mt-5 whitespace-pre-line text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {slide.headline}
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              {slide.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href={slide.ctaLink}>{slide.ctaText}</Link>
              </Button>
              {slide.secondaryCtaText && slide.secondaryCtaLink && (
                <Button asChild size="lg" variant="outline">
                  <Link href={slide.secondaryCtaLink}>{slide.secondaryCtaText}</Link>
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-5 top-6 z-10 rounded-2xl bg-secondary px-4 py-3 text-white shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Weekly Deals</p>
              <p className="mt-1 text-2xl font-bold">Up to 40% Off</p>
            </div>
            <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white p-3 shadow-[0_24px_80px_-32px_rgba(37,99,235,0.45)]">
              <div className="relative aspect-[5/4] overflow-hidden rounded-[22px]">
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
