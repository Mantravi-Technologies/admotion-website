"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#why-admotion", label: "Why us" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-[100] w-full border-b border-surface/50 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="relative block h-8 w-auto md:h-9" aria-label="AdMotion home">
          <Image
            src="/images/admotion-logo.png"
            alt="AdMotion"
            width={140}
            height={36}
            className="h-8 w-auto object-contain object-left md:h-9"
            priority
            placeholder="empty"
          />
        </Link>

        <nav className="hidden md:flex md:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-muted transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden flex flex-col gap-1.5 p-2 text-white"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-4 border-t border-surface/50 bg-bg/95 px-6 py-4 backdrop-blur-md md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-text-muted transition-colors hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
