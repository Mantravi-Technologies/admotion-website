"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  COMPANY_OVERVIEW,
  VISION,
  MISSION,
  KEY_FACTORS,
} from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const blocksRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      blocksRef.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
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
      id="about"
      className="relative z-10 px-6 max-md:min-h-0 max-md:pt-2 max-md:pb-10 md:min-h-screen md:pb-20 md:pt-10 lg:pb-28 lg:pt-12"
    >
      <div className="mx-auto max-w-4xl">
        <h2
          className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          About Ad Motion
        </h2>

        <div
          ref={(el) => {
            blocksRef.current[0] = el;
          }}
          className="mt-6 space-y-4 text-lg leading-relaxed text-text-muted"
        >
          <p className="text-white">Company Overview</p>
          {COMPANY_OVERVIEW.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div
            ref={(el) => {
              blocksRef.current[1] = el;
            }}
            className="rounded-2xl border border-cyan/30 bg-surface/50 p-6"
          >
            <h3 className="font-heading text-xl font-semibold text-cyan" style={{ fontFamily: "var(--font-heading)" }}>
              Vision
            </h3>
            <p className="mt-3 leading-relaxed text-text-muted">{VISION}</p>
          </div>
          <div
            ref={(el) => {
              blocksRef.current[2] = el;
            }}
            className="rounded-2xl border border-magenta/30 bg-surface/50 p-6"
          >
            <h3 className="font-heading text-xl font-semibold text-magenta" style={{ fontFamily: "var(--font-heading)" }}>
              Mission
            </h3>
            <p className="mt-3 leading-relaxed text-text-muted">{MISSION}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {KEY_FACTORS.map((factor, i) => (
            <div
              key={factor.title}
              ref={(el) => {
                blocksRef.current[3 + i] = el;
              }}
              className="rounded-2xl border border-yellow/20 bg-surface/30 p-6"
            >
              <h3 className="font-heading text-lg font-semibold text-yellow" style={{ fontFamily: "var(--font-heading)" }}>
                {factor.title}
              </h3>
              <p className="mt-2 leading-relaxed text-text-muted">
                {factor.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
