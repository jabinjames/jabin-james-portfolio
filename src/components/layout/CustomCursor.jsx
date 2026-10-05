import React, { useEffect, useRef, useState } from "react";

export default function CustomCursor({ enabled }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let raf;
    let ringX = 0,
      ringY = 0,
      targetX = 0,
      targetY = 0;

    const move = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${targetX}px, ${targetY}px)`;
      }
      const el = e.target.closest("[data-cursor]");
      if (el) {
        setHovering(true);
        setLabel(el.getAttribute("data-cursor") || "");
      } else {
        setHovering(false);
        setLabel("");
      }
    };

    const tick = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cx-dot" />
      <div ref={ringRef} className={`cx-ring ${hovering ? "cx-ring--active" : ""}`}>
        {hovering && <span className="cx-label">{label}</span>}
      </div>
    </>
  );
}
