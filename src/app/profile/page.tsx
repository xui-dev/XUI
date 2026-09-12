"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  Layers,
  Bookmark,
  Heart,
  LogOut,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function ProfilePage() {
  const { user, signOut, openAuthModal } = useAuth();
  const { messages } = useLanguage();

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="p-4 mb-4 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.3)]">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sign in to view Profile</h2>
          <p className="text-sm text-neutral-400 mb-6">
            Please sign in to access your personal developer dashboard and saved components.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("signin")}
            className="w-full py-3 px-5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg cursor-pointer"
          >
            Sign In Now
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const userMeta = user.user_metadata || {};
  const fullName = userMeta.full_name || userMeta.name || user.email?.split("@")[0] || "Developer";
  const avatarUrl = userMeta.avatar_url || userMeta.picture || null;
  const initial = fullName.charAt(0).toUpperCase();
  const provider = user.app_metadata?.provider || "email";
  const createdAt = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Recent";

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-600/30 selection:text-blue-200 flex flex-col">
      <Navbar />

      {/* Ambient background glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute top-28 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[160px]" />
        <div className="absolute top-60 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px]" />
      </div>

      <main className="relative z-10 flex-1 pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col gap-8">
        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0e101c]/80 backdrop-blur-2xl border border-white/[0.12] shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={fullName}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl font-extrabold text-white">{initial}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {fullName}
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {provider}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-mono">
                {user.email}
              </p>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {createdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link
              href="/settings"
              className="flex-1 sm:flex-initial text-center px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white transition-all"
            >
              Edit Settings
            </Link>

            <button
              type="button"
              onClick={() => signOut()}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Nav Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/saved"
            className="group p-5 rounded-2xl bg-[#0e101c]/60 hover:bg-[#121524]/80 border border-white/[0.08] hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/25">
                <Bookmark className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 group-hover:text-amber-400 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">Saved Components</h3>
              <p className="text-xs text-neutral-400">Quick access to bookmarked items</p>
            </div>
          </Link>

          <Link
            href="/components"
            className="group p-5 rounded-2xl bg-[#0e101c]/60 hover:bg-[#121524]/80 border border-white/[0.08] hover:border-blue-500/40 transition-all shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/25">
                <Layers className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">Explore Catalog</h3>
              <p className="text-xs text-neutral-400">Browse next-gen kinetic components</p>
            </div>
          </Link>

          <Link
            href="/docs"
            className="group p-5 rounded-2xl bg-[#0e101c]/60 hover:bg-[#121524]/80 border border-white/[0.08] hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between h-36"
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                <Sparkles className="w-5 h-5" />
              </span>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">Documentation</h3>
              <p className="text-xs text-neutral-400">CLI installation & framework guides</p>
            </div>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
