"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bookmark, Layers, ArrowLeft, ArrowUpRight } from "lucide-react";
import { COMPONENTS_DATA } from "@/data/componentsData";
import ComponentCard from "@/components/components-page/ComponentCard";

export default function SavedPage() {
  // Currently floating dock is available
  const savedComponents = COMPONENTS_DATA.slice(0, 1);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 flex flex-col">
      <Navbar />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-28 left-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[180px]" />
      </div>

      <main className="relative z-10 flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex flex-col gap-8">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                <Bookmark className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Saved Components
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Your Bookmarked Library
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Components you have saved for quick access and integration.
            </p>
          </div>

          <Link
            href="/components"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-all w-fit self-start sm:self-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse All Components</span>
          </Link>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedComponents.map((component) => (
            <ComponentCard key={component.id} component={component} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
