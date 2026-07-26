// src/components/MemoryCard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Memory } from "@/content";

export default function MemoryCard({ memory }: { memory: Memory }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="perspective-1000 h-64 w-48 text-left"
      aria-label={`Flip memory card: ${memory.caption}`}
    >
      <motion.div
        className="transform-style-3d relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="backface-hidden absolute inset-0 flex flex-col rounded-2xl border border-palette-silver bg-white p-3 shadow-lg">
          {memory.image ? (
            <div className="relative flex-1 overflow-hidden rounded-xl">
              <Image
                src={memory.image}
                alt={memory.caption}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex-1 rounded-xl bg-palette-tint" />
          )}
          <p className="mt-2 text-center text-sm font-medium text-palette-sapphire">
            {memory.caption}
          </p>
        </div>

        <div className="backface-hidden transform-rotate-y-180 absolute inset-0 flex items-center justify-center rounded-2xl border border-palette-silver bg-white p-4 shadow-lg">
          <p className="text-center font-serif italic text-palette-sapphire">
            {memory.note}
          </p>
        </div>
      </motion.div>
    </button>
  );
}
