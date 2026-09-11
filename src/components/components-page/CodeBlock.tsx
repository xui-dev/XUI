"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className = "" }: CodeBlockProps) {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-[#0a0c16]/95 border border-white/[0.12] transition-all duration-200 ${className}`}
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
  badgeColor?: string; // hex or tailwind text/bg
}

export function XUICodeBlock({
  code,
  language = "tsx",
  filename,
  frameworkBadge,
  badgeColor = "text-blue-400 bg-blue-500/15 border-blue-500/30",
}: XUICodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <CodeBlock className="w-full shadow-2xl">
      <CodeBlockGroup className="border-b border-white/[0.08] py-2.5 px-4">
        {/* Badge + Filename */}
        <div className="flex items-center gap-2.5">
          <div
            className={`rounded-md px-2 py-0.5 text-xs font-semibold border ${badgeColor}`}
          >
            {frameworkBadge}
          </div>
          <span className="text-neutral-400 text-xs font-mono">{filename}</span>
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all duration-150 border cursor-pointer active:scale-95 text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.1]"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </CodeBlockGroup>

      <CodeBlockCode code={code} language={language} />
    </CodeBlock>
  );
}
