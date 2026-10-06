import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Sparkles, Activity, Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion.js";

// ============================================================================
// 1. ADAPTIVE RAG PIPELINE SIMULATOR
// ============================================================================

const RAG_STAGES = [
  {
    id: "query",
    name: "Query Ingestion",
    short: "QUERY",
    x: 42,
    y: 95,
    tag: "USER",
    telemetry: "Query: 'Explain LangGraph conditional routing' [Dim: 1536]",
  },
  {
    id: "router",
    name: "Adaptive Router",
    short: "ROUTER",
    x: 130,
    y: 95,
    tag: "AGENT",
    telemetry: "Evaluating intent: Domain specific detected -> Vector path chosen",
  },
  {
    id: "chroma",
    name: "ChromaDB Retrieval",
    short: "CHROMA",
    x: 220,
    y: 50,
    tag: "VECTORS",
    telemetry: "ChromaDB: Cosine sim search k=4 chunks (dist: 0.12, 0.16, 0.18)",
  },
  {
    id: "rerank",
    name: "Dynamic Reranker",
    short: "RERANK",
    x: 220,
    y: 140,
    tag: "FILTER",
    telemetry: "Context threshold check: 3 chunks pass (>0.85 score), 1 pruned",
  },
  {
    id: "llm",
    name: "Groq LLM Synthesis",
    short: "LLM",
    x: 320,
    y: 95,
    tag: "GROQ",
    telemetry: "Synthesizing answer with grounded context @ 780 tokens/sec",
  },
  {
    id: "guardrail",
    name: "Grounded Answer",
    short: "VERIFIED",
    x: 412,
    y: 95,
    tag: "PASS",
    telemetry: "Hallucination check: 0.01% risk (citations verified, grounded: 99.4%)",
  },
];

export function RagVisual({ isModal = false }) {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (reducedMotion || !isPlaying) return;
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % RAG_STAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [reducedMotion, isPlaying]);

  const current = RAG_STAGES[stage];

  return (
    <div
      className="rag-sim-container"
      onMouseEnter={() => !isModal && setIsPlaying(false)}
      onMouseLeave={() => !isModal && setIsPlaying(true)}
    >
      {/* Console bar */}
      <div className="preview-console-bar">
        <div className="preview-console-title">
          <Activity size={12} color="var(--amber)" />
          <span>adaptive_rag_pipeline.py</span>
        </div>
        <div className="preview-console-controls">
          <button
            type="button"
            className="preview-action-btn"
            onClick={() => setIsPlaying((p) => !p)}
            title={isPlaying ? "Pause simulation" : "Play simulation"}
            data-cursor={isPlaying ? "PAUSE" : "PLAY"}
          >
            {isPlaying ? <Pause size={10} /> : <Play size={10} />}
            <span>{isPlaying ? "Live" : "Paused"}</span>
          </button>
          <button
            type="button"
            className="preview-action-btn"
            onClick={() => setStage(0)}
            title="Restart trace"
            data-cursor="RESTART"
          >
            <RotateCcw size={10} />
          </button>
        </div>
      </div>

      {/* SVG Pipeline Canvas */}
      <div className="preview-svg-stage">
        <svg
          viewBox="0 0 460 190"
          className="rag-svg"
          role="img"
          aria-label="Adaptive RAG Pipeline interactive state diagram"
        >
          <defs>
            {/* Ambient linear grid */}
            <pattern id="rag-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.8" />
            </pattern>

            {/* Glowing arrow markers */}
            <marker id="rag-arrow-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="var(--amber)" />
            </marker>
            <marker id="rag-arrow-teal" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="var(--teal)" />
            </marker>
            <marker id="rag-arrow-dim" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,1 L9,5 L0,9 z" fill="rgba(255,255,255,0.18)" />
            </marker>

            {/* Neon Glow Filter */}
            <filter id="rag-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#rag-grid)" />

          {/* Connection Edges */}
          {/* Query to Router */}
          <path
            d="M 68 95 L 102 95"
            className={stage >= 1 ? "diag-path-active" : "diag-path-base"}
            markerEnd={`url(#${stage >= 1 ? "rag-arrow-amber" : "rag-arrow-dim"})`}
          />

          {/* Router to Chroma (curved top) */}
          <path
            d="M 156 80 C 170 55, 185 50, 195 50"
            className={stage >= 2 ? "diag-path-teal" : "diag-path-base"}
            markerEnd={`url(#${stage >= 2 ? "rag-arrow-teal" : "rag-arrow-dim"})`}
          />

          {/* Chroma to Reranker (vertical dashed) */}
          <path
            d="M 220 70 L 220 118"
            className={`diag-path-base diag-path-dashed ${stage >= 3 ? "diag-path-teal" : ""}`}
            markerEnd={`url(#${stage >= 3 ? "rag-arrow-teal" : "rag-arrow-dim"})`}
          />

          {/* Router to Reranker (curved bottom) */}
          <path
            d="M 156 110 C 170 135, 185 140, 195 140"
            className="diag-path-base"
            strokeDasharray="3 3"
          />

          {/* Reranker to LLM (curved up) */}
          <path
            d="M 248 140 C 275 140, 285 105, 296 98"
            className={stage >= 4 ? "diag-path-active" : "diag-path-base"}
            markerEnd={`url(#${stage >= 4 ? "rag-arrow-amber" : "rag-arrow-dim"})`}
          />

          {/* Chroma to LLM (curved down) */}
          <path
            d="M 248 50 C 275 50, 285 85, 296 92"
            className={stage >= 4 ? "diag-path-teal" : "diag-path-base"}
            markerEnd={`url(#${stage >= 4 ? "rag-arrow-teal" : "rag-arrow-dim"})`}
          />

          {/* LLM to Guardrail/Answer */}
          <path
            d="M 346 95 L 386 95"
            className={stage >= 5 ? "diag-path-active" : "diag-path-base"}
            markerEnd={`url(#${stage >= 5 ? "rag-arrow-amber" : "rag-arrow-dim"})`}
          />

          {/* Active Travelling Data Packet */}
          <circle
            cx={current.x}
            cy={current.y}
            r="6"
            className="rag-packet"
          />
          <circle
            cx={current.x}
            cy={current.y}
            r="12"
            fill="none"
            stroke={stage === 2 || stage === 3 ? "var(--teal)" : "var(--amber)"}
            strokeWidth="1.2"
            opacity="0.6"
            className="chroma-ping"
          />

          {/* Node 0: Query */}
          <g
            className={`rag-node ${stage === 0 ? "rag-node--active" : ""}`}
            onClick={() => setStage(0)}
            style={{ cursor: "pointer" }}
          >
            <rect x="18" y="74" width="48" height="42" rx="8" className="rag-node-box" />
            <text x="42" y="93" textAnchor="middle" className="rag-node-title">Query</text>
            <text x="42" y="106" textAnchor="middle" className="rag-node-sub">Intent</text>
          </g>

          {/* Node 1: Router */}
          <g
            className={`rag-node ${stage === 1 ? "rag-node--active" : ""}`}
            onClick={() => setStage(1)}
            style={{ cursor: "pointer" }}
          >
            <rect x="105" y="74" width="52" height="42" rx="8" className="rag-node-box" />
            <text x="131" y="93" textAnchor="middle" className="rag-node-title">Router</text>
            <text x="131" y="106" textAnchor="middle" className="rag-node-sub">Dynamic</text>
          </g>

          {/* Node 2: ChromaDB */}
          <g
            className={`rag-node ${stage === 2 ? "rag-node--active-teal" : ""}`}
            onClick={() => setStage(2)}
            style={{ cursor: "pointer" }}
          >
            <rect x="195" y="28" width="52" height="42" rx="8" className="rag-node-box" />
            <ellipse cx="221" cy="38" rx="14" ry="4" className="chroma-ring" />
            <text x="221" y="52" textAnchor="middle" className="rag-node-title">Chroma</text>
            <text x="221" y="63" textAnchor="middle" className="rag-node-sub">Vectors</text>
          </g>

          {/* Node 3: Reranker */}
          <g
            className={`rag-node ${stage === 3 ? "rag-node--active-teal" : ""}`}
            onClick={() => setStage(3)}
            style={{ cursor: "pointer" }}
          >
            <rect x="195" y="118" width="52" height="42" rx="8" className="rag-node-box" />
            <text x="221" y="137" textAnchor="middle" className="rag-node-title">Rerank</text>
            <text x="221" y="150" textAnchor="middle" className="rag-node-sub">Threshold</text>
          </g>

          {/* Node 4: LLM */}
          <g
            className={`rag-node ${stage === 4 ? "rag-node--active" : ""}`}
            onClick={() => setStage(4)}
            style={{ cursor: "pointer" }}
          >
            <rect x="296" y="74" width="50" height="42" rx="8" className="rag-node-box" />
            <text x="321" y="93" textAnchor="middle" className="rag-node-title">Groq LLM</text>
            <text x="321" y="106" textAnchor="middle" className="rag-node-sub">Grounded</text>
          </g>

          {/* Node 5: Output / Guardrail */}
          <g
            className={`rag-node ${stage === 5 ? "rag-node--active" : ""}`}
            onClick={() => setStage(5)}
            style={{ cursor: "pointer" }}
          >
            <rect x="388" y="74" width="54" height="42" rx="8" className="rag-node-box" />
            <text x="415" y="93" textAnchor="middle" className="rag-node-title">Answer</text>
            <text x="415" y="106" textAnchor="middle" className="rag-node-sub">Verified ✓</text>
          </g>
        </svg>
      </div>

      {/* Telemetry live feed */}
      <div className="preview-telemetry">
        <div className="preview-telemetry__item">
          <span>Active:</span>
          <span className="preview-telemetry__val preview-telemetry__val--amber">{current.name}</span>
        </div>
        <div className="preview-telemetry__item" style={{ maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <span>Log:</span>
          <span className="preview-telemetry__val">{current.telemetry}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. TEXT SUMMARIZATION (BART TRANSFORMER) SIMULATOR
// ============================================================================

const SUMMARIZATION_MODES = [
  {
    topic: "Transformer Paper",
    originalTokens: 480,
    summaryTokens: 96,
    rouge1: "44.8",
    rougeL: "42.1",
    compression: "80%",
    summary: "BART applies denoising sequence-to-sequence autoencoders to achieve state-of-the-art abstractive summarization across long text.",
  },
  {
    topic: "Engineering Spec",
    originalTokens: 520,
    summaryTokens: 110,
    rouge1: "43.9",
    rougeL: "41.4",
    compression: "78%",
    summary: "Fine-tuned preprocessing and tokenization pipelines optimize memory limits, producing coherent summaries evaluated by ROUGE.",
  },
];

export function SummarizationVisual({ isModal = false }) {
  const reducedMotion = usePrefersReducedMotion();
  const [modeIdx, setModeIdx] = useState(0);
  const [pulsePhase, setPulsePhase] = useState(0);
  const [isInferring, setIsInferring] = useState(true);

  useEffect(() => {
    if (reducedMotion || !isInferring) return;
    const interval = setInterval(() => {
      setPulsePhase((prev) => (prev + 1) % 4);
    }, 1800);
    return () => clearInterval(interval);
  }, [reducedMotion, isInferring]);

  const activeMode = SUMMARIZATION_MODES[modeIdx];

  return (
    <div
      className="rag-sim-container"
      onMouseEnter={() => !isModal && setIsInferring(false)}
      onMouseLeave={() => !isModal && setIsInferring(true)}
    >
      {/* Console Bar */}
      <div className="preview-console-bar">
        <div className="preview-console-title">
          <Layers size={12} color="var(--teal)" />
          <span>bart_seq2seq_transformer.py</span>
        </div>
        <div className="preview-console-controls">
          <button
            type="button"
            className="preview-action-btn"
            onClick={() => setModeIdx((prev) => (prev + 1) % SUMMARIZATION_MODES.length)}
            title="Cycle document sample"
            data-cursor="SAMPLE"
          >
            <span>Sample: {activeMode.topic}</span>
          </button>
          <button
            type="button"
            className="preview-action-btn preview-action-btn--active"
            onClick={() => {
              setPulsePhase(0);
              setIsInferring(true);
            }}
            title="Trigger attention inference"
            data-cursor="INFER"
          >
            <Sparkles size={10} />
            <span>Infer</span>
          </button>
        </div>
      </div>

      {/* SVG Attention Stage */}
      <div className="preview-svg-stage">
        <svg
          viewBox="0 0 460 190"
          className="summarization-svg"
          role="img"
          aria-label="BART Transformer multi-head cross-attention compression visualizer"
        >
          <defs>
            <linearGradient id="beamGradAmberTeal" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="var(--amber)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="coreGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E232E" />
              <stop offset="100%" stopColor="#13171F" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#rag-grid)" />

          {/* LEFT: Source Document Document Container */}
          <g transform="translate(24, 25)">
            <rect x="0" y="0" width="94" height="140" rx="8" className="bart-layer-box" />
            <text x="12" y="20" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="600">
              INPUT DOC
            </text>
            <text x="12" y="32" fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize="7.5">
              {activeMode.originalTokens} tokens
            </text>

            {/* Token lines with dynamic attention highlights */}
            {[
              { y: 46, w: 70, lit: pulsePhase === 0 },
              { y: 58, w: 60, lit: false },
              { y: 70, w: 74, lit: pulsePhase === 1 },
              { y: 82, w: 55, lit: pulsePhase === 0 },
              { y: 94, w: 68, lit: false },
              { y: 106, w: 62, lit: pulsePhase === 2 },
              { y: 118, w: 45, lit: false },
            ].map((tok, i) => (
              <rect
                key={i}
                x="12"
                y={tok.y}
                width={tok.w}
                height="6"
                rx="3"
                className={`bart-token ${tok.lit ? "bart-token--lit" : ""}`}
              />
            ))}
          </g>

          {/* CENTER: BART Transformer Stack */}
          <g transform="translate(160, 25)">
            <rect
              x="0"
              y="0"
              width="134"
              height="140"
              rx="10"
              className="bart-layer-box bart-layer-box--pulse"
              fill="url(#coreGlow)"
            />
            <text x="67" y="22" textAnchor="middle" fill="var(--amber)" fontFamily="var(--font-mono)" fontSize="10" fontWeight="700">
              BART TRANSFORMER
            </text>
            <text x="67" y="34" textAnchor="middle" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="8">
              Bidirectional + Autoregressive
            </text>

            {/* Encoder sub-box */}
            <rect x="12" y="44" width="110" height="26" rx="5" fill="#171C24" stroke="rgba(231,163,62,0.3)" strokeWidth="1" />
            <text x="67" y="60" textAnchor="middle" fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize="9">
              6× Encoder Layers
            </text>

            {/* Cross attention bridge */}
            <line x1="67" y1="70" x2="67" y2="82" stroke="var(--teal)" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="67" cy="76" r="3" fill="var(--teal)" className="chroma-ping" />

            {/* Decoder sub-box */}
            <rect x="12" y="82" width="110" height="26" rx="5" fill="#171C24" stroke="rgba(95,184,168,0.35)" strokeWidth="1" />
            <text x="67" y="98" textAnchor="middle" fill="var(--teal)" fontFamily="var(--font-mono)" fontSize="9">
              6× Decoder Layers
            </text>

            {/* Bottom latent badge */}
            <rect x="24" y="116" width="86" height="16" rx="3" fill="rgba(231,163,62,0.12)" />
            <text x="67" y="127" textAnchor="middle" fill="var(--amber)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600">
              Latent Compress: {activeMode.compression}
            </text>
          </g>

          {/* Attention Beams: From Input to Transformer */}
          <path
            d="M 118 72 C 135 72, 145 60, 160 58"
            className={`bart-attention-beam ${pulsePhase === 0 ? "bart-attention-beam--active" : ""}`}
          />
          <path
            d="M 118 95 C 135 95, 145 65, 160 62"
            className={`bart-attention-beam ${pulsePhase === 1 ? "bart-attention-beam--active" : ""}`}
          />
          <path
            d="M 118 130 C 135 130, 145 75, 160 66"
            className={`bart-attention-beam ${pulsePhase === 2 ? "bart-attention-beam--active" : ""}`}
          />

          {/* Attention Beams: From Transformer to Summary */}
          <path
            d="M 294 95 C 315 95, 325 80, 342 75"
            className={`bart-attention-beam ${pulsePhase >= 1 ? "bart-attention-beam--active" : ""}`}
          />
          <path
            d="M 294 100 C 315 100, 325 110, 342 110"
            className={`bart-attention-beam ${pulsePhase >= 2 ? "bart-attention-beam--active" : ""}`}
          />

          {/* RIGHT: Abstractive Summary Card */}
          <g transform="translate(342, 35)">
            <rect x="0" y="0" width="96" height="120" rx="8" className="bart-layer-box" stroke="rgba(95,184,168,0.3)" />
            <text x="12" y="20" fill="var(--teal)" fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="600">
              ABSTRACTIVE
            </text>
            <text x="12" y="32" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="7.5">
              {activeMode.summaryTokens} tokens
            </text>

            {/* Generated Summary Lines */}
            <rect x="12" y="44" width="72" height="6" rx="3" className="bart-token bart-token--teal" />
            <rect x="12" y="56" width="68" height="6" rx="3" className="bart-token bart-token--teal" />
            <rect x="12" y="68" width="56" height="6" rx="3" className="bart-token bart-token--teal" />
            <rect x="12" y="80" width="64" height="6" rx="3" className="bart-token bart-token--lit" />

            {/* ROUGE Pill */}
            <rect x="10" y="98" width="76" height="16" rx="4" fill="rgba(95,184,168,0.12)" stroke="rgba(95,184,168,0.3)" strokeWidth="0.8" />
            <text x="48" y="109" textAnchor="middle" fill="var(--teal)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600">
              ROUGE-1: {activeMode.rouge1}
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry bar */}
      <div className="preview-telemetry">
        <div className="preview-telemetry__item">
          <span>ROUGE-L Score:</span>
          <span className="preview-telemetry__val">{activeMode.rougeL} F1</span>
        </div>
        <div className="preview-telemetry__item">
          <span>Compression:</span>
          <span className="preview-telemetry__val preview-telemetry__val--amber">{activeMode.compression} ratio</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. HANDWRITTEN TEXT -> BRAILLE (CNN + LSTM + CTC) SIMULATOR
// ============================================================================

// Braille 6-dot matrix encoding for characters (2 cols x 3 rows):
// [dot1, dot2, dot3, dot4, dot5, dot6]
// Row 0: 0, 3
// Row 1: 1, 4
// Row 2: 2, 5
const BRAILLE_MAP = {
  a: [1, 0, 0, 0, 0, 0],
  b: [1, 1, 0, 0, 0, 0],
  c: [1, 0, 0, 1, 0, 0],
  d: [1, 0, 0, 1, 1, 0],
  e: [1, 0, 0, 0, 1, 0],
  h: [1, 1, 0, 0, 1, 0],
  i: [0, 1, 0, 1, 0, 0],
  l: [1, 1, 1, 0, 0, 0],
  o: [1, 0, 1, 0, 1, 0],
  p: [1, 1, 1, 1, 0, 0],
  r: [1, 1, 1, 0, 1, 0],
};

const BRAILLE_WORDS = [
  { word: "ai", letters: ["a", "i"], braille: "⠁⠊", label: "AI" },
  { word: "braille", letters: ["b", "r", "a", "i", "l", "l", "e"], braille: "⠃⠗⠁⠊⠇⠇⠑", label: "Braille" },
  { word: "hello", letters: ["h", "e", "l", "l", "o"], braille: "⠓⠑⠇⠇⠕", label: "Hello" },
];

export function BrailleVisual({ isModal = false }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [isScanning, setIsScanning] = useState(true);

  const activeSample = BRAILLE_WORDS[wordIdx];

  return (
    <div
      className="rag-sim-container"
      onMouseEnter={() => !isModal && setIsScanning(false)}
      onMouseLeave={() => !isModal && setIsScanning(true)}
    >
      {/* Console Bar */}
      <div className="preview-console-bar">
        <div className="preview-console-title">
          <Activity size={12} color="var(--amber)" />
          <span>cnn_lstm_ctc_braille.py</span>
        </div>
        <div className="preview-console-controls">
          <button
            type="button"
            className="preview-action-btn"
            onClick={() => setWordIdx((p) => (p + 1) % BRAILLE_WORDS.length)}
            title="Cycle handwritten word"
            data-cursor="CYCLE"
          >
            <span>Word: '{activeSample.label}'</span>
          </button>
          <button
            type="button"
            className="preview-action-btn preview-action-btn--active"
            onClick={() => setWordIdx((p) => (p + 1) % BRAILLE_WORDS.length)}
            title="Translate in real-time"
            data-cursor="DECODE"
          >
            <Sparkles size={10} />
            <span>Decode</span>
          </button>
        </div>
      </div>

      {/* SVG Pipeline Canvas */}
      <div className="preview-svg-stage">
        <svg
          viewBox="0 0 460 190"
          className="braille-svg"
          role="img"
          aria-label="Handwritten text recognition to Braille conversion through CNN, LSTM, and CTC loss"
        >
          <defs>
            <radialGradient id="brailleDotAmberGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF3D6" />
              <stop offset="35%" stopColor="#F5B942" />
              <stop offset="100%" stopColor="#B37415" />
            </radialGradient>

            <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--teal)" stopOpacity="0.1" />
              <stop offset="50%" stopColor="var(--teal)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="var(--teal)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Background grid */}
          <rect width="100%" height="100%" fill="url(#rag-grid)" />

          {/* STAGE 1: Handwritten Stroke Canvas (Left) */}
          <g transform="translate(18, 25)">
            <rect x="0" y="0" width="118" height="140" rx="8" className="bart-layer-box" />
            <text x="12" y="20" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="600">
              HANDWRITTEN
            </text>
            <text x="12" y="32" fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize="7.5">
              Input Stroke: "{activeSample.label}"
            </text>

            {/* Realistic SVG Cursive Handwriting Glyphs */}
            {activeSample.word === "ai" && (
              <g transform="translate(15, 52)">
                <path
                  d="M 10 45 C 8 25, 25 15, 38 32 C 45 42, 42 55, 30 55 C 20 55, 12 45, 22 35 C 32 25, 42 45, 48 55 M 56 30 C 58 40, 62 55, 72 55 M 59 18 A 2 2 0 1 1 60 18"
                  className="braille-handwriting-path braille-handwriting-path--active"
                />
              </g>
            )}

            {activeSample.word === "braille" && (
              <g transform="translate(10, 52)">
                <path
                  d="M 8 10 C 10 50, 18 55, 24 45 C 30 35, 20 28, 12 36 M 26 40 C 32 30, 42 32, 45 42 M 52 42 C 50 32, 60 30, 64 45 M 70 28 C 72 45, 74 52, 78 52 M 84 10 C 86 50, 88 52, 92 52 M 95 38 C 94 48, 104 46, 102 38"
                  className="braille-handwriting-path braille-handwriting-path--active"
                />
              </g>
            )}

            {activeSample.word === "hello" && (
              <g transform="translate(12, 52)">
                <path
                  d="M 10 10 C 12 55, 15 52, 22 32 C 28 20, 36 50, 40 52 M 45 42 C 42 32, 52 30, 54 44 M 60 10 C 62 50, 65 52, 70 52 M 74 10 C 76 50, 80 52, 85 52 M 90 40 C 88 32, 100 32, 98 46 C 96 54, 88 50, 92 40"
                  className="braille-handwriting-path braille-handwriting-path--active"
                />
              </g>
            )}

            {/* Sweeping Laser Scan Line */}
            <g transform="translate(8, 42)">
              <rect x="0" y="0" width="3" height="85" fill="url(#scanBeamGrad)" className="braille-scanline" />
            </g>
          </g>

          {/* STAGE 2: Deep Learning Neural Core (Middle) */}
          <g transform="translate(148, 25)">
            <rect x="0" y="0" width="138" height="140" rx="10" className="bart-layer-box" fill="#13171F" />
            <text x="69" y="22" textAnchor="middle" fill="var(--amber)" fontFamily="var(--font-mono)" fontSize="9.5" fontWeight="700">
              NEURAL TRANSLATOR
            </text>
            <text x="69" y="34" textAnchor="middle" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="7.5">
              Zero Character Pre-seg
            </text>

            {/* CNN Feature Layer */}
            <rect x="12" y="44" width="114" height="24" rx="5" fill="#181D26" stroke="rgba(231,163,62,0.3)" strokeWidth="1" />
            <text x="22" y="59" fill="var(--amber)" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600">CNN</text>
            <text x="50" y="59" fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize="8">Feature Extraction</text>

            {/* Bi-LSTM Layer */}
            <rect x="12" y="74" width="114" height="24" rx="5" fill="#181D26" stroke="rgba(95,184,168,0.35)" strokeWidth="1" />
            <text x="22" y="89" fill="var(--teal)" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600">LSTM</text>
            <text x="54" y="89" fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize="8">Temporal Sequences</text>

            {/* CTC Loss Layer */}
            <rect x="12" y="104" width="114" height="24" rx="5" fill="#181D26" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text x="22" y="119" fill="#FFFFFF" fontFamily="var(--font-mono)" fontSize="9" fontWeight="600">CTC</text>
            <text x="48" y="119" fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize="8">Loss Alignment</text>
          </g>

          {/* Connection Arrows between stages */}
          <path d="M 136 95 L 148 95" className="diag-path-teal" markerEnd="url(#rag-arrow-teal)" />
          <path d="M 286 95 L 298 95" className="diag-path-active" markerEnd="url(#rag-arrow-amber)" />

          {/* STAGE 3: Tactile 3D Braille Output (Right) */}
          <g transform="translate(298, 25)">
            <rect x="0" y="0" width="144" height="140" rx="8" className="bart-layer-box" stroke="rgba(231,163,62,0.3)" />
            <text x="14" y="20" fill="var(--amber)" fontFamily="var(--font-mono)" fontSize="8.5" fontWeight="600">
              BRAILLE CELL
            </text>
            <text x="14" y="32" fill="var(--text-dim)" fontFamily="var(--font-mono)" fontSize="7.5">
              Decoded: {activeSample.braille}
            </text>

            {/* Render 3D Tactile Braille Cells for first 2-3 characters */}
            <g transform="translate(18, 48)">
              {activeSample.letters.slice(0, 3).map((letter, charIdx) => {
                const dots = BRAILLE_MAP[letter] || [1, 0, 0, 0, 0, 0];
                const offsetX = charIdx * 38;

                return (
                  <g key={`${letter}-${charIdx}`} transform={`translate(${offsetX}, 0)`}>
                    {/* Cell boundary frame */}
                    <rect x="0" y="0" width="28" height="42" rx="4" fill="#0E1217" stroke="rgba(255,255,255,0.06)" />
                    <text x="14" y="54" textAnchor="middle" fill="var(--text-faint)" fontFamily="var(--font-mono)" fontSize="8">
                      {letter}
                    </text>

                    {/* 6 Dots: 2 columns x 3 rows */}
                    {[
                      { r: 0, c: 0, idx: 0 },
                      { r: 1, c: 0, idx: 1 },
                      { r: 2, c: 0, idx: 2 },
                      { r: 0, c: 1, idx: 3 },
                      { r: 1, c: 1, idx: 4 },
                      { r: 2, c: 1, idx: 5 },
                    ].map(({ r, c, idx }) => {
                      const isOn = dots[idx] === 1;
                      const cx = 8 + c * 12;
                      const cy = 8 + r * 13;

                      return (
                        <circle
                          key={idx}
                          cx={cx}
                          cy={cy}
                          r={isOn ? "4" : "2.6"}
                          className={isOn ? "braille-dot-on" : "braille-dot-off"}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </g>

            {/* Bottom confidence tag */}
            <rect x="14" y="112" width="116" height="18" rx="4" fill="rgba(231,163,62,0.1)" />
            <text x="72" y="124" textAnchor="middle" fill="var(--amber)" fontFamily="var(--font-mono)" fontSize="8" fontWeight="600">
              Confidence: 98.7% ✓
            </text>
          </g>
        </svg>
      </div>

      {/* Telemetry bottom bar */}
      <div className="preview-telemetry">
        <div className="preview-telemetry__item">
          <span>Alignment:</span>
          <span className="preview-telemetry__val preview-telemetry__val--amber">CTC Loss / Greedy Search</span>
        </div>
        <div className="preview-telemetry__item">
          <span>Output:</span>
          <span className="preview-telemetry__val">{activeSample.braille} (Tactile)</span>
        </div>
      </div>
    </div>
  );
}

export const PROJECT_VISUALS = {
  rag: RagVisual,
  summarization: SummarizationVisual,
  braille: BrailleVisual,
};
