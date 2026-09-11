"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { GAZE_MAP } from "@/data/gazeMap";
import HeroSection from "@/components/HeroSection";
import LaserOverlay from "@/components/LaserOverlay";
import ParticleShowcaseSection from "@/components/landing/ParticleShowcaseSection";

const TOTAL_HERO_FRAMES = 240;
const TOTAL_LASER_FRAMES = 96;
const TOTAL_FLIGHT_FRAMES = 96;
const INITIAL_FRAME = 60; // Looking at user
const LOOK_DOWN_FRAME = 240; // Gaze locked straight down

type ExperienceMode = "hero" | "laser" | "flight" | "particles";

export default function RobotExperience() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preloaded image caches
  const heroImagesRef = useRef<HTMLImageElement[]>([]);
  const laserImagesRef = useRef<HTMLImageElement[]>([]);
  const flightImagesRef = useRef<HTMLImageElement[]>([]);

  // Hero gaze states
  const targetHeroFrameRef = useRef<number>(INITIAL_FRAME);
  const currentHeroFrameRef = useRef<number>(INITIAL_FRAME);
  const isInteractingRef = useRef<boolean>(false);
  const lastInteractionTimeRef = useRef<number>(0);
  const idleFrameProgressRef = useRef<number>(INITIAL_FRAME);
  const idleDirectionRef = useRef<number>(1);
  const pauseUntilRef = useRef<number>(0);
  const lastLoopTimeRef = useRef<number>(0);

  // Scroll & Phase states
  const scrollProgressRef = useRef<number>(0);
  const targetLaserFrameRef = useRef<number>(1);
  const currentLaserFrameRef = useRef<number>(1);
  const targetFlightFrameRef = useRef<number>(1);
  const currentFlightFrameRef = useRef<number>(1);
  const modeRef = useRef<ExperienceMode>("hero");

  // React state for overlay rendering
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentLaserFrame, setCurrentLaserFrame] = useState<number>(1);
  const [isLaserActive, setIsLaserActive] = useState<boolean>(false);
  const [laserOpacity, setLaserOpacity] = useState<number>(1);
  const [isParticlesActive, setIsParticlesActive] = useState<boolean>(false);
  const [particlesOpacity, setParticlesOpacity] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Animation frame loop id
  const animationFrameIdRef = useRef<number | null>(null);

  const getHeroFrameSrc = (index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/frame/ezgif-frame-${padded}.jpg`;
  };

  const getLaserFrameSrc = (index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/laser/ezgif-frame-${padded}.jpg`;
  };

  const getFlightFrameSrc = (index: number) => {
    const padded = String(index).padStart(3, "0");
    return `/hide_robot/ezgif-frame-${padded}.jpg`;
  };

  // 2D Gaze Solver
  const solveTargetFrame = useCallback(
    (cursorX: number, cursorY: number, prevFrame: number): number => {
      let bestFrame = prevFrame;
      let minCost = Infinity;

      const weightY = 2.8;
      const weightX = 1.3;

      for (let i = 0; i < GAZE_MAP.length; i++) {
        const item = GAZE_MAP[i];
        const dx = item.x - cursorX;
        const dy = item.y - cursorY;
        const distSq = dx * dx * weightX + dy * dy * weightY;
        const frameDiff = Math.abs(item.f - prevFrame) / TOTAL_HERO_FRAMES;
        const continuityCost = frameDiff * 0.12;
        const totalCost = distSq + continuityCost;

        if (totalCost < minCost) {
          minCost = totalCost;
          bestFrame = item.f;
        }
      }

      return bestFrame;
    },
    []
  );

  // Universal Canvas Drawer
  const drawImageOnCanvas = useCallback((img: HTMLImageElement | undefined) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Pure pitch black backdrop
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const topClearance =
      (typeof window !== "undefined" && window.innerWidth >= 768 ? 90 : 75) *
      dpr;
    const availableHeight = Math.max(100, canvasHeight - topClearance);

    const imgAspect = 1920 / 1080;
    const availableAspect = canvasWidth / availableHeight;

    let drawWidth: number;
    let drawHeight: number;
    let drawX: number;
    let drawY: number;

    if (availableAspect > imgAspect) {
      drawHeight = availableHeight;
      drawWidth = drawHeight * imgAspect;
      drawX = (canvasWidth - drawWidth) / 2;
      drawY = topClearance;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imgAspect;
      drawX = 0;
      drawY = topClearance + (availableHeight - drawHeight) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      img,
      Math.round(drawX),
      Math.round(drawY),
      Math.round(drawWidth),
      Math.round(drawHeight)
    );
  }, []);

  // Resize canvas dimensions to match viewport with retina DPR
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Redraw current state based on active mode
    const mode = modeRef.current;
    if (mode === "hero") {
      const idx = Math.min(
        TOTAL_HERO_FRAMES,
        Math.max(1, Math.round(currentHeroFrameRef.current))
      );
      drawImageOnCanvas(heroImagesRef.current[idx - 1]);
    } else if (mode === "laser") {
      const idx = Math.min(
        TOTAL_LASER_FRAMES,
        Math.max(1, Math.round(currentLaserFrameRef.current))
      );
      drawImageOnCanvas(laserImagesRef.current[idx - 1]);
    } else if (mode === "flight") {
      const idx = Math.min(
        TOTAL_FLIGHT_FRAMES,
        Math.max(1, Math.round(currentFlightFrameRef.current))
      );
      drawImageOnCanvas(flightImagesRef.current[idx - 1]);
    } else {
      // Particles mode: draw clean void
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [drawImageOnCanvas]);

  // Preload all frames (Hero 240 + Laser 96 + Flight 96 = 432)
  useEffect(() => {
    let totalLoaded = 0;
    const totalToLoad =
      TOTAL_HERO_FRAMES + TOTAL_LASER_FRAMES + TOTAL_FLIGHT_FRAMES;

    const heroImages: HTMLImageElement[] = [];
    const laserImages: HTMLImageElement[] = [];
    const flightImages: HTMLImageElement[] = [];

    // Preload initial alert frame (Frame 60) first for instant paint
    const initialFrame = new Image();
    initialFrame.src = getHeroFrameSrc(INITIAL_FRAME);
    initialFrame.onload = () => {
      heroImages[INITIAL_FRAME - 1] = initialFrame;
      drawImageOnCanvas(initialFrame);
    };

    const onFrameLoad = () => {
      totalLoaded++;
      const pct = Math.round((totalLoaded / totalToLoad) * 100);
      setLoadingProgress(pct);
      if (totalLoaded >= TOTAL_HERO_FRAMES) {
        setIsLoaded(true);
      }
    };

    // 1. Hero frames
    for (let i = 1; i <= TOTAL_HERO_FRAMES; i++) {
      const img = new Image();
      img.src = getHeroFrameSrc(i);
      img.onload = onFrameLoad;
      img.onerror = onFrameLoad;
      heroImages.push(img);
    }

    // 2. Laser frames
    for (let j = 1; j <= TOTAL_LASER_FRAMES; j++) {
      const img = new Image();
      img.src = getLaserFrameSrc(j);
      img.onload = onFrameLoad;
      img.onerror = onFrameLoad;
      laserImages.push(img);
    }

    // 3. Flight & Hide Robot frames
    for (let k = 1; k <= TOTAL_FLIGHT_FRAMES; k++) {
      const img = new Image();
      img.src = getFlightFrameSrc(k);
      img.onload = onFrameLoad;
      img.onerror = onFrameLoad;
      flightImages.push(img);
    }

    heroImagesRef.current = heroImages;
    laserImagesRef.current = laserImages;
    flightImagesRef.current = flightImages;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [drawImageOnCanvas, resizeCanvas]);

  // Scroll listener for sticky 4-stage cinematic sequence
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = rect.height - window.innerHeight;

      if (totalScrollable <= 0) return;

      const raw = -rect.top / totalScrollable;
      const progress = Math.max(0, Math.min(1, raw));
      scrollProgressRef.current = progress;

      // ── Stage 1: Hero Gaze (0.00 -> 0.12) ──
      if (progress < 0.12) {
        modeRef.current = "hero";
        setIsLaserActive(false);
        setIsParticlesActive(false);

        // Tilt head down as scroll starts
        if (progress > 0.03) {
          const blend = (progress - 0.03) / 0.09;
          const currentTarget = targetHeroFrameRef.current;
          targetHeroFrameRef.current = Math.round(
            currentTarget * (1 - blend) + LOOK_DOWN_FRAME * blend
          );
        }
      }
      // ── Stage 2: Laser Blast & MacCodeCard (0.12 -> 0.44) ──
      else if (progress >= 0.12 && progress < 0.44) {
        modeRef.current = "laser";
        setIsLaserActive(true);
        setIsParticlesActive(false);

        const laserProgress = (progress - 0.12) / 0.32;
        const targetFrame = Math.min(
          TOTAL_LASER_FRAMES,
          Math.max(1, Math.round(laserProgress * (TOTAL_LASER_FRAMES - 1)) + 1)
        );
        targetLaserFrameRef.current = targetFrame;
        setLaserOpacity(1);
      }
      // ── Stage 3: Laser Shutdown & Robot Flight (0.44 -> 0.72) ──
      else if (progress >= 0.44 && progress < 0.72) {
        modeRef.current = "flight";
        setIsParticlesActive(false);

        // Dissolve MacCodeCard as robot powers down
        const fadeProgress = (progress - 0.44) / 0.06;
        const opacity = Math.max(0, 1 - fadeProgress);
        setLaserOpacity(opacity);
        setIsLaserActive(opacity > 0.02);

        // Scrub flight frames (1 -> 96)
        const flightProgress = (progress - 0.44) / 0.28;
        const targetFrame = Math.min(
          TOTAL_FLIGHT_FRAMES,
          Math.max(
            1,
            Math.round(flightProgress * (TOTAL_FLIGHT_FRAMES - 1)) + 1
          )
        );
        targetFlightFrameRef.current = targetFrame;
      }
      // ── Stage 4: Stardust ParticleText Genesis (0.72 -> 1.00) ──
      else {
        modeRef.current = "particles";
        setIsLaserActive(false);
        setIsParticlesActive(true);

        const particleProgress = (progress - 0.72) / 0.12;
        const opacity = Math.min(1, Math.max(0, particleProgress));
        setParticlesOpacity(opacity);
      }

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Main 60fps/120fps physics render loop
  useEffect(() => {
    lastLoopTimeRef.current = performance.now();

    const animate = () => {
      const now = performance.now();
      const dt = Math.min((now - lastLoopTimeRef.current) / 1000, 0.1);
      lastLoopTimeRef.current = now;

      const mode = modeRef.current;

      // 1. Hero Mode
      if (mode === "hero") {
        const idleTime = now - lastInteractionTimeRef.current;
        const isAutonomous =
          (!isInteractingRef.current || idleTime > 1400) &&
          scrollProgressRef.current < 0.03;

        if (isAutonomous) {
          if (isInteractingRef.current) {
            isInteractingRef.current = false;
            idleFrameProgressRef.current = currentHeroFrameRef.current;
          }

          if (now >= pauseUntilRef.current) {
            const speed = 22;
            idleFrameProgressRef.current +=
              idleDirectionRef.current * speed * dt;

            if (idleFrameProgressRef.current >= TOTAL_HERO_FRAMES) {
              idleFrameProgressRef.current = TOTAL_HERO_FRAMES;
              idleDirectionRef.current = -1;
              pauseUntilRef.current = now + 650;
            } else if (idleFrameProgressRef.current <= 1) {
              idleFrameProgressRef.current = 1;
              idleDirectionRef.current = 1;
              pauseUntilRef.current = now + 650;
            }
          }

          targetHeroFrameRef.current = idleFrameProgressRef.current;
        }

        const lerpSpeed = isAutonomous ? 0.08 : 0.14;
        currentHeroFrameRef.current +=
          (targetHeroFrameRef.current - currentHeroFrameRef.current) * lerpSpeed;

        const frameToDraw = Math.min(
          TOTAL_HERO_FRAMES,
          Math.max(1, Math.round(currentHeroFrameRef.current))
        );

        const img = heroImagesRef.current[frameToDraw - 1];
        if (img) drawImageOnCanvas(img);
      }
      // 2. Laser Mode
      else if (mode === "laser") {
        const lerpSpeed = 0.18;
        currentLaserFrameRef.current +=
          (targetLaserFrameRef.current - currentLaserFrameRef.current) *
          lerpSpeed;

        const frameToDraw = Math.min(
          TOTAL_LASER_FRAMES,
          Math.max(1, Math.round(currentLaserFrameRef.current))
        );

        setCurrentLaserFrame(frameToDraw);

        const img = laserImagesRef.current[frameToDraw - 1];
        if (img) drawImageOnCanvas(img);
      }
      // 3. Flight Mode (Robot flight & shutdown)
      else if (mode === "flight") {
        const lerpSpeed = 0.2;
        currentFlightFrameRef.current +=
          (targetFlightFrameRef.current - currentFlightFrameRef.current) *
          lerpSpeed;

        const frameToDraw = Math.min(
          TOTAL_FLIGHT_FRAMES,
          Math.max(1, Math.round(currentFlightFrameRef.current))
        );

        const img = flightImagesRef.current[frameToDraw - 1];
        if (img) drawImageOnCanvas(img);
      }
      // 4. Particles Mode (Robot is gone)
      else {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d", { alpha: false });
          if (ctx) {
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
        }
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animationFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [drawImageOnCanvas]);

  // Pointer listener for Gaze Tracking in Hero Mode
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (modeRef.current !== "hero" || scrollProgressRef.current > 0.08) return;

      isInteractingRef.current = true;
      lastInteractionTimeRef.current = performance.now();

      const width = window.innerWidth;
      const height = window.innerHeight;

      const cursorX = Math.max(0, Math.min(1, e.clientX / width));
      const cursorY = Math.max(0, Math.min(1, e.clientY / height));

      const target = solveTargetFrame(
        cursorX,
        cursorY,
        Math.round(currentHeroFrameRef.current)
      );

      targetHeroFrameRef.current = target;
    };

    const handlePointerLeave = () => {
      isInteractingRef.current = false;
      lastInteractionTimeRef.current = 0;
      idleFrameProgressRef.current = currentHeroFrameRef.current;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
    };
  }, [solveTargetFrame]);

  // Derived overlay animations
  const heroOpacity = Math.max(0, 1 - scrollProgress / 0.1);
  const heroTranslateY = -(scrollProgress * 220);

  const laserProgress =
    scrollProgress >= 0.12 && scrollProgress < 0.44
      ? (scrollProgress - 0.12) / 0.32
      : scrollProgress >= 0.44
      ? 1
      : 0;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480vh] bg-black select-none"
    >
      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* High-Performance Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{
            imageRendering: "auto",
            filter: "contrast(1.03) brightness(1.01)",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
        />

        {/* 1. Act I: Hero Section Overlay (dissolves on scroll) */}
        <HeroSection
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            pointerEvents: heroOpacity < 0.1 ? "none" : "auto",
          }}
        />

        {/* 2. Act II & III: Laser Sequence & MacCodeCard Overlay */}
        <LaserOverlay
          laserProgress={laserProgress}
          currentLaserFrame={currentLaserFrame}
          active={isLaserActive}
          opacity={laserOpacity}
        />

        {/* 3. Act IV: Particle Text Genesis Section (appears after robot flight) */}
        <ParticleShowcaseSection
          active={isParticlesActive}
          opacity={particlesOpacity}
        />

        {/* Minimal loading bar at page initialization */}
        {!isLoaded && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-700">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-150"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="text-[11px] tracking-widest uppercase font-mono text-white/40">
              Initializing Engine {loadingProgress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
