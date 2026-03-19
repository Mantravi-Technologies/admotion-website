"use client";

import { MagneticButton } from "@/components/ui/MagneticButton";
import { CONTACT, BRAND } from "@/content/site";

export function Footer() {
  const telHref = `tel:+91${CONTACT.phone.replace(/\D/g, "")}`;

  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-surface px-6 pt-16 pb-16 md:pt-20 md:pb-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className="font-heading text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Let&apos;s Talk
        </h2>
        <p className="mt-8 max-w-md text-xl text-text-muted">
          We look forward to a successful collaboration.
        </p>
        <p className="mt-2 text-lg font-medium text-white">
          You could be the next prestigious client.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-8 md:gap-16">
          <div>
            <p className="text-sm uppercase tracking-wider text-text-muted">
              Address
            </p>
            <p className="mt-1 text-lg text-white">{CONTACT.address}</p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-text-muted">
              Telephone
            </p>
            <a
              href={telHref}
              className="mt-1 block text-lg text-white transition-colors hover:text-cyan-400"
            >
              {CONTACT.phoneDisplay}
            </a>
          </div>
        </div>

        <div className="mt-10">
          <MagneticButton
            as="a"
            href={`mailto:${CONTACT.email}`}
            className="bg-magenta text-white hover:bg-magenta/90"
          >
            {CONTACT.email}
          </MagneticButton>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-surface pt-8">
          <p className="text-text-muted">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-text-muted">
            {BRAND.tagline} · Lucknow
          </p>
        </div>
      </div>
    </footer>
  );
}
