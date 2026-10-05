import React, { useState } from "react";
import { Github } from "lucide-react";
import { DATA } from "../../data/resume.js";
import { PROJECT_VISUALS } from "./ProjectVisuals.jsx";
import ProjectModal from "../modals/ProjectModal.jsx";

function ProjectPreview({ project }) {
  if (project.image) {
    return (
      <div className="project-card__preview">
        <img src={project.image} alt={`${project.name} preview`} loading="lazy" />
      </div>
    );
  }
  const Visual = PROJECT_VISUALS[project.id];
  return <div className="project-card__preview project-card__preview--visual">{Visual && <Visual />}</div>;
}

function ProjectCard({ project, index, onOpen }) {
  const open = () => onOpen(project);
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  };

  return (
    <article
      className="project-card"
      data-reveal
      style={{ "--reveal-order": index % 3 }}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      onClick={open}
      onKeyDown={onKeyDown}
      data-cursor="VIEW"
    >
      <ProjectPreview project={project} />

      <div className="project-card__body">
        <p className="project-card__tagline">{project.tagline}</p>
        <h3>{project.name}</h3>
        <p className="project-card__summary">{project.summary}</p>

        <div className="project-card__tech">
          {project.tech.slice(0, 4).map((t) => (
            <span className="pill" key={t}>
              {t}
            </span>
          ))}
          {project.tech.length > 4 && <span className="pill">+{project.tech.length - 4}</span>}
        </div>
      </div>

      {project.githubUrl && (
        <div className="project-card__actions">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="project-card__code"
            onClick={(e) => e.stopPropagation()}
          >
            <Github size={16} strokeWidth={1.8} /> Code
          </a>
        </div>
      )}
    </article>
  );
}

export default function Projects() {
  const [open, setOpen] = useState(null);

  return (
    <section id="projects" className="section">
      <div className="section__head" data-reveal>
        <h2>Projects</h2>
        <p className="section__sub">Ideas turned into real solutions.</p>
      </div>

      <div className="projects-grid">
        {DATA.projects.map((p, i) => (
          <ProjectCard project={p} key={p.id} index={i} onOpen={setOpen} />
        ))}
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}