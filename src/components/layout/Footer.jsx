import React, { useState } from "react";
import {
  Mail,
  ArrowUpRight,
  ArrowUp,
  Github,
  Linkedin,
  Copy,
  Check,
  Terminal,
  Sparkles,
} from "lucide-react";
import { DATA } from "../../data/resume.js";
import "../../styles/footer.css";

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const email = DATA.email || "jabinjames.dev@gmail.com";
  const githubUrl = "https://github.com/jabinjames";
  const linkedinUrl = DATA.linkedin || "https://www.linkedin.com/in/jabinjames/";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="portfolio-footer">
      {/* =====================================================
          CTA / CONTACT AREA
      ====================================================== */}
      <section id="contact" className="footer-hero">
        <div className="footer-background" />
        <div className="footer-overlay" />

        <div className="footer-hero-container">
          <div className="footer-hero-grid">
            {/* Left Column: CTA Info */}
            <div className="footer-hero-left">
              <div className="footer-eyebrow">
                <span className="footer-eyebrow__dot" />
                <span>LET'S CONNECT</span>
              </div>

              <h2 className="footer-title">
                Have an idea worth <span>building?</span>
              </h2>

              <p className="footer-description">
                I'm always open to new opportunities, collaborations, and discussions
                around AI agent workflows, software architecture, and intelligent systems.
              </p>

              {/* Action Buttons */}
              <div className="footer-actions">
                <a
                  href={`mailto:${email}`}
                  className="footer-btn footer-btn--primary"
                  data-cursor="MAIL"
                >
                  <Mail size={15} strokeWidth={2} />
                  <span>Get in touch</span>
                </a>

                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-btn footer-btn--ghost"
                  data-cursor="OPEN"
                >
                  <Github size={15} strokeWidth={1.8} />
                  <span>GitHub</span>
                  <ArrowUpRight size={13} className="footer-btn__arrow" />
                </a>

                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-btn footer-btn--ghost"
                  data-cursor="OPEN"
                >
                  <Linkedin size={15} strokeWidth={1.8} />
                  <span>LinkedIn</span>
                  <ArrowUpRight size={13} className="footer-btn__arrow" />
                </a>
              </div>

              {/* Status & Copy Email Pill */}
              <div className="footer-meta-row">
                <div className="footer-status-pill">
                  <span className="status-indicator">
                    <span className="status-indicator__ping" />
                    <span className="status-indicator__core" />
                  </span>
                  <span>Open to opportunities</span>
                </div>

                <div className="footer-meta-sep" />

                <button
                  className={`footer-copy-btn ${copied ? "is-copied" : ""}`}
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  title="Click to copy email"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="copy-icon--check" />
                      <span>Copied to clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>{email}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: AI / System Status Card */}
            <div className="footer-hero-right">
              <div className="system-card">
                <div className="system-card__header">
                  <div className="system-card__window-dots">
                    <span className="sys-dot sys-dot--red" />
                    <span className="sys-dot sys-dot--yellow" />
                    <span className="sys-dot sys-dot--green" />
                  </div>
                  <div className="system-card__title">
                    <Terminal size={12} />
                    <span>system_status.agent</span>
                  </div>
                  <span className="system-card__badge">LIVE</span>
                </div>

                <div className="system-card__body">
                  <div className="sys-row">
                    <span className="sys-row__label">Role</span>
                    <span className="sys-row__val">{DATA.title}</span>
                  </div>
                  <div className="sys-row">
                    <span className="sys-row__label">Focus</span>
                    <span className="sys-row__val sys-row__val--highlight">
                      Agentic LLMs &amp; Systems
                    </span>
                  </div>
                  <div className="sys-row">
                    <span className="sys-row__label">Status</span>
                    <span className="sys-row__val sys-row__val--online">
                      Available for roles
                    </span>
                  </div>
                  <div className="sys-row">
                    <span className="sys-row__label">Location</span>
                    <span className="sys-row__val">{DATA.location}</span>
                  </div>
                  <div className="sys-row">
                    <span className="sys-row__label">Timezone</span>
                    <span className="sys-row__val">IST (UTC+5:30)</span>
                  </div>

                  <div className="system-card__footer">
                    <Sparkles size={13} className="sys-sparkle" />
                    <span>Reasoning systems &amp; stateful workflows</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN FOOTER COLUMNS
      ====================================================== */}
      <div className="footer-main">
        <div className="footer-main-grid">
          {/* Brand */}
          <div className="footer-brand">
            <h3 className="footer-brand__name">{DATA.name}</h3>
            <p className="footer-brand__desc">
              Building systems that reason in steps. Turning LLMs into stateful,
              reliable workflow components.
            </p>
            <div className="footer-socials">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={14} />
                <span>GitHub</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </a>
              <a href={`mailto:${email}`} aria-label="Email">
                <Mail size={14} />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-column">
            <h4>Navigate</h4>
            <button onClick={() => scrollToSection("home")}>Home</button>
            <button onClick={() => scrollToSection("experience")}>Experience</button>
            <button onClick={() => scrollToSection("skills")}>Skills</button>
            <button onClick={() => scrollToSection("projects")}>Projects</button>
          </div>

          {/* Contact & Info */}
          <div className="footer-column">
            <h4>Contact</h4>
            <a href={`mailto:${email}`} title={`Email ${email}`} className="footer-direct-email">
              {email}
            </a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Resume <span className="arrow-down">↓</span>
            </a>
          </div>

          {/* Location / Availability */}
          <div className="footer-column footer-location">
            <h4>Location</h4>
            <p className="location-name">{DATA.location}</p>
            <p className="location-sub">
              Open to remote roles and high-impact engineering teams globally.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {new Date().getFullYear()} {DATA.name}. All rights reserved.
          </div>

          <button className="back-to-top" onClick={goToTop} aria-label="Back to top">
            <span>Back to top</span>
            <span className="back-to-top__icon">
              <ArrowUp size={13} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;