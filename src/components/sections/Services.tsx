"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BentoCard } from "@/components/ui/BentoCard";

gsap.registerPlugin(ScrollTrigger);

import { SERVICES_GROUPED, PORTFOLIO_INTRO } from "@/content/site";

/** Featured services for Bento grid (from catalog + company profile). */
const FEATURED_INDICES = [0, 1, 2, 5, 6, 7, 8, 9, 11, 18] as const;
const SERVICES = FEATURED_INDICES.map((i) => ({
  ...SERVICES_GROUPED[i],
  size: i === 18 ? ("wide" as const) : SERVICES_GROUPED[i].size,
}));

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Skip per-card ScrollTrigger on touch devices to reduce mobile scroll jank
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((el, i) => {
        if (!el) return;
        if (isTouch) {
          gsap.set(el, { opacity: 1, y: 0 });
          return;
        }
        gsap.fromTo(
          el,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              end: "top 60%",
              scrub: false,
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-10 px-4 pb-16 pt-14 md:px-6 md:pb-28 md:pt-24"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          className="font-heading text-2xl font-bold text-white sm:text-3xl md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          What we do
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted md:mt-3 md:text-lg">
          {PORTFOLIO_INTRO}
        </p>

        <div className="admotion-bento mt-5 grid grid-cols-1 gap-1.5 sm:mt-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {SERVICES.map((service, i) => (
            <div
              key={service.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={getBentoClass(service.size)}
            >
              <BentoCard
                title={service.title}
                description={service.description}
                accent={service.accent}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function getBentoClass(size: string): string {
  const base = "min-h-[200px]";
  switch (size) {
    case "large":
      return `${base} sm:col-span-2`;
    case "wide":
      return `${base} sm:col-span-2 lg:col-span-4`;
    default:
      return base;
  }
}
