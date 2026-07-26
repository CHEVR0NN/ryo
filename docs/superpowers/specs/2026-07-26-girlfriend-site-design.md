# Cute Interactive Girlfriend Site — Design

## Purpose
A single-page, cozy, tactile "digital memory box" site for a girlfriend. Built with Next.js (App Router), Tailwind CSS v4, Framer Motion, Lucide icons, canvas-confetti, and a full-page WebGL 3D background via react-three-fiber. Explicitly avoiding generic/sterile AI-template aesthetics.

## Color Palette (already defined in `src/app/globals.css` `@theme`)
- `palette-tint` #D0F7FF — main background tint
- `palette-sky` #86E4FF — surface/hover
- `palette-azure` #1E9AFF — primary CTA
- `palette-sapphire` #0A48A3 — primary text/headers
- `palette-coral` #E294A2 — hearts/pink highlights
- `palette-gold` #E8BF87 — stars/sparkles
- `palette-silver` #BFBFBF — borders
- White — card surfaces

3D transform utilities (`perspective-1000`, `transform-style-3d`, `backface-hidden`, `transform-rotate-y-180`) already exist in `globals.css` and are reused for flip cards.

## Content strategy
All personal copy (names, memory photos/captions/notes, reasons list, date ideas) lives in a single typed file, `src/content.ts`, populated with clearly-marked placeholder data for now. Components read from this file exclusively — swapping in real content later requires no component changes.

```ts
export interface Memory { image?: string; caption: string; note: string }
export interface Reason { id: string; text: string }
export interface DateIdea { title: string; description: string; icon: string }

export const names = { her: string, me: string }
export const heroText = { title: string, subtitle: string, cta: string }
export const memories: Memory[]   // 6 placeholder entries
export const reasons: Reason[]    // 8 placeholder entries
export const dateIdeas: DateIdea[] // 10 placeholder entries
```

## File structure
```
src/
  content.ts
  lib/confetti.ts
  components/
    Scene3D.tsx
    Hero.tsx
    MemoryCard.tsx
    MemoryGrid.tsx
    ReasonsGrid.tsx
    DatePicker.tsx
  app/page.tsx
```

## Components

### `Scene3D.tsx`
- New deps: `three`, `@react-three/fiber`, `@react-three/drei`.
- Dynamically imported into `page.tsx` with `ssr: false` (r3f requires the browser).
- One fixed, full-viewport `<Canvas>` at `z-index: -10`, sitting behind every section. Page content scrolls on top; glass cards read against the 3D depth instead of a flat background.
- ~15-20 floating meshes total: hearts (extruded `THREE.Shape` heart profile, colored `palette-coral`) and stars (drei `<Sparkles>` plus a few low-poly `Icosahedron`s, colored `palette-gold`), each wrapped in drei `<Float>` for gentle independent bob/rotate/drift.
- The camera (or an enclosing group) tilts a few degrees toward the pointer position, lerped smoothly each frame — subtle parallax, not free-look.
- Respects `prefers-reduced-motion`: when set, drift/rotation/parallax freeze to a static pose.
- Capped pixel ratio and low poly counts to keep this performant, including on mobile.

### `Hero.tsx`
- Soft floating glass card, centered on screen, `rounded-3xl`, 1px `border-palette-silver`/`border-palette-sky`, glassmorphism (`backdrop-blur` + translucent white).
- Decorative star/heart icons (Lucide) float with a slow independent Framer Motion loop animation (separate from the 3D background).
- "Click for a surprise" CTA: spring-scale press feedback (`type: spring, stiffness: 300, damping: 20`), triggers `lib/confetti.ts` heart burst on click.

### `lib/confetti.ts`
- Thin wrapper around `canvas-confetti` using `confetti.shapeFromText({ text: '❤️' })` and a second burst with `✨`, fired together for a "heart explosion" feel.

### `MemoryCard.tsx` + `MemoryGrid.tsx`
- `MemoryGrid` maps `memories` from `content.ts` into a responsive grid of `MemoryCard`s.
- Each `MemoryCard` is a white, polaroid-style card with soft border and shadow.
- Click triggers an 180° Y-axis flip using the existing `perspective-1000` / `transform-style-3d` / `backface-hidden` / `transform-rotate-y-180` utility classes, animated via `motion.div` with spring physics (`stiffness: 300, damping: 20`).
- Front: photo (or placeholder image block) + caption. Back: handwritten-note styling (italic/script-style font treatment) showing the hidden note.

### `ReasonsGrid.tsx`
- Tile grid from `reasons` in `content.ts`.
- Tiles start locked: dimmed/blurred with a lock icon overlay.
- Tap unlocks permanently (no re-hide) — reveals the compliment/inside-joke text with a spring scale-in. Simplest interaction model, avoids toggle confusion.

### `DatePicker.tsx`
- "Pick for us" button triggers a rapid random-cycle animation through `dateIdeas` (~80ms interval, several cycles) then settles on a final pick with a springy bounce.
- Final result displayed via `AnimatePresence`-driven card: icon + title + description.

### `page.tsx`
- Composes `Scene3D` (background) + `Hero`, `MemoryGrid`, `ReasonsGrid`, `DatePicker` in vertical scroll order with generous spacing.

## Out of scope (for this pass)
- Real personal content (photos, names, captions) — placeholder only, swapped in later.
- Backend/persistence — fully static, client-side only.
- Sound/music.
