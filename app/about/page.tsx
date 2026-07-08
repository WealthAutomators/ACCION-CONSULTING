import { company } from "@/data/company";
import { testimonials } from "@/data/testimonials";
import { PageHero, PageSection } from "@/components/ui/page-layout";
import { Container } from "@/components/ui/container";
import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Check, Award, Heart, ShoppingBag } from "lucide-react";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={`About ${company.name}`}
        description={company.description}
        breadcrumbs={[{ label: "About Us" }]}
      />

      <Container className="pb-16">
        <div className="grid items-center gap-10 py-12 md:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border shadow-sm">
            <Image src="/banners/about.svg" alt={`About ${company.name}`} fill className="object-cover" sizes="50vw" />
          </div>
          <PageSection title="Our Story">
            <p>
              FELI VENTURES LLC was created to make everyday shopping feel brighter, easier, and
              more inspiring. We bring together practical home upgrades, modern tech, family
              essentials, wellness finds, and lifestyle favorites in one clean marketplace.
            </p>
            <p className="mt-4">
              Based in Upper Marlboro, Maryland, we focus on offering a curated mix of quality,
              value, and convenience. Every item is chosen to support modern living, and our team is
              committed to a smooth shopping experience from first click to final delivery update.
            </p>
          </PageSection>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShoppingBag, title: "Everyday Variety", desc: "Shop electronics, home, beauty, wellness, toys, fashion, and more in one place." },
            { icon: Award, title: "Curated Quality", desc: "We focus on useful, stylish products that feel good to bring into everyday life." },
            { icon: Heart, title: "Friendly Service", desc: "Helpful support and easy returns keep shopping simple from start to finish." },
            { icon: Check, title: "Modern Convenience", desc: "A polished store experience built for fast browsing, smooth checkout, and repeat visits." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <PageSection title="What Our Customers Say" className="mt-16">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <StarRating rating={t.rating} showCount={false} size="md" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/shop">Shop Our Collection</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
