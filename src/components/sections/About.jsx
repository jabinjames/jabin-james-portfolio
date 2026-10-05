import React from "react";
import { DATA } from "../../data/resume.js";
import JourneyMap from "./Journey/JourneyMap.jsx";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="section__head" data-reveal>
        <h2>My Journey</h2>
        <p className="section__sub">Different chapters. Same curiosity.</p>
      </div>

      <JourneyMap />

      <div className="about__grid" data-reveal>
        <p className="about__text">{DATA.summary}</p>

        <div className="about__aside">
          <div className="about__block">
            <h3>Based in</h3>
            <p>{DATA.location}</p>
          </div>
          <div className="about__block">
            <h3>Languages</h3>
            <p>{DATA.languages.join(" Â· ")}</p>
          </div>
          <div className="about__block">
            <h3>Focus areas</h3>
            <div className="about__tags">
              {DATA.interests.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
