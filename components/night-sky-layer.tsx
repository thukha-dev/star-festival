"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
};

type Twinkle = {
  x: number;
  y: number;
  base: number;
  phase: number;
  speed: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  len: number;
};

const STAR_COUNT = 10_000;
const TWINKLE_COUNT = 1_200;
const MAX_METEORS = 12;

function makeStars(width: number, height: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() < 0.94 ? Math.random() * 0.9 + 0.2 : Math.random() * 1.4 + 0.8,
    a: Math.random() * 0.65 + 0.2
  }));
}

function makeTwinkles(width: number, height: number): Twinkle[] {
  return Array.from({ length: TWINKLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * Math.max(height * 0.78, 1),
    base: Math.random() * 0.35 + 0.15,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 1.6 + 0.3
  }));
}

export function NightSkyLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d", { alpha: true });
    if (!offCtx) {
      return;
    }

    let stars: Star[] = [];
    let twinkles: Twinkle[] = [];
    let meteors: Meteor[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let meteorTimer = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      offscreen.width = Math.floor(width * dpr);
      offscreen.height = Math.floor(height * dpr);
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      stars = makeStars(width, height);
      twinkles = makeTwinkles(width, height);
      meteors = [];

      offCtx.clearRect(0, 0, width, height);
      for (const star of stars) {
        offCtx.globalAlpha = star.a;
        offCtx.fillStyle = "#ffffff";
        offCtx.beginPath();
        offCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        offCtx.fill();
      }
      offCtx.globalAlpha = 1;
    };

    const spawnMeteor = () => {
      if (meteors.length >= MAX_METEORS) {
        return;
      }
      const startX = Math.random() * width * 0.75 - width * 0.15;
      const startY = Math.random() * height * 0.35;
      const speed = Math.random() * 7 + 8;
      meteors.push({
        x: startX,
        y: startY,
        vx: speed,
        vy: speed * 0.35,
        life: 0,
        maxLife: Math.random() * 36 + 28,
        len: Math.random() * 90 + 70
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(offscreen, 0, 0, width, height);

      if (!reducedMotion) {
        const now = performance.now();
        for (const t of twinkles) {
          const alpha = t.base + Math.sin(now * 0.001 * t.speed + t.phase) * 0.18;
          ctx.globalAlpha = Math.max(0.05, Math.min(0.85, alpha));
          ctx.fillStyle = "#dff1ff";
          ctx.fillRect(t.x, t.y, 1, 1);
        }
        ctx.globalAlpha = 1;

        meteorTimer -= 1;
        if (meteorTimer <= 0) {
          spawnMeteor();
          meteorTimer = Math.floor(Math.random() * 26) + 10;
        }

        for (let index = meteors.length - 1; index >= 0; index -= 1) {
          const meteor = meteors[index];
          meteor.life += 1;
          meteor.x += meteor.vx;
          meteor.y += meteor.vy;

          const progress = meteor.life / meteor.maxLife;
          const alpha = Math.max(0, 1 - progress);
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = "#e6f5ff";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.len, meteor.y - meteor.len * 0.35);
          ctx.stroke();

          if (meteor.life >= meteor.maxLife) {
            meteors.splice(index, 1);
          }
        }
        ctx.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(loop);
    };

    resize();
    loop();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_30%,rgba(175,210,255,0.15),transparent_40%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(112deg,transparent_18%,rgba(184,210,255,0.08)_45%,transparent_72%)]" />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
