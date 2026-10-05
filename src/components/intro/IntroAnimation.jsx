import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";
import { generateShards } from "./shardUtils.js";
import { playShatterSound } from "./playShatterSound.js";

const SESSION_KEY = "intro-played";
const HOLD_MS = 3000; // 0.2s appear + hold, per spec ends at ~3.0s
const APPEAR_DELAY_MS = 200;
const SHATTER_MS = 700;
const CLEANUP_BUFFER_MS = 350;

const NAME = "JABIN JAMES";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    setMobile(mq.matches);
    const handler = (e) => setMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return mobile;
}

export default function IntroAnimation({ onFinish }) {
  const reducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const alreadyPlayed = useMemo(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  }, []);

  const [phase, setPhase] = useState(alreadyPlayed || reducedMotion ? "skip" : "hold-pending");
  const timers = useRef([]);

  const shards = useMemo(
    () =>
      generateShards({
        rows: isMobile ? 4 : 6,
        cols: isMobile ? 4 : 7,
        maxDistance: isMobile ? 220 : 380,
        mode: isMobile ? "mobile" : "desktop",
      }),
    [isMobile]
  );

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const finish = () => {
    clearTimers();
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setPhase("done");
    onFinish?.();
  };

  useEffect(() => {
    if (phase === "skip") {
      finish();
      return;
    }
    if (phase !== "hold-pending") return;

    const t1 = setTimeout(() => setPhase("hold"), APPEAR_DELAY_MS);
    const t2 = setTimeout(() => {
      setPhase("shatter");
      playShatterSound();
    }, HOLD_MS);
    const t3 = setTimeout(finish, HOLD_MS + SHATTER_MS + CLEANUP_BUFFER_MS);

    timers.current = [t1, t2, t3];
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase === "hold-pending"]);

  const skipIntro = () => {
    if (phase === "shatter" || phase === "done" || phase === "skip") return;
    setPhase("shatter");
    playShatterSound();
    clearTimers();
    const t = setTimeout(finish, SHATTER_MS + CLEANUP_BUFFER_MS);
    timers.current = [t];
  };

  if (phase === "done" || phase === "skip") return null;

  const shattering = phase === "shatter";

  return (
    <div
      className={`intro ${shattering ? "intro--shatter" : ""}`}
      role="presentation"
      aria-hidden="true"
      onClick={skipIntro}
    >
      <button className="intro__skip" onClick={skipIntro} aria-hidden="true" tabIndex={-1}>
        Skip
      </button>

      <div className="intro__stage">
        <div className="intro__glow" />

        {!isMobile && (
          <div className="intro__particles">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className="intro__particle"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        )}

        <div className={`intro__name-wrap ${phase === "hold" ? "intro__name-wrap--in" : ""}`}>
          <span className="intro__name intro__name--solid" style={{ opacity: shattering ? 0 : undefined }}>
            {NAME}
          </span>
          <span className="intro__name intro__name--reflection" aria-hidden="true">
            {NAME}
          </span>

          {shattering && (
            <div className="intro__shards">
              {shards.map((s) => (
                <span
                  key={s.id}
                  className="intro__shard"
                  style={{
                    clipPath: s.clipPath,
                    WebkitClipPath: s.clipPath,
                    animationDelay: `${s.delay}ms`,
                    animationDuration: `${s.duration}ms`,
                    "--tx": `${s.tx}px`,
                    "--ty": `${s.ty}px`,
                    "--rot": `${s.rotate}deg`,
                  }}
                >
                  {NAME}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
