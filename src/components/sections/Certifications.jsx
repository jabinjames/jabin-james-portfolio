import React, { useState } from "react";
import { ExternalLink } from "lucide-react";
import { DATA } from "../../data/resume.js";
import CertificateModal from "../modals/CertificateModal.jsx";

export default function Certifications() {
  const [open, setOpen] = useState(null);

  return (
    <section id="certifications" className="section">
      <div className="section__head" data-reveal>
        <h2>Certifications</h2>
      </div>

      <div className="certs-grid">
        {DATA.certifications.map((c) => (
          <div className={`cert-card ${c.featured ? "cert-card--featured" : ""}`} key={c.id} data-reveal>
            <div>
              <p className="cert-card__issuer">{c.issuer}</p>
              <h3>{c.title}</h3>
              <p className="cert-card__date">{c.date}</p>
            </div>
            <button className="cert-card__btn" onClick={() => setOpen(c)} data-cursor="VIEW">
              View certificate <ExternalLink size={14} strokeWidth={1.8} />
            </button>
          </div>
        ))}
      </div>

      <CertificateModal cert={open} onClose={() => setOpen(null)} />
    </section>
  );
}
