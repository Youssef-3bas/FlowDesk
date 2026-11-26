# Quickstart & Validation Guide: Practice Landing Page

**Feature**: `001-landing-page` | **Date**: 2026-11-26

Use this guide after implementation to install dependencies, run the local dev/preview servers, and verify all functional requirements (`FR-*`), success criteria (`SC-*`), and constitution gates.

## Prerequisites

- **Node.js**: LTS (v20+; verified environment uses v24.20.0)
- **npm**: v10+ (verified environment uses 11.19.0)
- **Browser**: Modern Chromium-based browser (Chrome or Edge) for DevTools emulation, JS-disabled testing, and Lighthouse audits; optional Firefox/Safari cross-check.

## Setup & Run Commands

1. **Install dependencies**:
   - `npm install`
2. **Generate responsive hero and social-preview images** *(only needed when `src/assets/source/hero-app.png` changes)*:
   - `npm run images`
3. **Start development server** *(default `http://localhost:5173`)*:
   - `npm run dev`
4. **Run code quality checks**:
   - `npm run lint`
   - `npm run format:check`
5. **Create production build and inspect bundle sizes**:
   - `npm run build` (writes static output to `dist/` and prints raw/gzip JS & CSS sizes)
6. **Serve production build locally** *(default `http://localhost:4173`)*:
   - `npm run preview`

## End-to-End Validation Scenarios

Run these checks against `npm run preview` (`http://localhost:4173`) unless noted otherwise:

| # | Scenario | How to Verify | Expected Outcome | Maps To |
|---|----------|---------------|------------------|---------|
| 1 | Hero above the fold on mobile | Open DevTools Device Mode at `375 × 667`; load `http://localhost:4173` | Headline, value statement, and primary CTA button are fully visible without scrolling; hero screenshot renders cleanly below/beside without clipping. | `FR-006`, `SC-005` |
| 2 | Sticky navbar & mobile menu interactions | At `375 × 667`, scroll down, tap `[data-menu-toggle]`, tap a section link, reopen and press `Escape` | Header stays fixed at top; toggle opens/closes menu (`aria-expanded` updates); tapping a link smooth-scrolls to section (heading visible below header) and closes menu; `Escape` closes menu and returns focus to toggle. | `FR-002`, `FR-003`, `FR-004`, `FR-005`, `SC-006` |
| 3 | Reduced-motion preference | In Chrome DevTools Rendering panel, set *Emulate CSS media feature `prefers-reduced-motion: reduce`*; click a nav link | Page jumps immediately to the target section without animated smooth scrolling. | `FR-004`, `US-2` |
| 4 | JavaScript disabled fallback | In Chrome DevTools Command Menu, run *Disable JavaScript* and reload | All 7 regions and copy remain readable; mobile nav links display as a wrapped static row (no broken toggle); `#` anchor links jump to sections with headings clear of the sticky header; static copyright year displays. | `FR-016`, Edge Cases |
| 5 | Responsive widths & resize reset | Inspect at `320`, `375`, `768`, `1280`, and `1920 px`; open mobile menu at `375 px`, resize to `1024 px` and back to `375 px` | Zero horizontal scrollbar (`document.documentElement.scrollWidth <= window.innerWidth`); no overlapping elements; open mobile menu resets cleanly on crossing `768 px`. | `FR-012`, `SC-004`, Edge Cases |
| 6 | Keyboard-only navigation | Navigate entire page using only `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape` | 100% of interactive controls receive visible focus rings and activate cleanly; all tap/click targets measure ≥ 44 × 44 px. | `FR-014`, `SC-007` |
| 7 | 200% browser zoom | Set browser page zoom to `200%` at `1280 × 720` | Text reflows cleanly without clipping, overlapping text, or horizontal scrolling. | Edge Cases |
| 8 | Lighthouse mobile audit | Run Chrome DevTools Lighthouse (Mobile) or `npx lighthouse http://localhost:4173 --view` | Performance ≥ 95, Accessibility ≥ 95, FCP < 1.2 s, LCP < 2.0 s, CLS < 0.1, zero contrast failures (< 4.5:1). | `SC-001`, `SC-002`, `SC-003`, `SC-008` |
| 9 | Build & bundle budgets | Inspect `npm run build` output | Zero build errors/warnings; initial JS ≤ 50 KB gzipped; initial CSS ≤ 30 KB gzipped. | Constitution Principle I |
| 10 | Total first-load transfer weight | Open DevTools Network tab with *Disable cache* enabled; reload `http://localhost:4173` | Total transferred bytes across HTML, CSS, JS, and hero AVIF/WebP ≤ 500 KB; below-the-fold images (if any) defer loading. | `FR-019`, `FR-020`, `SC-009` |
| 11 | CTA destination & no-form check | Click primary CTAs in Hero and Final CTA; inspect DOM for `<form>` | All primary CTAs navigate to `https://example.com/signup` with no error page; zero `<form>` or `<input>` elements exist. | `FR-021`, `US-4` |
| 12 | Footer year, social links & theme | Scroll to `<footer>`; inspect copyright, social `<a>` attributes, and toggle OS dark mode | Copyright displays current year; social links have `target="_blank"` and `rel="noopener noreferrer"`; page stays in light theme even when OS prefers dark mode. | `FR-011`, `FR-022` |
| 13 | Lint & formatting gates | Run `npm run lint` and `npm run format:check` | Both commands exit with code `0` and zero errors. | Constitution Principle III |

See [ui-contract.md](./contracts/ui-contract.md) for selector/ARIA details and [data-model.md](./data-model.md) for entity constraints.
