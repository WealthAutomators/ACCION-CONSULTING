"use client";

import { memo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftRight, Check, Eye, Heart, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, calculateDiscount } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useCompare } from "@/context/CompareContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickViewModal } from "@/components/product/quick-view-modal";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard = memo(function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? calculateDiscount(product.price, product.salePrice!) : 0;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <>
      <div
        className={cn("group relative flex flex-col bg-white", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden border border-transparent bg-white transition-colors group-hover:border-border">
          <Link href={`/product/${product.slug}`} className="relative block h-full w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              loading="lazy"
              className={cn(
                "object-contain p-4 transition-opacity duration-300",
                isHovered && product.images[1] ? "opacity-0" : "opacity-100"
              )}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                fill
                loading="lazy"
                className={cn(
                  "object-contain p-4 transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            )}
          </Link>

          {hasDiscount && (
            <span className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
              -{discountPercent}%
            </span>
          )}
          {product.newArrival && !hasDiscount && !product.badge && (
            <Badge variant="new" className="absolute left-3 top-3 rounded-sm">
              New
            </Badge>
          )}
          {product.badge && !hasDiscount && (
            <Badge variant="sale" className="absolute left-3 top-3 rounded-sm">
              {product.badge}
            </Badge>
          )}

          <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 max-sm:opacity-100">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
              onClick={() => toggleCompare(product.id)}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              title="Add to compare"
            >
              <ArrowLeftRight className={cn("h-4 w-4", inCompare && "text-primary")} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
              onClick={() => setQuickViewOpen(true)}
              aria-label="Quick view"
              title="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary"
              onClick={() => toggleWishlist(product.id)}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              title="Wishlist"
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-primary text-primary")} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-full p-0 transition-transform duration-300 group-hover:translate-y-0 max-sm:translate-y-0">
            <Button
              className="w-full rounded-none text-xs font-bold uppercase tracking-wide"
              size="sm"
              onClick={handleAddToCart}
            >
              {added ? (
                <>
                  <Check className="h-4 w-4" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  Add To Cart
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-1 px-0.5">
          <Link href={`/product/${product.slug}`}>
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="line-clamp-1 text-xs text-muted-foreground">{product.category}</p>
          <div className="mt-1 flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(product.salePrice!)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
      </div>

      <QuickViewModal product={product} open={quickViewOpen} onOpenChange={setQuickViewOpen} />
    </>
  );
});
