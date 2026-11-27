import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const WEIGHTED_EASE = "power3.out";
let heroEntrancePlayed = false;

export function initAnimations() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // Run one-time hero entrance outside matchMedia revert cycles so desktop
  // media-query / resize updates can never re-run it or leave hero stuck hidden.
  if (!prefersReduced && !heroEntrancePlayed) {
    heroEntrancePlayed = true;
    initHeroEntrance();
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      allowMotion: "(prefers-reduced-motion: no-preference)",
      finePointer: "(hover: hover) and (pointer: fine)",
    },
    (context) => {
      const { allowMotion, finePointer } = context.conditions;

      initActiveNavTracking();

      if (!allowMotion) {
        return;
      }

      initPhoneFloat();
      initHeroParallax();
      initSectionReveals();
      initTaglineReveal();
      initAnimatedCounters();

      const cleanups = [];
      if (finePointer) {
        const tiltCleanup = initPhoneTilt3D();
        const hoverCleanup = initHoverMicroInteractions();
        if (tiltCleanup) cleanups.push(tiltCleanup);
        if (hoverCleanup) cleanups.push(hoverCleanup);
      }

      return () => {
        for (const cleanup of cleanups) {
          cleanup();
        }
      };
    },
  );
}

function clearInlineMotion(targets) {
  gsap.set(targets, { clearProps: "transform,opacity" });
}

function initHeroEntrance() {
  const heroItems = Array.from(
    document.querySelectorAll("[data-hero-stagger]"),
  );
  const heroVisual = document.querySelector("[data-hero-visual]");
  const heroOrb = document.querySelector("[data-hero-orb]");

  if (!heroItems.length && !heroVisual) {
    return;
  }

  const allTargets = [...heroItems, heroVisual, heroOrb].filter(Boolean);

  try {
    const timeline = gsap.timeline({
      defaults: { ease: WEIGHTED_EASE },
      onInterrupt: () => clearInlineMotion(allTargets),
    });

    if (heroOrb) {
      timeline.fromTo(
        heroOrb,
        { scale: 0.9, opacity: 0.35 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.0,
          clearProps: "transform,opacity",
        },
        0,
      );
    }

    if (heroItems.length) {
      // Explicit fromTo -> opacity: 1 so target opacity is never read from a
      // mid-flight value; starts at 0.2 so text stays visible even mid-frame.
      timeline.fromTo(
        heroItems,
        { y: 20, opacity: 0.2 },
        {
          y: 0,
          opacity: 1,
          duration: 0.68,
          stagger: 0.08,
          clearProps: "transform,opacity",
        },
        0,
      );
    }

    if (heroVisual) {
      timeline.fromTo(
        heroVisual,
        { y: 28, scale: 0.97, opacity: 0.2 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.82,
          clearProps: "transform,opacity",
        },
        "-=0.42",
      );
    }
  } catch {
    clearInlineMotion(allTargets);
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

  const onMove = (event) => {
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
  };

  const onLeave = () => {
    rotateXTo(0);
    rotateYTo(0);
    if (sheenXTo && sheenOpacityTo) {
      sheenXTo(0);
      sheenOpacityTo(0);
    }
  };

  stage.addEventListener("pointermove", onMove, { passive: true });
  stage.addEventListener("pointerleave", onLeave, { passive: true });

  return () => {
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
  };
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

  // Progressive enhancement: never pre-hide sections at opacity: 0 on load.
  // Content stays visible by default and glides smoothly into place onEnter.
  for (const section of sections) {
    const heading = section.querySelector("[data-reveal-heading]");

    if (heading) {
      ScrollTrigger.create({
        trigger: heading,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            heading,
            { y: 28, opacity: 0.2 },
            {
              y: 0,
              opacity: 1,
              duration: 0.72,
              ease: WEIGHTED_EASE,
              overwrite: "auto",
              clearProps: "transform,opacity",
              onInterrupt: () => clearInlineMotion(heading),
            },
          );
        },
      });
    }

    const groups = section.querySelectorAll("[data-reveal-group]");
    for (const group of groups) {
      const items = group.querySelectorAll("[data-reveal-item]");
      if (!items.length) {
        continue;
      }

      ScrollTrigger.create({
        trigger: group,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.fromTo(
            items,
            { y: 26, scale: 0.98, opacity: 0.2 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 0.68,
              stagger: 0.08,
              ease: WEIGHTED_EASE,
              overwrite: "auto",
              clearProps: "transform,opacity",
              onInterrupt: () => clearInlineMotion(items),
            },
          );
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
  const cleanups = [];

  const buttonsWithIcons = document.querySelectorAll("[data-hover-btn]");
  for (const button of buttonsWithIcons) {
    const icon = button.querySelector("[data-btn-icon]");
    if (!icon) {
      continue;
    }

    const onEnter = () => {
      gsap.to(icon, {
        x: 4,
        duration: 0.3,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(icon, {
        x: 0,
        duration: 0.3,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    };

    button.addEventListener("mouseenter", onEnter, { passive: true });
    button.addEventListener("mouseleave", onLeave, { passive: true });
    cleanups.push(() => {
      button.removeEventListener("mouseenter", onEnter);
      button.removeEventListener("mouseleave", onLeave);
    });
  }

  const interactiveCards = document.querySelectorAll("[data-hover-card]");
  for (const card of interactiveCards) {
    const icon = card.querySelector("[data-card-icon]");
    if (!icon) {
      continue;
    }

    const onEnter = () => {
      gsap.to(icon, {
        y: -2,
        scale: 1.08,
        rotate: -4,
        duration: 0.35,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    };
    const onLeave = () => {
      gsap.to(icon, {
        y: 0,
        scale: 1,
        rotate: 0,
        duration: 0.35,
        ease: WEIGHTED_EASE,
        overwrite: "auto",
      });
    };

    card.addEventListener("mouseenter", onEnter, { passive: true });
    card.addEventListener("mouseleave", onLeave, { passive: true });
    cleanups.push(() => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    });
  }

  return () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
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
