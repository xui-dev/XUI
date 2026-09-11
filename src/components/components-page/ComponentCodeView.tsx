"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, Archive, Check, ChevronDown } from "lucide-react";
import type { ComponentItem } from "@/data/componentsData";
import { XUICodeBlock } from "./CodeBlock";
import { downloadComponentZip, downloadComponentMarkdown } from "@/lib/zipExporter";

type Framework = "react" | "html" | "vue" | "svelte";

export interface ComponentCodeViewProps {
  component: ComponentItem;
  locale?: string;
}

export default function ComponentCodeView({
  component,
}: ComponentCodeViewProps) {
  const [activeFramework, setActiveFramework] = useState<Framework>("react");
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [isDownloadingMd, setIsDownloadingMd] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    try {
      await downloadComponentZip({
        title: component.title,
        slug: component.slug,
        reactCode: component.reactCode,
        htmlCode: component.htmlCode,
        cssCode: component.cssCode,
        jsCode: component.jsCode,
        vueCode: component.vueCode,
        svelteCode: component.svelteCode,
        dependencies: component.dependencies,
      });
    } catch (err) {
      console.error("Failed to download zip", err);
    } finally {
      setTimeout(() => setIsDownloadingZip(false), 1200);
    }
  };

  const handleDownloadMd = () => {
    setIsDownloadingMd(true);
    try {
      downloadComponentMarkdown({
        title: component.title,
        slug: component.slug,
        reactCode: component.reactCode,
        htmlCode: component.htmlCode,
        cssCode: component.cssCode,
        jsCode: component.jsCode,
        vueCode: component.vueCode,
        svelteCode: component.svelteCode,
        dependencies: component.dependencies,
      });
    } catch (err) {
      console.error("Failed to download markdown", err);
    } finally {
      setTimeout(() => setIsDownloadingMd(false), 1200);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* ── Top Bar: Framework Selector & Download Actions ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2.5 rounded-2xl bg-[#0d0f1a]/85 backdrop-blur-2xl border border-white/[0.12] shadow-xl">
        {/* Framework Tabs Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {/* 1. React */}
          <button
            type="button"
            onClick={() => setActiveFramework("react")}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
              activeFramework === "react"
                ? "bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.35)]"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            <svg className="w-4 h-4 text-[#00D8FF] shrink-0" viewBox="0 0 115.3 100" fill="currentColor">
              <ellipse cx="57.65" cy="50" rx="16.7" ry="16.7" fill="#00D8FF" />
              <path
                d="M57.65,0 C42.75,0 30.7,22.4 30.7,50 C30.7,77.6 42.75,100 57.65,100 C72.55,100 84.6,77.6 84.6,50 C84.6,22.4 72.55,0 57.65,0 Z"
                fill="none"
                stroke="#00D8FF"
                strokeWidth="6"
                transform="rotate(30 57.65 50)"
              />
              <path
                d="M57.65,0 C42.75,0 30.7,22.4 30.7,50 C30.7,77.6 42.75,100 57.65,100 C72.55,100 84.6,77.6 84.6,50 C84.6,22.4 72.55,0 57.65,0 Z"
                fill="none"
                stroke="#00D8FF"
                strokeWidth="6"
                transform="rotate(90 57.65 50)"
              />
              <path
                d="M57.65,0 C42.75,0 30.7,22.4 30.7,50 C30.7,77.6 42.75,100 57.65,100 C72.55,100 84.6,77.6 84.6,50 C84.6,22.4 72.55,0 57.65,0 Z"
                fill="none"
                stroke="#00D8FF"
                strokeWidth="6"
                transform="rotate(150 57.65 50)"
              />
            </svg>
            <span>React</span>
          </button>

          {/* 2. HTML / CSS / JS */}
          <button
            type="button"
            onClick={() => setActiveFramework("html")}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
              activeFramework === "html"
                ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.25)]"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            <span className="w-4 h-4 rounded bg-[#F7DF1E] text-black text-[9px] font-black flex items-center justify-center shrink-0">
              JS
            </span>
            <span>HTML / CSS / JS</span>
          </button>

          {/* 3. Vue */}
          <button
            type="button"
            onClick={() => setActiveFramework("vue")}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
              activeFramework === "vue"
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 261.76 226.69" fill="none">
              <path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#42B883" />
              <path d="M161.096.001l-30.225 52.351L100.647.001H52.246l78.626 136.181L209.497.001z" fill="#35495E" />
            </svg>
            <span>Vue</span>
          </button>

          {/* 4. Svelte */}
          <button
            type="button"
            onClick={() => setActiveFramework("svelte")}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
              activeFramework === "svelte"
                ? "bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                : "text-neutral-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
            }`}
          >
            <svg className="w-4 h-4 text-[#FF3E00] shrink-0" viewBox="0 0 98.1 118" fill="currentColor">
              <path d="M91.2 19.8C85.5 10 74.3 3.6 62.1 2.4c-12.7-1.3-25 3.3-33.8 12.5L14.7 29C6.4 37.7 2.1 49.3 2.8 61.2c.7 11.8 6.4 22.8 15.6 29.9l6.7 5.2c-1.3-3.6-1.7-7.4-1.2-11.2.9-7.3 4.8-13.8 10.7-18l13.6-9.7c3.8-2.7 6.2-7 6.5-11.7.3-4.7-1.6-9.2-5.1-12.3-3.5-3-8.2-4.2-12.7-3.3-4.5.9-8.4 3.7-10.7 7.6l-5.6-4.5c4-6.4 10.4-10.9 17.8-12.4 7.4-1.5 15.2.4 21 5.3 5.8 4.9 9 12.2 8.6 19.8-.4 7.6-4.3 14.6-10.5 19l-13.6 9.7c-3.8 2.7-6.2 7-6.5 11.7-.3 4.7 1.6 9.2 5.1 12.3 3.5 3 8.2 4.2 12.7 3.3 4.5-.9 8.4-3.7 10.7-7.6l5.6 4.5c-4 6.4-10.4 10.9-17.8 12.4-7.4 1.5-15.2-.4-21-5.3-5.8-4.9-9-12.2-8.6-19.8" />
            </svg>
            <span>Svelte</span>
          </button>
        </div>

        {/* Download Dropdown Menu */}
        <div className="relative shrink-0 self-end sm:self-auto" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] text-white transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                isDownloadOpen ? "rotate-180 text-white" : ""
              }`}
            />
          </button>

          {isDownloadOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-48 p-1.5 rounded-2xl bg-[#0f111e]/95 backdrop-blur-2xl border border-white/[0.14] shadow-2xl z-50 flex flex-col gap-1"
              style={{
                boxShadow:
                  "0 20px 40px -10px rgba(0, 0, 0, 0.9), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
              }}
            >
              {/* Option 1: ZIP */}
              <button
                type="button"
                onClick={() => {
                  handleDownloadZip();
                  setIsDownloadOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left"
              >
                {isDownloadingZip ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Archive className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <div className="flex flex-col">
                  <span>ZIP</span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    {isDownloadingZip ? "Downloading..." : "All framework files"}
                  </span>
                </div>
              </button>

              {/* Option 2: Md file */}
              <button
                type="button"
                onClick={() => {
                  handleDownloadMd();
                  setIsDownloadOpen(false);
                }}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer text-left"
              >
                {isDownloadingMd ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                )}
                <div className="flex flex-col">
                  <span>Md file</span>
                  <span className="text-[10px] text-neutral-400 font-normal">
                    {isDownloadingMd ? "Downloading..." : "Docs & code"}
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Code Display Container ── */}
      {/* 1. React View */}
      {activeFramework === "react" && (
        <XUICodeBlock
          code={component.reactCode}
          language="tsx"
          filename={`${capitalize(component.slug)}.tsx`}
          frameworkBadge="React"
          badgeColor="text-blue-400 bg-blue-500/15 border-blue-500/30"
        />
      )}

      {/* 2. HTML / CSS / JS View (3 Stacked Blocks as requested in wireframe) */}
      {activeFramework === "html" && (
        <div className="flex flex-col gap-5">
          {/* HTML Block */}
          <XUICodeBlock
            code={component.htmlCode}
            language="html"
            filename="index.html"
            frameworkBadge="HTML"
            badgeColor="text-orange-400 bg-orange-500/10 border-orange-500/20"
          />

          {/* CSS Block */}
          <XUICodeBlock
            code={component.cssCode}
            language="css"
            filename="styles.css"
            frameworkBadge="CSS"
            badgeColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
          />

          {/* JS Block */}
          <XUICodeBlock
            code={component.jsCode}
            language="javascript"
            filename="script.js"
            frameworkBadge="JavaScript"
            badgeColor="text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
          />
        </div>
      )}

      {/* 3. Vue View */}
      {activeFramework === "vue" && (
        <XUICodeBlock
          code={component.vueCode}
          language="html"
          filename={`${capitalize(component.slug)}.vue`}
          frameworkBadge="Vue"
          badgeColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
      )}

      {/* 4. Svelte View */}
      {activeFramework === "svelte" && (
        <XUICodeBlock
          code={component.svelteCode}
          language="html"
          filename={`${capitalize(component.slug)}.svelte`}
          frameworkBadge="Svelte"
          badgeColor="text-orange-400 bg-orange-500/10 border-orange-500/20"
        />
      )}
    </div>
  );
}

function capitalize(str: string) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
