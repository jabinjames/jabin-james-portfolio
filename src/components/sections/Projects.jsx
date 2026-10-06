import React, { useState, useRef, useEffect } from "react";
import { Github, ArrowRight, Terminal, Layers, Cpu } from "lucide-react";
import { DATA } from "../../data/resume.js";
import { PROJECT_VISUALS } from "./ProjectVisuals.jsx";
import ProjectModal from "../modals/ProjectModal.jsx";
import "../../styles/projects.css";

const CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "Agentic & RAG", label: "Agentic & RAG" },
  { id: "Deep Learning & NLP", label: "Deep Learning & NLP" },
];

function ProjectCard({ project, index, onOpen }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty("--spotlight-x", `${x}%`);
    cardRef.current.style.setProperty("--spotlight-y", `${y}%`);
  };

  const Visual = PROJECT_VISUALS[project.id];

  const getCategoryIcon = (cat) => {
    if (cat.includes("Agentic") || cat.includes("RAG")) return <Cpu size={12} />;
    if (cat.includes("Deep Learning") || cat.includes("NLP")) return <Layers size={12} />;
    return <Terminal size={12} />;
  };

  return (
    <article
      ref={cardRef}
      className="project-card project-card--animate"
      style={{ "--reveal-order": index % 3 }}
      role="region"
      aria-label={`${project.name} project showcase`}
      onMouseMove={handleMouseMove}
    >
      {/* Top Console Bar */}
      <div className="project-card__topbar">
        <div className="project-card__cat-badge">
          {getCategoryIcon(project.category)}
          <span>{project.badge || project.category}</span>
        </div>
        <div className="project-card__status">
          <span
            className={`project-card__status-dot ${
              project.id === "rag" ? "project-card__status-dot--amber" : ""
            }`}
          />
          <span>{project.status || "Active System"}</span>
        </div>
      </div>

      {/* Interactive Architecture Simulator */}
      <div className="project-card__preview-wrapper">
        {project.image ? (
          <img src={project.image} alt={`${project.name} preview`} loading="lazy" />
        ) : (
          Visual && <Visual />
        )}
      </div>

      {/* Card Content Body */}
      <div className="project-card__body">
        <p className="project-card__tagline">{project.tagline}</p>
        <h3 className="project-card__title">{project.name}</h3>
        <p className="project-card__summary">{project.summary}</p>

        {/* Key Architecture Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="project-card__metrics">
            {project.metrics.map((m, idx) => (
              <div className="project-metric" key={idx}>
                <span className="project-metric__label">{m.label}</span>
                <span className="project-metric__value">{m.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack Pills */}
        <div className="project-card__tech">
          {project.tech.slice(0, 4).map((t) => (
            <span className="tech-tag" key={t}>
              {t}
            </span>
          ))}
          {project.tech.length > 4 && (
            <span className="tech-tag tech-tag--more">+{project.tech.length - 4}</span>
          )}
        </div>
      </div>

      {/* Card Actions */}
      <div className="project-card__actions">
        <button
          type="button"
          className="project-btn-primary"
          onClick={() => onOpen(project)}
          data-cursor="INSPECT"
        >
          <span>Architecture &amp; Deep Dive</span>
          <ArrowRight size={14} />
        </button>

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="project-btn-code"
            onClick={(e) => e.stopPropagation()}
            title="View source code on GitHub"
            data-cursor="CODE"
          >
            <Github size={15} />
            <span>Code</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);
  const [filter, setFilter] = useState("all");
  const gridRef = useRef(null);

  const filteredProjects =
    filter === "all"
      ? DATA.projects
      : DATA.projects.filter((p) => p.category === filter);

  // Re-trigger enter animation on every filter change
  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll(".project-card--animate");

    // Strip visibility class so cards are hidden first
    cards.forEach((card) => card.classList.remove("project-card--visible"));

    // Stagger-add the class back so the CSS transition fires
    let timeouts = [];
    cards.forEach((card, i) => {
      const t = setTimeout(() => {
        card.classList.add("project-card--visible");
      }, i * 90);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [filter]);

  return (
    <section id="projects" className="section projects-section">
      <div className="projects-section__glow" />

      {/* Section Head */}
      <div className="projects-header" data-reveal>
        <div className="projects-header__top">
          <div className="projects-badge">
            <span className="projects-badge__dot" />
            <span>// ARCHITECTURE &amp; PRODUCTION SYSTEMS</span>
          </div>

          <div className="projects-live-tag">
            <span />
            <span>Live Interactive Simulators</span>
          </div>
        </div>

        <h2>Featured Projects</h2>
        <p className="projects-header__sub">
          End-to-end machine learning pipelines, LLM orchestration engines, and deep neural
          architectures built for scale and precision.
        </p>

        {/* Category Filter Buttons */}
        <div className="projects-filters">
          {CATEGORIES.map((cat) => {
            const count =
              cat.id === "all"
                ? DATA.projects.length
                : DATA.projects.filter((p) => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                className={`projects-filter-btn ${
                  filter === cat.id ? "projects-filter-btn--active" : ""
                }`}
                onClick={() => setFilter(cat.id)}
                data-cursor="FILTER"
              >
                <span>{cat.label}</span>
                <span className="projects-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid" ref={gridRef}>
        {filteredProjects.map((p, i) => (
          <ProjectCard project={p} key={p.id} index={i} onOpen={setOpen} />
        ))}
      </div>

      {/* Case Study Modal */}
      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}