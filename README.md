# AdMotion Website

Modern, animated marketing site for **AdMotion** — Advertising, Marketing & Branding agency (Lucknow, Gomti Nagar).

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** — design tokens, responsive layout
- **GSAP + ScrollTrigger** — scroll-triggered reveals, parallax, pinned horizontal section
- **Lenis** — smooth scrolling (synced with GSAP)
- **Framer Motion** — magnetic button, Bento hover, menu transitions

## Design system

- **Background:** `#0F0F13` (Deep Space Black)
- **Surface/Cards:** `#1A1A20` (Dark Anthracite)
- **Accents:** Magenta `#E01A4F`, Cyan `#00B4D8`, Yellow `#FFD166`
- **Typography:** Space Grotesk (headings), Plus Jakarta Sans (body)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**If the site looks unstyled (white background, Times font, huge black “person” icon):** your CSS bundle didn’t load—usually after a failed or cached dev build. Stop the server, run **`npm run dev:clean`**, hard-refresh the browser (Ctrl+Shift+R).

**If you see ChunkLoadError / 500 on CSS or JS in dev:** same fix—`npm run dev:clean`. Default `npm run dev` uses **Webpack**; use `npm run dev:turbo` only if you want Turbopack.

**Typo:** the start command is `npm run dev`, not `npm starat`.

## Build

```bash
npm run build
npm start
```

## Structure

- `src/app/` — layout, globals, page
- `src/components/providers/` — Lenis smooth scroll
- `src/components/sections/` — Header, Hero, Services (Bento), Portfolio, WhyAdMotion, About, Footer
- `src/components/ui/` — CursorGlow, MagneticButton, BentoCard

Replace portfolio placeholders with real images and update contact details in `Footer.tsx` for production.
