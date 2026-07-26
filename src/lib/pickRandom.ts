export function pickRandom<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error("pickRandom: items array is empty");
  }
  return items[Math.floor(Math.random() * items.length)];
}
