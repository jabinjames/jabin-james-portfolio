import React, { useEffect, useRef } from "react";
import { X, ExternalLink, Github, Cpu, Layers, Terminal, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { PROJECT_VISUALS } from "../sections/ProjectVisuals.jsx";

export default function ProjectModal({ project, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!project) return null;

  const Visual = PROJECT_VISUALS[project.id];

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div
        className="modal modal--project-rich"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={ref}
        tabIndex={-1}
      >
        {/* Modal Top Header Bar */}
        <div className="modal-rich-topbar">
          <div className="modal-rich-badge">
            <Sparkles size={13} />
            <span>Architecture Deep Dive // {project.badge || project.category}</span>
          </div>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close case study"
            data-cursor="CLOSE"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="modal-rich-scrollbody">
          <h2 id="project-modal-title" className="modal-rich-title">
            {project.name}
          </h2>
          <p className="modal-rich-tagline">{project.tagline}</p>

          {/* Interactive Visual Simulator in Modal */}
          <div className="modal-rich-visual-container">
            {project.image ? (
              <img src={project.image} alt={`${project.name} preview`} />
            ) : (
              Visual && <Visual isModal={true} />
            )}
          </div>

          {/* Key Metrics Row */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="project-card__metrics" style={{ marginBottom: "28px" }}>
              {project.metrics.map((m, idx) => (
                <div className="project-metric" key={idx}>
                  <span className="project-metric__label">{m.label}</span>
                  <span className="project-metric__value" style={{ fontSize: "14px" }}>
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Problem vs Approach Grid */}
          <div className="modal-rich-grid">
            <div className="modal-card-block">
              <h4>
                <ShieldCheck size={14} color="var(--amber)" />
                <span>Problem Statement</span>
              </h4>
              <p>{project.problem}</p>
            </div>

            <div className="modal-card-block">
              <h4>
                <Zap size={14} color="var(--teal)" />
                <span>Engineered Solution</span>
              </h4>
              <p>{project.solution}</p>
            </div>
          </div>

          {/* Architecture Highlights / Key Features */}
          <div className="modal-card-block" style={{ marginBottom: "28px" }}>
            <h4>
              <CheckCircle2 size={14} color="var(--teal)" />
              <span>Key Architectural Features & Engineering</span>
            </h4>
            <ul>
              {project.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* Technology Stack */}
          <div className="modal-card-block" style={{ marginBottom: "28px" }}>
            <h4>
              <Terminal size={14} color="var(--amber)" />
              <span>Technology & Frameworks</span>
            </h4>
            <div className="project-card__tech" style={{ margin: 0 }}>
              {project.tech.map((t) => (
                <span className="tech-tag" key={t} style={{ fontSize: "12px", padding: "5px 12px" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Action Links */}
          <div className="modal-rich-footer">
            <div style={{ color: "var(--text-faint)", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
              Status: <span style={{ color: "var(--teal)" }}>{project.status}</span>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--primary"
                  data-cursor="GITHUB"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <Github size={15} />
                  <span>View Repository</span>
                </a>
              )}
              {project.demoUrl && project.demoUrl !== project.githubUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--ghost"
                  data-cursor="DEMO"
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <ExternalLink size={15} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
