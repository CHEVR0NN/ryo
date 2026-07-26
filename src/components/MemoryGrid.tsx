// src/components/MemoryGrid.tsx
"use client";

import { memories } from "@/content";
import MemoryCard from "./MemoryCard";

export default function MemoryGrid() {
  return (
    <section className="px-6 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-palette-sapphire">
        Little moments
      </h2>
      <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-6">
        {memories.map((memory, i) => (
          <MemoryCard key={i} memory={memory} />
        ))}
      </div>
    </section>
  );
}
