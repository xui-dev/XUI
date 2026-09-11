"use client";

import MacCodeCard from "@/components/MacCodeCard";

interface LaserOverlayProps {
  laserProgress: number; // 0 to 1
  currentLaserFrame: number; // 1 to 96
  active: boolean;
  opacity?: number;
}

export default function LaserOverlay({
  active,
  opacity = 1,
}: LaserOverlayProps) {
  if (!active || opacity <= 0.01) return null;

  return (
    <div
      dir="ltr"
      style={{ opacity }}
      className="absolute inset-0 z-20 pointer-events-none select-none flex items-start justify-start px-4 sm:px-7 lg:px-10 pt-28 sm:pt-32 transition-opacity duration-200"
    >
      {/* ── Left-Flanked Interactive macOS Code Showcase (Beside Robot, Safely Below Navbar) ── */}
      <div className="w-full max-w-7xl mx-auto flex items-start justify-start px-4 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto">
          <MacCodeCard />
        </div>
      </div>
    </div>
  );
}
