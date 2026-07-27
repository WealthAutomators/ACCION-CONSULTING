import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/navbar/site-header";
import { Footer } from "@/components/footer/footer";
import { Providers } from "@/components/providers/Providers";
import { BackToTop } from "@/components/ui/back-to-top";
import { company } from "@/data/company";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://accionitconsulting.com"),
  title: {
    default: `${company.name} | ${company.tagline}`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  keywords: [
    "ACCION",
    "Accion IT Consulting",
    "office supplies",
    "janitorial supplies",
    "cleaning products",
    "B2B marketplace",
    "breakroom supplies",
    "industrial supplies",
  ],
  openGraph: {
    type: "website",
    siteName: company.name,
    title: `${company.name} | ${company.tagline}`,
    description: company.description,
    url: "https://accionitconsulting.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} | ${company.tagline}`,
    description: company.description,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.name,
  description: company.description,
  email: company.email,
  telephone: company.phone,
  slogan: company.tagline,
  url: "https://accionitconsulting.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.zip,
    addressCountry: company.address.country,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Providers>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  );
}
