# Polaroid Camera Photo Reveal — Design

## Purpose
Replace the current scattered-polaroid `MemoryGrid` (6 photos on a dashed path) with a single interactive moment: a cute illustrated polaroid camera, a draggable placeholder photo strip beside it, and a print/develop animation. Once the photo finishes developing, its caption appears and the photo becomes clickable — reusing the existing `MemoryCard` slide-aside note reveal.

This supersedes the "Sound/music: out of scope" line in `2026-07-26-memory-box-site-design.md` for this one feature — everything else from that spec still stands.

## Content change
`src/content.ts`'s `memories: Memory[]` (6 placeholder entries) is replaced with a single `featuredMemory: Memory`:

```ts
export const featuredMemory: Memory = {
  caption: "Our first date",
  note: "I was so nervous I forgot my own order.",
};
```

The other 5 placeholder entries are dropped — nothing else will reference them once `MemoryGrid` is gone. The `Memory` interface itself (`image?`, `caption`, `note`) is unchanged.

## File structure changes
```
src/
  content.ts                    # memories[] -> featuredMemory
  lib/
    confetti.ts                 # unchanged
    developSound.ts             # new
  components/
    MemoryCard.tsx              # unchanged, reused as-is
    MemoryGrid.tsx              # deleted
    PolaroidPrinter.tsx         # new — replaces MemoryGrid in page.tsx
  app/page.tsx                  # <MemoryGrid /> -> <PolaroidPrinter />
```

## `PolaroidPrinter.tsx`
Client component (`"use client"`) that owns the whole interaction as a state machine: `idle → dragging → printing → developing → done`.

### Visual elements
- **Camera**: a hand-illustrated SVG (inline in this file or a small `CameraDoodle` sub-component), filled/shaded — not the thin-line style used by `DoodleIcons.tsx`, since this is a hero-scale illustration rather than a small icon. Coral (`palette-coral`) gradient body, sapphire (`palette-sapphire`) outline, a chrome-gray lens ring with a black barrel (the one deliberately neutral color — standard for a camera lens, confirmed fine even though it's outside the site's palette), gold (`palette-gold`) flash and flower decal outlined in cream for contrast, a couple of small sparkle accents, and a soft ground-shadow ellipse for depth. No bow/charm — tried and explicitly rejected for reading as a pouch instead of a camera.
- **Strip**: a small white polaroid-shaped rectangle with a blank/gray placeholder square, sitting beside the camera at a slight tilt (matches the "centered stage" mockup — strip tucked to the side, camera centered).
- **Slot**: a defined drop-zone rect roughly at the camera's front-center, invisible until a drag is in progress, at which point its outline highlights (azure) when the dragged strip overlaps it.

### Interaction (drag-only, every device — confirmed deliberate, no tap/click fallback)
Uses Framer Motion's `drag` (already a dependency, has reasonable touch support out of the box):
1. **idle**: strip is a `motion.div` with `drag`, constrained loosely to the section bounds.
2. **dragging**: on every drag frame, check the strip's bounding rect against the slot's rect (`getBoundingClientRect` overlap test). Toggle the slot's highlighted state accordingly.
3. **on drag end**:
   - No overlap → strip springs back to its idle position (`dragSnapToOrigin` or an animated reset).
   - Overlap → strip animates/snaps into the slot and unmounts; state moves to `printing`.
4. **printing**: `playDevelopSound()` fires. The camera plays a small wiggle (rotate/scale, spring-based) — skipped entirely under `prefers-reduced-motion`, same pattern already used in `Scene3D.tsx`. A blank white photo shape begins sliding out from the slot over ~1–1.5s.
5. **developing**: once ejected, the photo fades from blank/pale to the real placeholder gradient (the same `from-palette-sky/50 via-palette-tint to-[#cdeab3]` gradient `MemoryCard` uses when there's no image) over ~1.5–2s. This crossfade is functional content-reveal, not decorative, so it still runs under reduced motion (just without any spring/bounce easing).
6. **done**: the caption fades in below the photo, and the photo area becomes a live `MemoryCard` (initialized already in its "not revealed" state) — clicking it slides it aside to reveal the note, unchanged behavior from the existing component.

No keyboard/tap fallback for the insert gesture — confirmed acceptable since this is a single-user personal page, not a public product needing full input-method coverage.

## `lib/developSound.ts`
```ts
export function playDevelopSound(): void
```
Synthesized via the Web Audio API — no audio asset file. Two stages, matching the printing → developing timing:
- A short filtered-noise/oscillator "whirr" for ~1–1.5s (mechanical print sound), amplitude-shaped with a simple envelope.
- A soft short "click" transient at the end, marking the photo fully ejected.

Follows the same fire-and-forget pattern as `fireHeartBurst()` in `lib/confetti.ts` — no state, no cleanup required by the caller. No-ops gracefully if `AudioContext` is unavailable (older browsers) rather than throwing.

## Reduced motion
Mirrors `Scene3D.tsx`'s existing `prefers-reduced-motion` check:
- Suppressed: camera wiggle, spring bounce on strip snap/reset.
- Kept (functional, not decorative): the drag gesture itself, the slide-into-slot, and the develop crossfade — without these the interaction wouldn't communicate anything.

## Testing / verification
No unit tests — this is an animation/interaction feature with no meaningful pure logic to assert on beyond the overlap-rect check, which is simple enough to verify by exercising it. Verification is manual, via the `run` skill against the dev server:
- Drag the strip onto the slot → full printing → developing → done sequence plays, sound fires, caption appears.
- Drag the strip and release away from the slot → springs back to idle, no state change.
- Toggle `prefers-reduced-motion` → wiggle/bounce suppressed, crossfade and drag still work.
- Once "done," click the developed photo → existing slide-aside note reveal still works.
- Confirm `MemoryGrid.tsx` has no remaining references before deleting it.

## Out of scope
- Real personal photo/content — placeholder gradient only, same as the rest of the site.
- Multiple memories through this camera (one featured memory only, per decision above).
- Non-drag input fallback (tap-to-insert, keyboard insert) — deliberately excluded.
