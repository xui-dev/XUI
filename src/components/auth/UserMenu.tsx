"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import {
  LogOut,
  Layers,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const { messages } = useLanguage();
  const t = messages.auth?.userMenu || {};

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const userMetadata = user.user_metadata || {};
  const avatarUrl = userMetadata.avatar_url || userMetadata.picture || null;
  const fullName =
    userMetadata.full_name ||
    userMetadata.name ||
    user.email?.split("@")[0] ||
    "User";
  const userInitial = fullName.charAt(0).toUpperCase();
  const provider = user.app_metadata?.provider || "email";

  return (
    <div className="relative" ref={menuRef}>
      {/* ── Navbar Liquid Glass User Trigger Pill ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative overflow-hidden flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl
                   bg-white/[0.08] hover:bg-white/[0.15] active:bg-white/[0.2]
                   border border-white/20 hover:border-white/35
                   shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),0_4px_12px_rgba(0,0,0,0.4)]
                   transition-all duration-200 cursor-pointer"
        aria-expanded={isOpen}
      >
        {/* Specular sheen */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-xl" />

        {/* User Avatar */}
        <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-white/30 bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              width={28}
              height={28}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-xs font-bold text-white">{userInitial}</span>
          )}
        </div>

        {/* Name / Short label */}
        <span className="text-xs font-semibold text-neutral-200 group-hover:text-white max-w-[90px] sm:max-w-[120px] truncate">
          {fullName}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dropdown Menu (Liquid Glass Aesthetic) ── */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-3xl p-3 bg-[#0e121c]/85 backdrop-blur-3xl border border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] z-50 animate-in fade-in zoom-in-95 duration-200">
          {/* Top specular highlight */}
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          {/* User Details Header */}
          <div className="p-2.5 mb-2 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/25 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {userInitial}
                  </span>
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-white truncate">
                  {fullName}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Provider Pill */}
            <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/[0.06] text-[10px] font-mono text-neutral-400">
              <span className="uppercase">{provider}</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-1 mb-2">
            <Link
              href="/components"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{messages.navbar?.links?.components || "Components"}</span>
            </Link>

            {user.email?.toLowerCase() === (process.env.NEXT_PUBLIC_ADMIN_EMAIL || "xui.dev.off@gmail.com").toLowerCase() && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Admin Dashboard</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200">
                  Admin
                </span>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.08] my-1" />

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              signOut();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.signOut || "Sign Out"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
