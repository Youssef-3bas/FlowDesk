import { initCurrentYear } from "./modules/current-year.js";
import { initMobileMenu } from "./modules/mobile-menu.js";
import { initStarfield } from "./modules/starfield.js";

initMobileMenu();
initCurrentYear();

const observeLottieTrigger = () => {
  const featuresSection = document.getElementById("features");
  if (!featuresSection) {
    return;
  }

  let loaded = false;
  const loadLottie = () => {
    if (loaded) {
      return;
    }
    loaded = true;
    import("./modules/lottie-icons.js").then(({ initLottieIcons }) => {
      initLottieIcons();
    });
  };

  if (!("IntersectionObserver" in window)) {
    loadLottie();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          observer.disconnect();
          loadLottie();
          break;
        }
      }
    },
    { rootMargin: "320px 0px 320px 0px" },
  );

  observer.observe(featuresSection);
};

const loadEnhancedExperience = () => {
  initStarfield();

  import("./modules/animations.js").then(({ initAnimations }) => {
    initAnimations();
  });

  observeLottieTrigger();
};

if (document.readyState === "complete") {
  window.requestAnimationFrame(loadEnhancedExperience);
} else {
  window.addEventListener(
    "load",
    () => {
      window.requestAnimationFrame(loadEnhancedExperience);
    },
    { once: true },
  );
}
