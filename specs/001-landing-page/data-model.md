# Data Model: Practice Landing Page

**Feature**: `001-landing-page` | **Date**: 2026-11-26

This project is a static single-page website with no backend, database, or client-side persistence. All entities below represent structured static content authored in `index.html` (plus one UI state transition for the mobile navigation menu).

## Static Content Entities

### 1. Product

- **Description**: The fictional SaaS productivity web app promoted on the landing page.
- **Fields**:
  - `name`: string (`"Flowdesk"`)
  - `tagline`: string (`"Plan, write, and ship — all in one calm workspace."`)
  - `heroScreenshot`:
    - `sources`: AVIF and WebP responsive `srcset` (`640w`, `1024w`, `1440w`) in `public/images/`
    - `width`: integer (`1440`)
    - `height`: integer (`900`)
    - `alt`: non-empty descriptive string (`FR-015`)
- **Validation Rules**:
  - Hero screenshot MUST load eagerly (`loading="eager"`, `fetchpriority="high"`) and reserve explicit `width`/`height` dimensions (`FR-019`, `FR-020`, `SC-003`).
- **HTML Mapping**: Hero `<section id="top">` (`<h1>`, value statement `<p>`, and `<picture><img>`).

### 2. Section

- **Description**: A top-level structural region of the single page in fixed order (`FR-001`).
- **Fields**:
  - `id`: anchor identifier (`top`, `features`, `how-it-works`, `testimonials`, `get-started`)
  - `heading`: section heading text (`<h1>` in Hero; `<h2>` in content sections)
  - `order`: integer (`1..7`)
- **Ordered Instances**:
  1. Sticky Header & Navigation (`<header>` / `<nav aria-label="Primary">`)
  2. Hero (`<section id="top">`)
  3. Features / Benefits (`<section id="features">`)
  4. How it works (`<section id="how-it-works">`)
  5. Testimonials (`<section id="testimonials">`)
  6. Final CTA (`<section id="get-started">`)
  7. Footer (`<footer>`)
- **Validation Rules**:
  - Pricing section MUST NOT exist (`FR-001`).
  - Only one `<h1>` on the page; section headings use sequential heading levels (`<h2>`, `<h3>`).
  - Anchor targets MUST account for sticky navbar height via `scroll-padding-top` so headings remain visible after anchor navigation.

### 3. Feature

- **Description**: A single product benefit displayed in `#features` (`FR-007`).
- **Fields**:
  - `icon`: inline SVG element (`aria-hidden="true"`, `focusable="false"`)
  - `title`: short string (`<h3>`)
  - `description`: concise body text (`<p>`, ≥ 16 px on mobile)
- **Validation Rules**:
  - Minimum 3 features required (`FR-007`); planned count: 6 features arranged in a mobile-first responsive grid (1 column on mobile, 2 on `sm:`, 3 on `lg:`).
- **HTML Mapping**: `<article>` or `<li>` cards inside `<section id="features">`.

### 4. Step

- **Description**: One stage of the 3-step onboarding/workflow sequence in `#how-it-works` (`FR-008`).
- **Fields**:
  - `number`: integer (`1`, `2`, `3`)
  - `title`: short string (`<h3>`)
  - `description`: concise explanation (`<p>`)
- **Validation Rules**:
  - Exactly 3 numbered steps in ascending order (`1` → `2` → `3`).
- **HTML Mapping**: Ordered list (`<ol>`) inside `<section id="how-it-works">`.

### 5. Testimonial

- **Description**: Customer endorsement displayed in `#testimonials` (`FR-009`).
- **Fields**:
  - `quote`: endorsement text (`<blockquote>`)
  - `name`: person's full name (`<cite>` or `<p>`)
  - `roleCompany`: role and company string (e.g., `"Product Lead, Northstar"`)
  - `initials`: 2-character string rendered in a CSS initials badge (`aria-hidden="true"`)
- **Validation Rules**:
  - Minimum 3 testimonials required (`FR-009`).
  - Avatars use CSS initials rather than raster images to stay within page weight targets (`SC-009`).
- **HTML Mapping**: `<figure>` / `<blockquote>` + `<figcaption>` cards inside `<section id="testimonials">`.

### 6. CallToAction

- **Description**: Primary or secondary action button/link (`FR-006`, `FR-010`, `FR-021`).
- **Fields**:
  - `label`: clear English action label (e.g., `"Get started free"`, `"See how it works"`)
  - `href`: destination URL (`"https://example.com/signup"` for `primary`; `"#how-it-works"` for `secondary`)
  - `variant`: `"primary"` | `"secondary"`
- **Validation Rules**:
  - Minimum touch target `44×44 px` (`FR-014`).
  - All `primary` CTAs MUST link to `https://example.com/signup`; MUST NOT submit or open any form (`FR-021`).
- **HTML Mapping**: Styled `<a>` links in Header (optional primary CTA), Hero (primary + secondary), and `#get-started` (primary).

### 7. NavLink

- **Description**: In-page navigation item in the sticky `<header>` and `<footer>` (`FR-002`, `FR-011`).
- **Fields**:
  - `label`: English link label
  - `href`: `#features` | `#how-it-works` | `#testimonials` | `#get-started`
- **Validation Rules**:
  - Minimum touch target `44×44 px` (`FR-014`).
  - Must function as standard HTML anchor links when JS is disabled (`FR-016`).
- **HTML Mapping**: `<a>` inside `<nav>` lists in `<header>` and `<footer>`.

### 8. SocialLink

- **Description**: External social link in `<footer>` (`FR-011`).
- **Fields**:
  - `platform`: string (e.g., `"GitHub"`, `"X"`, `"LinkedIn"`)
  - `href`: placeholder external HTTPS URL (`https://example.com/...`)
  - `ariaLabel`: accessible name (`"Flowdesk on GitHub"`, etc.)
  - `target`: `"_blank"`
  - `rel`: `"noopener noreferrer"`
- **Validation Rules**:
  - Minimum `44×44 px` tap target (`FR-014`).
  - Inline SVG icon marked `aria-hidden="true"`, `focusable="false"`; accessible name provided by `aria-label` on `<a>`.
- **HTML Mapping**: `<a>` list in `<footer>`.

## UI State Transitions

Only one interactive state exists at runtime:

- **Mobile Navigation Menu** (`[data-menu]` / `[data-menu-toggle]`):
  - **Initial state**: `closed` (hidden below `768px` when `.js` is present; `[data-open]` absent; `aria-expanded="false"`). Without `.js`, menu links remain statically visible (`FR-016`).
  - `closed` → `open`: User clicks/activates `[data-menu-toggle]`. Sets `[data-open]` on `[data-menu]` and `aria-expanded="true"` on toggle button.
  - `open` → `closed`:
    1. User clicks/activates `[data-menu-toggle]`.
    2. User clicks any link inside `[data-menu]` (`FR-005`).
    3. User presses `Escape` while menu is open (`FR-005`) — focus returns to `[data-menu-toggle]`.
    4. Viewport crosses `min-width: 768px` (`md:` breakpoint via `matchMedia` `change` event) — resets `[data-open]` and `aria-expanded="false"` cleanly across resize/orientation changes.
