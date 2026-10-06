import React, { useState, useEffect } from "react";
import { Terminal, RotateCcw } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

const STEPS = [
  {
    id: "input",
    nodeIndex: 0,
    title: "Input Request",
    msg: "prompt received: 'orchestrate multi-step API workflow'",
    state: "dispatched",
    activeEdge: null,
  },
  {
    id: "agent",
    nodeIndex: 1,
    title: "LangGraph StateGraph",
    msg: "state router initializing: compiling conditional edge graph...",
    state: "reasoning",
    activeEdge: "edge-in-agent",
  },
  {
    id: "tool",
    nodeIndex: 2,
    title: "Tool Connectors",
    msg: "invoking tool: executing sequential API connectors...",
    state: "executing",
    activeEdge: "edge-agent-tool",
  },
  {
    id: "reflect",
    nodeIndex: 3,
    title: "Reflection Loop",
    msg: "evaluating output: self-correction & validation (passed)",
    state: "verifying",
    activeEdge: "edge-tool-reflect",
  },
  {
    id: "output",
    nodeIndex: 4,
    title: "Synthesized Output",
    msg: "state committed: finalized response dispatched to caller.",
    state: "completed",
    activeEdge: "edge-reflect-out",
  },
];

const NODES = [
  { id: "input", name: "Input", tag: "IN", x: 60, y: 75, r: 24 },
  { id: "agent", name: "Agent", tag: "LLM", x: 195, y: 75, r: 28 },
  { id: "tool", name: "Tool", tag: "API", x: 330, y: 75, r: 24 },
  { id: "reflect", name: "Reflect", tag: "LOOP", x: 260, y: 195, r: 25 },
  { id: "output", name: "Output", tag: "OUT", x: 395, y: 195, r: 24 },
];

export default function HeroGraph() {
  const reducedMotion = usePrefersReducedMotion();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (reducedMotion || isPaused) return undefined;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 2400);

    return () => clearInterval(timer);
  }, [reducedMotion, isPaused]);

  const activeNode = STEPS[currentStep].nodeIndex;

  return (
    <div
      className="hero-graph-card"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Interactive LangGraph State Execution Canvas"
    >
      {/* Card Window Bar */}
      <div className="hero-graph-card__bar">
        <div className="hero-graph-card__dots">
          <span className="hg-dot hg-dot--red" />
          <span className="hg-dot hg-dot--yellow" />
          <span className="hg-dot hg-dot--green" />
        </div>
        <div className="hero-graph-card__title">
          <Terminal size={12} className="hg-terminal-icon" />
          <span>state_graph_orchestrator.py</span>
        </div>
        <button
          type="button"
          className="hero-graph-card__replay"
          onClick={() => setCurrentStep(0)}
          title="Restart execution trace"
          aria-label="Restart execution trace"
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* SVG Canvas */}
      <div className="hero-graph-card__canvas">
        <svg
          viewBox="0 0 460 260"
          className="hero-graph-svg"
          aria-label="State Graph: Input to Agent, Tools, Reflection Loop, and Output"
        >
          <defs>
            {/* Standard edge arrow */}
            <marker
              id="hg-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,1.5 L8,5 L0,8.5 z" fill="rgba(255, 255, 255, 0.25)" />
            </marker>

            {/* Active edge arrow (Amber) */}
            <marker
              id="hg-arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,1.5 L8,5 L0,8.5 z" fill="#E7A33E" />
            </marker>

            {/* Active edge arrow (Teal) */}
            <marker
              id="hg-arrow-teal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0,1.5 L8,5 L0,8.5 z" fill="#5FB8A8" />
            </marker>

            {/* Amber Radial Glow for Active Node */}
            <radialGradient id="nodeActiveGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E7A33E" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#E7A33E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid lines in background of canvas */}
          <g className="hg-grid-lines" opacity="0.15">
            <line x1="30" y1="75" x2="430" y2="75" stroke="#FFFFFF" strokeDasharray="2 4" strokeWidth="0.8" />
            <line x1="30" y1="195" x2="430" y2="195" stroke="#FFFFFF" strokeDasharray="2 4" strokeWidth="0.8" />
            <line x1="195" y1="30" x2="195" y2="230" stroke="#FFFFFF" strokeDasharray="2 4" strokeWidth="0.8" />
            <line x1="260" y1="30" x2="260" y2="230" stroke="#FFFFFF" strokeDasharray="2 4" strokeWidth="0.8" />
          </g>

          {/* Edges */}
          {/* Edge 1: Input -> Agent */}
          <path
            d="M 84,75 L 167,75"
            className={`hg-edge ${activeNode >= 1 ? "hg-edge--active" : ""}`}
            markerEnd={activeNode >= 1 ? "url(#hg-arrow-active)" : "url(#hg-arrow)"}
          />

          {/* Edge 2: Agent -> Tool */}
          <path
            d="M 223,75 L 306,75"
            className={`hg-edge ${activeNode >= 2 ? "hg-edge--active" : ""}`}
            markerEnd={activeNode >= 2 ? "url(#hg-arrow-active)" : "url(#hg-arrow)"}
          />

          {/* Edge 3: Tool -> Reflect */}
          <path
            d="M 319,95 C 304,135 288,155 273,174"
            className={`hg-edge ${activeNode >= 3 ? "hg-edge--active" : ""}`}
            markerEnd={activeNode >= 3 ? "url(#hg-arrow-active)" : "url(#hg-arrow)"}
          />

          {/* Edge 4: Reflect -> Agent (Loopback feedback) */}
          <path
            d="M 247,175 C 224,145 204,125 198,103"
            className="hg-edge hg-edge--loopback"
            markerEnd="url(#hg-arrow-teal)"
          />
          <text x="195" y="145" className="hg-edge-label">reflect</text>

          {/* Edge 5: Reflect -> Output */}
          <path
            d="M 285,195 L 371,195"
            className={`hg-edge ${activeNode === 4 ? "hg-edge--active-teal" : ""}`}
            markerEnd={activeNode === 4 ? "url(#hg-arrow-teal)" : "url(#hg-arrow)"}
          />

          {/* Nodes */}
          {NODES.map((node, i) => {
            const isActive = activeNode === i;
            const isCompleted = activeNode > i;
            return (
              <g
                key={node.id}
                className={`hg-node-group ${isActive ? "is-active" : ""} ${
                  isCompleted ? "is-completed" : ""
                }`}
                onClick={() => setCurrentStep(i)}
                style={{ cursor: "pointer" }}
              >
                {/* Active Outer Glow Halo */}
                {isActive && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.r + 10}
                    fill="url(#nodeActiveGlow)"
                    className="hg-node__glow"
                  />
                )}

                {/* Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.r}
                  className="hg-node__circle"
                />

                {/* Node Tag (mono) */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className="hg-node__text"
                >
                  {node.tag}
                </text>

                {/* Subtitle below/above node */}
                <text
                  x={node.x}
                  y={node.y + node.r + 15}
                  textAnchor="middle"
                  className="hg-node__sub"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Terminal Ticker */}
      <div className="hero-graph-card__terminal">
        <div className="hg-term__line">
          <span className="hg-term__prompt">λ</span>
          <span className="hg-term__badge">{STEPS[currentStep].state.toUpperCase()}</span>
          <span className="hg-term__msg">{STEPS[currentStep].msg}</span>
          <span className="hg-term__cursor" />
        </div>
      </div>
    </div>
  );
}
