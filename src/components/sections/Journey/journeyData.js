// Shared geometry for the journey map. viewBox is 1600x640 — node x/y below
// are percentages of that box, so pins line up with the SVG background at
// any rendered size.

export const VIEW_W = 1600;
export const VIEW_H = 640;

export const JOURNEY_NODES = [
  {
    id: "start",
    label: "START",
    icon: "Flag",
    colorVar: "--jr-start",
    x: 5.6,
    y: 67.2,
  },
  {
    id: "education",
    label: "Education",
    icon: "GraduationCap",
    colorVar: "--jr-education",
    x: 23.75,
    y: 51.6,
  },
  {
    id: "projects",
    label: "Projects",
    icon: "Boxes",
    colorVar: "--jr-projects",
    x: 40.6,
    y: 65.6,
  },
  {
    id: "experience",
    label: "Experience",
    icon: "Briefcase",
    colorVar: "--jr-experience",
    x: 72.5,
    y: 53.1,
  },
  {
    id: "next",
    label: "What's Next?",
    icon: "Compass",
    colorVar: "--jr-next",
    x: 90.6,
    y: 65.6,
  },
];

// One continuous road, expressed as contiguous cubic-bezier segments —
// each segment starts exactly where the previous one ends, so the full
// road renders with zero gaps no matter how the segments are styled
// individually (needed for the per-segment hover highlight).
export const ROAD_SEGMENTS = [
  "M90,430 C200,380 260,360 380,330",
  "M380,330 C480,305 560,380 650,420",
  "M650,420 C780,470 1020,400 1160,340",
  "M1160,340 C1280,300 1360,380 1450,420",
];

// Same coordinates as one path, for the travelling light's <animateMotion>.
export const FULL_ROAD_D = ROAD_SEGMENTS.reduce((acc, seg, i) => {
  if (i === 0) return seg;
  // drop the leading "M x,y" of every segment after the first — the light
  // path just needs one unbroken sequence of curve commands
  return `${acc} ${seg.replace(/^M[-\d.]+,[-\d.]+\s*/, "")}`;
}, "");
