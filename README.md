# Flowdesk — Practice Landing Page

A fast, static, mobile-first English (LTR) landing page built with semantic HTML5, Tailwind CSS v4, and vanilla ES2022 JavaScript via Vite and npm. Zero backend and zero runtime dependencies.

## Tech Stack

- **Build Tool**: Vite (`es2022` target)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, system UI font stack, light-only theme)
- **JavaScript**: Vanilla ES modules (`src/js/modules/mobile-menu.js`, `src/js/modules/current-year.js`)
- **Asset Pipeline**: `sharp` (`scripts/optimize-images.mjs` → responsive AVIF/WebP hero variants + Open Graph image)
- **Code Quality**: ESLint 9 flat config + Prettier (`prettier-plugin-tailwindcss`)

## Project Structure

```text
index.html                  # Single-page semantic HTML5 content
public/
├── favicon.svg             # Flowdesk brand favicon
└── images/                 # Pre-generated hero-app-{640,1024,1440}.{avif,webp} + og-image.jpg
scripts/
└── optimize-images.mjs     # Responsive AVIF/WebP + OG image generator
src/
├── assets/source/          # Unshipped 1600x1000 source screenshot
├── css/style.css           # Tailwind v4 entry, custom `js` variant, scroll & focus rules
└── js/
    ├── main.js             # Entry module
    └── modules/
        ├── mobile-menu.js  # Accessible mobile menu toggle, Escape & resize reset
        └── current-year.js # Dynamic footer copyright year
```

## Available Scripts

| Command                | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `npm install`          | Install development dependencies                              |
| `npm run dev`          | Start Vite dev server (`http://localhost:5173`)               |
| `npm run build`        | Build production static bundle into `dist/`                   |
| `npm run preview`      | Preview production bundle locally (`http://localhost:4173`)   |
| `npm run images`       | Regenerate optimized AVIF/WebP hero images and `og-image.jpg` |
| `npm run lint`         | Run ESLint across `src/`, `scripts/`, and config files        |
| `npm run format`       | Format code and sort Tailwind classes with Prettier           |
| `npm run format:check` | Verify Prettier formatting without modifying files            |

## Quality Gates

- **Performance**: Mobile Lighthouse ≥ 95, FCP < 1.2 s, LCP < 2.0 s, CLS < 0.1, initial JS ≤ 50 KB gz, initial CSS ≤ 30 KB gz, total first-load weight < 500 KB.
- **Accessibility**: WCAG 2.1 AA contrast (≥ 4.5:1), Mobile Lighthouse Accessibility ≥ 95, full keyboard navigation, `prefers-reduced-motion` support, ≥ 44 × 44 px touch targets, and progressive `no-js` fallback.
- **Responsive**: Zero horizontal overflow from `320 px` to `1920 px+`.
