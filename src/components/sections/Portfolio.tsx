"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { WORK_PROJECTS, getProjectImageSrcs } from "@/content/work";
import { CardImageCarousel } from "@/components/ui/CardImageCarousel";

const GAP = 24;
const N = WORK_PROJECTS.length;
/** Three copies so we can animate last→first (and first→last) in one step, then reset. */
const DISPLAY_ITEMS = [...WORK_PROJECTS, ...WORK_PROJECTS, ...WORK_PROJECTS];
const TOTAL = DISPLAY_ITEMS.length;

/** Mobile: slightly wider cards (~2.35 in view); larger breakpoints keep 3-up. */
function getCardWidth(viewportWidth: number) {
  const sectionGutter = 16;
  const usable = Math.max(0, viewportWidth - sectionGutter);
  if (viewportWidth < 640) {
    const w = (usable - 2 * GAP) / 2.35;
    return Math.max(104, Math.floor(w));
  }
  const w = (usable - 2 * GAP) / 3;
  if (viewportWidth < 900) return Math.max(160, Math.floor(w));
  if (viewportWidth < 1200) return Math.max(220, Math.floor(w));
  return Math.max(280, Math.floor(w));
}

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselViewportRef = useRef<HTMLDivElement>(null);
  const cardRefsRef = useRef<(HTMLDivElement | null)[]>([]);
  const stripTweenRef = useRef<gsap.core.Tween | null>(null);

  // Use fixed default until measured so server and client render identical HTML (avoids hydration mismatch).
  const viewportWidth = containerWidth > 0 ? containerWidth : 1024;
  const cardWidth = getCardWidth(viewportWidth);
  const step = cardWidth + GAP;
  const cardPaddingLeft = viewportWidth / 2 - cardWidth / 2;

  const updateCardTransforms = useCallback(
    (stripX: number) => {
      const virtualIndex = -stripX / step;
      cardRefsRef.current.forEach((el, index) => {
        if (!el) return;
        const offset = index - virtualIndex;
        const abs = Math.abs(offset);
        const scale = abs <= 0.5 ? 1 : 1 - Math.min(1, abs) * 0.15;
        const rotateY = offset === 0 ? 0 : offset * 22;
        const x = offset === 0 ? 0 : offset * (cardWidth * 0.08);
        gsap.set(el, { scale, rotateY, x, force3D: true, backfaceVisibility: "hidden" });
      });
    },
    [step, cardWidth]
  );

  /** Strip position for logical index i: use second copy so left/center/right cards are visible. */
  const stripXForIndex = useCallback((i: number) => -(N + i) * step, [step]);

  const goToIndex = useCallback(
    (index: number) => {
      const targetIndex = ((index % N) + N) % N;
      const strip = stripRef.current;
      if (!strip) return;

      stripTweenRef.current?.kill();

      const ease = "expo.out" as const;
      const duration = 0.75;

      const isNextFromLast = activeIndex === N - 1 && targetIndex === 0;
      const isPrevFromFirst = activeIndex === 0 && targetIndex === N - 1;

      if (isNextFromLast) {
        setActiveIndex(0);
        stripTweenRef.current = gsap.to(strip, {
          x: -(2 * N) * step,
          duration,
          ease,
          force3D: true,
          onUpdate: function () {
            updateCardTransforms(gsap.getProperty(strip, "x") as number);
          },
          onComplete: function () {
            gsap.set(strip, { x: stripXForIndex(0), force3D: true });
            updateCardTransforms(stripXForIndex(0));
            stripTweenRef.current = null;
          },
        });
        return;
      }

      if (isPrevFromFirst) {
        setActiveIndex(N - 1);
        stripTweenRef.current = gsap.to(strip, {
          x: -(N - 1) * step,
          duration,
          ease,
          force3D: true,
          onUpdate: function () {
            updateCardTransforms(gsap.getProperty(strip, "x") as number);
          },
          onComplete: function () {
            gsap.set(strip, { x: stripXForIndex(N - 1), force3D: true });
            updateCardTransforms(stripXForIndex(N - 1));
            stripTweenRef.current = null;
          },
        });
        return;
      }

      const x = stripXForIndex(targetIndex);
      setActiveIndex(targetIndex);
      stripTweenRef.current = gsap.to(strip, {
        x,
        duration,
        ease,
        force3D: true,
        onUpdate: function () {
          updateCardTransforms(gsap.getProperty(strip, "x") as number);
        },
        onComplete: function () {
          stripTweenRef.current = null;
        },
      });
      updateCardTransforms(x);
    },
    [activeIndex, step, stripXForIndex, updateCardTransforms]
  );

  useEffect(() => {
    const el = carouselViewportRef.current ?? containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? 0;
      setContainerWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (strip) {
      const x = stripXForIndex(activeIndex);
      gsap.set(strip, { x });
      updateCardTransforms(x);
    }
  }, [containerWidth, activeIndex, step, stripXForIndex, updateCardTransforms]);

  const dragStartX = useRef(0);
  const dragStartScrollX = useRef(0);
  const dragCurrentX = useRef(0);
  const isDragging = useRef(false);
  const rafId = useRef<number>(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if ((e.target as HTMLElement).closest?.("button")) return;
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartScrollX.current = stripXForIndex(activeIndex);
      dragCurrentX.current = dragStartScrollX.current;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [activeIndex, stripXForIndex]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      const strip = stripRef.current;
      if (!strip) return;
      const dx = e.clientX - dragStartX.current;
      const x = dragStartScrollX.current + dx;
      const maxX = -N * step;
      const minX = -(3 * N - 1) * step;
      const clampedX = Math.max(minX, Math.min(maxX, x));
      dragCurrentX.current = clampedX;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        gsap.set(strip, { x: clampedX, force3D: true });
        updateCardTransforms(clampedX);
        rafId.current = 0;
      });
    },
    [step, updateCardTransforms]
  );

  useEffect(() => () => { if (rafId.current) cancelAnimationFrame(rafId.current); }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      if (!isDragging.current) return;
      isDragging.current = false;
      const strip = stripRef.current;
      if (!strip) return;
      const currentX = dragCurrentX.current;
      let stripIndex = Math.round(-currentX / step);
      stripIndex = Math.max(0, Math.min(TOTAL - 1, stripIndex));
      const normalizedIndex = stripIndex % N;
      const targetX = stripXForIndex(normalizedIndex);

      setActiveIndex(normalizedIndex);
      gsap.to(strip, {
        x: targetX,
        duration: 0.7,
        ease: "expo.out",
        force3D: true,
        onUpdate: function () {
          updateCardTransforms(gsap.getProperty(strip, "x") as number);
        },
      });
      updateCardTransforms(targetX);
    },
    [step, stripXForIndex, updateCardTransforms]
  );

  return (
    <section id="work" className="relative z-10 overflow-hidden px-3 py-16 sm:px-4 md:py-24 lg:py-28">
      <div ref={containerRef} className="mx-auto w-full min-w-0 max-w-[1400px]">
        <h2
          className="font-heading text-center text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Campaigns that made an impact
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-lg text-text-muted">
          From Tata Sampann to Kangaroo Kids and more — we bring brands to the streets
          and screens.
        </p>

        {/* Menu: compact nav – [Prev] [pills] [Next] */}
        <div className="mt-8 flex w-full justify-center md:mt-10">
          <div className="flex w-full max-w-full items-center justify-center rounded-xl border border-surface bg-surface/40 px-1.5 py-1.5 backdrop-blur-sm md:max-w-fit md:gap-2 md:px-3 md:py-2">
            <button
              type="button"
              onClick={() => goToIndex(activeIndex - 1)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-surface bg-surface text-white transition-colors hover:border-cyan/50 hover:bg-surface/80 md:h-8 md:w-8"
              aria-label="Previous"
            >
              <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex min-w-0 flex-1 flex-nowrap items-center justify-center gap-1 overflow-x-auto scrollbar-hide py-0.5 md:flex-initial md:flex-none md:gap-2 md:overflow-visible">
              {WORK_PROJECTS.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goToIndex(i)}
                  className={`flex-shrink-0 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap md:px-3 md:py-2 md:text-xs ${
                    i === activeIndex ? "bg-white text-bg" : "bg-transparent text-text-muted hover:bg-surface/80 hover:text-white"
                  }`}
                >
                  {p.client}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => goToIndex(activeIndex + 1)}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-surface bg-surface text-white transition-colors hover:border-cyan/50 hover:bg-surface/80 md:h-8 md:w-8"
              aria-label="Next"
            >
              <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={carouselViewportRef}
          className="relative mt-12 w-full min-w-0 overflow-hidden md:mt-16"
          style={{
            perspective: "1600px",
            perspectiveOrigin: "50% 50%",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            ref={stripRef}
            className="flex w-max min-w-0 flex-row flex-nowrap items-stretch cursor-grab select-none active:cursor-grabbing"
            style={{
              paddingLeft: `${cardPaddingLeft}px`,
              paddingRight: `${cardPaddingLeft}px`,
              gap: GAP,
              willChange: "transform",
              transformStyle: "preserve-3d",
              touchAction: "pan-y",
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            {DISPLAY_ITEMS.map((project, index) => (
              <WorkCard
                key={`work-${index}`}
                project={project}
                cardWidth={cardWidth}
                isActive={index === N + activeIndex}
                cardRef={(el) => {
                  cardRefsRef.current[index] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkCardLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const n = images.length;
  const safe = Math.max(0, Math.min(n - 1, index));
  const src = images[safe];

  return (
    <div
      className="absolute inset-0 z-[90] flex flex-col rounded-2xl bg-[#070708]/98 ring-1 ring-white/10"
      role="dialog"
      aria-modal="true"
      aria-label="Image expanded in card"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-2 top-2 z-[95] flex min-h-9 min-w-9 items-center justify-center rounded-full bg-white/15 text-white shadow-lg transition hover:bg-white/25 md:right-3 md:top-3 md:min-h-10 md:min-w-10"
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      {n > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((safe - 1 + n) % n);
            }}
            className="absolute left-1 top-1/2 z-[95] flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm transition hover:bg-white/22 md:left-2 md:min-h-10 md:min-w-10"
            aria-label="Previous image"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIndexChange((safe + 1) % n);
            }}
            className="absolute right-1 top-1/2 z-[95] flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm transition hover:bg-white/22 md:right-2 md:min-h-10 md:min-w-10"
            aria-label="Next image"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-2 pb-10 pt-11 md:px-3 md:pb-12 md:pt-12">
        <Image
          src={src}
          alt=""
          width={800}
          height={520}
          className="max-h-[min(72vh,520px)] w-full max-w-full object-contain"
          sizes="(max-width: 900px) 100vw, 800px"
          quality={85}
          draggable={false}
        />
      </div>
      {n > 1 && (
        <div className="absolute bottom-2 left-0 right-0 z-[95] flex justify-center gap-1.5 px-2 md:bottom-3">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onIndexChange(i)}
              className={`min-h-1.5 rounded-full transition-all ${
                i === safe ? "min-w-6 bg-white" : "min-w-1.5 bg-white/45 hover:bg-white/70"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WorkCard({
  project,
  cardWidth,
  isActive,
  cardRef,
}: {
  project: (typeof WORK_PROJECTS)[number];
  cardWidth: number;
  isActive: boolean;
  cardRef: (el: HTMLDivElement | null) => void;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const imageSrcs = "images" in project && Array.isArray(project.images)
    ? getProjectImageSrcs(project.images)
    : [];
  const carouselHeight = Math.max(80, Math.min(220, Math.round(cardWidth * 0.5)));
  const isNarrowCard = cardWidth < 140;
  const contentPadding = isNarrowCard ? "p-2" : cardWidth < 200 ? "p-3" : "p-4 md:p-6";

  return (
    <div
      ref={cardRef}
      className="work-card relative flex-shrink-0 overflow-hidden rounded-2xl border border-surface bg-surface"
      style={{
        width: cardWidth,
        minWidth: cardWidth,
        transformStyle: "preserve-3d",
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
    >
      {imageSrcs.length > 0 && (
        <CardImageCarousel
          images={imageSrcs}
          width={cardWidth}
          height={carouselHeight}
          autoScroll={isActive && lightboxIndex === null}
          className="shrink-0"
          expandedIndex={lightboxIndex}
          onExpand={setLightboxIndex}
        />
      )}
      <div
        className={`flex min-h-0 flex-1 flex-col bg-gradient-to-br ${project.gradient} ${contentPadding} ${imageSrcs.length > 0 ? "" : "min-h-[200px] md:min-h-[320px]"}`}
      >
        <h3
          className="font-heading truncate text-sm font-bold text-white sm:text-base md:text-2xl"
          style={{ fontFamily: "var(--font-heading)" }}
          title={project.client}
        >
          {project.client}
        </h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-[10px] leading-snug text-white/90 sm:mt-2 sm:text-xs md:mt-3 md:line-clamp-3 md:text-sm">
          {project.description}
        </p>
        <ul className="mt-2 space-y-0.5 md:mt-4 md:space-y-1.5">
          {project.metrics.map((m, i) => (
            <li key={i} className="truncate text-[10px] font-medium text-white/95 sm:text-xs md:text-sm">
              {m}
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="mt-2 flex h-8 w-full items-center justify-center rounded-xl bg-bg/40 font-medium text-white/90 transition-colors hover:bg-bg/60 md:mt-6 md:h-12"
        >
          <span className="text-[10px] uppercase tracking-wider sm:text-xs md:text-sm">Campaign</span>
        </button>
      </div>
      {lightboxIndex !== null && imageSrcs.length > 0 && (
        <WorkCardLightbox
          images={imageSrcs}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
