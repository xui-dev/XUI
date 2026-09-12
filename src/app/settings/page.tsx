"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  Settings as SettingsIcon,
  Globe,
  Moon,
  Shield,
  LogOut,
  ArrowLeft,
  Check,
} from "lucide-react";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { locale, setLocale } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 flex flex-col">
      <Navbar />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-28 left-1/3 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <SettingsIcon className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
                Preferences
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Platform Settings
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Customize your experience, locale, and account preferences.
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-all w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Setting Section: Language */}
        <div className="p-6 rounded-3xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Interface Language</h3>
              <p className="text-xs text-neutral-400">Choose between English and Arabic (RTL support).</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl border bg-blue-600/20 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] text-xs font-semibold flex items-center justify-between">
              <span>English (Default)</span>
              <Check className="w-4 h-4 text-blue-400" />
            </div>

            <div className="p-3.5 rounded-2xl border bg-white/[0.03] border-white/[0.08] text-neutral-400 text-xs font-semibold flex items-center justify-between opacity-80">
              <span>العربية (قريباً)</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-neutral-400">
                Soon
              </span>
            </div>
          </div>
        </div>

        {/* Setting Section: Appearance */}
        <div className="p-6 rounded-3xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Appearance Theme</h3>
              <p className="text-xs text-neutral-400">Obsidian OLED Dark Mode (Default for high kinetic contrast).</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-xl bg-white/[0.06] border border-white/[0.1] text-xs font-mono text-neutral-300">
            Dark (OLED)
          </span>
        </div>

        {/* Setting Section: Account */}
        {user && (
          <div className="p-6 rounded-3xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-500/15 text-red-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Signed in as {user.email}</h3>
                <p className="text-xs text-neutral-400">Manage your active authentication session.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
