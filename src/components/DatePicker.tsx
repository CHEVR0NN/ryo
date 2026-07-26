"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";
import { dateIdeas } from "@/content";
import { pickRandom } from "@/lib/pickRandom";
import { Doodle } from "./DoodleIcons";

export default function DatePicker() {
  const [result, setResult] = useState<(typeof dateIdeas)[number] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [tick, setTick] = useState(0);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current);
    };
  }, []);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    let ticks = 0;
    const maxTicks = 12;
    cycleRef.current = setInterval(() => {
      setResult(pickRandom(dateIdeas));
      setTick((t) => t + 1);
      ticks += 1;
      if (ticks >= maxTicks) {
        if (cycleRef.current) clearInterval(cycleRef.current);
        setSpinning(false);
      }
    }, 80);
  };

  return (
    <section className="flex flex-col items-center px-6 py-20">
      <h2 className="mb-10 text-center text-3xl font-bold text-palette-sapphire">
        Date night, decided for us
      </h2>

      <motion.button
        type="button"
        onClick={spin}
        disabled={spinning}
        whileHover={{ scale: spinning ? 1 : 1.05 }}
        whileTap={{ scale: spinning ? 1 : 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="mb-8 flex items-center gap-2 rounded-2xl bg-palette-azure px-6 py-3 font-semibold text-white shadow-lg disabled:opacity-70"
      >
        <Shuffle size={20} />
        {spinning ? "Picking..." : "Pick for us"}
      </motion.button>

      <div className="h-40 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={spinning ? `spin-${tick}` : result.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                spinning
                  ? { duration: 0.05 }
                  : { type: "spring", stiffness: 300, damping: 20 }
              }
              className="flex flex-col items-center gap-2 rounded-2xl border border-palette-sky bg-white p-6 text-center shadow-lg"
            >
              <Doodle name={result.icon} className="h-12 w-12" />
              <span className="text-lg font-bold text-palette-sapphire">
                {result.title}
              </span>
              <span className="text-sm text-palette-sapphire/80">
                {result.description}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
