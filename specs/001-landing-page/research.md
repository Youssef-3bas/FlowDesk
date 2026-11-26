# Research & Technical Decisions: Practice Landing Page

**Feature**: `001-landing-page` | **Date**: 2026-11-26

All technical unknowns and deferred styling decisions (brand identity, palette, typography, placeholder destination) are resolved below.

## 1. Branding, Copy & Visual Tokens

- **Decision**: Market a fictional SaaS productivity web app named **Flowdesk** with tagline *"Plan, write, and ship — all in one calm workspace."* Use Tailwind CSS default color tokens: primary `indigo-600` (`hover:indigo-700`), headings `slate-900`, body text `slate-600`, light surfaces `white` and `slate-50`. Use the system UI font stack (Tailwind v4 default `--font-sans`) with zero external web fonts.
- **Rationale**: All chosen color pairings exceed the WCAG 2.1 AA 4.5:1 text contrast ratio on white/slate-50 backgrounds (`SC-008`). Relying on `--font-sans` costs 0 KB, eliminates font-download network requests, and prevents layout shift (`CLS = 0`) from font swapping (`SC-001`, `SC-003`).
- **Alternatives considered**: Self-hosted or Google Fonts (`Inter`) — rejected to keep initial load lean and avoid FOIT/FOUT CLS; custom hex palette — unnecessary when Tailwind's built-in slate/indigo scales satisfy contrast and readability.

## 2. Placeholder Call-to-Action Destination

- **Decision**: Route every primary CTA button (Hero primary CTA, Final CTA, and optional Navbar "Get started" button) to `https://example.com/signup` in the same tab. Route the Hero's secondary action (*"See how it works"*) to `#how-it-works`.
- **Rationale**: Satisfies `FR-021` (single placeholder sign-up URL, zero forms) and `US-4` scenario 2 (resolves to an IANA-reserved domain with no 404 or error page).
- **Alternatives considered**: `#` anchor (jumps to top of page and confuses visitors); browser-only form/modal (explicitly excluded by `FR-021`).

## 3. Build Tooling & Tailwind CSS Integration

- **Decision**: Use Vite with `@tailwindcss/vite` (`tailwindcss` v4) and zero PostCSS/Tailwind JS config files; configure theme tokens and custom variants directly in `src/css/style.css` via `@import "tailwindcss"`, `@custom-variant`, and `@theme`.
- **Rationale**: First-party Tailwind v4 Vite plugin compiles and purges CSS at build time with minimal configuration, zero PostCSS boilerplate, and fast HMR.
- **Alternatives considered**: Tailwind CDN script (prohibited by Constitution Principle I); Tailwind v3 with `postcss.config.js` + `tailwind.config.js` (unneeded legacy config files).

## 4. Smooth Scrolling & Sticky-Navbar Offset

- **Decision**: Implement smooth scrolling and sticky-header offset purely in CSS inside `src/css/style.css`: `html { scroll-padding-top: 4.5rem; }` (matching the sticky navbar height) and `@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }`.
- **Rationale**: Meets `FR-004` (smooth scroll respecting `prefers-reduced-motion`), `FR-016` (works with JS disabled), and the sticky-navbar heading-overlap edge case without shipping any JS scroll logic.
- **Alternatives considered**: JS `element.scrollIntoView({ behavior: 'smooth' })` — adds unnecessary JS, requires manual `matchMedia` reduced-motion checks, and fails when JS is disabled.

## 5. Progressive Enhancement (`no-js` Fallback)

- **Decision**: Set `<html lang="en" dir="ltr" class="no-js">`, run a one-line synchronous inline script in `<head>` to replace `no-js` with `js`, and define `@custom-variant js (&:where(.js, .js *));` in `src/css/style.css`. Without `.js`, the mobile menu panel renders visibly as a wrapped static link row and the toggle button is hidden. With `.js`, CSS hides `[data-menu]` below `md` (`768px`) unless `[data-open]` is present.
- **Rationale**: Guarantees `FR-016` (navigation remains usable if JS fails to load) while eliminating post-load flash or layout shift (`CLS < 0.1`) because `.js` is applied before first paint.
- **Alternatives considered**: Hiding the mobile menu in `main.js` on `DOMContentLoaded` — causes a visible flash of the open menu and layout shift before JS executes.

## 6. Mobile Menu Behavior (`src/js/modules/mobile-menu.js`)

- **Decision**: Use a native `<button type="button" data-menu-toggle>` (≥ 44×44 px) controlling `[data-menu]#mobile-menu` via `data-open` and `aria-expanded`. Close the menu when a link inside `[data-menu]` is clicked, when `Escape` is pressed (returning focus to the toggle button), or when `window.matchMedia('(min-width: 768px)')` transitions to matching (handling resize/orientation changes).
- **Rationale**: Covers `FR-003`, `FR-005`, `FR-014`, keyboard accessibility (`SC-007`), and resize/orientation edge cases with ~40 lines of vanilla ES2022.
- **Alternatives considered**: `<details>`/`<summary>` menu — harder to close cleanly on link click, Escape, and `min-width: 768px` transitions with proper `aria-expanded` state; external UI libraries — prohibited by Constitution Principle IV.

## 7. Hero Screenshot Optimization (`scripts/optimize-images.mjs`)

- **Decision**: Pre-generate `hero-app-{640,1024,1440}.{avif,webp}` and `og-image.jpg` (1200×630) from `src/assets/source/hero-app.png` (1600×1000) into `public/images/` using `sharp` (`npm run images`). Render in `index.html` with `<picture>` (`<source type="image/avif" srcset="...">`, `<source type="image/webp" srcset="...">`, fallback `<img>` with `sizes="(min-width: 1024px) 50vw, 100vw"`, explicit `width="1440" height="900"`, `loading="eager"`, `fetchpriority="high"`, `decoding="async"`, and descriptive `alt`). Target ≤ 120 KB for `hero-app-1440.avif`.
- **Rationale**: Satisfies `FR-019`, `FR-020`, `SC-001` (LCP < 2.0 s), `SC-003` (CLS < 0.1 via intrinsic aspect ratio), and `SC-009` (< 500 KB total first load). Pre-generating committed assets keeps `vite build` fast and deterministic.
- **Alternatives considered**: `vite-imagetools` (does not automatically transform static `<img>`/`<picture>` references inside root `index.html` without JS imports); unoptimized PNG (exceeds weight/LCP budgets); SVG-only illustration (user selected an optimized raster screenshot in Q3).

## 8. Inline Icons & Testimonial Avatars

- **Decision**: Embed minimal inline SVGs (Heroicons-style paths) directly in `index.html` with `aria-hidden="true"` and `focusable="false"` for decorative feature/UI icons, and place `aria-label` on parent `<a>`/`<button>` controls for standalone icon links (menu toggle, footer social links). Render testimonial avatars as CSS-styled initials circles rather than external photos.
- **Rationale**: Eliminates icon-font/network overhead and avatar image downloads while fulfilling `FR-007`, `FR-009`, `FR-015`, and `SC-009`.
- **Alternatives considered**: Icon library package (`lucide`) or SVG sprite sheet — adds extra tooling/requests for fewer than 12 icons; raster avatar photos — unnecessary weight when `FR-009` marks avatars optional.

## 9. Static Content Authoring & Dynamic Footer Year

- **Decision**: Author all Flowdesk copy directly in `index.html` with semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) and static fallback year `2026` wrapped in `<span data-current-year>2026</span>`. `src/js/modules/current-year.js` updates `textContent` to `new Date().getFullYear()` at runtime.
- **Rationale**: Zero runtime rendering cost, full readability when JS is disabled (`FR-016`), and up-to-date copyright notice (`FR-011`).
- **Alternatives considered**: Client-side JSON/template rendering — breaks no-JS readability and increases JS bundle size.

## 10. Light-Only Theme & SEO Metadata

- **Decision**: Include `<meta name="color-scheme" content="light">`, omit all `dark:` Tailwind utilities (`FR-022`), and include `<title>`, `<meta name="description">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`), `twitter:card="summary_large_image"`, and `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` (`FR-018`).
- **Rationale**: Prevents browser dark-mode auto-inversion, guarantees light-theme color contrast, and meets Constitution Technical Constraints for SEO.
- **Alternatives considered**: Supporting `prefers-color-scheme: dark` — explicitly out of scope per `FR-022` and Q4.

## 11. Code Quality Tooling

- **Decision**: Configure ESLint 9 flat config (`eslint.config.js` with `@eslint/js` recommended + `globals.browser`) and Prettier (`.prettierrc` with `prettier-plugin-tailwindcss` pointing to `tailwindStylesheet: "./src/css/style.css"`).
- **Rationale**: Directly enforces Constitution Principle III (consistent Tailwind class order, zero lint errors, ES module hygiene).
- **Alternatives considered**: Manual style discipline without automated checks — prone to drift and violates Principle III gates.
