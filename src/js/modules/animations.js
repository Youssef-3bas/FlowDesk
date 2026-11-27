import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const WEIGHTED_EASE = "power3.out";

export function initAnimations() {
  const mm = gsap.matchMedia();

  mm.add("(prefers-reduced-motion: no-preference)", () => {
    initHeroEntrance();
    initPhoneFloat();

    const scheduleScrollTriggers = () => {
      initHeroParallax();
      initSectionReveals();
      initTaglineReveal();
      initAnimatedCounters();
      initActiveNavTracking();
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(scheduleScrollTriggers, { timeout: 250 });
    } else {
      window.setTimeout(scheduleScrollTriggers, 60);
    }
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    initActiveNavTracking();
  });

  mm.add(
    "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
    () => {
      initPhoneTilt3D();
      initHoverMicroInteractions();
    },
  );
}

function initHeroEntrance() {
  const heroItems = document.querySelectorAll("[data-hero-stagger]");
  const heroVisual = document.querySelector("[data-hero-visual]");
  const heroOrb = document.querySelector("[data-hero-orb]");

  if (!heroItems.length && !heroVisual) {
    return;
  }

  const timeline = gsap.timeline({
    defaults: { ease: WEIGHTED_EASE },
  });

  if (heroOrb) {
    timeline.from(
      heroOrb,
      {
        scale: 0.88,
        opacity: 0.2,
        duration: 1.1,
        clearProps: "transform,opacity",
      },
      0,
    );
  }

  if (heroItems.length) {
    timeline.from(
      heroItems,
      {
        y: 24,
        opacity: 0.01,
        duration: 0.72,
        stagger: 0.09,
        clearProps: "transform,opacity",
      },
      0,
    );
  }

  if (heroVisual) {
    timeline.from(
      heroVisual,
      {
        y: 36,
        scale: 0.96,
        opacity: 0.01,
        duration: 0.9,
        clearProps: "transform,opacity",
      },
      "-=0.48",
    );
  }
}

function initPhoneFloat() {
  const floatTarget = document.querySelector("[data-phone-float]");
  if (!floatTarget) {
    return;
  }

  gsap.to(floatTarget, {
    y: -12,
    duration: 3.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
}

function initPhoneTilt3D() {
  const stage = document.querySelector("[data-phone-stage]");
  const tiltTarget = document.querySelector("[data-phone-tilt]");
  const sheen = document.querySelector("[data-phone-sheen]");

  if (!stage || !tiltTarget) {
    return;
  }

  gsap.set(tiltTarget, {
    transformPerspective: 1100,
    transformStyle: "preserve-3d",
  });

  const rotateXTo = gsap.quickTo(tiltTarget, "rotationX", {
    duration: 0.5,
    ease: WEIGHTED_EASE,
  });
  const rotateYTo = gsap.quickTo(tiltTarget, "rotationY", {
    duration: 0.5,
    ease: WEIGHTED_EASE,
  });
  const sheenXTo = sheen
    ? gsap.quickTo(sheen, "xPercent", { duration: 0.5, ease: WEIGHTED_EASE })
    : null;
  const sheenOpacityTo = sheen
    ? gsap.quickTo(sheen, "opacity", { duration: 0.4, ease: WEIGHTED_EASE })
    : null;

  stage.addEventListener(
    "pointermove",
    (event) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const normX = (event.clientX - rect.left) / rect.width - 0.5;
      const normY = (event.clientY - rect.top) / rect.height - 0.5;

      rotateYTo(normX * 20);
      rotateXTo(-normY * 16);

      if (sheenXTo && sheenOpacityTo) {
        sheenXTo(normX * 45);
        sheenOpacityTo(0.45);
      }
    },
    { passive: true },
  );

  stage.addEventListener(
    "pointerleave",
    () => {
      rotateXTo(0);
      rotateYTo(0);
      if (sheenXTo && sheenOpacityTo) {
        sheenXTo(0);
        sheenOpacityTo(0);
      }
    },
    { passive: true },
  );
}

function initHeroParallax() {
  const heroSection = document.getElementById("top");
  const parallaxTarget = document.querySelector("[data-hero-parallax]");

  if (!heroSection || !parallaxTarget) {
    return;
  }

  gsap.fromTo(
    parallaxTarget,
    { y: 0 },
    {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: 0.75,
      },
    },
  );
}

function initSectionReveals() {
  const sections = document.querySelectorAll("[data-reveal-section]");

  for (const section of sections) {
    const heading = section.querySelector("[data-reveal-heading]");

    if (heading) {
      gsap.from(heading, {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: WEIGHTED_EASE,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: heading,
          start: "top 88%",
          once: true,
        },
      });
    }

    const groups = section.querySelectorAll("[data-reveal-group]");
    for (const group of groups) {
      const items = group.querySelectorAll("[data-reveal-item]");
      if (!items.length) {
        continue;
      }

      gsap.from(items, {
        y: 32,
        scale: 0.97,
        opacity: 0,
        duration: 0.75,
        stagger: 0.09,
        ease: WEIGHTED_EASE,
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: group,
          start: "top 86%",
          once: true,
        },
      });
    }
  }
}

function initTaglineReveal() {
  const taglineElement = document.querySelector("[data-tagline-reveal]");
  if (!taglineElement) {
    return;
  }

  const words = Array.from(taglineElement.querySelectorAll(".tagline-word"));
  if (!words.length) {
    return;
  }

  const applyProgress = (progress) => {
    const activeCount = Math.round(progress * words.length);
    for (let index = 0; index < words.length; index += 1) {
      const isActive = index < activeCount;
      gsap.to(words[index], {
        opacity: isActive ? 1 : 0.26,
        duration: 0.35,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
      if (isActive) {
        words[index].setAttribute("data-active", "true");
      } else {
        words[index].removeAttribute("data-active");
      }
    }
  };

  ScrollTrigger.create({
    trigger: taglineElement,
    start: "top 86%",
    end: "bottom 38%",
    onEnter: (self) => applyProgress(self.progress),
    onUpdate: (self) => applyProgress(self.progress),
  });
}

function initAnimatedCounters() {
  const counters = document.querySelectorAll("[data-counter-target]");
  if (!counters.length) {
    return;
  }

  for (const element of counters) {
    const target = Number(element.dataset.counterTarget);
    if (!Number.isFinite(target)) {
      continue;
    }

    const decimals = Number(element.dataset.counterDecimals || 0);
    const prefix = element.dataset.counterPrefix || "";
    const suffix = element.dataset.counterSuffix || "";
    const useGrouping = element.dataset.counterFormat === "comma";
    const formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
    });

    const state = { value: 0 };
    const trigger = element.closest("[data-stats-grid]") || element;

    ScrollTrigger.create({
      trigger,
      start: "top 86%",
      once: true,
      onEnter: () => {
        gsap.to(state, {
          value: target,
          duration: 1.35,
          ease: WEIGHTED_EASE,
          onUpdate: () => {
            element.textContent = `${prefix}${formatter.format(state.value)}${suffix}`;
          },
          onComplete: () => {
            element.textContent = `${prefix}${formatter.format(target)}${suffix}`;
          },
        });
      },
    });
  }
}

function initHoverMicroInteractions() {
  const buttonsWithIcons = document.querySelectorAll("[data-hover-btn]");
  for (const button of buttonsWithIcons) {
    const icon = button.querySelector("[data-btn-icon]");
    if (!icon) {
      continue;
    }

    button.addEventListener("mouseenter", () => {
      gsap.to(icon, {
        x: 4,
        duration: 0.3,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    });

    button.addEventListener("mouseleave", () => {
      gsap.to(icon, {
        x: 0,
        duration: 0.3,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    });
  }

  const interactiveCards = document.querySelectorAll("[data-hover-card]");
  for (const card of interactiveCards) {
    const icon = card.querySelector("[data-card-icon]");
    if (!icon) {
      continue;
    }

    card.addEventListener("mouseenter", () => {
      gsap.to(icon, {
        y: -2,
        scale: 1.08,
        rotate: -4,
        duration: 0.35,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(icon, {
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 0.35,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    });
  }
}

function initActiveNavTracking() {
  const navLinks = Array.from(
    document.querySelectorAll('header nav a[href^="#"]'),
  ).filter((link) => {
    const targetId = link.getAttribute("href")?.slice(1);
    return targetId && targetId !== "top";
  });

  if (!navLinks.length) {
    return;
  }

  const linkBySectionId = new Map();
  for (const link of navLinks) {
    const id = link.getAttribute("href").slice(1);
    if (document.getElementById(id)) {
      linkBySectionId.set(id, link);
    }
  }

  const setActiveSection = (activeId) => {
    for (const [id, link] of linkBySectionId) {
      if (id === activeId) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
  };

  for (const id of linkBySectionId.keys()) {
    const section = document.getElementById(id);
    ScrollTrigger.create({
      trigger: section,
      start: "top 45%",
      end: "bottom 45%",
      onEnter: () => setActiveSection(id),
      onEnterBack: () => setActiveSection(id),
    });
  }
}
