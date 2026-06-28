"use client";

import dynamic from "next/dynamic";

const ShapeGrid = dynamic(() => import("@/components/ui/shape-grid"), {
  ssr: false,
});

export function ShapeGridBackground() {
  return (
    <ShapeGrid
      speed={0.15}
      squareSize={48}
      direction="right"
      borderColor="oklch(0.55 0.18 260 / 0.08)"
      hoverFillColor="oklch(0.55 0.18 260 / 0.06)"
      shape="hexagon"
      hoverTrailAmount={3}
    />
  );
}
