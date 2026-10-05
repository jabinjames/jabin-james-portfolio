import React from "react";
import { NAV_ITEMS } from "../../data/resume.js";

export default function TraceLine({ progress, active }) {
  return (
    <div className="trace" aria-hidden="true">
      <div className="trace__rail">
        <div className="trace__pointer" style={{ top: `${progress * 100}%` }}>
          <span className="trace__pointer-core" />
        </div>
      </div>
      <div className="trace__nodes">
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`trace__node ${active === item.id ? "trace__node--active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
