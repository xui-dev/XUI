"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CATEGORIES } from "@/data/componentsData";
import {
  UploadCloud,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  Code2,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

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
  const [secretKey, setSecretKey] = useState("xui-admin-2026");
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [category, setCategory] = useState("cards");
  const [dependencies, setDependencies] = useState("lucide-react");
  const [code, setCode] = useState(DEFAULT_SAMPLE_CODE);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  // Auto-generate slug from title if id is empty
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!id || id === title.toLowerCase().replace(/[^a-z0-9]/g, "-")) {
      setId(val.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-"));
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const selectedCat = CATEGORIES.find((c) => c.id === category);

      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secretKey,
          id,
          title,
          titleAr,
          description,
          descriptionAr,
          category,
          categoryLabel: selectedCat?.label || category,
          categoryLabelAr: selectedCat?.labelAr || category,
          dependencies: dependencies.split(",").map((s) => s.trim()).filter(Boolean),
          code,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish component.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const copyCli = () => {
    if (!result?.cliCommand) return;
    navigator.clipboard.writeText(result.cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 flex flex-col">
      <Navbar />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-28 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-60 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                XUI Control Panel
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Publish Component to Registry
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Add new React components directly to the GitHub Registry and Supabase.
            </p>
          </div>

          <Link
            href="/components"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-neutral-300 hover:text-white transition-all w-fit"
          >
            <span>View Catalog</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
          </Link>
        </div>

        {/* Success Banner */}
        {result && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {result.message}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Status: {result.githubStatus}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-black/60 border border-emerald-500/20 font-mono text-xs">
              <div className="flex items-center gap-2 text-emerald-200">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>{result.cliCommand}</span>
              </div>
              <button
                type="button"
                onClick={copyCli}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedCli ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCli ? "Copied" : "Copy CLI"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="text-xs">{error}</p>
          </div>
        )}

        {/* Publish Form */}
        <form onSubmit={handlePublish} className="flex flex-col gap-6">
          {/* Section 1: Security & Auth */}
          <div className="p-5 rounded-2xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex flex-col gap-4">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Admin Secret Key (ADMIN_SECRET_KEY)</span>
            </label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter your admin secret key"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Section 2: Component Meta */}
          <div className="p-6 rounded-2xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex flex-col gap-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Component Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Neon Glow Button"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  Title (Arabic)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="مثال: زر التوهج النيوني"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  Unique Slug (ID) *
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. neon-glow-button"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-neutral-900 text-white">
                      {cat.label} ({cat.labelAr})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of this component..."
                  className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                  Description (Arabic)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="وصف مختصر للمكون بالعربية..."
                  className="w-full px-4 py-2 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-neutral-400 block mb-1.5">
                NPM Dependencies (comma separated)
              </label>
              <input
                type="text"
                value={dependencies}
                onChange={(e) => setDependencies(e.target.value)}
                placeholder="e.g. lucide-react, motion"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/[0.12] text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 3: React Source Code */}
          <div className="p-6 rounded-2xl bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.1] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>React Component Source Code *</span>
              </label>
              <span className="text-xs text-neutral-500 font-mono">
                {code.split("\n").length} lines
              </span>
            </div>

            <textarea
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              spellCheck={false}
              className="w-full p-4 rounded-xl bg-black/80 border border-white/[0.12] text-xs font-mono text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-blue-500 leading-relaxed"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_10px_30px_rgba(37,99,235,0.35)] transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Publishing to Registry & GitHub...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Publish Component to XUI Registry</span>
              </>
            )}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
