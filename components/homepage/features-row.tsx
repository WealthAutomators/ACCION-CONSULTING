import { RotateCcw, ShieldCheck, BadgeCheck, Truck } from "lucide-react";
import { features } from "@/data/homepage";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

const iconMap = {
  truck: Truck,
  shield: ShieldCheck,
  rotate: RotateCcw,
  star: BadgeCheck,
};

export function FeaturesRow() {
  return (
    <section className="border-y border-border bg-card py-12 md:py-16">
      <Container>
        <SectionHeading title="Why Shop With Accion" centered className="mb-10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Truck;
            return (
              <div
                key={feature.id}
                className="flex flex-col items-center rounded-[20px] border border-border bg-background p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
