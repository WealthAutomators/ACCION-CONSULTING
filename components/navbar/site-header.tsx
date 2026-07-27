"use client";

import { UtilityBar } from "@/components/navbar/utility-bar";
import { Navbar } from "@/components/navbar/navbar";

export function SiteHeader() {
  return (
    <>
      <UtilityBar />
      <div className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
        <Navbar />
      </div>
    </>
  );
}
