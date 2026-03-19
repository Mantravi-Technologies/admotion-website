"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const AUTO_INTERVAL_MS = 4000;
const SWIPE_THRESHOLD = 48;
const TAP_MAX_MOVE = 14;

interface CardImageCarouselProps {
  images: string[];
  width: number;
  height?: number;
  autoScroll?: boolean;
  className?: string;
  /** When set, in-card lightbox is open (controlled by parent). */
  expandedIndex: number | null;
  onExpand: (index: number) => void;
}

export function CardImageCarousel({
  images,
  width,
  height = 200,
  autoScroll = true,
  className = "",
  expandedIndex,
  onExpand,
}: CardImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const dragOffset = useRef(0);
  const pointerActiveRef = useRef(false);
  const maxMoveRef = useRef(0);
  const suppressClickRef = useRef(false);

  const N = images.length;
  const isLightboxOpen = expandedIndex !== null;

  const goTo = useCallback((delta: number) => {
    setIndex((i) => ((i + delta) % N + N) % N);
  }, [N]);

  const goToIndex = useCallback((i: number) => {
    setIndex(() => Math.max(0, Math.min(N - 1, i)));
  }, [N]);

  useEffect(() => {
    if (!autoScroll || N <= 1 || isLightboxOpen) return;
    const id = setInterval(() => {
      if (pointerActiveRef.current) return;
      goTo(1);
    }, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [autoScroll, N, isLightboxOpen, goTo]);

  const applyStripTransform = useCallback(
    (xPx: number, transition: boolean) => {
      const strip = stripRef.current;
      if (!strip) return;
      strip.style.transition = transition
        ? "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none";
      strip.style.transform = `translate3d(${xPx}px, 0, 0)`;
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isLightboxOpen) return;
      e.stopPropagation();
      const t = e.target as HTMLElement;
      if (t.closest("button")) return;
      pointerActiveRef.current = true;
      maxMoveRef.current = 0;
      dragStartX.current = e.clientX;
      dragOffset.current = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      applyStripTransform(-index * width, false);
    },
    [applyStripTransform, index, width, isLightboxOpen]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerActiveRef.current) return;
      dragOffset.current = e.clientX - dragStartX.current;
      maxMoveRef.current = Math.max(maxMoveRef.current, Math.abs(dragOffset.current));
      applyStripTransform(-index * width + dragOffset.current, false);
    },
    [applyStripTransform, index, width]
  );

  const handlePointerEnd = useCallback(() => {
    if (!pointerActiveRef.current) return;
    pointerActiveRef.current = false;
    const moved = maxMoveRef.current;
    const wasSwipe = moved > SWIPE_THRESHOLD;
    let newIndex = index;

    if (wasSwipe) {
      newIndex =
        dragOffset.current > 0
          ? (index - 1 + N) % N
          : (index + 1) % N;
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 400);
    }

    setIndex(newIndex);
    applyStripTransform(-newIndex * width, true);

    if (!wasSwipe && moved <= TAP_MAX_MOVE) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 450);
      onExpand(newIndex);
    }

    dragOffset.current = 0;
  }, [N, applyStripTransform, index, onExpand, width]);

  useEffect(() => {
    if (!pointerActiveRef.current) {
      applyStripTransform(-index * width, true);
    }
  }, [index, width, applyStripTransform]);

  if (N === 0) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-t-2xl bg-black/30 ${className}`}
      style={{
        width,
        height,
        touchAction: "pan-y",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => {
        try {
          (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        handlePointerEnd();
      }}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={(e) => {
        if (pointerActiveRef.current && e.buttons === 0) handlePointerEnd();
      }}
    >
      <div
        ref={stripRef}
        className="flex h-full"
        style={{
          width: width * N,
          willChange: "transform",
        }}
      >
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="relative flex-shrink-0 cursor-pointer"
            style={{ width, height }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (suppressClickRef.current || isLightboxOpen) return;
              onExpand(i);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onExpand(i);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Expand image ${i + 1} in card`}
          >
            <Image
              src={src}
              alt=""
              width={Math.max(1, Math.round(width))}
              height={Math.max(1, Math.round(height))}
              className="object-cover"
              sizes={`${Math.max(1, Math.round(width))}px`}
              unoptimized={src.startsWith("/")}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {N > 1 && !isLightboxOpen && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              goTo(-1);
            }}
            className="absolute left-1 top-1/2 z-20 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition hover:bg-black/80 md:left-2 md:min-h-10 md:min-w-10"
            aria-label="Previous image"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              goTo(1);
            }}
            className="absolute right-1 top-1/2 z-20 flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white shadow-md transition hover:bg-black/80 md:right-2 md:min-h-10 md:min-w-10"
            aria-label="Next image"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="pointer-events-none absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(i);
                }}
                className={`pointer-events-auto h-1.5 min-w-1.5 rounded-full transition-all duration-300 hover:bg-white/90 ${
                  i === index ? "min-w-6 bg-white" : "bg-white/45"
                }`}
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
