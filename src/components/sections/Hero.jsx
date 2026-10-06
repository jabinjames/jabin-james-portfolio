import React from "react";
import { Mail, Linkedin, Github, ArrowUpRight } from "lucide-react";
import { DATA } from "../../data/resume.js";
import HeroGraph from "./HeroGraph.jsx";
import HeroName from "./HeroName.jsx";

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          {/* Status Eyebrow */}
          <div className="hero__eyebrow-wrap" data-reveal>
            <div className="hero__status-badge">
              <span className="hero__status-dot" />
              <span>OPEN TO ROLES</span>
            </div>
            <span className="hero__eyebrow-sep">/</span>
            <span className="hero__eyebrow-text">AI &amp; SOFTWARE ENGINEER</span>
          </div>

          {/* Name Header */}
          <h1 className="hero__name" data-reveal>
            <HeroName />
          </h1>

          {/* Short, sharp, confident introduction */}
          <p className="hero__lede" data-reveal>
            I architect stateful AI systems and multi-agent workflows — turning large language models from conversational interfaces into reliable, reasoning software components.
          </p>

          {/* Action Buttons */}
          <div className="hero__actions" data-reveal>
            <button
              className="btn btn--primary hero__btn hero__btn--primary"
              data-cursor="VIEW"
              onClick={() => scrollTo("projects")}
            >
              <span>View my work</span>
              <ArrowUpRight size={15} className="hero__btn-arrow" />
            </button>

            <button
              className="btn btn--ghost hero__btn hero__btn--ghost"
              data-cursor="OPEN"
              onClick={() => scrollTo("contact")}
            >
              <span>Let's connect</span>
            </button>
          </div>

          {/* Core Stack Strip */}
          <div className="hero__stack" data-reveal>
            <span className="hero__stack-label">Core Focus</span>
            <div className="hero__stack-tags">
              <span className="hero__stack-tag">LangGraph</span>
              <span className="hero__stack-tag">Multi-Agent Systems</span>
              <span className="hero__stack-tag">RAG Pipelines</span>
              <span className="hero__stack-tag">PyTorch</span>
              <span className="hero__stack-tag">FastAPI</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="hero__social" data-reveal>
            <a
              href={`mailto:${DATA.email}`}
              data-cursor="MAIL"
              aria-label="Email Jabin James"
              title="Email"
            >
              <Mail size={16} strokeWidth={1.8} />
            </a>

            <a
              href="https://github.com/jabinjames"
              target="_blank"
              rel="noreferrer"
              data-cursor="OPEN"
              aria-label="Jabin James on GitHub"
              title="GitHub"
            >
              <Github size={16} strokeWidth={1.8} />
            </a>

            <a
              href={DATA.linkedin}
              target="_blank"
              rel="noreferrer"
              data-cursor="OPEN"
              aria-label="Jabin James on LinkedIn"
              title="LinkedIn"
            >
              <Linkedin size={16} strokeWidth={1.8} />
            </a>
          </div>
        </div>

        {/* Right Visual: Interactive LangGraph Orchestrator */}
        <div className="hero__visual" data-reveal>
          <HeroGraph />
          <p className="hero__visual-caption">
            interactive state graph — multi-step reasoning, tool dispatch &amp; reflection loop
          </p>
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
