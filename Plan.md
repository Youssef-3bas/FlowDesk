# Implementation Plan: Practice Landing Page

> **Superseded**: This pre-spec draft has been superseded by the canonical Spec Kit plan at `specs/001-landing-page/plan.md`. Follow `specs/001-landing-page/plan.md` and `specs/001-landing-page/tasks.md` for implementation.

**Branch**: `001-landing-page` | **Date**: 2026-11-26 | **Spec**: (No `spec.md` created yet — this plan is based on the constitution + your direct description)

**Input**:  
- Constitution: A practice landing page project using HTML + Tailwind CSS + vanilla JavaScript, Vite + npm, clean readable organized code, modern mobile-first responsive design, **LTR interface**, no backend, performance & speed are a priority.  
- User directive: Build the landing page with Vite, Tailwind CSS and vanilla JavaScript via npm. Proper project structure with a dev server and a production build. No backend. The plan must respect the constitution.

---

## Summary

Build a **Landing Page** using Vite + Tailwind CSS + Vanilla JavaScript only.  
Goal: A fast, clean, organized, mobile-first page with no backend and easy to maintain.

Main focus:
- High performance and fast loading
- Clean, readable and organized code
- Modern fully responsive design
- **LTR** interface

---

## Technical Context

**Language/Version**:  
- HTML5  
- CSS (via Tailwind)  
- JavaScript (ES2022+ / modern vanilla JS)  
- Node.js (for Vite and npm only)

**Primary Dependencies**:
- `vite` (dev server + production build)
- `tailwindcss` + `@tailwindcss/vite`
- `autoprefixer` + `postcss` (if needed)

**Storage**: N/A (static site only)

**Testing**:  
- Manual testing in browser (Chrome / Firefox / Safari + mobile)
- Lighthouse score (Performance ≥ 95, Accessibility ≥ 95)

**Target Platform**:  
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-first (iOS + Android)

**Project Type**: Single-page static website (Frontend only)

**Performance Goals**:
- First Contentful Paint (FCP) < 1.2s
- Largest Contentful Paint (LCP) < 2.0s
- Very low Total Blocking Time
- Small bundle size

**Constraints**:
- **No backend** of any kind
- **LTR interface** (`dir="ltr"`)
- Mobile-first responsive
- Clean and organized code
- Performance first

**Scale/Scope**:
- One main page containing:
  - Hero
  - Features / Benefits
  - About / How it works
  - Testimonials (optional)
  - CTA
  - Footer

---

## Constitution Check

| Principle                        | Status | Notes                                      |
|----------------------------------|--------|--------------------------------------------|
| HTML + Tailwind + Vanilla JS     | ✅ Pass | Fully respected                            |
| Vite + npm                       | ✅ Pass | Project will start with `npm create vite`  |
| Clean, readable, organized code  | ✅ Pass | Clear folder structure + naming conventions|
| Modern mobile-first responsive   | ✅ Pass | Tailwind mobile-first                      |
| **LTR interface**                | ✅ Pass | `dir="ltr"` + `lang="en"`                  |
| No backend                       | ✅ Pass | Static site only                           |
| Performance & speed priority     | ✅ Pass | Vite + Tailwind JIT + minimal JS           |

**Gate Result**: ✅ **Passed**

---

## Project Structure

### Documentation

```text
specs/001-landing-page/
├── plan.md
├── research.md
├── data-model.md          # N/A
├── quickstart.md
├── contracts/             # N/A
└── tasks.md
```

### Source Code

```text
landing-page/
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   └── components/
│   │       └── mobile-menu.js
│   └── index.html
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
└── README.md
```

**Structure Decision**: Simple and clean Single Project structure suitable for a static single-page website.

---

## Technical Decisions & Approach

### 1. Project Bootstrap
- Use `npm create vite@latest` with the `vanilla` template
- Add Tailwind CSS using the official Vite integration

### 2. Tailwind Setup
- Tailwind v4 with `@tailwindcss/vite`
- Suitable LTR font (e.g. Inter or system fonts)

### 3. LTR Support
- `html` tag: `lang="en" dir="ltr"`
- Standard left-to-right layout

### 4. Performance Strategy
- Vite built-in optimizations
- Optimized images (WebP if possible)
- Minimal JavaScript (mobile menu + smooth scroll only)
- Lazy loading for images

### 5. Proposed Sections
1. Navbar (sticky + mobile menu)
2. Hero Section
3. Features / Benefits
4. How it works / About
5. Social Proof (optional)
6. Final CTA
7. Footer

### 6. JavaScript Responsibilities
- Mobile navigation toggle
- Smooth scroll
- Any other simple interactions without external libraries

---

## Next Steps

1. Run `/speckit-tasks` to break this plan into small actionable tasks.
2. Then proceed to `/speckit-implement`.
