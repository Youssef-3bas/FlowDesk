<!--
Sync Impact Report
- Version change: (template, unversioned) → 1.0.0
- Modified principles: all template placeholders replaced
  - [PRINCIPLE_1_NAME] → I. Performance First (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Mobile-First Responsive Design
  - [PRINCIPLE_3_NAME] → III. Clean, Readable & Organized Code
  - [PRINCIPLE_4_NAME] → IV. Minimal Stack: HTML + Tailwind CSS + Vanilla JS
  - [PRINCIPLE_5_NAME] → V. Static, Accessible, English (LTR) Experience
- Added sections: Technology & Performance Constraints; Development Workflow & Quality Gates
- Removed sections: none
- Templates: not modified (dependent templates read the constitution at runtime)
- Follow-up TODOs: none
-->

# Practice Landing Page Constitution

## Core Principles

### I. Performance First (NON-NEGOTIABLE)

Speed is the primary quality attribute of this project.

- Production builds MUST target a Lighthouse Performance score of ≥ 95 on mobile.
- Core Web Vitals targets: LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
- Total initial JavaScript MUST stay ≤ 50 KB gzipped; initial CSS ≤ 30 KB gzipped.
- Tailwind MUST be compiled at build time with unused classes purged; the Tailwind CDN script
  MUST NOT be used.
- Images MUST use modern formats (WebP/AVIF) with explicit `width`/`height`, and below-the-fold
  images MUST use `loading="lazy"`.
- Non-critical JavaScript MUST be deferred (`type="module"` or `defer`); render-blocking
  resources MUST be minimized.
- Web fonts, if used, MUST be self-hosted or preloaded with `font-display: swap`, limited to
  at most two families.

Rationale: a landing page's value depends on how fast it renders; every added byte must earn
its place.

### II. Mobile-First Responsive Design

- Styles MUST be authored mobile-first: base Tailwind utilities target small screens, and
  `sm:`/`md:`/`lg:`/`xl:` prefixes progressively enhance larger viewports.
- Layouts MUST be usable without horizontal scrolling from 320 px width upward.
- Tap targets MUST be at least 44×44 px; body text MUST be at least 16 px on mobile.
- Layouts MUST use modern CSS (Flexbox/Grid via Tailwind utilities); fixed pixel layouts are
  prohibited.
- Every feature MUST be visually checked at mobile, tablet, and desktop widths before merge.

Rationale: most landing page traffic is mobile; designing up from small screens yields
simpler, faster CSS.

### III. Clean, Readable & Organized Code

- Code MUST be self-explanatory: descriptive names, small single-purpose functions, no dead
  or commented-out code.
- Project structure MUST stay predictable: `index.html` at the root, source in `src/`
  (e.g., `src/js/`, `src/css/`), static assets in `public/` or `src/assets/`.
- JavaScript MUST use ES modules, one concern per module, with `const`/`let` (never `var`).
- HTML MUST be semantic (`header`, `nav`, `main`, `section`, `footer`, proper heading order).
- Repeated Tailwind class groups SHOULD be extracted (via `@apply` in components layer or
  shared partials) only when reused three or more times.
- Formatting MUST be consistent and enforced by Prettier (with the Tailwind class-sorting
  plugin); ESLint MUST pass with zero errors.

Rationale: this is a practice project; readable, organized code is itself a learning goal.

### IV. Minimal Stack: HTML + Tailwind CSS + Vanilla JS

- The stack is fixed: HTML, Tailwind CSS, vanilla JavaScript, built with Vite, managed with
  npm.
- UI frameworks and libraries (React, Vue, jQuery, etc.) MUST NOT be added.
- Any new runtime dependency MUST be justified in writing (purpose, size impact, why vanilla
  JS is insufficient) and approved before adoption; dev-only tooling is exempt from size review.
- Prefer native browser APIs (IntersectionObserver, `<dialog>`, CSS transitions) over
  JavaScript libraries.

Rationale: fewer dependencies means smaller bundles, fewer breakages, and clearer code.

### V. Static, Accessible, English (LTR) Experience

- The site MUST be fully static: no backend, server-side code, or database. Any form MUST
  either be client-side only or post to a third-party static-form service.
- `<html lang="en" dir="ltr">` MUST be set; all interface copy MUST be in English.
- Accessibility MUST meet WCAG 2.1 AA: sufficient color contrast, alt text on meaningful
  images, keyboard navigability, visible focus states, and respect for
  `prefers-reduced-motion`.
- Core content MUST be readable even if JavaScript fails to load (progressive enhancement).

Rationale: a static, accessible page is fast, cheap to host, and usable by everyone.

## Technology & Performance Constraints

- Tooling: Node.js LTS, npm (committed `package-lock.json`), Vite as dev server and bundler,
  Tailwind CSS integrated through Vite's build pipeline (PostCSS or the official Vite plugin).
- Scripts: `npm run dev`, `npm run build`, and `npm run preview` MUST exist and work.
- Output: `vite build` MUST produce a static `dist/` deployable to any static host.
- Browser support: latest two versions of evergreen browsers (Chrome, Edge, Firefox, Safari,
  including iOS Safari).
- SEO basics MUST be present: `<title>`, meta description, viewport meta, Open Graph tags,
  and a favicon.
- No secrets, API keys, or tracking scripts that materially harm performance may be committed.

## Development Workflow & Quality Gates

Before any change is considered done:

1. `npm run build` succeeds with no errors or warnings that indicate problems.
2. ESLint and Prettier checks pass.
3. Lighthouse (mobile) on the production preview meets Principle I targets, and
   Accessibility scores ≥ 95.
4. The page is manually checked at ~375 px, ~768 px, and ≥ 1280 px widths.
5. Bundle sizes are checked against the budgets in Principle I.

Work SHOULD proceed in small, focused commits with descriptive messages (Conventional
Commits style recommended).

## Governance

- This constitution supersedes other project practices; specs, plans, and tasks MUST comply
  with it.
- Amendments require a documented change (what and why), an updated version number, and
  review of dependent Spec Kit artifacts for consistency.
- Versioning follows semantic versioning: MAJOR for removing or redefining principles, MINOR
  for new principles or materially expanded guidance, PATCH for clarifications and wording.
- Every plan and review MUST include a constitution compliance check; any deviation MUST be
  explicitly justified and recorded.

**Version**: 1.0.0 | **Ratified**: 2026-11-26 | **Last Amended**: 2026-11-26
