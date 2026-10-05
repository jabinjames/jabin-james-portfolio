// A very short, synthesized glass-crack sound — no audio file needed.
// Silently no-ops if the browser blocks audio without a prior user gesture,
// which is the correct, expected behavior for autoplay restrictions.

let hasUserGesture = false;

if (typeof window !== "undefined") {
  const markGesture = () => {
    hasUserGesture = true;
  };
  window.addEventListener("pointerdown", markGesture, { once: true });
  window.addEventListener("keydown", markGesture, { once: true });
}

export function playShatterSound() {
  if (typeof window === "undefined") return;
  if (!hasUserGesture) return; // respect autoplay restrictions — stay silent
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.value = 0.05;
    master.connect(ctx.destination);

    // short filtered noise burst = "crack"
    const bufferSize = Math.floor(ctx.sampleRate * 0.18);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 1800;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    noise.connect(filter).connect(noiseGain).connect(master);
    noise.start(now);
    noise.stop(now + 0.2);

    // a couple of high, quick "ting" tones layered on top
    [2600, 3400].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.4, now + i * 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(g).connect(master);
      osc.start(now + i * 0.01);
      osc.stop(now + 0.16);
    });

    setTimeout(() => ctx.close().catch(() => {}), 400);
  } catch {
    // audio is a non-essential enhancement — fail silently
  }
}
