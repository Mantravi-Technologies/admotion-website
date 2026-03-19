"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroBackground } from "@/components/ui/HeroBackground";

gsap.registerPlugin(ScrollTrigger);

const LINE1 = "We are AdMotion";
const ROTATING_PHRASES = ["Advertising", "Marketing", "Branding"];
const SUBTITLE =
  "Full-service outdoor advertising that goes beyond creativity—strategically designed for measurable results.";
const TYPING_MS = 72;
const SUBTITLE_TYPING_MS = 28;
const CURSOR_BLINK_MS = 480;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reelWrapRef = useRef<HTMLParagraphElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const [reelIndex, setReelIndex] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [subtitleLen, setSubtitleLen] = useState(0);
  const [showHeadlineCursor, setShowHeadlineCursor] = useState(true);
  const [showSubtitleCursor, setShowSubtitleCursor] = useState(false);

  // Line 1 typewriter
  useEffect(() => {
    if (typedLength >= LINE1.length) {
      const t = setTimeout(() => setShowHeadlineCursor(false), CURSOR_BLINK_MS * 3);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTypedLength((n) => n + 1), TYPING_MS);
    return () => clearTimeout(t);
  }, [typedLength]);

  // After headline: reel + subtitle typewriter
  useEffect(() => {
    if (typedLength < LINE1.length) return;
    const reelWrap = reelWrapRef.current;
    const scrollCue = scrollCueRef.current;
    if (!reelWrap || !scrollCue) return;

    gsap.fromTo(
      reelWrap,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.15 }
    );
    gsap.fromTo(
      scrollCue,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", delay: 0.55 }
    );
  }, [typedLength]);

  // Subtitle types after headline finishes
  useEffect(() => {
    if (typedLength < LINE1.length) return;
    const startDelay = setTimeout(() => setShowSubtitleCursor(true), 500);
    return () => clearTimeout(startDelay);
  }, [typedLength]);

  useEffect(() => {
    if (!showSubtitleCursor || typedLength < LINE1.length) return;
    if (subtitleLen >= SUBTITLE.length) {
      const t = setTimeout(() => setShowSubtitleCursor(false), CURSOR_BLINK_MS * 4);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSubtitleLen((n) => n + 1), SUBTITLE_TYPING_MS);
    return () => clearTimeout(t);
  }, [showSubtitleCursor, subtitleLen, typedLength]);

  useEffect(() => {
    const scrollCue = scrollCueRef.current;
    if (!sectionRef.current || !scrollCue) return;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        gsap.to(scrollCue, { opacity: 1 - self.progress * 1.2, duration: 0.2 });
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        setReelIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
      }, 2800);
      return () => clearInterval(interval);
    }, LINE1.length * TYPING_MS + 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[88svh] w-full max-w-[100vw] flex-col items-center justify-center overflow-x-hidden px-4 pt-24 pb-20 text-center sm:px-6 md:min-h-[100dvh] md:min-h-screen md:pb-10 lg:pb-12"
    >
      <HeroBackground />
      <div className="relative z-10 w-full min-w-0 max-w-4xl px-1 sm:max-w-5xl sm:px-0">
        <h1
          className="font-mono text-2xl font-semibold leading-snug tracking-tight text-white [overflow-wrap:anywhere] min-[400px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          <span className="text-cyan-400/90">&gt;</span>{" "}
          {LINE1.slice(0, typedLength).split("").map((char, i) => (
            <span key={i}>{char === " " ? " " : char}</span>
          ))}
          {showHeadlineCursor && (
            <span
              className="ml-0.5 inline-block w-2 animate-[cursor-blink_1s_step-end_infinite] bg-cyan-400 align-middle sm:w-2.5"
              style={{ height: "0.85em" }}
              aria-hidden
            />
          )}
        </h1>
        <p
          ref={reelWrapRef}
          className="mt-10 flex w-full min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-lg font-medium text-white/90 sm:mt-8 sm:text-2xl md:mt-7 md:text-3xl lg:mt-8 lg:text-4xl"
          style={{ opacity: 0 }}
        >
          <span className="text-white/50">$</span>
          <span>we_do</span>
          <span className="min-h-[1.15em] min-w-0 font-semibold text-cyan-400 sm:min-w-[160px] md:min-w-[200px]">
            <ReelWord key={reelIndex} phrase={ROTATING_PHRASES[reelIndex]} />
          </span>
        </p>
      </div>
      <div className="relative z-10 mt-6 w-full min-w-0 max-w-2xl px-2 sm:mt-10 sm:px-4 md:mt-8">
        <p
          className="text-center font-mono text-sm leading-relaxed text-white/85 [overflow-wrap:anywhere] sm:text-base md:text-lg"
          style={{ minHeight: "4.5em" }}
        >
          {SUBTITLE.slice(0, subtitleLen).split("").map((char, i) => (
            <span key={i}>{char === " " ? " " : char}</span>
          ))}
          {showSubtitleCursor && subtitleLen < SUBTITLE.length && (
            <span
              className="ml-0.5 inline-block w-1.5 animate-[cursor-blink_1.1s_step-end_infinite] bg-cyan-400/80 align-middle"
              style={{ height: "1em" }}
              aria-hidden
            />
          )}
        </p>
        {subtitleLen >= SUBTITLE.length && (
          <p className="mt-4 text-center font-mono text-sm font-semibold text-white sm:text-base">
            Lucknow · Gomti Nagar
          </p>
        )}
      </div>
      <div
        ref={scrollCueRef}
        className="scroll-cue absolute bottom-8 left-1/2 z-10 mt-0 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs text-white/70 max-md:bottom-6"
        style={{ opacity: 0 }}
        aria-hidden
      >
        <span className="uppercase tracking-[0.2em]">scroll</span>
        <span className="block h-8 w-5 rounded-full border-2 border-current opacity-60" />
      </div>
    </section>
  );
}

function ReelWord({ phrase }: { phrase: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }
    );
  }, [phrase]);
  return <span ref={ref}>{phrase}</span>;
}
