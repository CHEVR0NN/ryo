// src/components/PolaroidPrinter.tsx
"use client";

import { useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { featuredMemory } from "@/content";
import MemoryCard from "./MemoryCard";
import { playDevelopSound } from "@/lib/developSound";

type Phase = "idle" | "printing" | "developing" | "done";

function overlaps(a: DOMRect, b: DOMRect) {
  const cx = a.left + a.width / 2;
  const cy = a.top + a.height / 2;
  return cx >= b.left && cx <= b.right && cy >= b.top && cy <= b.bottom;
}

function CameraDoodle() {
  return (
    <svg viewBox="0 0 130 110" className="h-40 w-auto sm:h-48" fill="none">
      <defs>
        <linearGradient id="ppBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7b9c6" />
          <stop offset="50%" stopColor="#e07a8f" />
          <stop offset="100%" stopColor="#b95870" />
        </linearGradient>
        <linearGradient id="ppBump" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbdde3" />
          <stop offset="100%" stopColor="#e0a3b0" />
        </linearGradient>
        <linearGradient id="ppChrome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eef2f8" />
          <stop offset="45%" stopColor="#aab4c4" />
          <stop offset="100%" stopColor="#707c90" />
        </linearGradient>
        <radialGradient id="ppGround" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0A48A3" stopOpacity=".18" />
          <stop offset="100%" stopColor="#0A48A3" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="64" cy="94" rx="52" ry="9" fill="url(#ppGround)" />

      <path
        d="M25 70 C10 78, 8 95, 22 100 C34 104, 40 94, 30 88 C22 84, 20 90, 26 93"
        stroke="#b95870"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
        opacity=".9"
      />
      <path
        d="M25 70 C10 78, 8 95, 22 100 C34 104, 40 94, 30 88 C22 84, 20 90, 26 93"
        stroke="#f7b9c6"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity=".8"
      />

      <path
        d="M10 72 C11 80, 17 85, 26 84 L102 76 C110 75, 115 70, 114 62 L113.4 66
           C112 73, 107 77, 100 78 L25 86 C16 87, 10 82, 9 74 Z"
        fill="#9c4d63"
      />

      <path
        d="M14 34 C13 30, 16 27, 22 26 L96 18 C104 17, 110 21, 111 28 L114 62
           C115 70, 110 75, 102 76 L26 84 C17 85, 11 80, 10 72 Z"
        fill="url(#ppBody)"
        stroke="#0A48A3"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      <path d="M20 29 L94 21" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity=".6" />

      <path
        d="M30 26 L38 17 C40 15, 43 14, 46 14 L60 13 C63 13, 65 15, 65 18 L64 25"
        fill="url(#ppBump)"
        stroke="#0A48A3"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="42" cy="19" r="3.4" fill="#0A48A3" />
      <circle cx="41" cy="17.7" r="1" fill="#ffffff" opacity=".5" />

      <g transform="translate(34,54)" opacity=".95">
        <path
          d="M0 -6 C2 -8, 5 -6, 4 -3 C7 -4, 9 -1, 6 1 C9 3, 7 6, 4 5 C5 8, 2 9, 0 6 C-2 9, -5 8, -4 5 C-7 6, -9 3, -6 1 C-9 -1, -7 -4, -4 -3 C-5 -6, -2 -8, 0 -6 Z"
          fill="#fff9e6"
          stroke="#0A48A3"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="0" r="2.2" fill="#E8BF87" stroke="#0A48A3" strokeWidth="1" />
      </g>

      <circle cx="78" cy="52" r="24" fill="url(#ppChrome)" stroke="#0A48A3" strokeWidth="2.4" />
      <circle cx="78" cy="52" r="18" fill="#1c2333" stroke="#111826" strokeWidth="1" />
      <circle cx="78" cy="52" r="10" fill="#0d1420" />
      <rect
        x="70"
        y="42"
        width="10"
        height="3"
        rx="1.5"
        fill="#dbe6f4"
        opacity=".6"
        transform="rotate(-35 75 43.5)"
      />
      <path d="M64 44 C67 40, 72 38, 77 39.5" stroke="#c9d6e6" strokeWidth="2" strokeLinecap="round" opacity=".4" />

      <rect x="94" y="26" width="12" height="8" rx="2" fill="#f5d9a8" stroke="#0A48A3" strokeWidth="2" />
      <rect x="95.5" y="27.2" width="5" height="2.6" rx="1" fill="#fff" opacity=".6" />

      <path d="M96 4 L98 10 L104 12 L98 14 L96 20 L94 14 L88 12 L94 10 Z" fill="#E8BF87" />
      <path
        d="M108 46 L109 48.5 L111.5 49.5 L109 50.5 L108 53 L107 50.5 L104.5 49.5 L107 48.5 Z"
        fill="#fff9e6"
        opacity=".9"
      />
      <path
        d="M6 55 L6.8 57 L8.8 57.8 L6.8 58.6 L6 60.6 L5.2 58.6 L3.2 57.8 L5.2 57 Z"
        fill="#E8BF87"
        opacity=".7"
      />
    </svg>
  );
}

export default function PolaroidPrinter() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [overSlot, setOverSlot] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const stripRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const stripControls = useAnimation();
  const cameraControls = useAnimation();

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function checkOverlap() {
    if (!stripRef.current || !slotRef.current) return false;
    return overlaps(stripRef.current.getBoundingClientRect(), slotRef.current.getBoundingClientRect());
  }

  function handleDrag() {
    setOverSlot(checkOverlap());
  }

  async function handleDragEnd() {
    const hit = checkOverlap();
    setDragActive(false);
    setOverSlot(false);

    if (!hit) {
      stripControls.start({
        x: 0,
        y: 0,
        rotate: -8,
        transition: reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 20 },
      });
      return;
    }

    setPhase("printing");
    playDevelopSound();

    if (!reduceMotion) {
      cameraControls.start({
        rotate: [0, -2, 2, -1, 0],
        transition: { duration: 0.5 },
      });
    }

    window.setTimeout(() => setPhase("developing"), reduceMotion ? 0 : 300);
    window.setTimeout(() => setPhase("done"), reduceMotion ? 400 : 2200);
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 py-20">
      <h2 className="mb-16 -rotate-1 text-center text-3xl font-bold text-palette-sapphire">
        Little moments
      </h2>

      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 sm:flex-row sm:gap-20">
        <div className="relative shrink-0">
          <motion.div animate={cameraControls} className="relative z-0">
            <CameraDoodle />

            <div
              ref={slotRef}
              className={`pointer-events-none absolute bottom-2 left-1/2 h-6 w-12 -translate-x-1/2 rounded border-2 border-dashed transition-colors ${
                dragActive
                  ? overSlot
                    ? "border-palette-azure bg-palette-azure/10"
                    : "border-palette-azure/40"
                  : "border-transparent"
              }`}
            />
          </motion.div>

          {phase === "idle" && (
            <motion.div
              ref={stripRef}
              drag
              dragMomentum={false}
              dragElastic={0.15}
              onDragStart={() => setDragActive(true)}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              animate={stripControls}
              initial={{ x: 0, y: 0, rotate: -8 }}
              whileDrag={{ scale: 1.05 }}
              className="absolute right-0 bottom-4 z-10 h-20 w-16 cursor-grab touch-none rounded-sm border border-palette-silver bg-white p-1.5 shadow-lg active:cursor-grabbing"
            >
              <span
                aria-hidden="true"
                className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-3 opacity-80"
                style={{
                  background: "repeating-linear-gradient(45deg, #E294A2 0 5px, #fbdde3 5px 10px)",
                }}
              />
              <div className="h-full w-full rounded-sm bg-[#e9e9e9]" />
            </motion.div>
          )}
        </div>

        <div className="flex h-32 w-40 shrink-0 items-center justify-center">
          {(phase === "printing" || phase === "developing") && (
            <motion.div
              initial={{ y: -10, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 3 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              className="h-24 w-[76px] overflow-hidden rounded-sm border border-palette-silver bg-white p-1.5 shadow-xl"
            >
              <div className="relative h-full w-full overflow-hidden rounded-sm">
                {featuredMemory.image ? (
                  <Image src={featuredMemory.image} alt="" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-palette-sky/50 via-palette-tint to-[#cdeab3]" />
                )}
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: phase === "printing" ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0.2 : 1.6, ease: "easeOut" }}
                  className="absolute inset-0 bg-white"
                />
              </div>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.5 }}
              className="w-40"
            >
              <MemoryCard
                memory={featuredMemory}
                tiltClass="rotate-3"
                revealOffset={{ x: 190, y: 0, rotate: 6 }}
              />
            </motion.div>
          )}

          {phase === "idle" && (
            <p className="font-handwritten -rotate-2 text-center text-2xl text-palette-sapphire/70">
              Drag the photo into the camera!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
