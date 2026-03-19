"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Wraps the app with Lenis smooth scroll and syncs with GSAP ScrollTrigger.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Use native scroll on touch devices to avoid mobile scroll lag; keep smooth wheel on desktop
    const isTouch =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window);
    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      syncTouch: !isTouch,
      syncTouchLerp: isTouch ? 0.1 : 0.075,
      touchMultiplier: isTouch ? 1 : 1.15,
      wheelMultiplier: 0.9,
      anchors: true,
    });

    setLenis(instance);

    instance.on("scroll", () => {
      ScrollTrigger.update();
    });

    // When using native touch scroll, Lenis may not emit; keep ScrollTrigger in sync
    let tick: number | null = null;
    const onNativeScroll = () => {
      if (tick == null) tick = requestAnimationFrame(() => { ScrollTrigger.update(); tick = null; });
    };
    if (isTouch) {
      window.addEventListener("scroll", onNativeScroll, { passive: true });
    }

    function raf(time: number) {
      instance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      if (isTouch) window.removeEventListener("scroll", onNativeScroll);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [pathname]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
