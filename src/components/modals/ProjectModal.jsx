import React, { useEffect, useRef } from "react";
import { X, ExternalLink, Github } from "lucide-react";
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
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal modal--project"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        ref={ref}
        tabIndex={-1}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close case study" data-cursor="CLOSE">
          <X size={20} />
        </button>

        <div className="modal__preview">
          {project.image ? <img src={project.image} alt={`${project.name} preview`} /> : Visual && <Visual />}
        </div>

        <p className="modal__eyebrow">{project.tagline}</p>
        <h3 id="project-modal-title">{project.name}</h3>

        <div className="modal__section">
          <h4>Overview</h4>
          <p>{project.summary}</p>
        </div>
        <div className="modal__section">
          <h4>Problem</h4>
          <p>{project.problem}</p>
        </div>
        <div className="modal__section">
          <h4>Approach</h4>
          <p>{project.solution}</p>
        </div>
        <div className="modal__section">
          <h4>Key features</h4>
          <ul>
            {project.points.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="modal__section">
          <h4>Technology</h4>
          <div className="modal__tech">
            {project.tech.map((t) => (
              <span className="tag tag--mono" key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>

        {(project.demoUrl || project.githubUrl) && (
          <div className="modal__links">
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn--primary" data-cursor="OPEN">
                Demo <ExternalLink size={15} strokeWidth={1.8} />
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn--ghost" data-cursor="OPEN">
                <Github size={15} strokeWidth={1.8} /> View Code
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
