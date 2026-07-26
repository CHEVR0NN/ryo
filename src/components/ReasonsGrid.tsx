// src/components/ReasonsGrid.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock } from "lucide-react";
import { reasons } from "@/content";

export default function ReasonsGrid() {
  const [unlocked, setUnlocked] = useState<Set<string>>(new Set());

  const unlock = (id: string) =>
    setUnlocked((prev) => new Set(prev).add(id));

  return (
    <section className="px-6 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-palette-sapphire">
        Reasons why
      </h2>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {reasons.map((reason) => {
          const isUnlocked = unlocked.has(reason.id);
          return (
            <button
              key={reason.id}
              type="button"
              onClick={() => unlock(reason.id)}
              disabled={isUnlocked}
              className="relative flex h-32 items-center justify-center overflow-hidden rounded-2xl border border-palette-sky bg-white p-3 shadow-md"
            >
              <AnimatePresence mode="wait">
                {isUnlocked ? (
                  <motion.p
                    key="text"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-center text-sm text-palette-sapphire"
                  >
                    {reason.text}
                  </motion.p>
                ) : (
                  <motion.div
                    key="lock"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="flex flex-col items-center gap-2 text-palette-silver"
                  >
                    <Lock size={24} />
                    <span className="text-xs">Tap to reveal</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </section>
  );
}
