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
