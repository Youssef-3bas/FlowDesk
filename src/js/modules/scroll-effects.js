export function initScrollEffects() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  initSectionReveals(prefersReducedMotion);
  initTaglineReveal(prefersReducedMotion);
  initActiveNavTracking();
}

function initSectionReveals(prefersReducedMotion) {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length) {
    return;
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    for (const element of revealElements) {
      element.setAttribute("data-reveal", "visible");
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-reveal", "visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
  );

  for (const element of revealElements) {
    observer.observe(element);
  }
}

function initTaglineReveal(prefersReducedMotion) {
  const taglineElement = document.querySelector("[data-tagline-reveal]");
  if (!taglineElement) {
    return;
  }

  const words = taglineElement.querySelectorAll(".tagline-word");
  if (!words.length) {
    return;
  }

  if (prefersReducedMotion) {
    for (const word of words) {
      word.setAttribute("data-active", "true");
    }
    return;
  }

  let isVisible = false;
  let rafId = 0;

  const updateWordStates = () => {
    rafId = 0;
    const rect = taglineElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const startY = viewportHeight * 0.85;
    const endY = viewportHeight * 0.28;
    const rawProgress =
      (startY - rect.top) / (startY - endY + rect.height * 0.4);
    const progress = Math.max(0, Math.min(1, rawProgress));
    const activeCount = Math.round(progress * words.length);

    for (let index = 0; index < words.length; index += 1) {
      if (index < activeCount) {
        words[index].setAttribute("data-active", "true");
      } else {
        words[index].removeAttribute("data-active");
      }
    }
  };

  const scheduleUpdate = () => {
    if (!isVisible || rafId) {
      return;
    }
    rafId = window.requestAnimationFrame(updateWordStates);
  };

  if (!("IntersectionObserver" in window)) {
    for (const word of words) {
      word.setAttribute("data-active", "true");
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          taglineElement.setAttribute("data-reveal-armed", "");
          scheduleUpdate();
        }
      }
    },
    { rootMargin: "150px 0px 150px 0px" },
  );

  observer.observe(taglineElement);
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
}

function initActiveNavTracking() {
  const navLinks = Array.from(
    document.querySelectorAll('header nav a[href^="#"]'),
  ).filter((link) => {
    const targetId = link.getAttribute("href")?.slice(1);
    return targetId && targetId !== "top";
  });

  if (!navLinks.length || !("IntersectionObserver" in window)) {
    return;
  }

  const linkBySectionId = new Map();
  const sections = [];

  for (const link of navLinks) {
    const id = link.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (section) {
      linkBySectionId.set(id, link);
      sections.push(section);
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

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      }
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
  );

  for (const section of sections) {
    observer.observe(section);
  }
}
