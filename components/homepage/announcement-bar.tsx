"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { utilityBarLinks } from "@/data/navigation";

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-xs font-medium text-white sm:text-sm">
      <Container className="py-2">
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center">
          {utilityBarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/90 transition-colors hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
