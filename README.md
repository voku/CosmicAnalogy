<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Cosmic System Profiler

Cosmic System Profiler is a Vite + React experience that visualizes a stylized cosmic system dashboard with an interactive map, telemetry HUD, and mission data views. It is built for production deployments with GitHub Pages and a lightweight CI pipeline.

## Features

- Interactive galaxy map with zone selection and HUD-driven navigation.
- Mission brief and data log modal flows for deeper exploration.
- Responsive, glassmorphism-inspired UI with custom charting.
- Vite build optimized for GitHub Pages hosting.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind (via CDN) + custom UI styles
- Recharts + Lucide icons

## Getting Started

**Prerequisites**
- Node.js 18+ (LTS recommended)

**Install**
```bash
npm install
```

**Run locally**
```bash
npm run dev
```

**Production build**
```bash
npm run build
```

**Preview production build**
```bash
npm run preview
```

## Configuration

This project does not require runtime environment variables by default. If you add data sources or API integrations, document them here and update the CI secrets accordingly.

## Deployment (GitHub Pages)

The Vite config sets the `base` path for GitHub Pages. The included workflow builds and publishes the `dist/` directory to the `gh-pages` branch. After the first deployment, enable GitHub Pages in the repo settings and set the source to `gh-pages`.

## Continuous Integration

The CI workflow installs dependencies and runs the production build on each pull request and push to `main`.

## Key Files Detector (Helper Prompt)

Use this prompt to quickly spot the most important files:

```
You are a Key Files Detector. Identify the 5-10 most important files in this repository and explain why each matters. Group them by purpose (entry points, configuration, UI, data).
```

## Contributing

Contributions are welcome! Please open issues or pull requests at:  
https://github.com/voku/CosmicAnalogy
