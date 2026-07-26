// src/lib/developSound.ts
// Synthesized "polaroid printing" sound — a mechanical whirr followed by a
// soft click — via Web Audio, so there's no audio asset to source or license.

export function playDevelopSound(): void {
  if (typeof window === "undefined") return;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Whirr: filtered noise, amplitude-shaped, ~1.2s.
    const whirrDuration = 1.2;
    const bufferSize = Math.floor(ctx.sampleRate * whirrDuration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(220, now);
    filter.frequency.linearRampToValueAtTime(340, now + whirrDuration);
    filter.Q.value = 0.8;

    const whirrGain = ctx.createGain();
    whirrGain.gain.setValueAtTime(0, now);
    whirrGain.gain.linearRampToValueAtTime(0.15, now + 0.15);
    whirrGain.gain.setValueAtTime(0.15, now + whirrDuration - 0.2);
    whirrGain.gain.linearRampToValueAtTime(0, now + whirrDuration);

    noise.connect(filter);
    filter.connect(whirrGain);
    whirrGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + whirrDuration);

    // Click: short soft transient marking the photo fully ejected.
    const clickTime = now + whirrDuration;
    const click = ctx.createOscillator();
    click.type = "sine";
    click.frequency.setValueAtTime(900, clickTime);
    click.frequency.exponentialRampToValueAtTime(300, clickTime + 0.08);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.2, clickTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.1);

    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    click.start(clickTime);
    click.stop(clickTime + 0.12);

    click.onended = () => ctx.close();
  } catch {
    // Audio is a nice-to-have here; silently skip on any failure.
  }
}
