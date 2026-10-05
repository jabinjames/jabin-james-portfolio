import React from "react";
import { DATA } from "../../data/resume.js";

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="section__head" data-reveal>
        <h2>Education</h2>
      </div>

      <div className="edu-list">
        {DATA.education.map((e) => (
          <div className="edu-item" key={e.degree} data-reveal>
            <div className="edu-item__duration">{e.duration}</div>
            <div className="edu-item__body">
              <h3>{e.degree}</h3>
              <p>{e.org}</p>
              <span className="tag tag--mono">{e.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
