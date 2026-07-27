import { HeroBanner } from "@/components/homepage/hero-banner";
import { CategoryCarousel } from "@/components/homepage/category-carousel";
import { BestSellers } from "@/components/homepage/best-sellers";
import { BrandLogos } from "@/components/homepage/brand-logos";
import { PromotionalBanner } from "@/components/homepage/promotional-banner";
import { ProductCollections } from "@/components/homepage/product-collections";
import { AboutSection } from "@/components/homepage/about-section";
import { Newsletter } from "@/components/homepage/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryCarousel />
      <BestSellers />
      <BrandLogos />
      <PromotionalBanner />
      <ProductCollections />
      <AboutSection />
      <Newsletter />
    </>
  );
}
