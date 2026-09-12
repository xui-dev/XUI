"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Terminal,
  Copy,
  Check,
  Code2,
  Sparkles,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 flex flex-col">
      <Navbar />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-28 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[180px]" />
      </div>

      <main className="relative z-10 flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                Documentation
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Getting Started with XUI
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Add next-gen kinetic components to your React project in seconds.
            </p>
          </div>

          <Link
            href="/components"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-all w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Components</span>
          </Link>
        </div>

        {/* Section 1: Quick Install via CLI */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-blue-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              1. Add Components via CLI
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            You can add any component directly into your local project without manual copy-pasting. The CLI automatically downloads the file into <code className="text-blue-300">components/xui/</code> and installs any required dependencies.
          </p>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/60 border border-white/[0.12] font-mono text-xs sm:text-sm text-neutral-200">
            <code>npx xui add dynamic-floating-dock</code>
            <button
              type="button"
              onClick={() => copyCode("npx xui add dynamic-floating-dock", "cli1")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] text-xs transition-all cursor-pointer"
            >
              {copied === "cli1" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === "cli1" ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Section 2: Framework Requirements */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex flex-col gap-4 shadow-xl">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              2. Requirements & Compatibility
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            XUI components are designed for modern React stacks:
          </p>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-300 list-disc list-inside">
            <li><strong className="text-white">React 18 or 19</strong> (Next.js App Router, Vite, Remix, Astro)</li>
            <li><strong className="text-white">Tailwind CSS 3 or 4</strong> for utility classes</li>
            <li><strong className="text-white">Framer Motion / Motion</strong> for kinetic physics</li>
            <li><strong className="text-white">Lucide React</strong> for sleek icons</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
