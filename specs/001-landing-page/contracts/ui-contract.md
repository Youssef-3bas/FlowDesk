# UI & DOM Contract: Practice Landing Page

**Feature**: `001-landing-page` | **Date**: 2026-11-26

This contract defines the public DOM structure, anchor identifiers, JavaScript data-attribute hooks, ARIA semantics, external link rules, and responsive breakpoint shared across `index.html`, `src/css/style.css`, and `src/js/`.

## 1. Document Root & Language Contract

- `<html>` MUST declare `lang="en"`, `dir="ltr"`, and initial class `no-js`.
- `<head>` MUST include `<meta name="color-scheme" content="light">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, `<title>`, `<meta name="description">`, Open Graph (`og:title`, `og:description`, `og:image`, `og:type`), `twitter:card="summary_large_image"`, and `<link rel="icon" href="/favicon.svg" type="image/svg+xml">`.
- `<head>` MUST execute a one-line synchronous inline script replacing `no-js` with `js` on `document.documentElement` before first paint so `.js` styles apply without layout shift.

## 2. Section Anchor IDs & Order

Sections MUST appear in `index.html` in this exact top-to-bottom order (no Pricing section):

| Order | Landmark / Element | `id` | Heading Level | Purpose |
|-------|--------------------|------|---------------|---------|
| 1 | `<header>` | — | — | Sticky top bar + primary navigation |
| 2 | `<section>` (inside `<main>`) | `top` | `<h1>` | Hero headline, value statement, primary & secondary CTAs, app `<picture>` |
| 3 | `<section>` (inside `<main>`) | `features` | `<h2>` | 6 product benefits (`<h3>` per card) |
| 4 | `<section>` (inside `<main>`) | `how-it-works` | `<h2>` | 3 numbered workflow steps (`<h3>` per step) |
| 5 | `<section>` (inside `<main>`) | `testimonials` | `<h2>` | 3 customer quotes |
| 6 | `<section>` (inside `<main>`) | `get-started` | `<h2>` | Final CTA repeating main offer |
| 7 | `<footer>` | — | — | Section links, social links, copyright year |

- `html { scroll-padding-top: 4.5rem; }` MUST offset all `#id` anchor jumps below the sticky `<header>`.

## 3. Navigation Link Order

Primary navigation inside `<nav aria-label="Primary">` MUST contain links in this order:

1. `Features` → `#features`
2. `How it works` → `#how-it-works`
3. `Testimonials` → `#testimonials`
4. `Get started` → `#get-started` (required in-page section anchor so all four sections remain reachable from `<nav>`; `<header>` MAY also include a separate primary CTA button linking to `https://example.com/signup`)

## 4. JavaScript Hook Attributes

| Selector | Element | Owner / Behavior |
|----------|---------|------------------|
| `[data-menu-toggle]` | `<button type="button">` in `<header>` | `mobile-menu.js` attaches click listener; toggles `[data-open]` on `[data-menu]` and `aria-expanded` on itself. Hidden when `html.no-js` is active and at `md:` (`≥ 768px`). |
| `[data-menu]` (`id="mobile-menu"`) | Mobile/responsive nav container in `<header>` | Hidden below `768px` when `html.js` is active unless `[data-open]` attribute is present. Always visible statically when `html.no-js` is active or at `≥ 768px`. |
| `[data-open]` | Attribute on `[data-menu]` | Presence indicates mobile menu is open (`data-open=""`); removed on toggle, nav link click, `Escape`, or viewport `≥ 768px`. |
| `[data-current-year]` | `<span>` inside `<footer>` copyright | Contains static fallback `"2026"` in HTML; `current-year.js` sets `textContent` to `String(new Date().getFullYear())`. |

## 5. ARIA & Accessibility Contract

- `<header>` contains `<nav aria-label="Primary">`.
- `[data-menu-toggle]` MUST carry:
  - `type="button"`
  - `aria-controls="mobile-menu"`
  - `aria-expanded="false"` (toggled to `"true"` while open)
  - `aria-label="Open main menu"` when closed, `"Close main menu"` when open (or equivalent `sr-only` text)
- Pressing `Escape` while `[data-menu]` has `[data-open]` MUST close the menu and return focus to `[data-menu-toggle]`.
- Exactly one `<h1>` on the page; every `<section>` inside `<main>` has one `<h2>`; sub-items use `<h3>`.
- Every interactive control (`<a>`, `<button>`) MUST have a minimum clickable/tap area of `44×44 px` and a visible `:focus-visible` indicator.
- Decorative inline SVGs MUST set `aria-hidden="true"` and `focusable="false"`.

## 6. External Links Contract

- **Primary CTAs** (Hero primary CTA, Final CTA, and Header CTA if present):
  - `href="https://example.com/signup"`
  - Opens in the same tab (no `target="_blank"`).
- **Footer Social Links**:
  - `target="_blank"`
  - `rel="noopener noreferrer"`
  - Explicit `aria-label` naming the platform (e.g., `"Flowdesk on GitHub"`).

## 7. Responsive Breakpoint Contract

- **Mobile-to-Desktop Navigation Switch**: Tailwind `md` breakpoint (`min-width: 768px`).
  - `< 768px` (with `.js`): `[data-menu-toggle]` visible; `[data-menu]` collapses unless `[data-open]`.
  - `≥ 768px`: `[data-menu-toggle]` hidden; desktop nav inline; `matchMedia('(min-width: 768px)')` `change` listener resets `[data-open]` and `aria-expanded="false"`.
- **Supported Width Range**: `320 px` to `≥ 1920 px` with zero horizontal overflow.
