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
