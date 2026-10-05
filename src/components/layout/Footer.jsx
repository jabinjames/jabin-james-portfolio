import React, { useState } from "react";
import "../../styles/footer.css";
const Footer = () => {
  const [copied, setCopied] = useState(false);

  const email = "jabinjames.dev@gmail.com";

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch (error) {
      console.error("Failed to copy email:", error);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="portfolio-footer">

      {/* =====================================================
          CONTACT / CTA AREA
      ====================================================== */}

      <section className="footer-hero">

        {/* Background */}
        <div className="footer-background" />
        <div className="footer-overlay" />

        {/* Animated road light */}
        <div className="footer-road-light" />

        <div className="footer-hero-content">

          <div className="footer-eyebrow">
            LET'S CONNECT
          </div>

          <h2 className="footer-title">
            Have an idea worth
            <span> building?</span>
          </h2>

          <p className="footer-description">
            I'm always open to opportunities, collaborations, and
            conversations around AI, software development, and
            interesting ideas. Let's build something meaningful together.
          </p>

          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="footer-actions">

            {/* Get in touch */}
            <a
              href={`mailto:${email}`}
              className="footer-action footer-action-primary"
            >
              <span>Get in touch</span>
              <span className="footer-arrow">→</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/jabinjames"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-action"
            >
              <span>GitHub</span>
              <span className="footer-arrow">↗</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/jabinjames/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-action"
            >
              <span>LinkedIn</span>
              <span className="footer-arrow">↗</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="footer-action"
            >
              <span>Email</span>
              <span className="footer-arrow">↗</span>
            </a>

          </div>

          {/* =================================================
              AVAILABILITY + EMAIL
          ================================================= */}

          <div className="footer-contact-meta">

            <div className="availability">
              <span className="availability-dot" />
              <span>Open to opportunities</span>
            </div>

            <div className="footer-meta-divider" />

            <button
              className="email-copy"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              <span>{copied ? "Copied ✓" : email}</span>

              {!copied && (
                <span className="copy-icon">
                  ⧉
                </span>
              )}
            </button>

          </div>

        </div>

        {/* =================================================
            SIGNPOST / DECORATIVE ELEMENT
        ================================================== */}

        <div className="footer-signpost">
          <div className="sign sign-ideas">
            IDEAS
          </div>

          <div className="sign sign-products">
            PRODUCTS
          </div>

          <div className="sign sign-impact">
            IMPACT
          </div>

          <div className="footer-lantern">
            <span />
          </div>
        </div>

        <div className="footer-exploring">
          Still exploring...
        </div>

      </section>


      {/* =====================================================
          FOOTER MAIN
      ====================================================== */}

      <div className="footer-main">

        <div className="footer-main-grid">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="footer-brand">

            <h3>
              Jabin James
            </h3>

            <p>
              Building systems
              <br />
              that reason in steps.
            </p>

            <div className="footer-socials">

              <a
                href="https://github.com/YOUR_GITHUB_USERNAME"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                GitHub
              </a>

              <a
                href="https://www.linkedin.com/in/YOUR_LINKEDIN_USERNAME/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>

              <a
                href={`mailto:${email}`}
                aria-label="Email"
              >
                Email
              </a>

            </div>

          </div>


          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div className="footer-column">

            <h4>
              NAVIGATE
            </h4>

            <button onClick={() => scrollToSection("home")}>
              Home
            </button>

            <button onClick={() => scrollToSection("about")}>
              About
            </button>

            <button onClick={() => scrollToSection("projects")}>
              Projects
            </button>

            <button onClick={() => scrollToSection("certifications")}>
              Certifications
            </button>

            <button onClick={() => scrollToSection("experience")}>
              Experience
            </button>

          </div>


          {/* =================================================
              INFORMATION
          ================================================== */}

          <div className="footer-column">

            <h4>
              INFO
            </h4>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume <span>↓</span>
            </a>

            <button onClick={() => scrollToSection("journey")}>
              Journey
            </button>

            <button onClick={() => scrollToSection("contact")}>
              Contact
            </button>

          </div>


          {/* =================================================
              LOCATION
          ================================================== */}

          <div className="footer-column footer-location">

            <h4>
              LOCATION
            </h4>

            <p className="location-name">
              Pathanamthitta, Kerala, India
            </p>

            <p>
              Open to remote opportunities
              <br />
              and exciting collaborations.
            </p>

          </div>

        </div>


        {/* =================================================
            BOTTOM BAR
        ================================================== */}

        <div className="footer-bottom">

          <div className="footer-copyright">
            © {new Date().getFullYear()} Jabin James.
            All rights reserved.
          </div>

          <button
            className="back-to-top"
            onClick={goToTop}
          >
            <span>↑</span>
            <span>Back to top</span>
          </button>

        </div>

      </div>

    </footer>
  );
};

export default Footer;