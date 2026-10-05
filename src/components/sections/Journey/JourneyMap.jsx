import React, { useEffect, useMemo, useRef, useState } from "react";
import { Flag, GraduationCap, Boxes, Briefcase, Compass } from "lucide-react";
import { usePrefersReducedMotion } from "../../../hooks/usePrefersReducedMotion.js";
import { JOURNEY_NODES, ROAD_SEGMENTS, FULL_ROAD_D, VIEW_W, VIEW_H } from "./journeyData.js";
import JourneyPanel from "./JourneyPanel.jsx";

const ICONS = { Flag, GraduationCap, Boxes, Briefcase, Compass };

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    setCoarse(mq.matches);
    const handler = (e) => setCoarse(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return coarse;
}

// Deterministic pseudo-random pine tree scatter â€” organic-looking without
// needing a real RNG or a hand-typed position list.
function buildTrees() {
  const trees = [];
  const bands = [
    { y: 470, count: 16, scale: 0.85 },
    { y: 540, count: 14, scale: 1.05 },
    { y: 600, count: 12, scale: 1.25 },
  ];
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  bands.forEach((band) => {
    for (let i = 0; i < band.count; i++) {
      const x = (i / band.count) * VIEW_W + rand() * 40 - 20;
      const y = band.y + rand() * 26 - 13;
      const scale = band.scale * (0.8 + rand() * 0.4);
      trees.push({ x, y, scale, key: `${band.y}-${i}` });
    }
  });
  return trees;
}

const TREES = buildTrees();

function JourneyBackground() {
  return (
    <>
      <defs>
        <linearGradient id="jrSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#05060a" />
          <stop offset="55%" stopColor="#0c1119" />
          <stop offset="100%" stopColor="#151b24" />
        </linearGradient>
        <radialGradient id="jrMoon" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F3D9A6" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#F3D9A6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jrRoadCore" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={VIEW_W} y2="0">
          <stop offset="0%" stopColor="#F6C979" />
          <stop offset="50%" stopColor="#E7A33E" />
          <stop offset="100%" stopColor="#F6C979" />
        </linearGradient>
        <linearGradient id="jrMist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D0F13" stopOpacity="0" />
          <stop offset="100%" stopColor="#0D0F13" stopOpacity="1" />
        </linearGradient>
        <filter id="jrGlowSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="jrGlowRoad" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <symbol id="jrPine" viewBox="0 0 20 34">
          <polygon points="10,0 18,14 2,14" />
          <polygon points="10,7 19,21 1,21" />
          <polygon points="10,14 20,31 0,31" />
          <rect x="8.5" y="29" width="3" height="5" />
        </symbol>
      </defs>

      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#jrSky)" />
      <circle cx="1430" cy="255" r="150" fill="url(#jrMoon)" filter="url(#jrGlowSoft)" />
      <circle cx="1430" cy="255" r="30" fill="#F3D9A6" opacity="0.85" />

      {/* back range */}
      <path
        d="M0,300 L80,220 160,270 260,190 360,250 460,175 560,240 660,185 760,255 860,200 960,260 1060,195 1160,245 1260,205 1360,260 1460,215 1560,255 1600,235 L1600,640 L0,640 Z"
        fill="#1a2029"
        opacity="0.85"
      />

      {/* summit with a hint of snow, echoing "higher, still curious" */}
      <path d="M480,330 L560,150 600,190 640,140 720,330 Z" fill="#141a23" />
      <path d="M556,158 L578,182 600,160 622,196 640,148" fill="none" stroke="#cfd3da" strokeOpacity="0.35" strokeWidth="3" />

      {/* mid range */}
      <path
        d="M0,360 L100,260 220,330 340,240 460,320 580,230 700,310 820,250 940,330 1060,255 1180,320 1300,260 1420,330 1540,270 1600,300 L1600,640 L0,640 Z"
        fill="#121821"
        opacity="0.96"
      />

      {/* small cliffside residence near the Experience marker */}
      <g transform="translate(1108,296)">
        <polygon points="-6,22 76,22 35,-8" fill="#0f141c" />
        <rect x="0" y="22" width="70" height="42" fill="#151b25" />
        <rect x="10" y="34" width="9" height="12" fill="#f2c879" opacity="0.55" />
        <rect x="27" y="34" width="9" height="12" fill="#f2c879" opacity="0.4" />
        <rect x="44" y="34" width="9" height="12" fill="#f2c879" opacity="0.5" />
      </g>

      {/* front ridge closest to the road */}
      <path
        d="M0,430 C150,380 300,410 450,370 C600,340 750,390 900,420 C1050,450 1200,380 1350,400 C1450,415 1550,395 1600,405 L1600,640 L0,640 Z"
        fill="#0b0f16"
      />

      {/* pine treeline flanking the road */}
      <g fill="#0a0d13">
        {TREES.map((t) => (
          <use
            key={t.key}
            href="#jrPine"
            x={t.x - 10 * t.scale}
            y={t.y}
            width={20 * t.scale}
            height={34 * t.scale}
          />
        ))}
      </g>

      {/* lighthouse â€” a quiet nod to "still exploring" at the end of the road */}
      <g transform="translate(1524,255)">
        <rect x="9" y="58" width="16" height="88" fill="#151b25" />
        <rect x="5" y="48" width="24" height="13" fill="#1c2330" />
        <polygon points="5,48 29,48 17,28" fill="#212837" />
        <circle cx="17" cy="37" r="5" fill="var(--jr-next)" className="jr-beacon" />
      </g>

      <rect x="0" y="500" width={VIEW_W} height="140" fill="url(#jrMist)" />
    </>
  );
}

export default function JourneyMap() {
  const reducedMotion = usePrefersReducedMotion();
  const isCoarse = useCoarsePointer();
  const [activeId, setActiveId] = useState(null);
  const clearTimer = useRef(null);

  const activeIndex = useMemo(() => JOURNEY_NODES.findIndex((n) => n.id === activeId), [activeId]);

  const isSegmentActive = (segIndex) => activeIndex !== -1 && (segIndex === activeIndex - 1 || segIndex === activeIndex);
  const isNodeDim = (id) => activeId !== null && id !== activeId;

  const setActiveNow = (id) => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setActiveId(id);
  };
  const clearActiveSoon = () => {
    clearTimer.current = setTimeout(() => setActiveId(null), 160);
  };

  const handleNodeClick = (id) => {
    if (!isCoarse) return; // desktop uses hover, not click
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      className={`journey ${activeId ? "journey--focused" : ""}`}
      onMouseLeave={!isCoarse ? clearActiveSoon : undefined}
    >
      <div className="journey__map" aria-label="Interactive map of my career journey">
        <svg
          className="journey__svg"
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-hidden="true"
        >
          <JourneyBackground />

          <path id="jrFullRoad" d={FULL_ROAD_D} fill="none" stroke="none" />

          {ROAD_SEGMENTS.map((d, i) => (
            <g key={i} className={isSegmentActive(i) ? "jr-seg jr-seg--active" : activeId ? "jr-seg jr-seg--dim" : "jr-seg"}>
              <path d={d} className="jr-seg__glow" filter="url(#jrGlowRoad)" />
              <path d={d} className="jr-seg__core" />
            </g>
          ))}

          {!reducedMotion && (
            <>
              <circle r="9" fill="#FFE3AE" className="jr-light-core">
                <animateMotion
                  id="jrLightMotion"
                  dur="7.2s"
                  repeatCount="1"
                  fill="freeze"
                  begin="0.3s;jrLightMotion.end+4s"
                  rotate="auto"
                >
                  <mpath href="#jrFullRoad" />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.04;0.92;1"
                  dur="7.2s"
                  begin="0.3s;jrLightMotion.end+4s"
                  fill="freeze"
                />
              </circle>
              <circle r="20" fill="#FFE3AE" opacity="0.35" filter="url(#jrGlowRoad)" className="jr-light-halo">
                <animateMotion dur="7.2s" repeatCount="1" fill="freeze" begin="0.3s;jrLightMotion.end+4s" rotate="auto">
                  <mpath href="#jrFullRoad" />
                </animateMotion>
                <animate
                  attributeName="opacity"
                  values="0;0.4;0.4;0"
                  keyTimes="0;0.04;0.92;1"
                  dur="7.2s"
                  begin="0.3s;jrLightMotion.end+4s"
                  fill="freeze"
                />
              </circle>
            </>
          )}
        </svg>

        <div className="journey__pins">
          {JOURNEY_NODES.map((node) => {
            const Icon = ICONS[node.icon];
            const active = activeId === node.id;
            const dim = isNodeDim(node.id);
            return (
              <button
                key={node.id}
                type="button"
                className={`jr-pin ${active ? "jr-pin--active" : ""} ${dim ? "jr-pin--dim" : ""}`}
                style={{ left: `${node.x}%`, top: `${node.y}%`, "--pin-color": `var(${node.colorVar})` }}
                onMouseEnter={!isCoarse ? () => setActiveNow(node.id) : undefined}
                onFocus={() => setActiveNow(node.id)}
                onBlur={!isCoarse ? clearActiveSoon : undefined}
                onClick={() => handleNodeClick(node.id)}
                aria-pressed={active}
              >
                <span className="jr-pin__badge">
                  <Icon size={16} strokeWidth={2} />
                </span>
                <span className="jr-pin__label">{node.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="journey__panel-wrap"
        onMouseEnter={!isCoarse ? () => activeId && setActiveNow(activeId) : undefined}
        onMouseLeave={!isCoarse ? clearActiveSoon : undefined}
        style={activeId ? { "--panel-accent": `var(${JOURNEY_NODES[activeIndex]?.colorVar || "--jr-start"})` } : undefined}
      >
        <JourneyPanel nodeId={activeId} />
      </div>
    </div>
  );
}
