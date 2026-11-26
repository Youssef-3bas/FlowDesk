# Implementation Plan: Practice Landing Page

**Branch**: `001-landing-page` | **Date**: 2026-11-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-landing-page/spec.md`

## Summary

Build **Flowdesk**, a static, mobile-first, English (LTR) single-page SaaS productivity landing
page with zero backend and zero runtime dependencies. The page is authored in semantic HTML5,
styled with Tailwind CSS v4 (compiled via `@tailwindcss/vite` using the system font stack and a
light-only palette), and enhanced with minimal ES2022 vanilla JavaScript for the mobile menu
toggle and dynamic footer year. Smooth scrolling, sticky-header scroll padding, reduced-motion
support, and progressive `no-js` visibility are handled in pure CSS; the hero screenshot is
pre-optimized into responsive AVIF and WebP variants via `sharp`.

## Technical Context

**Language/Version**: HTML5, CSS via Tailwind CSS v4, JavaScript ES2022 modules; Node.js LTS (≥ 20; dev machine has v24.20.0) and npm (11.19.0) for build tooling only.

**Primary Dependencies**: `vite`, `tailwindcss`, `@tailwindcss/vite`, `eslint`, `@eslint/js`, `globals`, `prettier`, `prettier-plugin-tailwindcss`, `sharp` (all `devDependencies`; zero runtime dependencies; no `postcss.config.js` or `tailwind.config.js` — Tailwind v4 is configured in CSS via `@import "tailwindcss"` and `@theme`).

**Storage**: N/A (fully static site; no backend, database, or visitor data persistence).

**Testing**: No unit-test framework; verification relies on the constitution's quality gates: `npm run lint` (ESLint), `npm run format:check` (Prettier), `npm run build`, Lighthouse mobile audit against `npm run preview`, and manual browser checks at 320 / 375 / 768 / 1280 / 1920 px, with JavaScript disabled, keyboard-only navigation, and 200% zoom.

**Target Platform**: Latest two versions of evergreen desktop and mobile browsers (Chrome, Edge, Firefox, Safari including iOS Safari); Vite build target `es2022`.

**Project Type**: Single-page static website (frontend only).

**Performance Goals**: FCP < 1.2 s, LCP < 2.0 s, CLS < 0.1, INP < 200 ms, Lighthouse Performance ≥ 95 and Accessibility ≥ 95 on mobile.

**Constraints**: Initial JS ≤ 50 KB gzipped (expected ~1–2 KB); initial CSS ≤ 30 KB gzipped (expected ~6–10 KB); total first-load page weight < 500 KB; no backend; light theme only (`<meta name="color-scheme" content="light">`); `lang="en" dir="ltr"`; zero runtime dependencies.

**Scale/Scope**: 1 HTML page (`index.html`), 7 page regions (header/nav, hero, features, how-it-works, testimonials, final CTA, footer), 3 small ES modules (`main.js`, `mobile-menu.js`, `current-year.js`), 1 image optimization script.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Rule / Principle | Initial | Post-Design | Notes |
|------------------|---------|-------------|-------|
| I. Performance First | ✅ PASS | ✅ PASS | JS ≤ 50 KB gz, CSS ≤ 30 KB gz, compiled Tailwind v4, AVIF/WebP hero `<picture>`, lazy below-the-fold, `<script type="module">`, zero web fonts (system stack). |
| II. Mobile-First Responsive Design | ✅ PASS | ✅ PASS | Base Tailwind utilities target 320 px+ mobile first, `sm:`/`md:`/`lg:` scale up, ≥ 44×44 px tap targets, ≥ 16 px body text, Flexbox/Grid only. |
| III. Clean, Readable & Organized Code | ✅ PASS | ✅ PASS | Root `index.html`, `src/css/` + `src/js/modules/`, ES modules (`const`/`let`), semantic landmarks, ESLint flat config + Prettier Tailwind sorting. |
| IV. Minimal Stack: HTML + Tailwind + Vanilla JS | ✅ PASS | ✅ PASS | Zero runtime dependencies; only Vite, Tailwind v4, ESLint, Prettier, and `sharp` as `devDependencies`; native CSS and DOM APIs used throughout. |
| V. Static, Accessible, English (LTR) | ✅ PASS | ✅ PASS | Static `dist/` only, `<html lang="en" dir="ltr">`, WCAG 2.1 AA contrast (≥ 4.5:1), keyboard focus/ARIA, `prefers-reduced-motion`, `no-js` CSS fallback. |
| Tech & Performance Constraints | ✅ PASS | ✅ PASS | `dev`/`build`/`preview` scripts, `dist/` static output, evergreen browser support, SEO/OG tags + SVG favicon, no secrets or tracking. |
| Development Workflow & Quality Gates | ✅ PASS | ✅ PASS | Build, `lint`, `format:check`, mobile Lighthouse (Perf/A11y ≥ 95), 375/768/1280+ viewport checks, and gzip bundle-size checks defined in `quickstart.md`. |

**Gate Result**: ✅ **PASS** (initial and post-design).

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-page/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── ui-contract.md   # DOM anchors, hook attributes, ARIA & breakpoint contract
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
index.html                  # Single page; all semantic content authored directly here
package.json                # Scripts: dev, build, preview, lint, format, format:check, images
package-lock.json
vite.config.js              # @tailwindcss/vite plugin, build.target 'es2022'
eslint.config.js            # Flat config: @eslint/js recommended + globals + non-app ignores
.prettierrc                 # plugins: prettier-plugin-tailwindcss; tailwindStylesheet: ./src/css/style.css
.prettierignore             # Ignores dist, node_modules, .agents, .specify, specs, Plan.md
.gitignore                  # node_modules, dist
README.md
public/
├── favicon.svg
└── images/                 # Pre-generated: hero-app-{640,1024,1440}.{avif,webp}, og-image.jpg
scripts/
└── optimize-images.mjs     # sharp: src/assets/source/hero-app.png -> public/images/*
src/
├── assets/
│   └── source/
│       └── hero-app.png    # Source screenshot (not shipped), 1600x1000
├── css/
│   └── style.css           # @import "tailwindcss"; @custom-variant js; @theme; @layer base
└── js/
    ├── main.js             # Entry: imports + init calls only
    └── modules/
        ├── mobile-menu.js  # Toggle panel, link/Escape/min-width(768px) close & focus return
        └── current-year.js # Updates [data-current-year] textContent at runtime
```

**Structure Decision**: Repository-root single-project Vite layout (superseding the `landing-page/` subfolder in the earlier root `Plan.md` draft). Placing `index.html`, `package.json`, and `src/` at the repository root satisfies Constitution Principle III (`index.html` at the root) and keeps project tooling alongside `.specify/`. During `/speckit-implement`, files are created directly because `npm create vite` refuses or prompts in a non-empty directory.

## Complexity Tracking

No violations — section intentionally empty.
