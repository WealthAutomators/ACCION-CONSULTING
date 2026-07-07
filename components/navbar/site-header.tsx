"use client";

import { AnnouncementBar } from "@/components/homepage/announcement-bar";
import { Navbar } from "@/components/navbar/navbar";

export function SiteHeader() {
  return (
    <>
      <AnnouncementBar />
      <div className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
        <Navbar />
      </div>
    </>
  );
}
