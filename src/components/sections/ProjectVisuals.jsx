import React from "react";

// Shared node/edge visual language â€” same idea as the hero's state-graph
// illustration: circles + mono labels + arrowed edges. Each project gets a
// pipeline diagram instead of a generic placeholder box.

function Node({ x, y, r = 20, label, active }) {
  return (
    <g className={active ? "pv-node pv-node--active" : "pv-node"}>
      <circle cx={x} cy={y} r={r} />
      <text x={x} y={y + 4} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Edge({ d, markerId, dashed }) {
  return <path d={d} className={dashed ? "pv-edge pv-edge--dashed" : "pv-edge"} markerEnd={`url(#${markerId})`} />;
}

function ArrowMarker({ id }) {
  return (
    <marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" className="pv-arrow" />
    </marker>
  );
}

export function RagVisual() {
  return (
    <svg viewBox="0 0 400 170" className="pv-svg" role="img" aria-label="Diagram: query goes to a retriever backed by a vector database, then to the LLM, producing a grounded response">
      <defs>
        <ArrowMarker id="pv-arrow-rag" />
      </defs>
      <Edge d="M56,85 L118,85" markerId="pv-arrow-rag" />
      <Edge d="M158,85 L242,85" markerId="pv-arrow-rag" />
      <Edge d="M282,85 L342,85" markerId="pv-arrow-rag" />
      <Edge d="M138,110 L138,65" markerId="pv-arrow-rag" dashed />
      <rect x="112" y="118" width="52" height="30" rx="3" className="pv-store" />
      <text x="138" y="137" textAnchor="middle" className="pv-store-label">
        vectors
      </text>
      <Node x={32} y={85} r={22} label="query" />
      <Node x={138} y={85} r={24} label="retrieve" />
      <Node x={262} y={85} r={24} label="LLM" active />
      <Node x={368} y={85} r={22} label="answer" />
    </svg>
  );
}

export function SummarizationVisual() {
  return (
    <svg viewBox="0 0 400 170" className="pv-svg" role="img" aria-label="Diagram: a long document is fed into a fine-tuned BART model, producing a short summary">
      <defs>
        <ArrowMarker id="pv-arrow-sum" />
      </defs>
      <Edge d="M96,85 L168,85" markerId="pv-arrow-sum" />
      <Edge d="M208,85 L292,85" markerId="pv-arrow-sum" />

      <g className="pv-doc" transform="translate(30,55)">
        <rect x="0" y="0" width="56" height="60" rx="2" />
        <line x1="10" y1="14" x2="46" y2="14" />
        <line x1="10" y1="24" x2="46" y2="24" />
        <line x1="10" y1="34" x2="46" y2="34" />
        <line x1="10" y1="44" x2="34" y2="44" />
      </g>

      <Node x={188} y={85} r={24} label="BART" active />

      <g className="pv-doc pv-doc--summary" transform="translate(316,64)">
        <rect x="0" y="0" width="52" height="42" rx="2" />
        <line x1="9" y1="13" x2="43" y2="13" />
        <line x1="9" y1="23" x2="43" y2="23" />
        <line x1="9" y1="33" x2="28" y2="33" />
      </g>

      <text x="340" y="126" textAnchor="middle" className="pv-store-label">
        ROUGE-evaluated
      </text>
    </svg>
  );
}

export function BrailleVisual() {
  const brailleCells = [
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  return (
    <svg viewBox="0 0 400 170" className="pv-svg" role="img" aria-label="Diagram: handwritten input passes through a CNN, then an LSTM, decoded with CTC loss, into Braille output">
      <defs>
        <ArrowMarker id="pv-arrow-br" />
      </defs>
      <Edge d="M62,85 L98,85" markerId="pv-arrow-br" />
      <Edge d="M130,85 L166,85" markerId="pv-arrow-br" />
      <Edge d="M198,85 L234,85" markerId="pv-arrow-br" />
      <Edge d="M266,85 L302,85" markerId="pv-arrow-br" />

      <g transform="translate(20,72)" className="pv-scribble">
        <path d="M0,14 C6,0 12,24 18,10 C22,0 26,20 32,8 C36,2 40,16 44,10" />
      </g>

      <Node x={114} y={85} r={20} label="CNN" />
      <Node x={182} y={85} r={20} label="LSTM" />
      <Node x={250} y={85} r={20} label="CTC" active />

      <g transform="translate(318,62)">
        {brailleCells.map((row, r) =>
          row.map((filled, c) => (
            <circle
              key={`${r}-${c}`}
              cx={c * 16}
              cy={r * 16}
              r="4.5"
              className={filled ? "pv-braille-dot pv-braille-dot--on" : "pv-braille-dot"}
            />
          ))
        )}
      </g>
    </svg>
  );
}

export const PROJECT_VISUALS = {
  rag: RagVisual,
  summarization: SummarizationVisual,
  braille: BrailleVisual,
};
