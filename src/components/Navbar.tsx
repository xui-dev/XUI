"use client";

import { useState } from "react";
import Link from "next/link";
import XUILogo from "@/components/XUILogo";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/auth/UserMenu";
import { Menu, X, Layers, LayoutTemplate, Sparkles, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const { messages, dir } = useLanguage();
  const { user, openAuthModal, isAuthModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = messages.navbar;

  return (
    <header className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.25rem)] sm:w-[calc(100%-3.5rem)] lg:w-[calc(100%-5rem)] max-w-7xl pointer-events-none flex flex-col items-center transition-all duration-300">
      {/* ══════════════════════════════════════════════════════════════════
          DESKTOP NAVIGATION (Dual Island Dock on sm and up)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden sm:flex items-center justify-between w-full gap-3">
        {/* ── Island 1: Main Navigation Dock (Logo + Links) ── */}
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

          {/* Settings Icon Pill (replacing language switcher) */}
          <Link
            href="/admin"
            className="flex items-center justify-center p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white 
                       bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.08] transition-all duration-200 cursor-pointer active:scale-95 shrink-0 group"
            title="Settings"
            aria-label="Settings"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 group-hover:text-white group-hover:rotate-45 transition-transform duration-300" />
          </Link>
        </nav>

        {/* ── Island 2: Standalone Action Dock (Sign In Pill or User Menu) ── */}
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

          {/* If logged in, show Liquid Glass UserMenu */}
          {user ? (
            <UserMenu />
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal("signin")}
              className="relative group overflow-hidden px-4 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-[13px] font-semibold text-white
                         bg-white/[0.10] hover:bg-white/[0.18] active:bg-white/[0.24]
                         backdrop-blur-2xl backdrop-saturate-200
                         border border-white/20 hover:border-white/35
                         shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_rgba(0,0,0,0.4)]
                         transition-colors duration-200 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <span className="relative z-10 whitespace-nowrap">{t.signIn}</span>
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          MOBILE NAVIGATION (Unified Sleek Liquid Glass Dock on < sm)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="flex sm:hidden flex-col w-full pointer-events-auto relative">
        <div
          dir={dir}
          className="flex items-center justify-between w-full px-3 py-2 rounded-2xl
                     bg-[#10121a]/85 backdrop-blur-2xl backdrop-saturate-200
                     border border-white/[0.15] shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.22)]"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 pr-1"
            aria-label="XUI Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <XUILogo height={18} color="#ffffff" />
          </Link>

          {/* Quick Center Action: Components Pill */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/components"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold text-white
                         bg-blue-600/25 hover:bg-blue-600/35 border border-blue-500/40
                         shadow-[0_0_12px_rgba(37,99,235,0.3)] active:scale-95 transition-all"
            >
              {t.links.components}
            </Link>
          </div>

          {/* Right Action: Sign In / User + Hamburger Menu */}
          <div className="flex items-center gap-1.5">
            {user ? (
              <UserMenu />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal("signin");
                }}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold text-white
                           bg-white/[0.12] hover:bg-white/[0.18] border border-white/20 active:scale-95 transition-all"
              >
                {t.signIn}
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl text-neutral-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-blue-400" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Expandable Mobile Frosted Drawer ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mt-2 p-3 rounded-2xl bg-[#0c0e18]/95 backdrop-blur-3xl border border-white/[0.14] shadow-[0_24px_50px_rgba(0,0,0,0.95)] flex flex-col gap-1.5 z-50"
            >
              <Link
                href="/components"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{t.links.components}</span>
              </Link>

              <Link
                href="#templates"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
              >
                <LayoutTemplate className="w-4 h-4 text-indigo-400" />
                <span>{t.links.templates}</span>
              </Link>

              <Link
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>{t.links.showcase}</span>
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors"
              >
                <Settings className="w-4 h-4 text-neutral-400" />
                <span>Settings</span>
              </Link>

              <div className="w-full h-px bg-white/[0.08] my-1" />

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-neutral-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>GitHub Repository</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.06] text-neutral-300">
                  ★ Star
                </span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

