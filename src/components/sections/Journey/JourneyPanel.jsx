import React, { useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { DATA } from "../../../data/resume.js";
import ProjectModal from "../../modals/ProjectModal.jsx";

function StartPanel() {
  return (
    <>
      <p className="jr-panel__eyebrow">Where it began</p>
      <h3>Curiosity, pointed at software</h3>
      <p className="jr-panel__body">
        Like most journeys into engineering, mine started with wanting to know how things work under the
        hood — then wanting to build the things myself. That curiosity eventually pointed toward software
        development and, later, toward AI systems that reason rather than just respond.
      </p>
    </>
  );
}

function EducationPanel() {
  const edu = DATA.education[0];
  return (
    <>
      <p className="jr-panel__eyebrow">Chapter one</p>
      <h3>{edu.degree}</h3>
      <p className="jr-panel__body">
        {edu.org} — {edu.duration}. Four years of building a foundation across programming, algorithms,
        and systems thinking, which is where the shift toward AI and applied ML really started to take
        shape.
      </p>
      <span className="tag tag--mono">{edu.detail}</span>
    </>
  );
}

function ProjectsPanel({ onOpenProject }) {
  return (
    <>
      <p className="jr-panel__eyebrow">Ideas into solutions</p>
      <h3>What I built along the way</h3>
      <p className="jr-panel__body">
        Three projects that trace a path from NLP to retrieval to accessibility — each one a different
        angle on applied deep learning.
      </p>
      <div className="jr-panel__list">
        {DATA.projects.map((p) => (
          <button key={p.id} className="jr-panel__list-item" onClick={() => onOpenProject(p)}>
            <span>{p.name}</span>
            <ArrowUpRight size={15} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </>
  );
}

function ExperiencePanel() {
  const exp = DATA.experience[0];
  return (
    <>
      <p className="jr-panel__eyebrow">Learning through doing</p>
      <h3>{exp.role}</h3>
      <p className="jr-panel__body">
        {exp.org} â€” {exp.location}, {exp.duration}. Architecting stateful LangGraph workflows, turning
        natural language into orchestrated API calls, and building the tooling that connects LLMs to
        real systems.
      </p>
      <div className="jr-panel__tech">
        {exp.tech.map((t) => (
          <span key={t} className="tag tag--mono">
            {t}
          </span>
        ))}
      </div>
    </>
  );
}

function NextPanel() {
  return (
    <>
      <p className="jr-panel__eyebrow">Still exploring</p>
      <h3>Bigger problems, next</h3>
      <p className="jr-panel__body">
        I'm looking for roles and collaborations in AI engineering and backend systems â€” places where I
        can keep working at the layer where language models become part of a larger, reasoning system.
      </p>
      <a href={`mailto:${DATA.email}`} className="btn btn--primary jr-panel__cta" data-cursor="MAIL">
        <Mail size={15} strokeWidth={1.8} /> Let's talk
      </a>
    </>
  );
}

export default function JourneyPanel({ nodeId }) {
  const [openProject, setOpenProject] = useState(null);

  if (!nodeId) {
    return (
      <div className="jr-panel jr-panel--placeholder">
        <p>Hover a milestone above — or tap one on mobile — to explore that chapter.</p>
      </div>
    );
  }

  return (
    <div className="jr-panel">
      {nodeId === "start" && <StartPanel />}
      {nodeId === "education" && <EducationPanel />}
      {nodeId === "projects" && <ProjectsPanel onOpenProject={setOpenProject} />}
      {nodeId === "experience" && <ExperiencePanel />}
      {nodeId === "next" && <NextPanel />}

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </div>
  );
}
