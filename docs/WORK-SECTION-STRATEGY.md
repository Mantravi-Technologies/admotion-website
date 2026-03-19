# Work Section – Strategy & Architecture

## 1. Target (from reference images)

| Requirement | Description |
|-------------|-------------|
| **Three cards always visible** | At any viewport size, exactly three cards in view: one full center card, two partial side cards (left and right). |
| **Center card** | Straight (no rotation), largest, in front. |
| **Side cards** | Tilted (left card rotated one way, right the other), slightly smaller, appear behind center. |
| **Smooth scrolling** | No jank or conflict: drag/swipe feels continuous and consistent. |
| **Same style on mobile and desktop** | Same layout rules and tilt behavior; only sizing and touch vs mouse differ. |

---

## 2. Why current implementation falls short

- **Three cards:** Card width or padding is derived in a way that doesn’t guarantee three cards in the visible window (e.g. two full + one sliver). Need explicit “three cards in view” rule.
- **Tilt not visible:** Either no `perspective` on a common ancestor, or `rotateY` is too small / overridden. Need one perspective container and clear 3D transform hierarchy.
- **Scrolling feels conflicting:** Mix of native scroll + GSAP, or updating React state on every scroll/drag, causes re-renders and competing updates. Need a single source of truth for “scroll position” and one update path (GSAP-driven).

---

## 3. Architecture options

### Option A: Native scroll + CSS 3D

- **Idea:** Strip uses `overflow-x: auto`, scroll-snap. Card tilt/scale from scroll position via CSS or a single scroll listener that only updates a “scroll position” ref and then applies transforms in rAF.
- **Pros:** Simple, accessible, native touch scroll.
- **Cons:** Scroll position is in px; mapping to “which card is center” and smooth tilt interpolation is fiddly. Risk of jank if we also run heavy GSAP on scroll.

### Option B: GSAP-only “virtual” scroll (translateX)

- **Idea:** No overflow scroll. Strip is a single row; its `translateX` is the only scroll state. Dragging updates `translateX` in rAF; on release, snap to nearest card index with `gsap.to()`. Card tilt/scale computed from `(cardIndex - virtualIndex)`.
- **Pros:** One source of truth (index + drag offset), smooth animations, full control over tilt and snap.
- **Cons:** Must implement drag/swipe and keyboard/accessibility ourselves; no native scroll for assistive tech unless we add ARIA and focus handling.

### Option C: Hybrid – native scroll for accessibility, GSAP for visuals

- **Idea:** Strip is scrollable; we read `scrollLeft` and derive a “virtual index” (float). We drive card 3D transforms from this virtual index only (no React state for it). Snap is done with `scrollTo({ behavior: 'smooth' })` or GSAP animating `scrollLeft`.
- **Pros:** Real scroll for a11y and touch.
- **Cons:** Two sources of truth (DOM scrollLeft vs our logic); can still feel conflicting if not carefully throttled and derived in one place.

**Recommendation:** **Option B (GSAP-only)** for maximum control over “three cards + tilt + smooth,” with explicit a11y: focus management, arrow keys, and ARIA live region for “card N of M.”

---

## 4. Chosen architecture (Option B, refined)

### 4.1 Layout model

- **Viewport:** One “window” (e.g. section width minus padding). Always shows exactly the width of **three card slots** (left partial, center full, right partial).
- **Card width:**  
  `cardWidth = (viewportWidth - 2 * gap) / 3`  
  So three cards fit exactly in the visible width. No “two and a bit” – three slots, with center one fully visible and left/right partially visible.
- **Strip:**  
  - Horizontal flex row: `[paddingLeft] [card] [gap] [card] [gap] ... [card] [paddingRight]`.  
  - `paddingLeft = paddingRight = viewportWidth/2 - cardWidth/2` so that when `translateX = 0`, the first card is centered.
- **No overflow scroll:** Strip lives in a container with `overflow: hidden`. Only transform we change is `translateX` on the strip.

### 4.2 State and “scroll” position

- **Single source of truth:**  
  - `activeIndex` (integer): which card is “current.”  
  - While dragging: `dragOffsetPx` (ref, not state) = pointer movement in px.
- **Effective scroll position:**  
  `stripTranslateX = -activeIndex * (cardWidth + gap) + dragOffsetPx`  
  Only this value drives:
  - GSAP `x` on the strip.
  - Card 3D transforms (see below).

No `scrollLeft`, no native scroll.

### 4.3 Card 3D (tilt and scale)

- **One perspective parent:**  
  Wrapper around the strip: `perspective: 1400px`, `perspective-origin: 50% 50%`, `overflow: hidden`.
- **Per-card:**  
  For each card index `i`, compute “offset from center”:  
  `virtualIndex = -stripTranslateX / (cardWidth + gap)`  
  `offset = i - virtualIndex`
  - **Center card (offset ≈ 0):**  
    `scale = 1`, `rotateY = 0`, `translateX = 0`.
  - **Side cards (|offset| ≈ 1):**  
    `scale = 0.88–0.9`, `rotateY = ±20°` to ±25° (left positive, right negative), small `translateX` for spacing.
- **Updates:**  
  - During drag: in the same rAF where we set the strip’s `x`, we compute `stripTranslateX` and update each card’s transform (via refs or a single “apply transforms” function). No React state for drag.
  - On snap: GSAP animates strip `x`; `onUpdate` calls the same “apply transforms” so tilt/scale animate smoothly.

This gives “center straight, two sides tilted” and keeps the same style on mobile and desktop.

### 4.4 Smooth scrolling behavior

- **Pills / arrows:**  
  Set `activeIndex` and run `gsap.to(strip, { x: -activeIndex * step, duration: 0.6, ease: 'power2.out' })`. In `onUpdate`, recompute and apply card transforms. No native scroll involved.
- **Drag:**  
  - `pointerdown`: store `startX`, `startStripX = -activeIndex * step`.  
  - `pointermove`: `dragOffsetPx = startX - clientX`, `stripX = startStripX + dragOffsetPx`, clamp to min/max. In rAF: `gsap.set(strip, { x: stripX })` and apply card transforms. No state updates during drag.
  - `pointerup`: compute `nearestIndex = round(-stripX / step)`, then call the same “go to index” logic (set `activeIndex`, animate strip to that index). One place for “scroll” behavior.
- **Touch:**  
  Same pointer events; no separate touch handlers. Same logic = same style on mobile and desktop.

### 4.5 Sizing and responsiveness

- **Container width:**  
  Measured once and on resize (ResizeObserver).  
  `viewportWidth = containerWidth` (or `containerWidth - section padding` if we want padding outside the “window”).
- **Formulas:**  
  - `cardWidth = (viewportWidth - 2 * GAP) / 3`  
  - `step = cardWidth + GAP`  
  - `paddingLeft = viewportWidth/2 - cardWidth/2`
- **Min/max:**  
  Optional: clamp `cardWidth` to e.g. `min(420, max(280, computed))` so cards don’t get too big on large screens or too small on small ones. Same formula keeps three cards in view.

---

## 5. Pros and cons of this approach

| Pros | Cons |
|------|------|
| Exactly three cards in view by construction | No native scroll (must handle a11y ourselves) |
| One source of truth (index + drag offset) | Slightly more code than “just overflow-x” |
| Smooth: only GSAP + rAF, no scroll event jank | Resize needs recompute of cardWidth/step |
| Tilt is reliable: one perspective root, explicit rotateY/scale | |
| Same layout and tilt on mobile and desktop | |
| No conflicting scroll + React state during drag | |

---

## 6. Implementation checklist

1. **Layout**
   - [ ] One wrapper with `perspective`, `overflow: hidden`.
   - [ ] Strip with `translateX` only; padding left/right for center alignment.
   - [ ] `cardWidth` and `step` from `viewportWidth` so three cards fit.

2. **State and refs**
   - [ ] `activeIndex` (state).
   - [ ] `containerWidth` (state, from ResizeObserver).
   - [ ] Refs: strip, card elements (for transform updates), `dragStartX`, `dragStartStripX`, `dragOffsetPx` (or derive from strip x).

3. **Transforms**
   - [ ] Single function `applyCardTransforms(stripTranslateX)` that:
     - Computes `virtualIndex`, then per-card `offset`.
     - Sets each card’s `scale`, `rotateY`, `x` (no React state).

4. **Navigation**
   - [ ] `goToIndex(index)`: set `activeIndex`, `gsap.to(strip, { x: -index * step })`, `onUpdate` → `applyCardTransforms`.

5. **Drag**
   - [ ] pointerdown: capture, store start x and start strip x.
   - [ ] pointermove: compute strip x, clamp, in rAF set strip x and call `applyCardTransforms`.
   - [ ] pointerup: snap to nearest index, call `goToIndex(nearestIndex)`.

6. **Pills and arrows**
   - [ ] Call `goToIndex(i)` or `goToIndex(activeIndex ± 1)`.

7. **Optional a11y**
   - [ ] Arrow keys: next/prev card.
   - [ ] ARIA labels and live region for “Card N of M”.

---

## 7. Files to touch

- `src/components/sections/Portfolio.tsx`: rewrite to follow this architecture (single source of truth, GSAP-only scroll, explicit three-card layout and 3D).
- Optional: `src/content/work.ts` unchanged unless we add more projects.

Once this strategy is agreed, implementation will follow this document so the result matches the reference: three cards visible, center straight, sides tilted, smooth and consistent on mobile and desktop.

---

## 8. Implementation summary (done)

- **Layout:** `cardWidth = (viewportWidth - 2*GAP) / 3` so exactly three card slots fit. Strip padding centers the first card; strip only uses `translateX` (no native scroll).
- **State:** `activeIndex` + refs for drag (`dragStartX`, `dragStartStripX`, `dragCurrentX`). No state updates during drag.
- **3D:** One wrapper with `perspective: 1600px`, `transformStyle: preserve-3d` on wrapper and strip. Cards get `scale`, `rotateY` (±24°), `x` from `applyCardTransforms(stripX)`.
- **Smooth:** Drag updates strip `x` and card transforms in a single rAF. Snap uses `gsap.to(strip, { x })` with `onUpdate` → `applyCardTransforms`. Pills/arrows call `goToIndex`.
- **Same on mobile/desktop:** Same formulas and pointer events; ResizeObserver keeps `containerWidth` in sync.
- **Infinite loop (Appinventiv-style):** Strip is duplicated (`DISPLAY_ITEMS = [...WORK_PROJECTS, ...WORK_PROJECTS]`). Drag range is `[-(TOTAL-1)*step, 0]`. “Next” from last card animates to duplicate then resets to 0; “Prev” from first goes to last. Snap after drag normalizes to `stripIndex % N` so pills and position stay in sync.
