import React from "react";
import { DATA } from "../../data/resume.js";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="section__head" data-reveal>
        <h2>Experience</h2>
      </div>

      <div className="timeline">
        {DATA.experience.map((exp) => (
          <div
            className="timeline__item"
            key={exp.org}
            data-reveal
            style={{ "--exp-accent": exp.state === "active" ? "var(--amber)" : "var(--teal)" }}
          >
            <div className="timeline__marker">
              <span className="timeline__dot-ring">
                <span className={`state-dot state-dot--${exp.state}`} />
              </span>
            </div>

            <div className="timeline__content">
              <div className="timeline__top">
                <div>
                  <h3>{exp.role}</h3>
                  <p className="timeline__org">
                    {exp.org} â€” {exp.location}
                  </p>
                </div>
                <span className="timeline__duration">{exp.duration}</span>
              </div>

              <ul className="timeline__points">
                {exp.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>

              {exp.tech.length > 0 && (
                <div className="timeline__tech">
                  {exp.tech.map((t) => (
                    <span key={t} className="tag tag--mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
