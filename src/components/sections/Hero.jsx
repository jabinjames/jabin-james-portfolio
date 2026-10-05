import React from "react";
import { Mail, Linkedin } from "lucide-react";
import { DATA } from "../../data/resume.js";
import HeroGraph from "./HeroGraph.jsx";
import HeroName from "./HeroName.jsx";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow" data-reveal>
            AI &amp; Software Engineer
          </p>
          <h1 className="hero__name" data-reveal>
            <HeroName />
          </h1>
          <p className="hero__lede" data-reveal>
            I build intelligent systems where language models go beyond answering— they reason through steps, interact with tools, and manage state across workflows. Most recently, I applied this approach to building agentic LangGraph workflows during my AI research internship
          </p>

          <div className="hero__actions" data-reveal>
            <button
              className="btn btn--primary"
              data-cursor="VIEW"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            >
              View my work
            </button>
            <button
              className="btn btn--ghost"
              data-cursor="OPEN"
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Let's connect
            </button>
          </div>

          <div className="hero__social" data-reveal>
            <a href={`mailto:${DATA.email}`} data-cursor="MAIL" aria-label="Email Jabin James">
              <Mail size={18} strokeWidth={1.6} />
            </a>
            <a href={DATA.linkedin} target="_blank" rel="noreferrer" data-cursor="OPEN" aria-label="Jabin James on LinkedIn">
              <Linkedin size={18} strokeWidth={1.6} />
            </a>
          </div>
        </div>

        <div className="hero__visual" data-reveal>
          <HeroGraph />
          <p className="hero__visual-caption">state graph — input → reasoning → tool call → output</p>
        </div>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
