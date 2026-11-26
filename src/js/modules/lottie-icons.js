import lottie from "lottie-web/build/player/lottie_light";
import barsData from "../../assets/lottie/bars.json";
import boltData from "../../assets/lottie/bolt.json";
import checklistData from "../../assets/lottie/checklist.json";
import targetData from "../../assets/lottie/target.json";

const ANIMATIONS = {
  checklist: checklistData,
  target: targetData,
  bolt: boltData,
  bars: barsData,
};

export function initLottieIcons() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (prefersReducedMotion) {
    return;
  }

  const containers = document.querySelectorAll("[data-lottie]");
  if (!containers.length) {
    return;
  }

  const instances = new Map();

  const mountContainer = (container) => {
    if (instances.has(container)) {
      return instances.get(container);
    }

    const name = container.dataset.lottie;
    const animationData = name ? ANIMATIONS[name] : null;
    if (!animationData) {
      return null;
    }

    const stage = document.createElement("span");
    stage.className = "block h-7 w-7";
    stage.setAttribute("aria-hidden", "true");
    container.appendChild(stage);

    const anim = lottie.loadAnimation({
      container: stage,
      renderer: "svg",
      loop: true,
      autoplay: false,
      animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
      },
    });

    const fallback = container.querySelector("[data-lottie-fallback]");
    if (fallback) {
      fallback.classList.add("hidden");
    }

    container.setAttribute("data-lottie-loaded", "true");
    instances.set(container, anim);

    const parentCard = container.closest("[data-hover-card]");
    if (parentCard) {
      parentCard.addEventListener("mouseenter", () => {
        anim.setSpeed(1.4);
        anim.play();
      });
      parentCard.addEventListener("mouseleave", () => {
        anim.setSpeed(1);
      });
    }

    return anim;
  };

  if (!("IntersectionObserver" in window)) {
    for (const container of containers) {
      const anim = mountContainer(container);
      if (anim) {
        anim.play();
      }
    }
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const container = entry.target;
        if (entry.isIntersecting) {
          const anim = mountContainer(container);
          if (anim) {
            anim.play();
          }
        } else if (instances.has(container)) {
          instances.get(container).pause();
        }
      }
    },
    { rootMargin: "120px 0px 120px 0px", threshold: 0.05 },
  );

  for (const container of containers) {
    observer.observe(container);
  }
}
