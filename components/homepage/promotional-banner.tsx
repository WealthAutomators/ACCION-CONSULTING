import Link from "next/link";
import { promotionalBanner } from "@/data/homepage";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function PromotionalBanner() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-primary via-primary to-accent shadow-md">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 left-1/4 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />
          <div className="relative flex flex-col items-start justify-center p-8 md:p-12 lg:p-16">
            <span className="mb-4 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white">
              FELI Favorites
            </span>
            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl">
              {promotionalBanner.title}
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/80">{promotionalBanner.description}</p>
            <Button asChild size="lg" variant="accent" className="mt-8 bg-secondary hover:bg-secondary/90">
              <Link href={promotionalBanner.buttonLink}>{promotionalBanner.buttonText}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
