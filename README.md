# Jabin James — Portfolio

A personal portfolio built with React + Vite. The visual language is built
around state-graph orchestration (nodes, edges, execution states) to reflect
actual LangGraph/agentic-AI work rather than generic AI-portfolio decoration.

## Project structure

```
src/
  data/resume.js          All resume content — edit this to update text, projects, skills, etc.
  hooks/                   Scroll progress, active section, reveal-on-scroll, reduced motion
  components/
    layout/                Nav, Footer, TraceLine (scroll pointer), CustomCursor
    sections/               Hero, About, Experience, Skills, Projects, Certifications, Education, Contact
    modals/                 ProjectModal, CertificateModal
  styles/global.css        All styling (design tokens live at the top as CSS variables)
  assets/certificates/     Drop real certificate scans here, then reference them in CertificateModal.jsx
```

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`.

## Deploy

The build output in `dist/` is a static site — deploy it anywhere that serves
static files:

- **Vercel**: import the GitHub repo, framework preset "Vite" is auto-detected, no config needed.
- **Netlify**: import the repo, build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: run `npm run build`, then push the contents of `dist/` to a `gh-pages` branch
  (or use the `gh-pages` npm package).

## Updating content

All resume data lives in `src/data/resume.js` as a single exported object —
update your role, projects, skills, or certifications there without touching
any component code.

To swap in the real Data Scientist certificate image: add the file to
`src/assets/certificates/`, import it in `CertificateModal.jsx`, and render
an `<img>` in place of (or alongside) the designed certificate summary.
