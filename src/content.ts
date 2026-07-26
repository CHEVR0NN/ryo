// src/content.ts
// Placeholder content — swap these values for the real thing whenever ready.
// No other file needs to change when you do.

import type { DoodleName } from "./components/DoodleIcons";

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
  icon: DoodleName;
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

export const featuredMemory: Memory = {
  image: "/images/featured-memory.jpg",
  caption: "Our first date",
  note: "I was so nervous I forgot my own order.",
};

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
  { title: "Picnic at sunset", description: "Blanket, snacks, and nowhere else to be.", icon: "picnic" },
  { title: "Cook something new", description: "Pick a recipe neither of us has tried.", icon: "cooking" },
  { title: "Arcade night", description: "Loser buys ice cream after.", icon: "arcade" },
  { title: "Stargazing drive", description: "Find somewhere dark and just look up.", icon: "stargaze" },
  { title: "Bookstore wander", description: "Buy each other a book, no peeking at the price.", icon: "book" },
  { title: "Karaoke at home", description: "Bad singing mandatory.", icon: "mic" },
  { title: "Museum day", description: "Pick the weirdest exhibit and overanalyze it.", icon: "museum" },
  { title: "Baking disaster", description: "Attempt something way above our skill level.", icon: "cupcake" },
  { title: "Mini golf", description: "Petty rivalry encouraged.", icon: "golf" },
  { title: "Movie marathon", description: "One theme, three movies, unlimited snacks.", icon: "movie" },
];
