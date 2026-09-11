"use client";

import React, { useState } from "react";
import { Home, Compass, Layers, Sparkles, Settings } from "lucide-react";

export interface ComponentLivePreviewProps {
  id: string;
  interactive?: boolean;
  scale?: number;
}

export default function ComponentLivePreview({
  id,
}: ComponentLivePreviewProps) {
  // 1. Floating Liquid Dock (Dynamic Floating Dock)
  if (id === "dynamic-floating-dock") {
    return <FloatingDockPreview />;
  }

  // Fallback for future components
  return (
    <div className="flex items-center justify-center p-8 text-neutral-400 text-sm">
      Interactive Preview
    </div>
  );
}

// ── Floating Dock Preview ──

function FloatingDockPreview() {
  const [hovered, setHovered] = useState<number | null>(null);
  const items = [Home, Compass, Layers, Sparkles, Settings];

  return (
    <div className="flex items-center justify-center p-6">
      <nav className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#121218]/90 backdrop-blur-2xl border border-white/[0.15] shadow-[0_16px_40px_rgba(0,0,0,0.7)]">
        {items.map((Icon, i) => {
          const isHovered = hovered === i;
          return (
            <button
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className={`p-2 rounded-xl text-neutral-400 transition-all duration-200 cursor-pointer ${
                isHovered
                  ? "scale-125 text-blue-400 bg-white/[0.1] -translate-y-1"
                  : "hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
