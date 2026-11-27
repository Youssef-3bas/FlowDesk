const STAR_COLORS = [
  [255, 255, 255],
  [224, 231, 255],
  [199, 210, 254],
  [196, 181, 253],
];

const MAX_DPR = 2;
const SMALL_SCREEN_MAX_WIDTH = 767;

export function initStarfield() {
  const canvas = document.getElementById("starfield-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    return;
  }

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  );

  let width = 0;
  let height = 0;
  let stars = [];
  let rafId = 0;
  let isHeroVisible = true;
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  const createStratifiedStars = () => {
    const area = width * height;
    const isSmallScreen = width <= SMALL_SCREEN_MAX_WIDTH;
    // Match visual density across phone & desktop while keeping mobile star count light
    const densityTarget = Math.round(area / 12800);
    const targetCount = isSmallScreen
      ? Math.max(24, Math.min(36, densityTarget))
      : Math.max(64, Math.min(108, densityTarget));

    const aspect = width / Math.max(height, 1);
    const cols = Math.max(4, Math.round(Math.sqrt(targetCount * aspect)));
    const rows = Math.max(5, Math.round(targetCount / cols));
    const cellW = width / cols;
    const cellH = height / rows;

    const list = [];
    let index = 0;

    for (let row = 0; row < rows; row += 1) {
      for (let col = 0; col < cols; col += 1) {
        const depth = (index % 3) + 1;
        const color = STAR_COLORS[index % STAR_COLORS.length];
        const x = (col + 0.14 + Math.random() * 0.72) * cellW;
        const y = (row + 0.14 + Math.random() * 0.72) * cellH;
        const radius = depth === 3 ? 1.25 : depth === 2 ? 1.0 : 0.8;
        const baseAlpha = depth === 3 ? 0.78 : depth === 2 ? 0.56 : 0.38;

        list.push({
          x,
          y,
          col,
          cellW,
          radius,
          baseAlpha,
          speedY: depth * 0.045,
          twinkleSpeed: 0.0007 + (index % 5) * 0.00018,
          twinklePhase: Math.random() * Math.PI * 2,
          depth,
          color,
        });
        index += 1;
      }
    }

    stars = list;
  };

  const drawFrame = (now, shouldAnimate) => {
    ctx.clearRect(0, 0, width, height);

    if (shouldAnimate && hasFinePointer.matches) {
      pointerX += (targetPointerX - pointerX) * 0.04;
      pointerY += (targetPointerY - pointerY) * 0.04;
    }

    for (const star of stars) {
      if (shouldAnimate) {
        star.y -= star.speedY;
        if (star.y < -3) {
          star.y = height + 3;
          star.x = (star.col + 0.14 + Math.random() * 0.72) * star.cellW;
        }
      }

      const twinkle = shouldAnimate
        ? 0.74 + 0.26 * Math.sin(now * star.twinkleSpeed + star.twinklePhase)
        : 1;
      const alpha = Math.min(1, star.baseAlpha * twinkle);
      const offsetX = hasFinePointer.matches ? pointerX * star.depth * 4 : 0;
      const offsetY = hasFinePointer.matches ? pointerY * star.depth * 4 : 0;

      ctx.beginPath();
      ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${alpha.toFixed(3)})`;
      ctx.fill();
    }
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStratifiedStars();
    drawFrame(performance.now(), false);
  };

  const shouldRun = () =>
    isHeroVisible && !document.hidden && !prefersReducedMotion.matches;

  const loop = (now) => {
    rafId = 0;
    if (!shouldRun()) {
      return;
    }
    drawFrame(now, true);
    rafId = window.requestAnimationFrame(loop);
  };

  const start = () => {
    if (!rafId && shouldRun()) {
      rafId = window.requestAnimationFrame(loop);
    }
  };

  const stop = () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  resize();

  // Pause starfield whenever the hero section scrolls out of view
  const heroSection = document.getElementById("top");
  if (heroSection && "IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isHeroVisible = entry.isIntersecting;
          canvas.dataset.starfieldState = isHeroVisible ? "active" : "paused";
          if (isHeroVisible) {
            start();
          } else {
            stop();
          }
        }
      },
      { rootMargin: "80px 0px 80px 0px", threshold: 0 },
    );
    heroObserver.observe(heroSection);
  } else {
    canvas.dataset.starfieldState = "active";
  }

  // Defer starting continuous rAF slightly so initial mobile paint stays uncontended
  const beginAnimation = () => {
    canvas.dataset.starfieldState = shouldRun() ? "active" : "paused";
    start();
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(beginAnimation, { timeout: 300 });
  } else {
    window.setTimeout(beginAnimation, 120);
  }

  let resizeTimer = 0;
  window.addEventListener(
    "resize",
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    },
    { passive: true },
  );

  if (hasFinePointer.matches) {
    window.addEventListener(
      "pointermove",
      (event) => {
        if (!width || !height || !isHeroVisible) {
          return;
        }
        targetPointerX = (event.clientX / width - 0.5) * 2;
        targetPointerY = (event.clientY / height - 0.5) * 2;
      },
      { passive: true },
    );
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      canvas.dataset.starfieldState = "paused";
      stop();
    } else if (shouldRun()) {
      canvas.dataset.starfieldState = "active";
      start();
    }
  });

  prefersReducedMotion.addEventListener("change", () => {
    if (prefersReducedMotion.matches) {
      canvas.dataset.starfieldState = "paused";
      stop();
      pointerX = 0;
      pointerY = 0;
      drawFrame(performance.now(), false);
    } else if (shouldRun()) {
      canvas.dataset.starfieldState = "active";
      start();
    }
  });
}
