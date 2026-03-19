"use client";

import { useLayoutEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WHY_ADMOTION } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const ACCENT_HOVER: Record<(typeof WHY_ADMOTION.pillars)[number]["accent"], string> = {
  cyan: "hover:border-cyan/50 hover:shadow-[0_0_30px_rgba(0,180,216,0.15)]",
  magenta: "hover:border-magenta/50 hover:shadow-[0_0_30px_rgba(224,26,79,0.12)]",
  yellow: "hover:border-yellow/50 hover:shadow-[0_0_30px_rgba(255,209,102,0.12)]",
};

const ACCENT_TITLE: Record<(typeof WHY_ADMOTION.pillars)[number]["accent"], string> = {
  cyan: "text-cyan",
  magenta: "text-magenta",
  yellow: "text-yellow",
};

const THREE_PILLARS = WHY_ADMOTION.pillars.slice(0, 3);
const STRIP_ITEMS = [...THREE_PILLARS, ...THREE_PILLARS];

function WhyCard({
  item,
  className = "",
}: {
  item: (typeof WHY_ADMOTION.pillars)[number];
  className?: string;
}) {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`flex flex-col rounded-2xl border-2 border-surface bg-surface p-6 transition-colors ${ACCENT_HOVER[item.accent]} ${className}`}
      style={{
        minWidth: 240,
        flexShrink: 0,
        backgroundColor: "#1a1a20",
        border: "2px solid #2a2a32",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h3
        className={`font-heading text-lg font-semibold md:text-xl ${ACCENT_TITLE[item.accent]}`}
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {item.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-text-muted md:text-[15px]">
        {item.description}
      </p>
    </motion.article>
  );
}

/**
 * GSAP pin + scrub: section pins when it hits the top, horizontal strip moves with vertical scroll.
 */
export function WhyAdMotion() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const stripWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const strip = stripRef.current;
    const wrap = stripWrapRef.current;
    const pin = pinRef.current;
    if (!strip || !wrap || !pin) return;

    let ctx: gsap.Context;

    const run = () => {
      ctx?.revert();
      const travel = Math.max(0, strip.scrollWidth - wrap.clientWidth);
      const narrow = window.innerWidth < 768;
      const scrollPx = Math.max(
        Math.round(travel + (narrow ? 14 : 20)),
        narrow ? 168 : 200
      );

      ctx = gsap.context(() => {
        gsap.set(strip, { x: 0, force3D: true });
        gsap.to(strip, {
          x: -travel,
          ease: "none",
          overwrite: true,
          scrollTrigger: {
            trigger: pin,
            start: "top top",
            end: () => `+=${scrollPx}`,
            pin: true,
            pinSpacing: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);
    };

    run();
    const ro = new ResizeObserver(() => {
      run();
      ScrollTrigger.refresh();
    });
    ro.observe(strip);
    ro.observe(wrap);
    ro.observe(pin);

    const t = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 500);

    return () => {
      cancelAnimationFrame(t);
      clearTimeout(t2);
      ro.disconnect();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-admotion"
      className="relative z-10 bg-bg max-md:pb-0"
      data-layout="team-style-sticky-strip"
    >
      <div
        ref={pinRef}
        className="flex w-full min-h-[100svh] flex-col bg-bg px-4 pb-2 pt-14 max-md:min-h-[min(82svh,640px)] md:h-auto md:min-h-0 md:flex-row md:items-end md:px-0 md:pb-5 md:pt-20 lg:pt-24"
        style={{ backgroundColor: "#0f0f13" }}
      >
        <div className="relative z-20 min-w-0 shrink-0 border-surface/30 bg-bg md:w-[min(100%,380px)] md:border-r md:px-8 md:pr-6 md:pb-0">
          <h2
            className="font-heading text-2xl font-bold tracking-tight text-white md:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {WHY_ADMOTION.title}
          </h2>
          <p className="mt-1.5 text-left text-sm leading-snug text-text-muted max-md:leading-snug md:mt-4 md:text-base md:leading-relaxed">
            {WHY_ADMOTION.intro}
          </p>
        </div>

        <div
          ref={stripWrapRef}
          className="relative z-0 flex min-h-0 min-w-0 flex-none flex-col justify-start overflow-hidden pt-1 max-md:flex-none md:min-w-0 md:flex-1 md:justify-end md:pl-4 md:pr-8 md:pb-0 md:pt-0"
        >
          <div
            ref={stripRef}
            className="flex w-max gap-4 md:gap-8"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              width: "max-content",
              gap: "1rem",
              willChange: "transform",
            }}
          >
            {STRIP_ITEMS.map((item, index) => (
              <WhyCard
                key={`why-${item.title}-${index}`}
                item={item}
                className="w-[240px] flex-shrink-0 sm:w-[260px] md:w-[280px] lg:w-[300px]"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
