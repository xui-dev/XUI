"use client";

import React, { useState } from "react";
import {
  Heart,
  Bookmark,
  Share2,
  Eye,
  Terminal,
} from "lucide-react";
import type { ComponentItem } from "@/data/componentsData";
import ComponentLivePreview from "./ComponentLivePreview";
import ShareModal from "./ShareModal";
import { useComponentStats } from "@/hooks/useComponentStats";

export interface ComponentPreviewViewProps {
  component: ComponentItem;
  locale?: string;
}

export default function ComponentPreviewView({
  component,
  locale = "en",
}: ComponentPreviewViewProps) {
  const { likes, views, isLiked, toggleLike } = useComponentStats(
    component.id,
    component.likes,
    component.views
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleSave = () => {
    setIsSaved((prev) => !prev);
  };

  const title = component.title;
  const description = component.description;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* ── 1. Main Interactive Preview Playground ── */}
      <div
        className="relative w-full rounded-3xl bg-[#0b0d18]/90 backdrop-blur-2xl border border-white/[0.12] overflow-hidden transition-all shadow-2xl"
        style={{
          boxShadow:
            "0 30px 70px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)",
        }}
      >
        {/* Live Canvas Area */}
        <div
          className="relative min-h-[300px] sm:min-h-[440px] flex items-center justify-center p-4 sm:p-8 transition-colors duration-300 overflow-hidden"
          style={{
            backgroundColor: "#090b14",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />

          <ComponentLivePreview id={component.id} interactive={true} />
        </div>
      </div>

      {/* ── 2. Action & Stats Bar (Responsive 2-tier on mobile, 1-tier on desktop) ── */}
      <div
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 sm:px-5 sm:py-3 rounded-2xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] shadow-xl"
        style={{
          boxShadow:
            "0 15px 35px -10px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)",
        }}
      >
        {/* Tier 1: Action Buttons: Like, Save, Share (Full width grid on mobile) */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto">
          {/* Like button */}
          <button
            type="button"
            onClick={toggleLike}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer border active:scale-95 ${
              isLiked
                ? "bg-rose-500/15 border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] text-neutral-300 hover:text-white"
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-neutral-400"
              }`}
            />
            <span>{likes}</span>
          </button>

          {/* Save / Bookmark button */}
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border active:scale-95 ${
              isSaved
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                : "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1] text-neutral-300 hover:text-white"
            }`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isSaved ? "fill-blue-400 text-blue-400" : "text-neutral-400"
              }`}
            />
            <span>{isSaved ? "Saved" : "Save"}</span>
          </button>

          {/* Share button */}
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 sm:py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-neutral-300 hover:text-white transition-all cursor-pointer active:scale-95"
            title="Share component"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span>Share</span>
          </button>
        </div>

        {/* Tier 2: Stats & Creator Attribution */}
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/[0.06] w-full sm:w-auto">
          {/* Views count */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
            <Eye className="w-4 h-4 text-neutral-500" />
            <span>Views {component.views}</span>
          </div>

          {/* Hairline divider */}
          <div className="w-px h-4 bg-white/10 hidden sm:block" />

          {/* Creator Attribution */}
          <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
              {component.author.charAt(0)}
            </div>
            <span className="text-[11px] sm:text-xs text-neutral-300 font-medium">
              Created by <strong className="text-white font-semibold">{component.author}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. Secondary Details / Documentation Box ── */}
      <div
        className="rounded-3xl bg-[#0c0e18]/80 backdrop-blur-xl border border-white/[0.1] p-6 sm:p-8 flex flex-col gap-6"
        style={{
          boxShadow:
            "0 20px 50px -15px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold px-2.5 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30">
                {component.categoryLabel}
              </span>
              <span className="text-xs text-neutral-500 font-mono">Production Ready</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
          </div>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed max-w-3xl">
          {description}
        </p>

        {/* Installation Command Snippet */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            Installation & Dependencies
          </span>
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/60 border border-white/[0.08] font-mono text-xs text-neutral-300">
            <code>npm install {component.dependencies.join(" ")}</code>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(`npm install ${component.dependencies.join(" ")}`);
              }}
              className="text-[11px] text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* ── Share Modal Popup ── */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        componentId={component.id}
        title={title}
        description={description}
      />
    </div>
  );
}
