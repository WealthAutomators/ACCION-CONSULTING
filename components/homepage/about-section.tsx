import Image from "next/image";
import Link from "next/link";
import { aboutSection } from "@/data/homepage";
import { company } from "@/data/company";
import { Container } from "@/components/ui/container";

export function AboutSection() {
  return (
    <section className="bg-muted py-12 md:py-16">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[280px_minmax(0,1fr)] lg:gap-16">
          <div className="flex justify-center md:justify-start">
            <Image
              src={aboutSection.image}
              alt={company.name}
              width={240}
              height={56}
              className="h-14 w-auto"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {aboutSection.eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-bold uppercase tracking-wide text-primary md:text-3xl">
              {aboutSection.title}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {aboutSection.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={aboutSection.buttonLink}
                className="inline-flex bg-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-secondary"
              >
                {aboutSection.buttonText}
              </Link>
              {aboutSection.secondaryButtonText && aboutSection.secondaryButtonLink && (
                <Link
                  href={aboutSection.secondaryButtonLink}
                  className="inline-flex border border-border bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {aboutSection.secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
