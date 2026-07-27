import { brandLogos } from "@/data/navigation";
import { Container } from "@/components/ui/container";

export function BrandLogos() {
  return (
    <section className="border-y border-border bg-white py-8 md:py-10">
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {brandLogos.map((brand) => (
            <span
              key={brand.name}
              className="text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground/70 transition-colors hover:text-muted-foreground md:text-base"
              aria-label={brand.label}
            >
              {brand.label}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
