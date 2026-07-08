"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Truck, RotateCcw, Check } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductReviews } from "@/components/product/product-reviews";
import { RelatedProducts, RecentlyViewedCarousel } from "@/components/product/product-carousel";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Separator } from "@/components/ui/separator";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { recentlyViewed, addRecentlyViewed } = useRecentlyViewed();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  useEffect(() => {
    addRecentlyViewed(product.slug);
  }, [product.slug, addRecentlyViewed]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/checkout");
  };

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/categories/${product.categorySlug}` },
          { label: product.name },
        ]}
      />

      <Container className="py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            <StarRating rating={product.rating} reviews={product.reviews} className="mt-4" size="md" />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-semibold text-accent">
                    {formatPrice(product.salePrice!)}
                  </span>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="sale">-{calculateDiscount(product.price, product.salePrice!)}% OFF</Badge>
                </>
              ) : (
                <span className="text-3xl font-semibold">{formatPrice(product.price)}</span>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <QuantitySelector quantity={quantity} onChange={setQuantity} max={product.stock} />
              <span className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {product.stock} in stock
                  </span>
                ) : (
                  "Out of stock"
                )}
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 transition-all"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => toggleWishlist(product.id)}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="transition-transform active:scale-95"
              >
                <Heart className={`h-4 w-4 transition-colors ${inWishlist ? "fill-accent text-accent" : ""}`} />
              </Button>
            </div>

            <Separator className="my-8" />

            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">SKU:</span> {product.sku}
              </p>
              <p>
                <span className="font-medium text-foreground">Category:</span>{" "}
                <Link href={`/categories/${product.categorySlug}`} className="text-primary hover:underline">
                  {product.category}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <section>
            <h2 className="text-xl font-semibold md:text-2xl">Product Description</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{product.description}</p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold md:text-2xl">Specifications</h2>
            <dl className="mt-4 max-w-lg divide-y divide-border rounded-lg border border-border">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between px-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd className="font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="grid gap-6 sm:grid-cols-2">
            <section className="rounded-lg border border-border bg-muted/20 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Shipping Information</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Free standard shipping on orders over $75. Standard delivery takes 3–5 business days.
                Express shipping (1–2 business days) is available at checkout for $14.99.
                We ship to all 50 US states. Orders placed before 2pm EST ship same day.
              </p>
            </section>

            <section className="rounded-lg border border-border bg-muted/20 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <RotateCcw className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Returns Information</h2>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                We offer a 30-day hassle-free return policy. Items must be unused, in original
                packaging, and with tags attached. Return shipping is free for defective items.
                Refunds are processed within 5–7 business days after we receive your return.
              </p>
            </section>
          </div>
        </div>
      </Container>

      <ProductReviews product={product} />
      <RelatedProducts product={product} />
      <RecentlyViewedCarousel slugs={recentlyViewed} currentSlug={product.slug} />
    </>
  );
}
