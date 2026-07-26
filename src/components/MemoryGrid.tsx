// src/components/MemoryGrid.tsx
"use client";

import { memories } from "@/content";
import MemoryCard from "./MemoryCard";

const ALIGN = ["self-start", "self-end", "self-center"] as const;
const TILT = ["-rotate-6", "rotate-3", "-rotate-3", "rotate-5", "-rotate-4", "rotate-2"] as const;
const ROW_HEIGHT = 150;

function buildPath(count: number) {
  const xFor = (i: number) => {
    const slot = i % 3;
    return slot === 0 ? 20 : slot === 1 ? 80 : 50;
  };
  const points = Array.from({ length: count }, (_, i) => ({
    x: xFor(i),
    y: i * ROW_HEIGHT + ROW_HEIGHT / 2,
  }));

  return points.reduce((d, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + point.y) / 2;
    return `${d} C ${prev.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
  }, "");
}

export default function MemoryGrid() {
  const pathD = buildPath(memories.length);
  const viewBoxHeight = memories.length * ROW_HEIGHT;

  return (
    <section className="px-6 py-20">
      <h2 className="mb-20 text-center text-3xl font-bold text-palette-sapphire">
        Little moments
      </h2>
      <div className="relative mx-auto flex max-w-md flex-col gap-16">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 100 ${viewBoxHeight}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d={pathD}
            fill="none"
            stroke="var(--color-palette-coral)"
            strokeWidth="0.6"
            strokeLinecap="round"
            strokeDasharray="0.5 5"
          />
        </svg>

        {memories.map((memory, i) => (
          <div key={i} className={`relative z-10 w-56 max-w-[70%] ${ALIGN[i % ALIGN.length]}`}>
            <MemoryCard memory={memory} tiltClass={TILT[i % TILT.length]} />
          </div>
        ))}
      </div>
    </section>
  );
}
