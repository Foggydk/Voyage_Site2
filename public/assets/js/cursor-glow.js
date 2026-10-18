(function () {
  if (window.innerWidth <= 768) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("custom-cursor-active");
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "2147483647";
  canvas.style.opacity = "1";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let headX = targetX;
  let headY = targetY;
  let hasPointer = true;
  const points = [];
  const maxPoints = reducedMotion ? 14 : 24;
  const brandRed = [186, 26, 26];
  const white = [255, 255, 255];
  let activeColor = brandRed;
  let lastColorSampleAt = 0;
  const colorSampleIntervalMs = 90;

  const parseRgbColor = function (value) {
    if (!value) return null;
    const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return null;
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  };

  const getEffectiveBackgroundRgb = function (x, y) {
    const element = document.elementFromPoint(x, y);
    if (!element) return [252, 248, 248];

    let current = element;
    while (current && current !== document.documentElement) {
      const bg = window.getComputedStyle(current).backgroundColor;
      if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
        const parsed = parseRgbColor(bg);
        if (parsed) return parsed;
      }
      current = current.parentElement;
    }
    return [252, 248, 248];
  };

  const srgbToLinear = function (channel) {
    const normalized = channel / 255;
    if (normalized <= 0.03928) return normalized / 12.92;
    return Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  const relativeLuminance = function (rgb) {
    return (
      0.2126 * srgbToLinear(rgb[0]) +
      0.7152 * srgbToLinear(rgb[1]) +
      0.0722 * srgbToLinear(rgb[2])
    );
  };

  const contrastRatio = function (a, b) {
    const l1 = relativeLuminance(a);
    const l2 = relativeLuminance(b);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const blendToRgba = function (rgb, alpha) {
    return "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", " + alpha + ")";
  };

  const updateAdaptiveColor = function (timestamp) {
    if (timestamp - lastColorSampleAt < colorSampleIntervalMs) return;
    lastColorSampleAt = timestamp;

    const background = getEffectiveBackgroundRgb(headX, headY);
    const redContrast = contrastRatio(brandRed, background);
    const whiteContrast = contrastRatio(white, background);
    activeColor = whiteContrast > redContrast ? white : brandRed;
  };

  const resize = function () {
    width = window.innerWidth;
    height = window.innerHeight;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const addPoint = function (x, y) {
    points.unshift({
      x: x,
      y: y,
      life: 1
    });
    if (points.length > maxPoints) points.pop();
  };

  const drawHead = function () {
    const gradient = ctx.createRadialGradient(headX - 2, headY - 2, 0, headX, headY, 10);
    const bright = activeColor === white ? [255, 255, 255] : [255, 186, 186];
    const mid = activeColor === white ? [255, 255, 255] : [225, 41, 41];
    const deep = activeColor === white ? [220, 220, 220] : [138, 14, 14];
    gradient.addColorStop(0, blendToRgba(bright, 0.96));
    gradient.addColorStop(0.45, blendToRgba(mid, 0.92));
    gradient.addColorStop(1, blendToRgba(deep, 0.76));
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(headX, headY, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawThread = function () {
    for (let i = 0; i < points.length - 1; i += 1) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const t = i / points.length;
      const alpha = reducedMotion ? 0.45 * (1 - t) : 0.75 * (1 - t);
      const lineWidth = reducedMotion ? 1.3 - t * 0.6 : 2.2 - t * 1.1;

      ctx.strokeStyle = blendToRgba(activeColor, alpha);
      ctx.lineWidth = lineWidth > 0.45 ? lineWidth : 0.45;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  };

  const tick = function (timestamp) {
    ctx.clearRect(0, 0, width, height);

    if (hasPointer) {
      const follow = reducedMotion ? 0.18 : 0.28;
      headX += (targetX - headX) * follow;
      headY += (targetY - headY) * follow;
      addPoint(headX, headY);
      updateAdaptiveColor(timestamp || 0);
    } else {
      for (let i = 0; i < points.length; i += 1) {
        points[i].life -= 0.06;
      }
      while (points.length && points[points.length - 1].life <= 0) {
        points.pop();
      }
    }

    if (points.length > 1) drawThread();
    if (hasPointer) drawHead();

    window.requestAnimationFrame(tick);
  };

  window.addEventListener("pointermove", function (event) {
    targetX = event.clientX;
    targetY = event.clientY;
    hasPointer = true;
  });

  window.addEventListener("pointerenter", function (event) {
    targetX = event.clientX;
    targetY = event.clientY;
    hasPointer = true;
  });

  window.addEventListener("pointerleave", function () {
    hasPointer = false;
  });

  window.addEventListener("blur", function () {
    hasPointer = false;
  });

  window.addEventListener("resize", resize);
  resize();
  window.requestAnimationFrame(tick);
})();
