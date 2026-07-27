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
          <div className="flex items-center justify-center rounded-sm border border-border bg-muted p-10">
            <Image
              src="/logo/logo.svg"
              alt={`About ${company.name}`}
              width={280}
              height={64}
              className="h-16 w-auto"
            />
          </div>
          <PageSection title="Our Story">
            <p>
              Accion IT Consulting LLC is your go-to source for quality office, cleaning, and
              household essentials — delivered fast and affordably. We stock commercial-grade
              supplies for workplaces, facilities, and businesses that need reliable everyday
              products.
            </p>
            <p className="mt-4">
              Based in Mableton, Georgia, Accion focuses on office supplies, janitorial products,
              breakroom essentials, technology accessories, furniture, and industrial goods. Our
              catalog is built for buyers who want clear pricing, carton-ready packs, and a
              straightforward shopping experience.
            </p>
          </PageSection>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShoppingBag,
              title: "Workplace Essentials",
              desc: "Office, janitorial, breakroom, technology, and industrial supplies in one store.",
            },
            {
              icon: Award,
              title: "Commercial Quality",
              desc: "Products selected for facilities, offices, and everyday business operations.",
            },
            {
              icon: Heart,
              title: "Reliable Service",
              desc: "Helpful support and clear policies for purchasing teams and facility managers.",
            },
            {
              icon: Check,
              title: "Fast Delivery",
              desc: "A clean storefront experience built for quick browsing and repeat ordering.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-sm border border-border bg-card p-6 text-center shadow-sm">
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
              <div key={t.id} className="rounded-sm border border-border bg-card p-6 shadow-sm">
                <StarRating rating={t.rating} showCount={false} size="md" />
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.location}</p>
              </div>
            ))}
          </div>
        </PageSection>

        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-sm">
            <Link href="/shop">Shop Our Collection</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-sm">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </Container>
    </>
  );
}
