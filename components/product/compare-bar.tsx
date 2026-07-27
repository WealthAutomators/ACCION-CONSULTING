"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { formatPrice } from "@/lib/format";
import { Container } from "@/components/ui/container";

export function CompareBar() {
  const { compareProducts, toggleCompare, clearCompare } = useCompare();

  if (compareProducts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <Container className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 overflow-x-auto">
          {compareProducts.map((product) => (
            <div
              key={product.id}
              className="flex min-w-[180px] items-center gap-2 rounded-sm border border-border bg-muted/40 px-2 py-1.5"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-white">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-contain p-0.5"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{product.name}</p>
                <p className="text-xs text-primary">
                  {formatPrice(product.salePrice ?? product.price)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`Remove ${product.name} from compare`}
                onClick={() => toggleCompare(product.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={clearCompare}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
          >
            Clear
          </button>
          <Link
            href="/shop"
            className="bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-secondary"
          >
            Compare ({compareProducts.length})
          </Link>
        </div>
      </Container>
    </div>
  );
}
