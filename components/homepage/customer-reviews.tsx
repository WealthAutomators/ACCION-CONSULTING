import { testimonials } from "@/data/testimonials";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { StarRating } from "@/components/ui/star-rating";

export function CustomerReviews() {
  return (
    <section className="bg-card py-12 md:py-16">
      <Container>
        <SectionHeading
          title="Customer Reviews"
          subtitle="Real feedback from shoppers picking up everything from home upgrades to family favorites."
          centered
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="rounded-[20px] border border-border bg-background p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <StarRating rating={t.rating} showCount={false} size="sm" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-4 text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.location}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
