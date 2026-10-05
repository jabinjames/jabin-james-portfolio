import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_ITEMS } from "../../data/resume.js";

export default function Nav({ active, compact }) {
  const [open, setOpen] = useState(false);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`nav ${compact ? "nav--compact" : ""}`}>
      <div className="nav__inner">
        <button className="nav__mark" onClick={() => go("home")} data-cursor="TOP" aria-label="Go to top">
          JJ<span className="nav__mark-dot" />
        </button>

        <nav className="nav__links" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav__link ${active === item.id ? "nav__link--active" : ""}`}
              onClick={() => go(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button
          className="nav__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={`nav__mobile ${open ? "nav__mobile--open" : ""}`}>
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item.id}
            className={`nav__mobile-link ${active === item.id ? "nav__mobile-link--active" : ""}`}
            style={{ transitionDelay: `${i * 30}ms` }}
            onClick={() => go(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
}
