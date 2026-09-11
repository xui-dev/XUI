"use client";

import React from "react";
import Link from "next/link";
import ElasticMesh from "./ElasticMesh";
import BlurText from "./BlurText";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Websites3DSection() {
  const { messages } = useLanguage();
  const t = messages.websites3D || {
    title: "Looking for a 3D Website?",
    showTemplates: "Show Templates",
    customRequest: "Custom Request",
  };

  const handleCustomRequest = () => {
    const subject = encodeURIComponent("Custom 3D Website Request");
    window.location.href = `mailto:contact@xui.dev?subject=${subject}`;
  };

  return (
    <section
      id="3d-websites"
      dir="ltr"
      className="relative w-full pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center bg-black overflow-hidden select-none"
    >
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* ── 1. Title with BlurText (Generous Headroom below Navbar) ── */}
        <div className="w-full flex justify-center text-center mb-10 sm:mb-14">
          <BlurText
            key={t.title}
            text={t.title}
            delay={90}
            animateBy="words"
            direction="top"
            className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white justify-center"
          />
        </div>

        {/* ── 2. Pure 3D Elastic Mesh (No Muddy Smudge/Halos Behind) ── */}
        <div className="relative w-full max-w-4xl aspect-[16/9] min-h-[260px] sm:min-h-[440px] md:min-h-[500px] flex items-center justify-center">
          <div className="relative w-full h-full rounded-[24px] overflow-hidden">
            <ElasticMesh
              image="/3D.jpeg"
              interaction="hover"
              tilt={14}
              shading={0.5}
              color1="#5227FF"
              color2="#B19EEF"
              showGrid={true}
              gridDensity={20}
              gridOpacity={0.28}
              gridColor="#ffffff"
              highlight="#ffffff"
              borderRadius={24}
              stiffness={0.05}
              damping={0.2}
              grabRadius={0.6}
              pull={0.4}
              wobble={5}
              resolution={25}
              enabled={true}
            />
          </div>
        </div>

        {/* ── 3. Authentic XUI Buttons (Hero Section Aesthetic) ── */}
        <div className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pointer-events-auto">
          {/* Primary CTA: Show Templates (Luminous Porcelain Keycap with Capsule Arrow) */}
          <Link
            href="/components"
            className="relative group overflow-hidden h-11 sm:h-12 px-5 sm:px-6 rounded-[14px]
                       inline-flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-tight text-neutral-950
                       bg-gradient-to-b from-white via-[#f7f7f8] to-[#e4e4e9]
                       border border-white/90
                       shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_24px_-4px_rgba(255,255,255,0.25),inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_0_rgba(0,0,0,0.08)]
                       hover:shadow-[0_2px_4px_rgba(0,0,0,0.35),0_14px_32px_-4px_rgba(255,255,255,0.4),inset_0_1px_0_rgba(255,255,255,1),inset_0_-2px_0_rgba(0,0,0,0.08)]
                       hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                       transition-all duration-200 ease-out cursor-pointer"
          >
            {/* Diagonal Light Sweep Sheen */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/60 to-transparent" />

            <span className="relative z-10">{t.showTemplates}</span>

            {/* Micro-capsule Arrow Track */}
            <span className="relative z-10 flex items-center justify-center w-6 h-6 rounded-full bg-black/[0.07] group-hover:bg-black group-hover:text-white text-neutral-800 transition-all duration-200">
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </Link>

          {/* Secondary CTA: Custom Request (Obsidian Titanium with Specular Hairline) */}
          <button
            type="button"
            onClick={handleCustomRequest}
            className="relative group overflow-hidden h-11 sm:h-12 px-5 sm:px-6 rounded-[14px]
                       inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium tracking-tight text-neutral-200 hover:text-white
                       bg-[#0d0e12]/85 hover:bg-[#15161e]/90 backdrop-blur-xl
                       border border-white/[0.12] hover:border-white/[0.25]
                       shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_24px_rgba(0,0,0,0.6)]
                       hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_28px_rgba(0,0,0,0.7)]
                       hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
                       transition-all duration-200 ease-out cursor-pointer"
          >
            {/* Top Specular Hairline Highlight */}
            <span className="pointer-events-none absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

            <Sparkles className="relative z-10 w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />

            <span className="relative z-10">{t.customRequest}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
