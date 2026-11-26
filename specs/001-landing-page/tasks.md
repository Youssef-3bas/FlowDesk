---
description: "Task list for Practice Landing Page implementation"
---

# Tasks: Practice Landing Page

**Input**: Design documents from `/specs/001-landing-page/`

**Prerequisites**: [plan.md](./plan.md) (required), [spec.md](./spec.md) (required for user stories), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/ui-contract.md](./contracts/ui-contract.md), [quickstart.md](./quickstart.md)

**Tests**: Automated unit/integration test tasks are omitted because the specification and implementation plan rely on ESLint, Prettier, Vite build budgets, Lighthouse audits, and manual browser verification in [quickstart.md](./quickstart.md).

**Organization**: Tasks are grouped by user story (`US1`–`US4`) to enable independent implementation and testing of each increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks in the same phase)
- **[Story]**: Which user story this task belongs to (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Exact repository-relative file paths are included in every task description

## Path Conventions

- **Single project (repository root)**: `index.html`, `public/`, `scripts/`, `src/css/`, `src/js/` at repository root per `plan.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize repository-root Vite + Tailwind CSS v4 project, npm scripts, and code-quality tooling

- [X] T001 Create project directory structure (`public/images/`, `scripts/`, `src/assets/source/`, `src/css/`, `src/js/modules/`) and ignore rules (`node_modules`, `dist`) in `.gitignore`
- [X] T002 Create project manifest (`type: "module"`, `dev`/`build`/`preview`/`lint`/`format`/`format:check`/`images` scripts, and `devDependencies`: `vite`, `tailwindcss`, `@tailwindcss/vite`, `eslint`, `@eslint/js`, `globals`, `prettier`, `prettier-plugin-tailwindcss`, `sharp`) in `package.json` and run `npm install` to generate `package-lock.json`
- [X] T003 [P] Configure Vite bundler with `@tailwindcss/vite` plugin and `build.target: "es2022"` in `vite.config.js`
- [X] T004 [P] Configure ESLint 9 flat config (`@eslint/js` recommended rules, browser/Node globals for `src/` and `scripts/`, and `ignores` for `dist/`, `node_modules/`, `.agents/`, `.specify/`, `specs/`) in `eslint.config.js`
- [X] T005 [P] Configure Prettier (`prettier-plugin-tailwindcss` and `tailwindStylesheet: "./src/css/style.css"`) in `.prettierrc` and ignore non-app paths (`dist/`, `node_modules/`, `.agents/`, `.specify/`, `specs/`, `Plan.md`) in `.prettierignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core stylesheet, brand asset, HTML document shell, and JS entry module required before any user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 [P] Author Tailwind CSS v4 entry stylesheet (`@import "tailwindcss"`, `@custom-variant js (&:where(.js, .js *))`, light-only `@theme` tokens, `scroll-padding-top: 4.5rem`, `prefers-reduced-motion: no-preference` smooth scrolling, and `:focus-visible` base rules per `research.md` Sections 1, 3–5) in `src/css/style.css`
- [X] T007 [P] Create Flowdesk SVG brand favicon in `public/favicon.svg`
- [X] T008 [P] Create base HTML5 document shell (`lang="en"`, `dir="ltr"`, `class="no-js"`, synchronous `no-js`→`js` head script, `<meta name="color-scheme" content="light">`, SEO/Open Graph/Twitter tags, `/favicon.svg` link, ordered landmark/section shells per `data-model.md` (`Section.id`, `Section.heading`, `Section.order`) and `contracts/ui-contract.md` Sections 1–2, and `<script type="module" src="/src/js/main.js">`) in `index.html`
- [X] T009 [P] Create JavaScript entry module importing `/src/css/style.css` in `src/js/main.js`

**Checkpoint**: Foundation ready (`npm run build` succeeds on the base shell) — user story implementation can now begin

---

## Phase 3: User Story 1 - Understand the offer at first glance (Priority: P1) 🎯 MVP

**Goal**: Visitor opens Flowdesk on any device and immediately sees the headline, supporting value statement, primary/secondary CTAs, and an optimized responsive app screenshot without slow loading or layout shift.

**Independent Test**: Run `npm run build && npm run preview`, open `http://localhost:4173` at `375 × 667` and `1280 × 800`, and verify the headline, value statement, and primary CTA appear above the fold, the responsive AVIF/WebP screenshot renders without layout shift, and the primary CTA navigates to `https://example.com/signup`.

### Implementation for User Story 1

- [X] T010 [P] [US1] Create `sharp` asset pipeline generating a clean `1600×1000` Flowdesk workspace UI screenshot at `src/assets/source/hero-app.png` and exporting responsive `hero-app-{640,1024,1440}.{avif,webp}` plus `1200×630` `og-image.jpg` into `public/images/` in `scripts/optimize-images.mjs`
- [X] T011 [US1] Execute `npm run images` to produce `public/images/hero-app-640.avif`, `public/images/hero-app-1024.avif`, `public/images/hero-app-1440.avif`, `public/images/hero-app-640.webp`, `public/images/hero-app-1024.webp`, `public/images/hero-app-1440.webp`, and `public/images/og-image.jpg`
- [X] T012 [US1] Populate Hero `<section id="top">` with Flowdesk `<h1>` headline, value statement, primary and secondary CTAs, and responsive `<picture>` app screenshot per `data-model.md` (`Product.name`, `Product.tagline`, `Product.heroScreenshot`, `Product.heroScreenshot.sources`, `Product.heroScreenshot.width`, `Product.heroScreenshot.height`, `Product.heroScreenshot.alt`, `CallToAction.label`, `CallToAction.href`, `CallToAction.variant`) and `contracts/ui-contract.md` Sections 2 & 6 in `index.html`

**Checkpoint**: User Story 1 is fully functional and independently testable as an MVP landing hero

---

## Phase 4: User Story 2 - Navigate between sections easily (Priority: P2)

**Goal**: Visitor uses a sticky top navigation bar to jump smoothly (or instantly under reduced motion) to any section on desktop or via an accessible collapsible mobile menu (`< 768px`) with progressive `no-js` fallback.

**Independent Test**: At `375 × 667`, toggle the mobile menu open/closed, click a section link to confirm smooth scroll with heading visible below the sticky header and automatic menu closure, press `Escape` to confirm menu closure and focus return, resize past `768 px` to confirm menu state reset, and disable JavaScript to confirm static navigation links remain usable.

### Implementation for User Story 2

- [X] T013 [P] [US2] Implement `initMobileMenu()` handling `[data-menu-toggle]` click, `[data-menu]#mobile-menu` `[data-open]` + `aria-expanded`/`aria-label` updates, nav-link click close, `Escape` close with focus return, and `matchMedia("(min-width: 768px)")` state reset per `data-model.md` (UI State Transitions) and `contracts/ui-contract.md` Sections 4, 5 & 7 in `src/js/modules/mobile-menu.js`
- [X] T014 [US2] Import and invoke `initMobileMenu()` in `src/js/main.js`
- [X] T015 [P] [US2] Populate sticky `<header>` and `<nav aria-label="Primary">` with brand link, ordered section links, header primary CTA, `[data-menu-toggle]` button, `#mobile-menu` `[data-menu]` container, and `no-js`/`js:` responsive visibility classes per `data-model.md` (`NavLink.label`, `NavLink.href`, `CallToAction.label`, `CallToAction.href`, `CallToAction.variant`) and `contracts/ui-contract.md` Sections 3, 4, 5 & 7 in `index.html`

**Checkpoint**: User Stories 1 and 2 work together and independently across mobile, desktop, keyboard, reduced-motion, and `no-js` modes

---

## Phase 5: User Story 3 - Learn the details and be persuaded (Priority: P3)

**Goal**: Visitor scrolls through Features/Benefits, How it works, and Testimonials sections arranged mobile-first to understand Flowdesk's capabilities, 3-step workflow, and social proof.

**Independent Test**: Scroll `#features`, `#how-it-works`, and `#testimonials` at `320 px`, `375 px`, `768 px`, and `1280 px`; confirm 6 feature cards with inline icons, 3 numbered steps, and 3 testimonials with CSS initials badges stack cleanly on mobile and form multi-column grids on desktop with zero horizontal scrolling.

### Implementation for User Story 3

- [X] T016 [US3] Populate `<section id="features">` with section `<h2>` and 6 mobile-first feature benefit cards using decorative inline SVGs per `data-model.md` (`Section.id`, `Section.heading`, `Feature.icon`, `Feature.title`, `Feature.description`) and `contracts/ui-contract.md` Sections 2 & 5 in `index.html`
- [X] T017 [US3] Populate `<section id="how-it-works">` with section `<h2>` and 3 ordered workflow steps in `<ol>` per `data-model.md` (`Section.id`, `Section.heading`, `Step.number`, `Step.title`, `Step.description`) and `contracts/ui-contract.md` Section 2 in `index.html`
- [X] T018 [US3] Populate `<section id="testimonials">` with section `<h2>` and 3 customer endorsement `<figure>` cards with CSS initials badges per `data-model.md` (`Section.id`, `Section.heading`, `Testimonial.quote`, `Testimonial.name`, `Testimonial.roleCompany`, `Testimonial.initials`) and `contracts/ui-contract.md` Section 2 in `index.html`

**Checkpoint**: User Stories 1, 2, and 3 render complete persuasion content across all supported viewport widths

---

## Phase 6: User Story 4 - Take action and find closing information (Priority: P4)

**Goal**: Visitor reaches a final Call-to-Action repeating the main offer and a Footer containing section links, external social links, and a current-year copyright notice.

**Independent Test**: Scroll to `#get-started` and `<footer>`; verify the prominent CTA links to `https://example.com/signup` with zero forms, footer section links jump cleanly, social links open in a new tab with accessible labels, and `<span data-current-year>` shows the current year (with static `2026` fallback when JS is disabled).

### Implementation for User Story 4

- [X] T019 [P] [US4] Implement `initCurrentYear()` updating `[data-current-year]` `textContent` to the current four-digit year per `contracts/ui-contract.md` Section 4 in `src/js/modules/current-year.js`
- [X] T020 [US4] Import and invoke `initCurrentYear()` in `src/js/main.js`
- [X] T021 [P] [US4] Populate `<section id="get-started">` final CTA and `<footer>` (section navigation links, external social icon links, and `<span data-current-year>2026</span>` copyright) per `data-model.md` (`Section.id`, `Section.heading`, `CallToAction.label`, `CallToAction.href`, `CallToAction.variant`, `NavLink.label`, `NavLink.href`, `SocialLink.platform`, `SocialLink.href`, `SocialLink.ariaLabel`, `SocialLink.target`, `SocialLink.rel`) and `contracts/ui-contract.md` Sections 2, 4, 5 & 6 in `index.html`

**Checkpoint**: All four user stories (`US1`–`US4`) are complete and independently verifiable

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, formatting/lint enforcement, production bundle verification, and end-to-end quality-gate validation

- [X] T022 [P] Document project overview, tech stack, npm scripts, and quality gates in `README.md`
- [X] T023 Run `npm run format`, `npm run format:check`, and `npm run lint`, resolving any formatting, class-sorting, or lint issues across `index.html`, `src/css/style.css`, `src/js/main.js`, `src/js/modules/mobile-menu.js`, `src/js/modules/current-year.js`, and `scripts/optimize-images.mjs`
- [X] T024 Run `npm run build` and validate all 13 end-to-end scenarios (gzipped JS ≤ 50 KB & CSS ≤ 30 KB budgets, `< 500 KB` total transfer, `320`–`1920 px` viewports, `no-js` fallback, `prefers-reduced-motion`, keyboard-only navigation, 200% zoom, and mobile Lighthouse Performance & Accessibility ≥ 95) against `dist/` per `specs/001-landing-page/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately (`T001` → `T002` → `T003`/`T004`/`T005` in parallel).
- **Foundational (Phase 2)**: Depends on Setup (`Phase 1`) — **BLOCKS** all user stories (`T006`–`T009` touch separate files and can run in parallel).
- **User Stories (Phases 3–6)**: All depend on Foundational (`Phase 2`) completion:
  - Recommended single-developer order: **US1 (P1)** → **US2 (P2)** → **US3 (P3)** → **US4 (P4)**.
  - Logically independent by landmark/section shell (`#top`, `<header>`, `#features`/`#how-it-works`/`#testimonials`, `#get-started`/`<footer>`); note that `T012`, `T015`, `T016`–`T018`, and `T021` all edit `index.html`, so coordinate merges if staffing multiple stories concurrently.
- **Polish (Phase 7)**: Depends on all desired user stories (`Phases 3–6`) being complete.

### User Story Dependency Graph

```text
Phase 1: Setup (T001–T005)
          │
          ▼
Phase 2: Foundational (T006–T009)
          │
          ├──────────────────────┬──────────────────────┬──────────────────────┐
          ▼                      ▼                      ▼                      ▼
   Phase 3: US1 (P1)      Phase 4: US2 (P2)      Phase 5: US3 (P3)      Phase 6: US4 (P4)
     Hero & Assets        Sticky Nav & Menu      Features/Steps/Proof    Final CTA & Footer
      (T010–T012)            (T013–T015)            (T016–T018)             (T019–T021)
          │                      │                      │                      │
          └──────────────────────┴──────────┬───────────┴──────────────────────┘
                                            ▼
                                 Phase 7: Polish (T022–T024)
```

### Within Each User Story

- **US1**: `T010` (image script + source PNG) → `T011` (`npm run images`) → `T012` (Hero markup in `index.html`).
- **US2**: `T013` (`mobile-menu.js`) and `T015` (`<header>` markup in `index.html`) can run in parallel; `T014` (`main.js` wiring) depends on `T013`.
- **US3**: `T016` → `T017` → `T018` run sequentially on `index.html`.
- **US4**: `T019` (`current-year.js`) and `T021` (`#get-started` + `<footer>` in `index.html`) can run in parallel; `T020` (`main.js` wiring) depends on `T019`.

---

## Parallel Opportunities & Examples

### Parallel Example: Phase 1 & Phase 2

```bash
# After T002 completes, launch Phase 1 config files together:
Task: "T003 Configure Vite bundler in vite.config.js"
Task: "T004 Configure ESLint 9 flat config in eslint.config.js"
Task: "T005 Configure Prettier in .prettierrc"

# Launch all Phase 2 foundational files together:
Task: "T006 Author Tailwind CSS v4 entry stylesheet in src/css/style.css"
Task: "T007 Create Flowdesk SVG brand favicon in public/favicon.svg"
Task: "T008 Create base HTML5 document shell in index.html"
Task: "T009 Create JavaScript entry module in src/js/main.js"
```

### Parallel Example: User Story 2 & User Story 4

```bash
# Within User Story 2 (different files):
Task: "T013 Implement initMobileMenu() in src/js/modules/mobile-menu.js"
Task: "T015 Populate sticky <header> and <nav> in index.html"

# Within User Story 4 (different files):
Task: "T019 Implement initCurrentYear() in src/js/modules/current-year.js"
Task: "T021 Populate <section id=\"get-started\"> and <footer> in index.html"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete **Phase 1: Setup** (`T001`–`T005`).
2. Complete **Phase 2: Foundational** (`T006`–`T009`).
3. Complete **Phase 3: User Story 1** (`T010`–`T012`).
4. **STOP and VALIDATE**: Run `npm run build && npm run preview` and verify the Flowdesk Hero section above the fold on mobile (`375 × 667`) and desktop (`1280 × 800`), responsive AVIF/WebP image loading, and CTA link destination.

### Incremental Delivery

1. **Setup + Foundational** → Buildable Vite + Tailwind v4 shell ready.
2. **Add US1 (Hero)** → Validate above-the-fold offer & LCP image → MVP ready!
3. **Add US2 (Sticky Nav & Mobile Menu)** → Validate section jumping, keyboard/ARIA, reduced motion & `no-js` fallback.
4. **Add US3 (Features, Steps, Testimonials)** → Validate responsive grids & persuasion copy.
5. **Add US4 (Final CTA & Footer)** → Validate conversion section, external social links & dynamic copyright year.
6. **Polish (Phase 7)** → Run ESLint, Prettier, bundle-budget checks, and full 13-scenario `quickstart.md` validation.
