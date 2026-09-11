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
      className="absolute inset-0 z-20 pointer-events-none select-none flex items-start justify-center sm:justify-start px-3 sm:px-7 lg:px-10 pt-20 sm:pt-32 transition-opacity duration-200"
    >
      {/* ── Left-Flanked on desktop, Centered on mobile ── */}
      <div className="w-full max-w-7xl mx-auto flex items-start justify-center sm:justify-start px-0 sm:px-6 pointer-events-none">
        <div className="pointer-events-auto w-full flex justify-center sm:justify-start">
          <MacCodeCard />
        </div>
      </div>
    </div>
  );
}
