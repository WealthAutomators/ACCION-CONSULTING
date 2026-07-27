"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, Search } from "lucide-react";
import { searchProducts } from "@/data/products";
import { categories } from "@/data/categories";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface HeaderSearchBarProps {
  className?: string;
}

export function HeaderSearchBar({ className }: HeaderSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const searchResults =
    searchQuery.length > 0
      ? searchProducts(searchQuery)
          .filter((p) => !category || p.categorySlug === category)
          .slice(0, 5)
      : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      router.push(
        `/categories/${category}${
          searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : ""
        }`
      );
    } else if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      return;
    }
    setSearchOpen(false);
    setSearchQuery("");
  };

  const selectedLabel =
    categories.find((c) => c.slug === category)?.name ?? "Select Category";

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSearchSubmit}>
        <div className="flex h-12 rounded-sm border border-border bg-white">
          <input
            type="search"
            placeholder="Search for products"
            className="min-w-0 flex-1 rounded-l-sm bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
          />
          <div className="relative hidden shrink-0 border-l border-border sm:block">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className="flex h-full min-w-[160px] items-center justify-between gap-2 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground"
            >
              <span className="truncate">{selectedLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            </button>
            {catOpen && (
              <div className="absolute right-0 top-full z-[60] mt-1 max-h-72 w-56 overflow-auto rounded-sm border border-border bg-white py-1 shadow-lg">
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                  onClick={() => {
                    setCategory("");
                    setCatOpen(false);
                  }}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    className="block w-full px-3 py-2 text-left text-xs hover:bg-muted"
                    onClick={() => {
                      setCategory(c.slug);
                      setCatOpen(false);
                    }}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-r-sm bg-primary text-white transition-colors hover:bg-secondary"
            aria-label="Search products"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {searchOpen && searchQuery.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-sm border border-border bg-white py-1 shadow-lg">
          {searchResults.length > 0 ? (
            <>
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="flex items-center gap-3 px-3 py-2 transition-colors hover:bg-muted"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-sm border border-border bg-white">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-0.5"
                      sizes="36px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-primary">
                      {formatPrice(product.salePrice ?? product.price)}
                    </p>
                  </div>
                </Link>
              ))}
              <button
                type="button"
                className="w-full border-t border-border px-3 py-2 text-left text-sm font-medium text-primary transition-colors hover:bg-muted"
                onClick={() => {
                  router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
              >
                View all results for &quot;{searchQuery}&quot;
              </button>
            </>
          ) : (
            <div className="px-3 py-2.5 text-sm text-muted-foreground">
              No products found for &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
