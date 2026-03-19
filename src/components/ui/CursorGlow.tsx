"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle gradient glow that follows the cursor in the hero area.
 * Uses CSS custom properties for position; GPU-accelerated.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
      aria-hidden
      style={{
        background: `radial-gradient(
          600px circle at var(--x, 50%) var(--y, 50%),
          rgba(0, 180, 216, 0.15),
          rgba(224, 26, 79, 0.08),
          transparent 40%
        )`,
      }}
    />
  );
}
