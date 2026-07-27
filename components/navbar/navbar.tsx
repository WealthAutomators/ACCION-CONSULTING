"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Menu, Search, ShoppingCart, X } from "lucide-react";
import { company } from "@/data/company";
import { navigationLinks } from "@/data/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeaderSearchBar } from "@/components/navbar/header-search-bar";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount, total } = useCart();
  const { wishlist } = useWishlist();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("?")[0]);

  return (
    <header className="bg-white">
      <Container>
        <div className="flex h-16 items-center gap-3 py-2 lg:h-[88px] lg:gap-6">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logo/logo.svg"
              alt={company.name}
              width={200}
              height={44}
              priority
              className="h-9 w-auto sm:h-10 lg:h-11"
            />
          </Link>

          <div className="relative mx-auto hidden min-w-0 max-w-2xl flex-1 lg:block">
            <HeaderSearchBar />
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="h-[18px] w-[18px]" /> : <Search className="h-[18px] w-[18px]" />}
            </Button>

            <Button variant="ghost" size="icon" asChild className="relative hidden h-9 w-9 sm:inline-flex">
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="h-[18px] w-[18px]" />
                {wishlist.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </Button>

            <Link
              href="/cart"
              className="group/cart relative flex items-center gap-2 rounded-full border border-primary bg-white px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:!text-white"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4 text-primary transition-colors group-hover/cart:text-white" />
              <span className="hidden text-primary transition-colors group-hover/cart:text-white sm:inline">
                {formatPrice(total)}
              </span>
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white group-hover/cart:bg-white group-hover/cart:text-primary">
                {itemCount}
              </span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </Button>
          </div>
        </div>
      </Container>

      <div className="hidden border-t border-border lg:block">
        <Container>
          <nav className="flex items-center justify-center">
            <ul className="flex flex-wrap items-center justify-center gap-0.5 py-2.5">
              {navigationLinks.map((link) => (
                <li key={link.href} className="group relative">
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide transition-colors",
                      isActive(link.href)
                        ? "text-primary"
                        : "text-foreground/80 hover:text-primary"
                    )}
                  >
                    {link.label}
                    {link.children && link.children.length > 0 && (
                      <ChevronDown className="h-3 w-3 opacity-60" />
                    )}
                  </Link>
                  {link.children && link.children.length > 0 && (
                    <div className="invisible absolute left-0 top-full z-50 min-w-[200px] rounded-sm border border-border bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-4 py-2 text-xs font-medium text-foreground/80 hover:bg-muted hover:text-primary"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>

      <AnimatePresence initial={false}>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-visible border-t border-border bg-white lg:hidden"
          >
            <Container className="py-3">
              <HeaderSearchBar />
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      {mobileOpen && (
        <div className="border-t border-border bg-white lg:hidden">
          <Container className="py-3">
            <ul className="space-y-0.5">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-sm px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-foreground/85 hover:bg-muted hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-sm px-6 py-2 text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </li>
              ))}
              <li>
                <Link
                  href="/wishlist"
                  className="block rounded-sm px-3 py-2.5 text-sm font-semibold uppercase tracking-wide hover:bg-muted hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  Wishlist ({wishlist.length})
                </Link>
              </li>
            </ul>
          </Container>
        </div>
      )}
    </header>
  );
}
