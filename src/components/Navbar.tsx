"use client";

import Link from "next/link";
import XUILogo from "@/components/XUILogo";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

export default function Navbar() {
  const { locale, setLocale, messages, dir } = useLanguage();
  const t = messages.navbar;

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-[calc(100%-3.5rem)] lg:w-[calc(100%-5rem)] max-w-7xl pointer-events-none flex items-center justify-between gap-3 transition-all duration-300">
      {/* ── Island 1: Main Navigation Dock (Logo + Links + Language Switcher) ── */}
      <nav
        dir={dir}
        className="pointer-events-auto relative flex items-center gap-2.5 sm:gap-4 px-3 sm:px-5 py-2 sm:py-2.5
                   rounded-2xl sm:rounded-[22px]
                   bg-[#121216]/65 backdrop-blur-2xl backdrop-saturate-180
                   border border-white/[0.14]
                   transition-all duration-300 ease-out overflow-x-auto no-scrollbar"
        style={{
          boxShadow:
            "0 24px 60px -12px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.6)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {/* Apple Liquid Glass Top Specular Sheen */}
        <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent rounded-full" />

        {/* 1. Left Section: Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            className="flex items-center transition-transform duration-200 hover:scale-105 active:scale-95"
            aria-label="XUI Home"
          >
            <XUILogo height={22} color="#ffffff" />
          </Link>
        </div>

        {/* Hairline vertical divider */}
        <div className="w-px h-4 bg-white/15 shrink-0" />

        {/* 2. Center Section: 3 Navigation Items */}
        <ul className="flex items-center gap-1 sm:gap-1.5 list-none m-0 p-0">
          <li>
            <Link
              href="/components"
              className="relative px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium text-neutral-300 hover:text-white 
                         hover:bg-white/[0.08] active:bg-white/[0.12] transition-all duration-200 whitespace-nowrap"
            >
              {t.links.components}
            </Link>
          </li>
          <li>
            <Link
              href="#templates"
              className="relative px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium text-neutral-300 hover:text-white 
                         hover:bg-white/[0.08] active:bg-white/[0.12] transition-all duration-200 whitespace-nowrap"
            >
              {t.links.templates}
            </Link>
          </li>
          <li>
            <Link
              href="#showcase"
              className="relative px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-medium text-neutral-300 hover:text-white 
                         hover:bg-white/[0.08] active:bg-white/[0.12] transition-all duration-200 whitespace-nowrap"
            >
              {t.links.showcase}
            </Link>
          </li>
        </ul>

        {/* Hairline vertical divider */}
        <div className="w-px h-4 bg-white/15 shrink-0" />

        {/* 3. Language Toggle Pill */}
        <button
          type="button"
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white 
                     bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] transition-all cursor-pointer active:scale-95 shrink-0"
          title="Switch Language"
        >
          <Globe className="w-3.5 h-3.5 text-neutral-400" />
          <span className="uppercase">{locale === "en" ? "AR" : "EN"}</span>
        </button>
      </nav>

      {/* ── Island 2: Standalone Action Dock (Sign In Pill) ── */}
      <div
        dir={dir}
        className="pointer-events-auto relative flex items-center p-1 sm:p-1.5
                   rounded-2xl sm:rounded-[22px]
                   bg-[#121216]/65 backdrop-blur-2xl backdrop-saturate-180
                   border border-white/[0.14]
                   transition-all duration-300 ease-out shrink-0"
        style={{
          boxShadow:
            "0 24px 60px -12px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.6)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
        }}
      >
        {/* Apple Liquid Glass Top Specular Sheen */}
        <div className="pointer-events-none absolute inset-x-3 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent rounded-full" />

        {/* Sign In Button */}
        <button
          type="button"
          className="relative group overflow-hidden px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-white
                     bg-white/[0.10] hover:bg-white/[0.18] active:bg-white/[0.24]
                     border border-white/20 hover:border-white/35
                     shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,0,0,0.4)]
                     transition-all duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          {/* Pure white specular sweep sheen */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="relative z-10 whitespace-nowrap">{t.signIn}</span>
        </button>
      </div>
    </header>
  );
}
