"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ParticleText from "./ParticleText";
import { ArrowRight, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const PHRASES = [
  { id: "ui-design", text: "UI design components", label: "UI Components" },
  { id: "frameworks", text: "4 frameworks", label: "4 Frameworks" },
  { id: "react", text: "React", label: "React" },
  { id: "html-css-js", text: "HTML / CSS / JS", label: "HTML / CSS / JS" },
  { id: "vue", text: "Vue", label: "Vue" },
  { id: "svelte", text: "Svelte", label: "Svelte" },
];

export interface ParticleShowcaseSectionProps {
  active?: boolean;
  opacity?: number;
}

export default function ParticleShowcaseSection({
  active = true,
  opacity = 1,
}: ParticleShowcaseSectionProps) {
  const { locale, dir } = useLanguage();
  const [currentIdx, setCurrentIdx] = useState(0);

  // Progressive auto-cycle every 3.8s
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % PHRASES.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [active]);

  if (!active || opacity <= 0.01) return null;

  const currentPhrase = PHRASES[currentIdx];

  return (
    <section
      dir={dir}
      style={{ opacity }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4 sm:px-8 pointer-events-auto transition-opacity duration-300 select-none overflow-hidden"
    >
      {/* ── Ambient Radial Royal Blue Nebula ── */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18)_0%,rgba(79,9,237,0.12)_40%,transparent_70%)] blur-[120px]" />
      </div>

      {/* ── Progressive Phrase Pills Navigator ── */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-6">
        {PHRASES.map((phrase, idx) => {
          const isCurrent = currentIdx === idx;
          return (
            <button
              key={phrase.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`px-3 py-1 rounded-xl text-xs font-mono font-medium transition-all duration-300 cursor-pointer ${
                isCurrent
                  ? "bg-blue-600/25 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.35)] scale-105"
                  : "bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]"
              }`}
            >
              {phrase.label}
            </button>
          );
        })}
      </div>

      {/* ── Particle Text Stage ── */}
      <div className="relative z-10 w-full max-w-5xl h-[280px] sm:h-[360px] flex items-center justify-center">
        <ParticleText
          key={currentPhrase.id}
          text={currentPhrase.text}
          particleSize={2.4}
          density={4}
          color="#f8fafc"
          highlightColor="#2563EB"
          scatter={200}
          gatherDuration={1500}
          stagger={400}
          pointerRepel={45}
          repelRadius={130}
          idleDrift={0.8}
          trigger="mount"
          fontSize="clamp(2.8rem, 9vw, 7.5rem)"
          fontWeight={900}
          fontFamily="inherit"
          glow={true}
        />
      </div>

      {/* ── Exploratory Call to Action ── */}
      <div className="relative z-10 mt-6 flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/components"
          className="relative group overflow-hidden h-12 px-7 rounded-2xl
                     inline-flex items-center gap-3 text-sm font-semibold tracking-tight text-white
                     bg-gradient-to-r from-blue-600 to-indigo-600
                     border border-blue-400/30
                     shadow-[0_0_30px_rgba(37,99,235,0.45),inset_0_1px_1px_rgba(255,255,255,0.3)]
                     hover:shadow-[0_0_45px_rgba(37,99,235,0.65),inset_0_1px_1px_rgba(255,255,255,0.4)]
                     hover:scale-[1.02] active:scale-[0.98]
                     transition-all duration-200 cursor-pointer"
        >
          <Layers className="w-4 h-4 text-blue-200" />
          <span>{locale === "ar" ? "استكشف مكتبة المكونات" : "Explore Component Library"}</span>
          <ArrowRight
            className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
              dir === "rtl" ? "rotate-180 group-hover:-translate-x-1" : ""
            }`}
          />
        </Link>
      </div>
    </section>
  );
}
