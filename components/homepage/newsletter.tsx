"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { newsletter } from "@/data/homepage";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <Image
        src={newsletter.image}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/55" />
      <Container className="relative">
        <div className="mx-auto max-w-3xl border border-white/70 px-6 py-12 text-center text-white md:px-12 md:py-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{newsletter.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
            {newsletter.description}
          </p>
          {submitted ? (
            <p className="mt-8 text-sm font-medium text-white">Thank you for subscribing!</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-sm border-white/30 bg-white/10 text-white placeholder:text-white/55"
              />
              <Button
                type="submit"
                size="lg"
                className="shrink-0 rounded-sm bg-white text-primary hover:bg-white/90"
              >
                {newsletter.buttonText}
              </Button>
            </form>
          )}
          <p className="mt-6 text-xs text-white/70">
            Will be used in accordance with our{" "}
            <Link href="/privacy" className="font-semibold text-white underline underline-offset-2">
              Privacy Policy
            </Link>
          </p>
        </div>
      </Container>
    </section>
  );
}
