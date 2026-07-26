"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Memory } from "@/content";

const NOTE_CLIP =
  "polygon(0% 2%, 4% 0%, 96% 1%, 100% 3%, 99% 97%, 95% 100%, 3% 99%, 1% 96%)";

export default function MemoryCard({
  memory,
  tiltClass = "",
}: {
  memory: Memory;
  tiltClass?: string;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative">
      <div
        className="absolute inset-0 translate-x-3 translate-y-4 rotate-3 rounded-lg bg-[#FFF9E6] p-4 shadow-md"
        style={{ clipPath: NOTE_CLIP }}
      >
        <p className="font-serif text-sm italic text-palette-sapphire">{memory.note}</p>
      </div>

      <motion.button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        aria-label={
          revealed
            ? `Hide the note behind this photo: ${memory.caption}`
            : `Slide this photo aside to reveal the note behind it: ${memory.caption}`
        }
        animate={revealed ? { x: -36, y: -168, rotate: -9 } : { x: 0, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative flex w-full flex-col rounded-lg border border-palette-silver bg-white p-3 text-left shadow-lg ${tiltClass}`}
      >
        {memory.image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded">
            <Image src={memory.image} alt={memory.caption} fill className="object-cover" />
          </div>
        ) : (
          <div className="aspect-[4/3] rounded bg-gradient-to-b from-palette-sky/50 via-palette-tint to-[#cdeab3]" />
        )}
        <p className="mt-2 text-center text-sm font-medium text-palette-sapphire">
          {memory.caption}
        </p>
      </motion.button>
    </div>
  );
}
