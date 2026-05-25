# Adastra · Audit Platform — Clickable Demo

A clickable product demo of an AI-based audit automation platform for large
Financial Services firms. Built with React 18 + Vite. No backend — all data
is in-memory mock data designed to walk through the product vision.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build for production

```bash
npm run build
```

Outputs a static site to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## What's inside

### Workspace (operational pages)

- **Dashboard** — KPIs, recent audits, live monitor stream
- **Knowledge** — uploaded policies, standards, regulations; click "Upload
  document" to watch the rule auto-generation pipeline animate
- **Rules** — auto-generated rule library with citation chains
- **Connectors** — data source and tool onboarding by category
- **Audits** — audit list; click any row for the live execution view
  with streaming agent timeline
- **Continuous Monitor** — always-on monitors with recent triggered events
- **Findings** — finding detail with AI narrative, citation chain, and
  recommended remediation

### Admin Portal

- **AI Agents** — every agent with config, metrics, runs, tool access,
  and guardrails (click any agent card)
- **Models** — registered LLMs and ML models with cost and latency
- **Prompts** — versioned prompt library under change control
- **Users & Roles** — RBAC with role tiers and external auditor access
- **Audit Log** — immutable platform activity log
- **Settings** — org config, AI governance toggles, data retention policy

## Suggested demo flow

1. **Dashboard** — orient on KPIs and the live monitor stream
2. **Knowledge → Upload document** — show the ingest → parse → extract →
   rule generation animation
3. **Audits → click any audit** — show agents working in real time on the
   detail page
4. **Findings → F-1842** — show the citation chain back to source policy
   and evidence
5. **Admin → AI Agents → Orchestrator** — open the drawer and walk through
   all four tabs (Config, Metrics, Recent runs, Tools)
6. **Admin → Settings → AI Governance** — show the platform-wide controls

## Tech stack

- **React 18** with hooks; no state library (state is local to the demo)
- **Vite 5** for dev server and build
- **lucide-react** for icons
- **Inline styles** keyed off a single design-token object — no CSS framework

## Brand

The visual treatment is inspired by Adastra Corporation's red-and-white
editorial aesthetic. The primary accent is `#E2231A` (Adastra red). All
design tokens live at the top of `src/App.jsx` in the `T` object — edit
them to re-theme the entire app in one place.

## Deployment

The build is a fully static site that can be deployed to any static host:

- **Vercel / Netlify** — drag and drop the `dist/` folder, or connect the
  repo for CI/CD
- **GitHub Pages** — push `dist/` to a `gh-pages` branch
- **AWS S3 + CloudFront** — sync `dist/` to a bucket configured for static
  hosting
- **Azure Static Web Apps** / **Cloudflare Pages** — connect the repo

The `base: './'` setting in `vite.config.js` ensures the build works at
any URL prefix, so you can deploy under `/audit-demo/` or any subpath.

## Project structure

```
audit-platform-demo/
├── index.html              ← entry HTML with font loading
├── package.json            ← deps and scripts
├── vite.config.js          ← Vite build config
├── .gitignore
├── README.md
└── src/
    ├── main.jsx            ← React bootstrap
    ├── styles.css          ← global reset + base typography
    └── App.jsx             ← all demo pages + components (single file)
```

`App.jsx` is intentionally a single file — easier to read, fork, and
customize for a demo. In a production app you'd split it by route.

## Notes

- All data is mock data. The demo simulates AI agent execution with timers,
  but no real LLM calls are made.
- The Adastra brand colors used here are inspired by their visible site
  treatment. If your team has the official brand pack, update `T.red` and
  `T.redDark` at the top of `src/App.jsx`.
- Tested on Chromium-based browsers and Safari at 1280px+ widths. Mobile
  layout is not optimized — this is designed for laptop/desktop demos.
