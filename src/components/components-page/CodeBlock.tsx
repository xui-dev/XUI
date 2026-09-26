"use client";

import React, { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

export interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className = "" }: CodeBlockProps) {
  return (
    <div
      className={`relative w-full rounded-2xl bg-[#0a0c16]/95 border border-white/[0.12] transition-all duration-200 ${className}`}
      style={{
        boxShadow:
          "0 20px 50px -10px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Specular Top Sheen */}
      <div className="pointer-events-none absolute inset-x-6 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      {children}
    </div>
  );
}

export interface CodeBlockGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlockGroup({ children, className = "" }: CodeBlockGroupProps) {
  return (
    <div
      className={`flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-4 py-2.5 backdrop-blur-md ${className}`}
    >
      {children}
    </div>
  );
}

export interface CodeBlockCodeProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export function CodeBlockCode({
  code,
  language = "tsx",
  showLineNumbers = true,
}: CodeBlockCodeProps) {
  const lines = code.trim().split("\n");

  return (
    <div className="relative overflow-x-auto p-3 sm:p-4 font-mono text-[11px] sm:text-[13px] leading-relaxed text-neutral-300 selection:bg-blue-600/30 selection:text-blue-200 touch-scroll-x no-scrollbar">
      <pre className="m-0 flex flex-col font-mono min-w-max">
        {lines.map((line, idx) => (
          <div key={idx} className="table-row group">
            {showLineNumbers && (
              <span className="table-cell select-none pr-2 sm:pr-4 text-right font-mono text-[10px] sm:text-xs text-neutral-600 group-hover:text-neutral-500 w-6 sm:w-8 shrink-0">
                {idx + 1}
              </span>
            )}
            <span className="table-cell whitespace-pre font-mono">
              {formatSyntaxHighlight(line, language)}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

// Simple deterministic syntax highlighter for rich presentation
function formatSyntaxHighlight(line: string, _lang: string): React.ReactNode {
  // If comment
  if (line.trim().startsWith("//") || line.trim().startsWith("/*") || line.trim().startsWith("*")) {
    return <span className="text-neutral-500 italic">{line}</span>;
  }

  // Tokens regex for keywords, strings, tags, types
  const parts = line.split(
    /(\b(?:import|export|from|default|function|const|let|var|return|if|else|type|interface|class|true|false|null|undefined|async|await|script|style|template)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|<\/?[A-Za-z0-9_.-]+(?:\s|>|\/)|[{}\(\)\[\];=><+\-*\/&|!?:.,])/g
  );

  return parts.map((part, i) => {
    if (!part) return null;

    // Strings
    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'")) ||
      (part.startsWith("`") && part.endsWith("`"))
    ) {
      return (
        <span key={i} className="text-emerald-400">
          {part}
        </span>
      );
    }

    // Keywords
    if (
      /^(import|export|from|default|function|const|let|var|return|if|else|type|interface|class|true|false|null|undefined|async|await)$/.test(
        part
      )
    ) {
      return (
        <span key={i} className="text-purple-400 font-semibold">
          {part}
        </span>
      );
    }

    // HTML / JSX tags
    if (part.startsWith("<") || part.startsWith("</")) {
      return (
        <span key={i} className="text-blue-400">
          {part}
        </span>
      );
    }

    // Punctuation & operators
    if (/^[{}()\[\];,=><+\-*\/&!?:.]$/.test(part)) {
      return (
        <span key={i} className="text-neutral-400">
          {part}
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

// Complete Ready-To-Use CodeBlock with Header and Copy action
export interface XUICodeBlockProps {
  code: string;
  language?: string;
  filename: string;
  frameworkBadge: string;
  badgeColor?: string;
  /** accent bar color on the left edge of the header (tailwind bg class) */
  accentBar?: string;
  /** Extra action buttons rendered after the Copy button in the header */
  extraActions?: React.ReactNode;
}

export function XUICodeBlock({
  code,
  language = "tsx",
  filename,
  frameworkBadge,
  badgeColor = "text-blue-400 bg-blue-500/15 border-blue-500/30",
  accentBar = "bg-blue-500",
  extraActions,
}: XUICodeBlockProps) {
  return (
    <CodeBlock className="w-full shadow-2xl">
      {/* ── Header ── */}
      <div className="relative flex items-center justify-between px-4 py-0 border-b border-white/[0.07] min-h-[44px] overflow-visible">

        {/* Subtle header background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.035) 0%, transparent 60%)",
          }}
        />

        {/* Left: badge + filename */}
        <div className="relative flex items-center gap-3 pl-3">
          {/* Framework badge pill */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold border tracking-wide ${badgeColor}`}
          >
            {frameworkBadge}
          </span>

          {/* Separator */}
          <span className="text-white/[0.12] text-sm select-none">/</span>

          {/* Filename */}
          <span className="text-neutral-300 text-xs font-mono tracking-tight">
            {filename}
          </span>
        </div>

        {/* Right: actions */}
        <div className="relative flex items-center gap-2 py-2.5">
          <CopyButton
            text={code}
            className="px-2.5 py-1 rounded-lg border text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.09]"
          />
          {extraActions}
        </div>
      </div>

      <CodeBlockCode code={code} language={language} />
    </CodeBlock>
  );
}
