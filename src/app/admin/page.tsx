"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CATEGORIES } from "@/data/componentsData";
import ComponentLivePreview from "@/components/components-page/ComponentLivePreview";
import {
  Plus,
  Trash2,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Search,
  SlidersHorizontal,
  AlertTriangle,
  Loader2,
  Sparkles,
  ShieldAlert,
  Code2,
  X,
  Layers,
  Radio,
  ArrowUpRight,
} from "lucide-react";

interface RegistryItem {
  name: string;
  title: string;
  description?: string;
  category?: string;
  categoryLabel?: string;
  dependencies?: string[];
}

const DEFAULT_SAMPLE_CODE = `"use client";

import React, { useState } from "react";

export default function MyNewComponent() {
  const [active, setActive] = useState(false);

  return (
    <div className="flex items-center justify-center p-8 bg-neutral-950 rounded-2xl border border-white/10">
      <button
        onClick={() => setActive(!active)}
        className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg transition-all"
      >
        {active ? "Active" : "Click Me"}
      </button>
    </div>
  );
}`;

export default function AdminPage() {
  const [isLocalhost, setIsLocalhost] = useState<boolean | null>(null);
  const [items, setItems] = useState<RegistryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // New component modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"code" | "preview">("code");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("cards");
  const [dependencies, setDependencies] = useState("lucide-react");
  const [code, setCode] = useState(DEFAULT_SAMPLE_CODE);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishWarning, setPublishWarning] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  // Helper to extract npm dependencies from code
  const extractDeps = (sourceCode: string): string[] => {
    if (!sourceCode) return [];
    const importRegex = /(?:import\s+(?:[\w\s{},*]+from\s+)?['"]|export\s+(?:[\w\s{},*]+from\s+)?['"])([^'"]+)['"]/g;
    const deps = new Set<string>();
    let m;
    while ((m = importRegex.exec(sourceCode)) !== null) {
      const spec = m[1].trim();
      if (
        !spec.startsWith(".") &&
        !spec.startsWith("/") &&
        !spec.startsWith("@/") &&
        !spec.startsWith("http:") &&
        !spec.startsWith("https:") &&
        spec !== "react" &&
        !spec.startsWith("react/") &&
        spec !== "react-dom" &&
        !spec.startsWith("react-dom/")
      ) {
        let pkg = spec;
        if (spec.startsWith("@")) {
          pkg = spec.split("/").slice(0, 2).join("/");
        } else {
          pkg = spec.split("/")[0];
        }
        if (pkg) deps.add(pkg);
      }
    }
    return Array.from(deps);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    const detected = extractDeps(newCode);
    if (detected.length > 0) {
      setDependencies(detected.join(", "));
    }
  };

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Copied CLI feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Check Localhost on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const isLocal =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "[::1]";
      setIsLocalhost(isLocal);
    }
  }, []);

  // 2. Load Registry Components
  const fetchRegistryItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/registry");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch (err) {
      console.error("Failed to load components:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLocalhost) {
      fetchRegistryItems();
    }
  }, [isLocalhost]);

  // Handle title change and slug generation
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const cleanSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const prevExpected = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    if (!id || id === prevExpected) {
      setId(cleanSlug);
    }
  };

  // 3. Handle Publish New Component
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setPublishError(null);
    setPublishWarning(null);
    setPublishSuccess(null);

    try {
      const selectedCat = CATEGORIES.find((c) => c.id === category);

      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title,
          description,
          category,
          categoryLabel: selectedCat?.label || category,
          dependencies: dependencies
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish component.");
      }

      if (data.partial || !data.githubSynced || data.success === false) {
        setPublishWarning(
          data.message ||
            data.githubStatus ||
            "Component saved locally, but remote GitHub sync failed."
        );
        fetchRegistryItems();
      } else {
        setPublishSuccess(data.message || "Component published successfully!");
        // Reset form & reload list
        setTimeout(() => {
          setIsAddModalOpen(false);
          setTitle("");
          setId("");
          setDescription("");
          setCode(DEFAULT_SAMPLE_CODE);
          setPublishSuccess(null);
          setPublishWarning(null);
          fetchRegistryItems();
        }, 1200);
      }
    } catch (err: any) {
      setPublishError(err.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  // 4. Handle Delete Component
  const handleDelete = async (componentId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: componentId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete component.");
      }

      if (data.partial || !data.githubSynced || data.success === false) {
        alert(
          `Warning: ${
            data.message ||
            data.githubStatus ||
            "Component deleted locally, but remote GitHub removal failed."
          }`
        );
      }

      setItems((prev) => prev.filter((item) => item.name !== componentId));
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || "Could not delete component.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Copy CLI command
  const handleCopyCli = (componentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`npx xui add ${componentId}`);
    setCopiedId(componentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter components by category and search
  const selectedCategory = CATEGORIES[activeCategoryIndex] || CATEGORIES[0];
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory.id === "all" || item.category === selectedCategory.id;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // If loading localhost check
  if (isLocalhost === null) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // If not localhost, restrict access strictly
  if (!isLocalhost) {
    return (
      <div className="min-h-screen bg-black text-white selection:bg-red-600/30 selection:text-red-200 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-24">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#0e101c]/90 border border-red-500/30 text-center shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              The XUI Admin Control Panel is exclusively accessible from your
              local development environment (<code className="text-red-400 font-mono">http://localhost</code>).
            </p>
            <Link
              href="/components"
              className="mt-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold transition-all"
            >
              Return to Components
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Render Localhost Admin Dashboard ──
  return (
    <div
      dir="ltr"
      className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 flex flex-col"
    >
      <Navbar />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-60 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 flex-1 pt-24 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 xl:px-10 max-w-[1720px] mx-auto w-full flex flex-col gap-8">
        {/* ── Top Dashboard Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Localhost Admin Panel
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/[0.08] text-neutral-300">
                {items.length} Components in Registry
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Component Registry Manager
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl">
              Inspect, add, and delete components directly in your local registry and synced GitHub cloud repository.
            </p>
          </div>

          {/* Action Button: Add Component */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_24px_rgba(37,99,235,0.45)] cursor-pointer active:scale-95 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Component</span>
          </button>
        </div>

        {/* ── Search & Filter Area (Identical to /components) ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          {/* Left Sidebar: Categories & Search */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            {/* Search Box */}
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registry..."
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/60 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {CATEGORIES.map((cat, idx) => {
                const isSelected = activeCategoryIndex === idx;
                const count =
                  cat.id === "all"
                    ? items.length
                    : items.filter((c) => c.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-md border border-blue-400/40"
                        : "bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    <span>{cat.label}</span>
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
          </aside>

          {/* Right Column: Registry Grid with Admin Controls */}
          <section className="flex-1 w-full flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  {selectedCategory.label}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-white/[0.08] text-neutral-300">
                  {filteredItems.length}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredItems.map((comp) => (
                  <div
                    key={comp.name}
                    className="group relative flex flex-col rounded-3xl bg-[#0d0f1a]/85 backdrop-blur-2xl border border-white/[0.12] overflow-hidden transition-all duration-300 hover:border-blue-500/50 shadow-xl"
                  >
                    {/* Live Preview Area */}
                    <div className="relative h-64 sm:h-72 lg:h-80 w-full flex items-center justify-center bg-black/40 overflow-hidden border-b border-white/[0.08]">
                      <ComponentLivePreview id={comp.name} interactive={false} />
                    </div>

                    {/* Content & Metadata */}
                    <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20">
                            {comp.categoryLabel || comp.category || "Component"}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">
                            {comp.name}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                          {comp.title}
                        </h3>
                        {comp.description && (
                          <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                            {comp.description}
                          </p>
                        )}
                      </div>

                      {/* Admin Action Bar */}
                      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                        {/* Copy CLI */}
                        <button
                          type="button"
                          onClick={(e) => handleCopyCli(comp.name, e)}
                          title="Copy CLI install command"
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition-all cursor-pointer"
                        >
                          {copiedId === comp.name ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Terminal className="w-3.5 h-3.5 text-blue-400" />
                          )}
                          <span className="text-[10px]">
                            {copiedId === comp.name ? "Copied" : "xui add"}
                          </span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          {/* View Page */}
                          <Link
                            href={`/components/${comp.name}`}
                            target="_blank"
                            title="View component detail page"
                            className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-neutral-300 hover:text-white transition-all"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingId(comp.name)}
                            title="Delete component from registry"
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-all cursor-pointer active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl bg-[#0c0e1a]/40 border border-white/[0.08] text-center">
                <p className="text-neutral-400 text-sm font-medium mb-2">
                  No components found in registry.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
                >
                  Create First Component
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* ── Add Component Modal ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 28,
              }}
              className="relative z-10 w-full max-w-3xl my-auto rounded-3xl bg-[#0d0f1a] border border-white/[0.15] p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    Publish New Component
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Saves to local registry and commits directly to GitHub repo.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {publishError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs">
                {publishError}
              </div>
            )}

            {publishWarning && (
              <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <div className="flex-1 leading-relaxed">
                  <div className="font-semibold text-amber-200">GitHub Sync Warning</div>
                  <div>{publishWarning}</div>
                </div>
              </div>
            )}

            {publishSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{publishSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePublish} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Component Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Kinetic Cyber Button"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a12] border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Component ID (slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="e.g. kinetic-cyber-button"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a12] border border-white/[0.12] text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a12] border border-white/[0.12] text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-[#0e101c]">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Dependencies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={dependencies}
                    onChange={(e) => setDependencies(e.target.value)}
                    placeholder="lucide-react, motion"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a12] border border-white/[0.12] text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of the kinetic behavior and features..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090a12] border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded bg-[#3178C6] text-white text-[8px] font-black flex items-center justify-center shrink-0">TS</span>
                      Component Code *
                    </span>
                  </label>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setModalTab("code")}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        modalTab === "code"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Code Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab("preview")}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        modalTab === "preview"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>

                {modalTab === "code" ? (
                  <>
                    <textarea
                      rows={12}
                      required
                      value={code}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      placeholder="Write or paste your React + TypeScript or styled-components component code here..."
                      className="w-full p-4 rounded-xl bg-[#07080e] border border-blue-500/30 font-mono text-xs text-blue-200 focus:outline-none focus:border-blue-500 leading-relaxed resize-y"
                      spellCheck={false}
                    />
                    {dependencies && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-neutral-400">Detected Dependencies:</span>
                        {dependencies.split(",").map((d) => d.trim()).filter(Boolean).map((dep) => (
                          <span
                            key={dep}
                            className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/25 text-[10px] text-blue-300 font-mono"
                          >
                            {dep}
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full min-h-[320px] rounded-xl bg-[#07080e] border border-white/[0.1] p-2 flex items-center justify-center overflow-hidden">
                    <ComponentLivePreview
                      id={id || "modal-preview"}
                      code={code}
                      interactive={true}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-lg cursor-pointer"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Publish Component</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ── */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setDeletingId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 28,
              }}
              className="relative z-10 w-full max-w-md my-auto rounded-3xl bg-[#0d0f1a] border border-red-500/30 p-6 shadow-2xl flex flex-col gap-4"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Delete Component?
                </h3>
                <p className="text-xs text-neutral-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <code className="text-red-400 font-mono font-bold bg-red-500/10 px-1.5 py-0.5 rounded">
                {deletingId}
              </code>{" "}
              from the registry and GitHub repository?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer shadow-lg"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span>Delete Permanently</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
