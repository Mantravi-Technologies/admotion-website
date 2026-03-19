"use client";

import Image from "next/image";

/**
 * Hero background: modern geometric blue design image with dark overlay
 * so text stays readable. No heavy shapes — clean and light.
 */
export function HeroBackground() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <Image
        src="/images/hero-bg-geometric.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority
        unoptimized
      />
      {/* Dark overlay so white text is readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,14,0.72) 0%, rgba(12,12,18,0.82) 45%, rgba(15,15,19,0.9) 100%)",
        }}
      />
    </div>
  );
}
