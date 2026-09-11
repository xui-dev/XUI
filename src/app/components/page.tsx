"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LineSidebar from "@/components/components-page/LineSidebar";
import ComponentCard from "@/components/components-page/ComponentCard";
import { COMPONENTS_DATA, CATEGORIES } from "@/data/componentsData";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Sparkles, X, SlidersHorizontal } from "lucide-react";

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // Categories list for LineSidebar
  const categoryLabels = useMemo(() => {
    return CATEGORIES.map((cat) => cat.label);
  }, []);

  const selectedCategory = CATEGORIES[activeCategoryIndex] || CATEGORIES[0];

  // Filtered components based on category & search
  const filteredComponents = useMemo(() => {
    return COMPONENTS_DATA.filter((comp) => {
      const matchesCategory =
        selectedCategory.id === "all" || comp.category === selectedCategory.id;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        comp.title.toLowerCase().includes(query) ||
        comp.description.toLowerCase().includes(query) ||
        comp.categoryLabel.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div
      dir="ltr"
      className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 overflow-x-hidden flex flex-col"
    >
      {/* ── Fixed Floating Navbar Dock ── */}
      <Navbar />

      {/* ── Ambient Background Glow Orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-60 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      {/* ── Main Layout Container ── */}
      <main className="relative z-10 flex-1 pt-24 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
        {/* Hero Title Section */}
        <div className="mb-6 sm:mb-12 flex flex-col items-start gap-2">
          <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-white">
            Explore Components
          </h1>
          <p className="text-neutral-400 text-xs sm:text-base max-w-2xl leading-relaxed">
            High-performance kinetic UI components ready to drop into your project across 4 framework flavors.
          </p>
        </div>

        {/* ── Two Column Architecture (Sidebar + Grid) ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          {/* ── Left Sidebar: Search + LineSidebar on desktop / Chips on mobile ── */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-28">
            {/* Search Box */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all"
                style={{
                  boxShadow: "inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* ── Mobile Horizontal Category Chips Carousel (Immediate Thumb Access) ── */}
            <div className="flex lg:hidden items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full touch-scroll-x">
              {CATEGORIES.map((cat, idx) => {
                const isSelected = activeCategoryIndex === idx;
                const label = cat.label;
                const count =
                  cat.id === "all"
                    ? COMPONENTS_DATA.length
                    : COMPONENTS_DATA.filter((c) => c.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-[0_0_16px_rgba(37,99,235,0.4)] border border-blue-400/40"
                        : "bg-[#0d0f1a]/85 text-neutral-300 hover:text-white border border-white/[0.1] hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isSelected
                          ? "bg-white/25 text-white font-bold"
                          : "bg-white/[0.06] text-neutral-400"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Kinetic LineSidebar Component (Desktop Only) */}
            <div className="hidden lg:block rounded-3xl p-4 bg-[#0a0c16]/70 backdrop-blur-xl border border-white/[0.08] shadow-xl">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.06] text-xs font-mono uppercase tracking-wider text-neutral-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-500" />
                <span>Categories</span>
              </div>

              <LineSidebar
                items={categoryLabels}
                activeIndex={activeCategoryIndex}
                onItemClick={(index) => setActiveCategoryIndex(index)}
                accentColor="#2563EB"
                textColor="#9CA3AF"
                markerColor="#374151"
                showIndex={true}
                showMarker={true}
                itemGap={18}
                fontSize={0.92}
                smoothing={120}
              />
            </div>
          </aside>

          {/* ── Right Column: 3x3 Components Grid ── */}
          <section className="flex-1 w-full flex flex-col gap-6">
            {/* Category Stats Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-white">
                  {selectedCategory.label}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/[0.08] text-neutral-300">
                  {filteredComponents.length}
                </span>
              </div>

              {searchQuery && (
                <span className="text-xs text-neutral-400 font-mono">
                  Results for "{searchQuery}"
                </span>
              )}
            </div>

            {/* Grid Container (3 Columns on desktop matching wireframe) */}
            {filteredComponents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredComponents.map((comp) => (
                  <ComponentCard key={comp.id} component={comp} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl bg-[#0c0e1a]/40 border border-white/[0.08] text-center">
                <p className="text-neutral-400 text-base font-medium mb-2">
                  No components found
                </p>
                <p className="text-neutral-500 text-xs max-w-sm mb-4">
                  Try searching with different terms or selecting another category.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategoryIndex(0);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
