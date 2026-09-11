"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComponentPreviewView from "@/components/components-page/ComponentPreviewView";
import ComponentCodeView from "@/components/components-page/ComponentCodeView";
import type { ComponentItem } from "@/data/componentsData";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, Eye, Code2 } from "lucide-react";

export interface ComponentDetailClientProps {
  component: ComponentItem;
}

export default function ComponentDetailClient({ component }: ComponentDetailClientProps) {
  const { locale, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const title = locale === "ar" && component.titleAr ? component.titleAr : component.title;

  return (
    <div
      dir={dir}
      className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden flex flex-col"
    >
      {/* ── Fixed Floating Navbar ── */}
      <Navbar />

      {/* ── Ambient Background Glows ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-24 left-1/3 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-24 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      <main className="relative z-10 flex-1 pt-28 sm:pt-36 pb-24 px-4 sm:px-6 lg:px-12 max-w-6xl mx-auto w-full flex flex-col gap-8">
        {/* ── Navigation Header: Back Link + Breadcrumb ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link
            href="/components"
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.1] text-xs font-semibold text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>{locale === "ar" ? "العودة إلى المكونات" : "Back to Components"}</span>
          </Link>

          {/* Top Toggle Tabs: [ Preview ] and [ Code ] (matching wireframe) */}
          <div className="flex items-center p-1 rounded-2xl bg-[#10121e]/90 backdrop-blur-2xl border border-white/[0.12] shadow-xl">
            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "preview"
                  ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.45)] border border-blue-400/40"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "code"
                  ? "bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.45)] border border-blue-400/40"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Code</span>
            </button>
          </div>
        </div>

        {/* ── Component Title Header ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold px-2.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30">
              {locale === "ar" && component.categoryLabelAr ? component.categoryLabelAr : component.categoryLabel}
            </span>
            <span className="text-xs text-neutral-500 font-mono">MIT Licensed</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
        </div>

        {/* ── Active Tab View ── */}
        <div className="w-full transition-all duration-300">
          {activeTab === "preview" ? (
            <ComponentPreviewView component={component} locale={locale} />
          ) : (
            <ComponentCodeView component={component} locale={locale} />
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
