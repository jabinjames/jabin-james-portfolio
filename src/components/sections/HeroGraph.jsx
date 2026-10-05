import React from "react";

export default function HeroGraph() {
  return (
    <svg
      viewBox="0 0 360 300"
      className="hero__graph"
      role="img"
      aria-label="Diagram of a state graph: input, reasoning, tool call, and output nodes connected in sequence"
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--border)" />
        </marker>
      </defs>

      <path d="M60,60 L60,140" className="hg-edge" markerEnd="url(#arrow)" />
      <path d="M60,140 L60,220" className="hg-edge" markerEnd="url(#arrow)" />
      <path d="M60,140 C140,140 140,80 220,80" className="hg-edge hg-edge--dashed" markerEnd="url(#arrow)" />
      <path d="M220,80 L300,80" className="hg-edge" markerEnd="url(#arrow)" />

      <g className="hg-node hg-node--1">
        <circle cx="60" cy="60" r="20" />
        <text x="60" y="65" textAnchor="middle">in</text>
      </g>
      <g className="hg-node hg-node--2">
        <circle cx="60" cy="140" r="24" />
        <text x="60" y="145" textAnchor="middle">llm</text>
      </g>
      <g className="hg-node hg-node--3">
        <circle cx="220" cy="80" r="20" />
        <text x="220" y="85" textAnchor="middle">tool</text>
      </g>
      <g className="hg-node hg-node--4">
        <circle cx="60" cy="220" r="20" />
        <text x="60" y="225" textAnchor="middle">out</text>
      </g>
      <g className="hg-node hg-node--5">
        <circle cx="300" cy="80" r="16" />
        <text x="300" y="85" textAnchor="middle" style={{ fontSize: "9px" }}>
          api
        </text>
      </g>

      <text x="88" y="103" className="hg-tag">
        route
      </text>
    </svg>
  );
}
