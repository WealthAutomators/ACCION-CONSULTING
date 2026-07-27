"use client";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { CompareProvider } from "@/context/CompareContext";
import { CompareBar } from "@/components/product/compare-bar";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <CompareProvider>
          <RecentlyViewedProvider>
            {children}
            <CompareBar />
          </RecentlyViewedProvider>
        </CompareProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
