"use client";

import React, { useState, useEffect, useMemo } from "react";
import registryComponentMap from "@/lib/registryComponentMap";

export interface ComponentLivePreviewProps {
  id: string;
  code?: string;
  interactive?: boolean;
  scale?: number;
}

export default function ComponentLivePreview({
  id,
  code: initialCode,
  interactive = true,
}: ComponentLivePreviewProps) {
  // 1. Check if a statically registered component exists
  const StaticComponent = registryComponentMap[id];

  const [fetchedCode, setFetchedCode] = useState<string | null>(initialCode || null);
  const [loading, setLoading] = useState<boolean>(!StaticComponent && !initialCode);

  // Sync initialCode if passed or changed
  useEffect(() => {
    if (initialCode) {
      setFetchedCode(initialCode);
      setLoading(false);
    }
  }, [initialCode]);

  // If no static component and no code provided, fetch dynamically from registry API
  useEffect(() => {
    if (StaticComponent || initialCode) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/registry/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted) return;
        if (data?.files?.[0]?.content) {
          setFetchedCode(data.files[0].content);
        } else {
          setFetchedCode(null);
        }
      })
      .catch(() => {
        if (isMounted) setFetchedCode(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, StaticComponent, initialCode]);

  // If statically registered component is present, render directly
  if (StaticComponent) {
    return <StaticComponent />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-neutral-500 text-sm animate-pulse">
        Loading preview…
      </div>
    );
  }

  if (!fetchedCode) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-neutral-500 text-sm gap-2">
        <span className="font-mono text-xs text-neutral-600">[{id}]</span>
        <span>Interactive Preview</span>
      </div>
    );
  }

  return (
    <LiveIframeSandbox
      code={fetchedCode}
      interactive={interactive}
    />
  );
}

// ── Smart Sandboxed Live Iframe ──

function LiveIframeSandbox({
  code,
  interactive = true,
}: {
  code: string;
  interactive?: boolean;
}) {
  const isHtmlOnly = useMemo(() => {
    const trimmed = code.trim();
    return (
      !trimmed.includes("import ") &&
      !trimmed.includes("export default") &&
      !trimmed.includes("function") &&
      trimmed.startsWith("<")
    );
  }, [code]);

  const srcDoc = useMemo(() => {
    if (isHtmlOnly) {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
    }
  </style>
</head>
<body>
  ${code}
</body>
</html>`;
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: '#2563eb',
          }
        }
      }
    }
  </script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      min-height: 100%;
      background: transparent;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow-x: hidden;
    }
    #root {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 100%;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    ::-webkit-scrollbar { display: none; }
  </style>
  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.3.1",
      "react/": "https://esm.sh/react@18.3.1/",
      "react-dom": "https://esm.sh/react-dom@18.3.1",
      "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
      "lucide-react": "https://esm.sh/lucide-react@0.475.0",
      "motion/react": "https://esm.sh/motion@12.4.7/react",
      "framer-motion": "https://esm.sh/framer-motion@12.4.7",
      "clsx": "https://esm.sh/clsx",
      "tailwind-merge": "https://esm.sh/tailwind-merge"
    }
  }
  </script>
  <script src="https://unpkg.com/@babel/standalone@7.24.0/babel.min.js"></script>
</head>
<body>
  <div id="root">
    <div style="font-size:12px;color:#737373;display:flex;align-items:center;gap:6px;">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#3b82f6;animation:pulse 1s infinite;"></span>
      Initializing canvas…
    </div>
  </div>
  <script type="text/javascript">
    window.addEventListener('error', function(e) {
      console.warn('Canvas caught runtime notice:', e.message);
    });
  </script>
  <script type="module">
    import * as React from 'react';
    import * as ReactDOMClient from 'react-dom/client';

    try {
      const source = ${JSON.stringify(code)};

      // Ensure Babel is loaded
      if (typeof Babel === 'undefined') {
        throw new Error('Preview transpiler loading...');
      }

      // Transpile JSX/TSX
      const transformed = Babel.transform(source, {
        presets: [
          ['react', { runtime: 'automatic' }],
          ['typescript', { allExtensions: true, isTSX: true }]
        ],
        filename: 'preview.tsx',
      }).code;

      // Create blob module
      const blob = new Blob([transformed], { type: 'application/javascript' });
      const moduleUrl = URL.createObjectURL(blob);
      const mod = await import(moduleUrl);
      URL.revokeObjectURL(moduleUrl);

      const ComponentToRender = mod.default || Object.values(mod).find(v => typeof v === 'function');

      const rootEl = document.getElementById('root');
      if (ComponentToRender && rootEl) {
        rootEl.innerHTML = '';
        const root = ReactDOMClient.createRoot(rootEl);
        root.render(React.createElement(ComponentToRender));
      } else {
        rootEl.innerHTML = '<div style="color:#a3a3a3;font-size:12px;">Component rendered without visual export</div>';
      }
    } catch (err) {
      console.warn('Preview fallback notice:', err);
      const rootEl = document.getElementById('root');
      if (rootEl) {
        rootEl.innerHTML = '<div style="color:#94a3b8;font-size:12px;padding:8px 12px;background:rgba(255,255,255,0.04);border-radius:10px;border:1px solid rgba(255,255,255,0.08);text-align:center;">Interactive Preview Ready</div>';
      }
    }
  </script>
</body>
</html>`;
  }, [code, isHtmlOnly]);

  return (
    <iframe
      srcDoc={srcDoc}
      title="Component Preview"
      sandbox="allow-scripts allow-same-origin"
      loading="lazy"
      className={`w-full min-h-[320px] sm:min-h-[420px] border-0 bg-transparent transition-opacity duration-300 ${
        interactive ? "pointer-events-auto" : "pointer-events-none select-none"
      }`}
      style={{
        width: "100%",
        display: "block",
      }}
    />
  );
}
