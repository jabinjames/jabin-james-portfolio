import React, { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

const DISPLAY = "Jabin James";

// Build the cycle sequence from the name's own letters (spaces excluded),
// preserving each letter's natural case: J,a,b,i,n,J,a,m,e,s
const CHARS = DISPLAY.split("");
const LETTER_INDICES = CHARS.map((c, i) => (c !== " " ? i : null)).filter((i) => i !== null);
const SEQUENCE = LETTER_INDICES.map((i) => CHARS[i]);
const SEQ_LEN = SEQUENCE.length;

const INTERIM_FRAMES = 3; // how many "wrong" letters flash by before settling
const FRAME_MS = 70; // speed of each interim flash
const STAGGER_MS = 95; // delay between each letter's burst start — creates the wave
const PAUSE_MS = 3000; // hold the fully readable name before the next sweep
const INITIAL_DELAY_MS = 1600; // let the hero's own entrance animation settle first

const BURST_DURATION_MS = (INTERIM_FRAMES + 1) * FRAME_MS;
const CYCLE_DURATION_MS = (SEQ_LEN - 1) * STAGGER_MS + BURST_DURATION_MS;

export default function HeroName() {
  const reducedMotion = usePrefersReducedMotion();
  const [chars, setChars] = useState(CHARS);
  const [burstKeys, setBurstKeys] = useState(() => CHARS.map(() => 0));

  useEffect(() => {
    if (reducedMotion) return undefined;

    let mounted = true;
    const timers = [];
    const schedule = (fn, ms) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    const burstLetter = (k, fullIndex) => {
      const homeChar = SEQUENCE[k];
      setBurstKeys((prev) => {
        const next = [...prev];
        next[fullIndex] += 1;
        return next;
      });

      let step = 0;
      const seqStart = (k + 1) % SEQ_LEN;

      const frame = () => {
        if (!mounted) return;
        if (step < INTERIM_FRAMES) {
          const letter = SEQUENCE[(seqStart + step) % SEQ_LEN];
          setChars((prev) => {
            const next = [...prev];
            next[fullIndex] = letter;
            return next;
          });
          step += 1;
          schedule(frame, FRAME_MS);
        } else {
          setChars((prev) => {
            const next = [...prev];
            next[fullIndex] = homeChar;
            return next;
          });
        }
      };

      frame();
    };

    // One full sweep across every letter, then a clean readable pause,
    // then the whole thing restarts from the beginning — forever.
    const playCycle = () => {
      if (!mounted) return;
      LETTER_INDICES.forEach((fullIndex, k) => {
        schedule(() => burstLetter(k, fullIndex), k * STAGGER_MS);
      });
      schedule(() => {
        schedule(playCycle, PAUSE_MS);
      }, CYCLE_DURATION_MS);
    };

    schedule(playCycle, INITIAL_DELAY_MS);

    return () => {
      mounted = false;
      timers.forEach(clearTimeout);
    };
  }, [reducedMotion]);

  // Group characters into discrete words so wrapping on narrow viewports is clean
  const words = [];
  let currentWord = [];
  chars.forEach((c, i) => {
    if (c === " ") {
      if (currentWord.length > 0) {
        words.push({ type: "word", items: currentWord });
        currentWord = [];
      }
      words.push({ type: "space", index: i });
    } else {
      currentWord.push({ char: c, index: i, burstKey: burstKeys[i] });
    }
  });
  if (currentWord.length > 0) {
    words.push({ type: "word", items: currentWord });
  }

  return (
    <span className="hero-name" aria-label={DISPLAY}>
      <span className="hero-name__visual" aria-hidden="true">
        {words.map((w, wi) =>
          w.type === "space" ? (
            <span key={`sp-${w.index}`} className="hero-name__space" />
          ) : (
            <span key={`w-${wi}`} className="hero-name__word">
              {w.items.map((item) => (
                <span key={`${item.index}-${item.burstKey}`} className="hero-name__char">
                  {item.char}
                </span>
              ))}
            </span>
          )
        )}
      </span>
    </span>
  );
}
