"use client";

import Link from "next/link";
import { company } from "@/data/company";
import { utilityBarLinks } from "@/data/navigation";
import { Container } from "@/components/ui/container";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.917L1.254 2.25H8.08l4.263 5.686L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.94 6.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88zM4.75 9h4.4v11.5h-4.4V9zm7.05 0h4.22v1.57h.06c.59-1.05 2.03-2.15 4.18-2.15 4.47 0 5.29 2.94 5.29 6.76V20.5h-4.4v-5.2c0-1.24-.02-2.83-1.73-2.83-1.73 0-2 1.35-2 2.74v5.29h-4.4V9z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.75-3.25a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  );
}

const socialIcons = [
  { key: "facebook", href: company.social.facebook, Icon: FacebookIcon, label: "Facebook" },
  { key: "twitter", href: company.social.twitter, Icon: XIcon, label: "X" },
  { key: "linkedin", href: company.social.linkedin, Icon: LinkedInIcon, label: "LinkedIn" },
  { key: "instagram", href: company.social.instagram, Icon: InstagramIcon, label: "Instagram" },
] as const;

export function UtilityBar() {
  return (
    <div className="bg-primary text-white">
      <Container>
        <div className="flex h-9 items-center justify-between gap-4 text-[11px] font-medium uppercase tracking-wide">
          <a
            href={`mailto:${company.email}`}
            className="truncate transition-opacity hover:opacity-80"
          >
            {company.email}
          </a>
          <div className="flex shrink-0 items-center gap-4">
            <div className="hidden items-center gap-2.5 sm:flex">
              {socialIcons.map(({ key, href, Icon, label }) =>
                href ? (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="transition-opacity hover:opacity-80"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ) : null
              )}
            </div>
            <div className="flex items-center gap-3">
              {utilityBarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-opacity hover:opacity-80"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
