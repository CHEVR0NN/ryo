# Memory-Box Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page, cozy interactive "digital memory box" site (Hero, flip Memory Cards, Reasons Grid, Date Picker) over a full-page WebGL 3D floating hearts/stars background.

**Architecture:** Next.js App Router page composed of client components reading from one typed `src/content.ts` placeholder-content module. Framer Motion drives all 2D spring animations (flips, reveals, floats, button feedback); `canvas-confetti` drives the hero CTA burst; a single fixed `react-three-fiber` `<Canvas>` (dynamically imported, `ssr:false`) renders the 3D background behind everything.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion 12, canvas-confetti, lucide-react, three@0.185.1, @react-three/fiber@9.6.1, @react-three/drei@10.7.7.

**Verification approach:** This project has no test runner configured, and the work is almost entirely visual/animation behavior (flips, floats, WebGL scene, random selection) that unit tests would either trivially pass or require brittle DOM/canvas mocking to check. Each task is instead verified with `npx tsc --noEmit` (type safety) and `npm run lint`, plus a final end-to-end manual check in the browser via `npm run dev`. Logic that IS pure and worth asserting (the date-idea random-pick helper) gets a plain Node script check, not a full test framework.

---

### Task 1: Install 3D dependencies

**Files:**
- Modify: `package.json`, `package-lock.json` (via npm install)

- [ ] **Step 1: Install packages**

Run:
```bash
npm install three@0.185.1 @react-three/fiber@9.6.1 @react-three/drei@10.7.7
npm install -D @types/three@latest
```

- [ ] **Step 2: Verify install**

Run: `node -e "console.log(require('three/package.json').version)"`
Expected: `0.185.1`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add react-three-fiber, drei, three deps"
```

---

### Task 2: Content module

**Files:**
- Create: `src/content.ts`

- [ ] **Step 1: Write the content file**

```typescript
// src/content.ts
// Placeholder content — swap these values for the real thing whenever ready.
// No other file needs to change when you do.

export interface Memory {
  image?: string;
  caption: string;
  note: string;
}

export interface Reason {
  id: string;
  text: string;
}

export interface DateIdea {
  title: string;
  description: string;
  icon: string; // one emoji, rendered large in the result card
}

export const names = {
  her: "Her Name",
  me: "My Name",
};

export const heroText = {
  title: "For You",
  subtitle: "A little corner of the internet just for us.",
  cta: "Click for a surprise",
};

export const memories: Memory[] = [
  { caption: "Our first date", note: "I was so nervous I forgot my own order." },
  { caption: "That road trip", note: "Still can't believe we made it on half a tank." },
  { caption: "Rainy day in", note: "Best kind of doing absolutely nothing." },
  { caption: "Your birthday", note: "The cake was crooked but you loved it anyway." },
  { caption: "Late night talk", note: "3am and we still had more to say." },
  { caption: "Just because", note: "No occasion. Just us, and that was enough." },
];

export const reasons: Reason[] = [
  { id: "r1", text: "The way you laugh at your own jokes before you finish them." },
  { id: "r2", text: "You remember the small things I forget I said." },
  { id: "r3", text: "You make even boring errands feel like an adventure." },
  { id: "r4", text: "Your terrible taste in snacks, and I love you for it." },
  { id: "r5", text: "You always know when I need quiet, not advice." },
  { id: "r6", text: "The way you say my name when you're half asleep." },
  { id: "r7", text: "You never let me take myself too seriously." },
  { id: "r8", text: "Every single ordinary Tuesday with you." },
];

export const dateIdeas: DateIdea[] = [
  { title: "Picnic at sunset", description: "Blanket, snacks, and nowhere else to be.", icon: "🧺" },
  { title: "Cook something new", description: "Pick a recipe neither of us has tried.", icon: "🍳" },
  { title: "Arcade night", description: "Loser buys ice cream after.", icon: "🕹️" },
  { title: "Stargazing drive", description: "Find somewhere dark and just look up.", icon: "✨" },
  { title: "Bookstore wander", description: "Buy each other a book, no peeking at the price.", icon: "📚" },
  { title: "Karaoke at home", description: "Bad singing mandatory.", icon: "🎤" },
  { title: "Museum day", description: "Pick the weirdest exhibit and overanalyze it.", icon: "🖼️" },
  { title: "Baking disaster", description: "Attempt something way above our skill level.", icon: "🧁" },
  { title: "Mini golf", description: "Petty rivalry encouraged.", icon: "⛳" },
  { title: "Movie marathon", description: "One theme, three movies, unlimited snacks.", icon: "🎬" },
];
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/content.ts
git commit -m "feat: add typed placeholder content module"
```

---

### Task 3: Confetti helper

**Files:**
- Create: `src/lib/confetti.ts`

- [ ] **Step 1: Write the helper**

```typescript
// src/lib/confetti.ts
import confetti from "canvas-confetti";

export function fireHeartBurst() {
  const heart = confetti.shapeFromText({ text: "❤️", scalar: 4 });
  const star = confetti.shapeFromText({ text: "✨", scalar: 3 });

  confetti({
    particleCount: 40,
    spread: 70,
    startVelocity: 35,
    origin: { y: 0.7 },
    shapes: [heart],
    scalar: 2,
  });

  confetti({
    particleCount: 25,
    spread: 100,
    startVelocity: 25,
    origin: { y: 0.7 },
    shapes: [star],
    scalar: 1.5,
  });
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors (confirms `canvas-confetti` types resolve `shapeFromText`)

- [ ] **Step 3: Commit**

```bash
git add src/lib/confetti.ts
git commit -m "feat: add heart-burst confetti helper"
```

---

### Task 4: Scene3D background

**Files:**
- Create: `src/components/Scene3D.tsx`
- Create: `src/components/Scene3DCanvas.tsx`

`Scene3D.tsx` holds the actual r3f content (meshes, camera rig). `Scene3DCanvas.tsx` is the `next/dynamic`-wrapped entry point with `ssr:false`, since `page.tsx` is a Server Component and cannot pass `ssr:false` to `dynamic()` directly inside itself in a Client Component — keeping the dynamic import in its own small client file avoids that restriction entirely.

- [ ] **Step 1: Write the heart geometry + floating objects + pointer rig**

```typescript
// src/components/Scene3D.tsx
"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const CORAL = "#E294A2";
const GOLD = "#E8BF87";
const AZURE = "#1E9AFF";

function heartShape() {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;
  shape.moveTo(x, y + 0.3);
  shape.bezierCurveTo(x, y + 0.3, x - 0.5, y - 0.2, x - 1, y + 0.3);
  shape.bezierCurveTo(x - 1.6, y + 0.9, x - 0.8, y + 1.3, x, y + 0.6);
  shape.bezierCurveTo(x + 0.8, y + 1.3, x + 1.6, y + 0.9, x + 1, y + 0.3);
  shape.bezierCurveTo(x + 0.5, y - 0.2, x, y + 0.3, x, y + 0.3);
  return shape;
}

function Hearts({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const geometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(heartShape(), {
      depth: 0.4,
      bevelEnabled: true,
      bevelSize: 0.05,
      bevelThickness: 0.05,
    });
    geo.scale(0.25, 0.25, 0.25);
    geo.center();
    return geo;
  }, []);

  const placements = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        rotation: [0, 0, Math.random() * Math.PI] as [number, number, number],
        speed: 0.5 + Math.random() * 1.5,
      })),
    [count]
  );

  return (
    <>
      {placements.map((p, i) => (
        <Float
          key={i}
          speed={reduceMotion ? 0 : p.speed}
          rotationIntensity={reduceMotion ? 0 : 0.6}
          floatIntensity={reduceMotion ? 0 : 1.2}
          position={p.position}
        >
          <mesh geometry={geometry} rotation={p.rotation}>
            <meshStandardMaterial color={CORAL} roughness={0.4} metalness={0.1} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function Stars({ count, reduceMotion }: { count: number; reduceMotion: boolean }) {
  const placements = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6 - 2,
        ] as [number, number, number],
        speed: 0.4 + Math.random() * 1.2,
        scale: 0.15 + Math.random() * 0.15,
      })),
    [count]
  );

  return (
    <>
      {placements.map((p, i) => (
        <Float
          key={i}
          speed={reduceMotion ? 0 : p.speed}
          rotationIntensity={reduceMotion ? 0 : 1}
          floatIntensity={reduceMotion ? 0 : 1.5}
          position={p.position}
        >
          <mesh scale={p.scale}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={GOLD} roughness={0.3} metalness={0.2} />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function PointerRig({ reduceMotion }: { reduceMotion: boolean }) {
  const { camera, pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame(() => {
    if (reduceMotion) return;
    target.current.x = pointer.x * 0.6;
    target.current.y = pointer.y * 0.4;
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (target.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function Scene3D() {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} color={AZURE} />
      <Hearts count={10} reduceMotion={reduceMotion} />
      <Stars count={8} reduceMotion={reduceMotion} />
      <Sparkles count={40} scale={10} size={2} speed={reduceMotion ? 0 : 0.3} color={GOLD} />
      <PointerRig reduceMotion={reduceMotion} />
    </Canvas>
  );
}
```

- [ ] **Step 2: Write the dynamic-import wrapper**

```typescript
// src/components/Scene3DCanvas.tsx
"use client";

import dynamic from "next/dynamic";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function Scene3DCanvas() {
  return (
    <div className="fixed inset-0 -z-10" aria-hidden="true">
      <Scene3D />
    </div>
  );
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/Scene3D.tsx src/components/Scene3DCanvas.tsx
git commit -m "feat: add full-page 3D floating hearts/stars background"
```

---

### Task 5: Hero section

**Files:**
- Create: `src/components/Hero.tsx`

- [ ] **Step 1: Write the component**

```typescript
// src/components/Hero.tsx
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
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: add Hero section with confetti CTA"
```

---

### Task 6: Memory flip cards

**Files:**
- Create: `src/components/MemoryCard.tsx`
- Create: `src/components/MemoryGrid.tsx`

- [ ] **Step 1: Write `MemoryCard`**

```typescript
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
```

- [ ] **Step 2: Write `MemoryGrid`**

```typescript
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
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/components/MemoryCard.tsx src/components/MemoryGrid.tsx
git commit -m "feat: add flip-able memory cards grid"
```

---

### Task 7: Reasons grid

**Files:**
- Create: `src/components/ReasonsGrid.tsx`

- [ ] **Step 1: Write the component**

```typescript
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
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/ReasonsGrid.tsx
git commit -m "feat: add lock-to-reveal reasons grid"
```

---

### Task 8: Date night picker

**Files:**
- Create: `src/lib/pickRandom.ts`
- Create: `tests/pickRandom.check.mjs`
- Create: `src/components/DatePicker.tsx`

The random-selection logic is the one piece of pure, assertable logic in this feature (everything else is visual/animation). It gets pulled into its own tiny module so it can be checked without a browser.

- [ ] **Step 1: Write the pure helper**

```typescript
// src/lib/pickRandom.ts
export function pickRandom<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("pickRandom: items array is empty");
  }
  return items[Math.floor(Math.random() * items.length)];
}
```

- [ ] **Step 2: Write a plain-Node check script (no test framework in this repo)**

```javascript
// tests/pickRandom.check.mjs
import { pickRandom } from "../src/lib/pickRandom.ts";

const items = ["a", "b", "c"];
const seen = new Set();
for (let i = 0; i < 200; i++) {
  const pick = pickRandom(items);
  if (!items.includes(pick)) {
    console.error(`FAIL: pickRandom returned value not in input array: ${pick}`);
    process.exit(1);
  }
  seen.add(pick);
}
if (seen.size < 2) {
  console.error("FAIL: pickRandom returned the same value on every call across 200 tries");
  process.exit(1);
}

try {
  pickRandom([]);
  console.error("FAIL: pickRandom([]) should have thrown");
  process.exit(1);
} catch (e) {
  if (!(e instanceof Error) || !e.message.includes("empty")) {
    console.error(`FAIL: unexpected error for empty array: ${e}`);
    process.exit(1);
  }
}

console.log("PASS: pickRandom.check.mjs");
```

- [ ] **Step 3: Run the check**

Run: `npx tsx tests/pickRandom.check.mjs`
Expected: `PASS: pickRandom.check.mjs`

If `tsx` isn't available, run `npm install -D tsx` first (dev-only, one-time).

- [ ] **Step 4: Write `DatePicker`**

```typescript
// src/components/DatePicker.tsx
"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";
import { dateIdeas } from "@/content";
import { pickRandom } from "@/lib/pickRandom";

export default function DatePicker() {
  const [result, setResult] = useState<(typeof dateIdeas)[number] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const cycleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    let ticks = 0;
    const maxTicks = 12;
    cycleRef.current = setInterval(() => {
      setResult(pickRandom(dateIdeas));
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
              key={spinning ? `spin-${Math.random()}` : result.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={
                spinning
                  ? { duration: 0.05 }
                  : { type: "spring", stiffness: 300, damping: 20 }
              }
              className="flex flex-col items-center gap-2 rounded-2xl border border-palette-sky bg-white p-6 text-center shadow-lg"
            >
              <span className="text-4xl">{result.icon}</span>
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
```

- [ ] **Step 5: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/pickRandom.ts tests/pickRandom.check.mjs src/components/DatePicker.tsx
git commit -m "feat: add date-night spin picker"
```

---

### Task 9: Compose the page

**Files:**
- Modify: `src/app/page.tsx` (full replace)

- [ ] **Step 1: Replace the starter page with the composed sections**

```typescript
// src/app/page.tsx
import Scene3DCanvas from "@/components/Scene3DCanvas";
import Hero from "@/components/Hero";
import MemoryGrid from "@/components/MemoryGrid";
import ReasonsGrid from "@/components/ReasonsGrid";
import DatePicker from "@/components/DatePicker";

export default function Home() {
  return (
    <div className="relative flex flex-col">
      <Scene3DCanvas />
      <Hero />
      <MemoryGrid />
      <ReasonsGrid />
      <DatePicker />
    </div>
  );
}
```

- [ ] **Step 2: Check the `@/*` path alias resolves**

Run: `grep -A2 "\"paths\"" tsconfig.json`
Expected: shows `"@/*": ["./src/*"]` (already configured by create-next-app). If missing, add it to `compilerOptions.paths` in `tsconfig.json`.

- [ ] **Step 3: Verify types compile and lint passes**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: compose memory-box page from all sections"
```

---

### Task 10: End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`

- [ ] **Step 2: Open in browser and check each interaction**

Open `http://localhost:3000` and confirm:
- 3D hearts/stars drift and rotate behind the content; camera tilts slightly as the mouse moves
- Hero card is centered, glass-styled, floating icons bob gently
- "Click for a surprise" fires a heart+star confetti burst
- Each memory card flips 180° on click, showing the note on the back, flips back on a second click
- Each reason tile starts locked, tapping reveals the text permanently (no re-lock)
- "Pick for us" rapidly cycles date ideas then settles on one with a spring bounce; clicking again re-spins
- Resize to a narrow (mobile) width — layout stays usable, no horizontal scroll, 3D scene keeps a reasonable frame rate

- [ ] **Step 3: Stop the dev server**

Run: Ctrl+C in the terminal running `npm run dev`

- [ ] **Step 4: Final commit if any manual fixes were made during verification**

```bash
git add -A
git commit -m "fix: polish from manual verification pass"
```
(Skip this step if no changes were needed.)
