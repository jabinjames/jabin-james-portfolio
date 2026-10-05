import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { DATA } from "../../data/resume.js";

export default function CertificateModal({ cert, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!cert) return null;

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className="modal modal--cert"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
        ref={ref}
        tabIndex={-1}
      >
        <button className="modal__close" onClick={onClose} aria-label="Close certificate" data-cursor="CLOSE">
          <X size={20} />
        </button>

        <div className="cert-plate">
          <div className="cert-plate__frame">
            <p className="cert-plate__kicker">Certificate of Completion</p>
            <h3 id="cert-modal-title">{cert.title}</h3>
            <div className="cert-plate__rule" />
            <p className="cert-plate__meta">Issued by {cert.issuer}</p>
            <p className="cert-plate__meta">{cert.date}</p>
            <p className="cert-plate__name">{DATA.name}</p>
          </div>
        </div>
        <p className="modal__note">
          This is a summary generated from the certificate record — swap in the scanned certificate file
          whenever it's ready (see src/assets/certificates).
        </p>
      </div>
    </div>
  );
}
