import React from "react";
import { DATA } from "../../data/resume.js";

// Display metadata per technology — short monogram + an optional one-line
// tooltip for the less self-explanatory items. Tied to DATA.skills by name
// so this never drifts from the resume data; anything without an entry
// here still renders fine via the fallback below.
const TECH_META = {
  Python: { mono: "PY", color: "#3776AB" },
  Java: { mono: "JAVA", color: "#EA6D2F" },
  SQL: { mono: "SQL" },
  NumPy: { mono: "NP", color: "#4DABCF" },
  Pandas: { mono: "PD" },
  Matplotlib: { mono: "MPL" },
  PyTorch: { mono: "PT", color: "#EE4C2C" },
  "Hugging Face Transformers": { mono: "HF", color: "#FFD21E" },
  React: { mono: "RE", color: "#61DAFB" },
  HTML: { mono: "HTML", color: "#E44D26" },
  CSS: { mono: "CSS", color: "#2965F1" },

  LangChain: { mono: "LC", desc: "Framework for building LLM-powered applications." },
  "LangGraph StateGraph": { mono: "LG", desc: "Stateful orchestration for multi-step LLM workflows." },
  "Groq LLM": { mono: "GRQ" },
  "RAG Pipelines": { mono: "RAG", desc: "Grounding LLM responses in retrieved documents." },
  "LLM Agent Orchestration": { mono: "AGT" },
  MLOps: { mono: "OPS", desc: "Operational practices for training and shipping ML models." },

  "Machine Learning": { mono: "ML" },
  "Deep Learning": { mono: "DL" },
  CNNs: { mono: "CNN", desc: "Convolutional networks for image/spatial feature extraction." },
  LSTMs: { mono: "LSTM", desc: "Recurrent networks for modelling sequential data." },
  "CTC Loss": { mono: "CTC", desc: "Sequence alignment without explicit segmentation." },
  NLP: { mono: "NLP" },
  EDA: { mono: "EDA", desc: "Exploratory Data Analysis." },
  "Feature Engineering": { mono: "FE" },
  "Model Evaluation": { mono: "EVAL" },

  Git: { mono: "GIT", color: "#F05032" },
  GitHub: { mono: "GH" },
  "Power BI": { mono: "PBI", color: "#F2C811" },
  Excel: { mono: "XLS", color: "#217346" },
  MySQL: { mono: "MY", color: "#00758F" },
  NoSQL: { mono: "NSQL" },
  "Production Support": { mono: "PROD" },
  "Workflow Orchestration": { mono: "WF" },
};

function fallbackMono(name) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 4).toUpperCase();
  return words
    .slice(0, 3)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Skills() {
  const rows = Object.entries(DATA.skills);

  return (
    <section id="skills" className="section">
      <div className="section__head" data-reveal>
        <h2>Skills</h2>
        <p className="section__sub">The technologies I actually reach for.</p>
      </div>

      <div className="tech-wall">
        {rows.map(([category, group]) => (
          <div className="tech-wall__row" key={category}>
            {group.items.map((name) => {
              const meta = TECH_META[name] || {};
              const mono = meta.mono || fallbackMono(name);
              const categoryAccent = group.color === "amber" ? "var(--amber)" : "var(--teal)";
              const accent = meta.color || categoryAccent;
              return (
                <div
                  key={name}
                  className="tech-card"
                  style={{ "--tech-accent": accent }}
                  data-reveal
                  title={meta.desc || undefined}
                >
                  <span className="tech-card__icon">{mono}</span>
                  <span className="tech-card__name">{name}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}