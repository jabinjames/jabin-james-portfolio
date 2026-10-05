import React from "react";
import { ArrowUpRight } from "lucide-react";
import { DATA } from "../../data/resume.js";

export default function Contact() {
  return (
    <section id="contact" className="section contact">
      <div className="contact__inner" data-reveal>
        <p className="contact__eyebrow">Get in touch</p>
        <h2>Have an idea worth building?</h2>
        <p className="contact__lede">
          I'm open to roles and collaborations in AI engineering and backend systems. The fastest way to
          reach me is email.
        </p>

        <div className="contact__actions">
          <a href={`mailto:${DATA.email}`} className="btn btn--primary" data-cursor="MAIL">
            {DATA.email}
          </a>
          <a href={DATA.linkedin} target="_blank" rel="noreferrer" className="btn btn--ghost" data-cursor="OPEN">
            LinkedIn <ArrowUpRight size={16} strokeWidth={1.8} />
          </a>
        </div>
      </div>
    </section>
  );
}
