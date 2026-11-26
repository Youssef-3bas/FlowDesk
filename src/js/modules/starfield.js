const STAR_COLORS = [
  [255, 255, 255],
  [199, 210, 254],
  [165, 180, 252],
  [196, 181, 253],
];

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
  let pointerX = 0;
  let pointerY = 0;
  let targetPointerX = 0;
  let targetPointerY = 0;

  const createStars = () => {
    const area = width * height;
    const count = Math.max(55, Math.min(140, Math.round(area / 11500)));
    stars = Array.from({ length: count }, (_, index) => {
      const depth = (index % 3) + 1;
      const color = STAR_COLORS[index % STAR_COLORS.length];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: depth === 3 ? 1.55 : depth === 2 ? 1.05 : 0.7,
        baseAlpha: depth === 3 ? 0.8 : depth === 2 ? 0.55 : 0.35,
        speedY: depth * 0.065,
        twinkleSpeed: 0.0008 + Math.random() * 0.0014,
        twinklePhase: Math.random() * Math.PI * 2,
        depth,
        color,
      };
    });
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
    drawFrame(performance.now(), false);
  };

  const drawFrame = (now, shouldDrift) => {
    ctx.clearRect(0, 0, width, height);

    if (shouldDrift) {
      pointerX += (targetPointerX - pointerX) * 0.04;
      pointerY += (targetPointerY - pointerY) * 0.04;
    }

    for (const star of stars) {
      if (shouldDrift) {
        star.y -= star.speedY;
        if (star.y < -4) {
          star.y = height + 4;
          star.x = Math.random() * width;
        }
      }

      const twinkle = shouldDrift
        ? 0.65 + 0.35 * Math.sin(now * star.twinkleSpeed + star.twinklePhase)
        : 1;
      const alpha = Math.min(1, star.baseAlpha * twinkle);
      const offsetX = pointerX * star.depth * 5;
      const offsetY = pointerY * star.depth * 5;
      const drawX = star.x + offsetX;
      const drawY = star.y + offsetY;

      ctx.beginPath();
      ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${star.color[0]}, ${star.color[1]}, ${star.color[2]}, ${alpha.toFixed(3)})`;
      ctx.fill();
    }
  };

  const loop = (now) => {
    rafId = 0;
    if (document.hidden || prefersReducedMotion.matches) {
      return;
    }
    drawFrame(now, true);
    rafId = window.requestAnimationFrame(loop);
  };

  const start = () => {
    if (!rafId && !prefersReducedMotion.matches && !document.hidden) {
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
  start();

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
        if (!width || !height) {
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
      stop();
    } else {
      start();
    }
  });

  prefersReducedMotion.addEventListener("change", () => {
    if (prefersReducedMotion.matches) {
      stop();
      pointerX = 0;
      pointerY = 0;
      drawFrame(performance.now(), false);
    } else {
      start();
    }
  });
}
