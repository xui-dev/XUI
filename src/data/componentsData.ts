export type ComponentCategory =
  | "all"
  | "checkboxes"
  | "toggle-switches"
  | "cards"
  | "loaders"
  | "inputs"
  | "forms"
  | "patterns"
  | "footer"
  | "navbar"
  | "background"
  | "3d-web-templates";

export interface ComponentItem {
  id: string;
  slug: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  category: ComponentCategory;
  categoryLabel: string;
  categoryLabelAr?: string;
  author: string;
  authorHandle: string;
  authorAvatar: string;
  likes: number;
  views: string;
  dependencies: string[];
  reactCode: string;
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  vueCode: string;
  svelteCode: string;
}

export const CATEGORIES = [
  { id: "all", label: "Overview", labelAr: "نظرة عامة" },
  { id: "checkboxes", label: "Checkboxes", labelAr: "مربعات الاختيار" },
  { id: "toggle-switches", label: "Toggle switches", labelAr: "مفاتيح التبديل" },
  { id: "cards", label: "Cards", labelAr: "بطاقات" },
  { id: "loaders", label: "Loaders", labelAr: "مؤشرات التحميل" },
  { id: "inputs", label: "Inputs", labelAr: "حقول الإدخال" },
  { id: "forms", label: "Forms", labelAr: "نماذج" },
  { id: "patterns", label: "Patterns", labelAr: "أنماط وتصاميم" },
  { id: "footer", label: "Footer", labelAr: "تذييل الصفحة" },
  { id: "navbar", label: "Navbar", labelAr: "أشرطة تنقل" },
  { id: "background", label: "Backgrounds", labelAr: "خلفيات" },
  { id: "3d-web-templates", label: "3D Web Templates", labelAr: "قوالب مواقع 3D" },
] as const;

export const COMPONENTS_DATA: ComponentItem[] = [
  {
    id: "dynamic-floating-dock",
    slug: "dynamic-floating-dock",
    title: "Floating Liquid Dock",
    titleAr: "شريط التنقل الزجاجي العائم",
    description: "Smooth Apple-inspired floating navigation dock with magnification kinetics and specular glass reflections.",
    descriptionAr: "شريط تنقل عائم مستوحى من نظام آبل مع تكبير فيزيائي متناسق وانعكاسات زجاجية ناعمة.",
    category: "navbar",
    categoryLabel: "Navbar",
    categoryLabelAr: "أشرطة تنقل",
    author: "Aymen",
    authorHandle: "@aymen_dev",
    authorAvatar: "/XUI.png",
    likes: 1830,
    views: "28k",
    dependencies: ["lucide-react"],
    reactCode: `"use client";

import React, { useState } from "react";
import { Home, Compass, Layers, Sparkles, Settings } from "lucide-react";

const NAV_ITEMS = [
  { icon: Home, label: "Home" },
  { icon: Compass, label: "Explore" },
  { icon: Layers, label: "Components" },
  { icon: Sparkles, label: "Showcase" },
  { icon: Settings, label: "Settings" },
];

export default function FloatingLiquidDock() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <nav className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#121218]/80 backdrop-blur-2xl border border-white/[0.15] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {NAV_ITEMS.map((item, i) => {
        const Icon = item.icon;
        const isHovered = hovered === i;
        return (
          <button
            key={item.label}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative p-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.1] transition-all duration-200 cursor-pointer group"
          >
            <Icon className={\`w-5 h-5 transition-transform duration-200 \${isHovered ? "scale-125 text-blue-400" : ""}\`} />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-[10px] px-2 py-0.5 rounded border border-white/10 pointer-events-none">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}`,
    htmlCode: `<div class="dock-container">
  <button class="dock-btn" data-label="Home">🏠</button>
  <button class="dock-btn" data-label="Explore">🧭</button>
  <button class="dock-btn" data-label="Components">📦</button>
  <button class="dock-btn" data-label="Settings">⚙️</button>
</div>`,
    cssCode: `.dock-container {
  display: flex;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 18px;
  background: rgba(18, 18, 24, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0,0,0,0.7);
}
.dock-btn {
  padding: 10px;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.dock-btn:hover {
  transform: scale(1.3) translateY(-4px);
}`,
    jsCode: `// Floating liquid dock initialized`,
    vueCode: `<template>
  <nav class="dock-container">
    <button v-for="item in items" :key="item" class="dock-btn">{{ item }}</button>
  </nav>
</template>`,
    svelteCode: `<nav class="dock-container">
  <button class="dock-btn">Home</button>
  <button class="dock-btn">Components</button>
</nav>`,
  },
];
