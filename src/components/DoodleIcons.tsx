// Small hand-drawn-style doodle icons for the date-night picker.
// Deliberately imperfect line work (uneven strokes, slight asymmetry) instead
// of polished vector icons or emoji, for a more human, sketched-note feel.
"use client";

import type { SVGProps } from "react";

type DoodleProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PicnicDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 30 L24 10 L40 30" stroke="#E294A2" />
      <path d="M6 30 H42" stroke="#0A48A3" />
      <path d="M12 30 L24 14 L36 30" stroke="#E8BF87" />
      <path d="M17 30 V21" stroke="#0A48A3" strokeWidth="2" />
      <path d="M31 30 V21" stroke="#0A48A3" strokeWidth="2" />
    </svg>
  );
}

export function CookingDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <ellipse cx="21" cy="28" rx="15" ry="7" stroke="#0A48A3" />
      <path d="M35 25 C41 24, 43 21, 41 18" stroke="#E294A2" />
      <path d="M12 17 C13 12, 15 10, 15 10" stroke="#E8BF87" />
      <path d="M20 15 C21 10, 23 9, 23 9" stroke="#E8BF87" />
      <path d="M28 17 C29 12, 31 11, 31 11" stroke="#E8BF87" />
    </svg>
  );
}

export function ArcadeDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 30 V16" stroke="#0A48A3" />
      <circle cx="24" cy="12" r="6" stroke="#E294A2" />
      <path d="M10 34 C10 30, 14 28, 24 28 C34 28, 38 30, 38 34 L36 40 H12 Z" stroke="#0A48A3" />
      <circle cx="18" cy="34" r="2" fill="#E8BF87" stroke="none" />
      <circle cx="30" cy="34" r="2" fill="#E8BF87" stroke="none" />
    </svg>
  );
}

export function StargazeDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 8 L26 15 L33 15 L27 19 L29 27 L24 22 L19 27 L21 19 L15 15 L22 15 Z" stroke="#E8BF87" />
      <path d="M8 34 C14 30, 34 30, 40 34" stroke="#0A48A3" />
      <path d="M10 26 L11 29 M36 24 L37 27" stroke="#E294A2" />
    </svg>
  );
}

export function BookDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 14 C20 10, 12 10, 8 13 V34 C12 31, 20 31, 24 35" stroke="#0A48A3" />
      <path d="M24 14 C28 10, 36 10, 40 13 V34 C36 31, 28 31, 24 35" stroke="#E294A2" />
      <path d="M24 14 V35" stroke="#0A48A3" strokeWidth="1.5" />
    </svg>
  );
}

export function MicDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <rect x="19" y="8" width="10" height="18" rx="5" stroke="#E294A2" />
      <path d="M13 22 C13 29, 18 33, 24 33 C30 33, 35 29, 35 22" stroke="#0A48A3" />
      <path d="M24 33 V40 M18 40 H30" stroke="#0A48A3" />
    </svg>
  );
}

export function MuseumDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="10" width="30" height="24" rx="2" stroke="#0A48A3" />
      <path d="M9 28 L18 19 L25 26 L31 20 L39 28" stroke="#E294A2" />
      <circle cx="18" cy="16" r="2.5" stroke="#E8BF87" />
    </svg>
  );
}

export function CupcakeDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <path d="M14 24 H34 L31 38 H17 Z" stroke="#E8BF87" />
      <path d="M15 24 C15 15, 20 12, 24 17 C28 12, 33 15, 33 24" stroke="#E294A2" />
      <path d="M24 12 V8" stroke="#0A48A3" strokeWidth="1.5" />
    </svg>
  );
}

export function GolfDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 40 H32" stroke="#0A48A3" />
      <path d="M24 40 V10" stroke="#0A48A3" strokeWidth="2" />
      <path d="M24 10 L36 14 L24 18 Z" stroke="#E294A2" />
      <ellipse cx="24" cy="40" rx="10" ry="2.5" stroke="#E8BF87" />
    </svg>
  );
}

export function MovieDoodle(props: DoodleProps) {
  return (
    <svg {...base} {...props}>
      <path d="M8 18 L12 10 H36 L40 18 Z" stroke="#E294A2" />
      <rect x="8" y="18" width="32" height="18" rx="2" stroke="#0A48A3" />
      <path d="M16 10 L13 18 M26 10 L23 18 M36 10 L33 18" stroke="#E8BF87" strokeWidth="1.5" />
    </svg>
  );
}

export const doodles = {
  picnic: PicnicDoodle,
  cooking: CookingDoodle,
  arcade: ArcadeDoodle,
  stargaze: StargazeDoodle,
  book: BookDoodle,
  mic: MicDoodle,
  museum: MuseumDoodle,
  cupcake: CupcakeDoodle,
  golf: GolfDoodle,
  movie: MovieDoodle,
} as const;

export type DoodleName = keyof typeof doodles;

export function Doodle({ name, ...props }: { name: DoodleName } & DoodleProps) {
  const Icon = doodles[name];
  return <Icon {...props} />;
}
