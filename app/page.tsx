import { HeroBanner } from "@/components/homepage/hero-banner";
import { TrendingProducts } from "@/components/homepage/trending-products";
import { CategoryCarousel } from "@/components/homepage/category-carousel";
import { DealsOfTheDay } from "@/components/homepage/deals-of-the-day";
import { BestSellers } from "@/components/homepage/best-sellers";
import { FeaturesRow } from "@/components/homepage/features-row";
import { PromotionalBanner } from "@/components/homepage/promotional-banner";
import { CustomerReviews } from "@/components/homepage/customer-reviews";
import { Newsletter } from "@/components/homepage/newsletter";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrendingProducts />
      <CategoryCarousel />
      <PromotionalBanner />
      <DealsOfTheDay />
      <BestSellers />
      <FeaturesRow />
      <CustomerReviews />
      <Newsletter />
    </>
  );
}
