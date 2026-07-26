"use client";

import { motion } from "framer-motion";
import { Heart, Star, Sparkles } from "lucide-react";
import { heroText } from "@/content";
import { fireHeartBurst } from "@/lib/confetti";

const floatTransition = (delay: number) => ({
  y: [0, -12, 0],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay },
});

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-full max-w-lg rounded-3xl border border-palette-sky/60 bg-white/60 p-10 text-center shadow-xl backdrop-blur-md"
      >
        <motion.div
          className="absolute -top-6 -left-4 text-palette-coral"
          animate={floatTransition(0)}
        >
          <Heart size={32} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute -top-4 right-2 text-palette-gold"
          animate={floatTransition(0.6)}
        >
          <Star size={26} fill="currentColor" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 -right-6 text-palette-coral"
          animate={floatTransition(1.2)}
        >
          <Sparkles size={28} />
        </motion.div>

        <h1 className="text-4xl font-bold text-palette-sapphire">{heroText.title}</h1>
        <p className="mt-3 text-lg text-palette-sapphire/80">{heroText.subtitle}</p>

        <motion.button
          type="button"
          onClick={() => fireHeartBurst()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mt-8 rounded-2xl bg-palette-azure px-6 py-3 font-semibold text-white shadow-lg"
        >
          {heroText.cta}
        </motion.button>
      </motion.div>
    </section>
  );
}
