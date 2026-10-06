import React, { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { NAV_ITEMS } from "./data/resume.js";

import { usePrefersReducedMotion } from "./hooks/usePrefersReducedMotion.js";
import { useActiveSection } from "./hooks/useActiveSection.js";
import { useScrollProgress } from "./hooks/useScrollProgress.js";
import { useReveal } from "./hooks/useReveal.js";

import IntroAnimation from "./components/intro/IntroAnimation.jsx";
import CustomCursor from "./components/layout/CustomCursor.jsx";
import TraceLine from "./components/layout/TraceLine.jsx";
import Nav from "./components/layout/Nav.jsx";
import Footer from "./components/layout/Footer.jsx";

import Hero from "./components/sections/Hero.jsx";
import Experience from "./components/sections/Experience.jsx";
import Skills from "./components/sections/Skills.jsx";
import Projects from "./components/sections/Projects.jsx";

const SECTION_IDS = NAV_ITEMS.map((n) => n.id);

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const active = useActiveSection(SECTION_IDS);
  const progress = useScrollProgress();
  const [compact, setCompact] = useState(false);
  const [fineCursor, setFineCursor] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  useReveal(reducedMotion);

  useEffect(() => {
    document.body.style.overflow = introDone ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [introDone]);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const wide = window.matchMedia("(min-width: 1024px)");
    setFineCursor(mq.matches && wide.matches && !reducedMotion);
  }, [reducedMotion]);

  return (
    <div className={`app ${fineCursor ? "app--custom-cursor" : ""}`}>
      <IntroAnimation onFinish={() => setIntroDone(true)} />
      <CustomCursor enabled={fineCursor} />
      <TraceLine progress={progress} active={active} />
      <Nav active={active} compact={compact} />

      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
      </main>

      <Footer />
      <Analytics />
    </div>
  );
}
