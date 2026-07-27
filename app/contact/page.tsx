"use client";

import { useState } from "react";
import { company } from "@/data/company";
import { PageHero } from "@/components/ui/page-layout";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Clock, CheckCircle, Phone } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        description="Have a question about your order or our products? Our team is here to help."
        breadcrumbs={[{ label: "Contact Us" }]}
      />

      <Container className="pb-16">
        <div className="grid gap-12 py-12 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">Get in Touch</h2>
            <p className="mt-2 text-muted-foreground">
              We typically respond within one business day. For order-related inquiries,
              please include your order number.
            </p>

            <div className="mt-8 space-y-6">
              {[
                { icon: Mail, label: "Email", value: company.email },
                { icon: Phone, label: "Phone", value: company.phone },
                {
                  icon: MapPin,
                  label: "Address",
                  value: `${company.address.street}, ${company.address.city}, ${company.address.state} ${company.address.zip}`,
                },
                { icon: Clock, label: "Hours", value: company.hours },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Send a Message</h2>

            {submitted ? (
              <div className="mt-6 flex flex-col items-center py-8 text-center">
                <CheckCircle className="h-12 w-12 text-primary" />
                <p className="mt-4 text-lg font-medium">Message Sent!</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Thank you for reaching out. We&apos;ll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" required className="mt-1.5" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required className="mt-1.5" placeholder="your@email.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required className="mt-1.5" placeholder="How can we help?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" required className="mt-1.5" placeholder="Tell us more..." rows={5} />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
