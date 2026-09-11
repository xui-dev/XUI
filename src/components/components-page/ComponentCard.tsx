"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Eye, ArrowUpRight, Terminal, Check, Copy } from "lucide-react";
import type { ComponentItem } from "@/data/componentsData";
import ComponentLivePreview from "./ComponentLivePreview";

export interface ComponentCardProps {
  component: ComponentItem;
  locale?: string;
}

export default function ComponentCard({ component, locale = "en" }: ComponentCardProps) {
  const [likes, setLikes] = useState(component.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikes((prev) => (nextIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    // Sync to Supabase in background
    fetch(`/api/stats/${component.id}?action=${nextIsLiked ? "like" : "unlike"}`, {
      method: "POST",
    }).catch(() => {});
  };

  const handleCopyCli = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`npx xui add ${component.id}`);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const title = component.title;
  const description = component.description;

  return (
    <div
      className="group relative flex flex-col rounded-3xl bg-[#0d0f1a]/80 backdrop-blur-2xl border border-white/[0.12] overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:-translate-y-1.5"
      style={{
        boxShadow:
          "0 20px 50px -15px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.16)",
      }}
    >
      {/* Specular Edge Glow on Hover */}
      <div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-b from-blue-600/20 via-transparent to-indigo-600/10" />

      {/* ── 1. Interactive Preview Area ── */}
      <Link
        href={`/components/${component.id}`}
        className="relative h-48 sm:h-56 w-full flex items-center justify-center p-3 sm:p-4 bg-black/40 overflow-hidden border-b border-white/[0.08] cursor-pointer"
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />

        <ComponentLivePreview id={component.id} interactive={false} />

        {/* View overlay pill on card hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-xl translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            Open Details <ArrowUpRight className="w-4 h-4 text-blue-400" />
          </span>
        </div>
      </Link>

      {/* ── 2. Card Info & Footer ── */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3.5 sm:gap-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30">
              {component.categoryLabel}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Quick CLI Copy Button */}
              <button
                type="button"
                onClick={handleCopyCli}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                title={`Copy "npx xui add ${component.id}"`}
              >
                {copiedCli ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span className="text-[11px] hidden xs:inline">CLI</span>
              </button>

              {/* Like Counter Button */}
              <button
                type="button"
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs font-mono transition-colors cursor-pointer px-2 py-1 rounded-lg border ${
                  isLiked
                    ? "text-rose-400 bg-rose-500/10 border-rose-500/30"
                    : "text-neutral-400 hover:text-white bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.08]"
                }`}
                title="Like component"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-transform active:scale-125 ${
                    isLiked ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
                <span>{likes}</span>
              </button>
            </div>
          </div>

          <Link href={`/components/${component.id}`} className="group/link block">
            <h3 className="text-base font-bold text-white group-hover/link:text-blue-300 transition-colors flex items-center gap-1.5">
              {title}
            </h3>
            <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
              {description}
            </p>
          </Link>
        </div>

        {/* Footer Meta: Views + Creator Attribution */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-sm">
              {component.author.charAt(0)}
            </span>
            <span className="text-neutral-300 font-medium">{component.author}</span>
          </div>

          <div className="flex items-center gap-1 text-neutral-500 font-mono text-[11px]">
            <Eye className="w-3.5 h-3.5" />
            <span>{component.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
