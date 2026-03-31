# Cosmic Analogy — Storage & Speed in Space

**Cosmic Analogy** is a Vite + React interactive visualizer that makes abstract computer science concepts tangible by mapping them to cosmic distances. Choose between two modes to grasp just how vast the differences in data sizes and hardware latencies really are.

🔭 **Live demo:** https://voku.github.io/CosmicAnalogy/

## Modes

### Storage Size → Space Dimensions
| Unit | Cosmic distance equivalent |
|------|---------------------------|
| 1 Byte | 1 km (surface of Earth) |
| 1 KB | Earth → Moon (384,400 km) |
| ~4 MB (Photo) | Earth → between Mars and Sun |
| 1 MB | Earth → Mars orbit (54.6 M km) |
| 1 GB | Earth → Sun (149.6 M km) |

### Computer Latency → Space Distances
| Operation | Real latency | Cosmic distance equivalent |
|-----------|-------------|---------------------------|
| CPU Cycle | 0.5 ns | Standing on Earth (0 km) |
| RAM Access | 100 ns | Earth → Moon (384,400 km) |
| SSD Read | 150 µs | Earth → Sun (149.6 M km) |
| HDD Seek | 10 ms | Earth → Heliopause (18.1 B km) |
| Internet Ping | 150 ms | Earth → Proxima Centauri (4.24 ly) |

## Features

- **Cosmic visualization** — animated Earth-scale and cosmic-scale spheres with glowing effects.
- **Scale Map** — logarithmic cosmic ruler showing all items at once with interactive bar selection.
- **Info Panel** — detailed description, Earth analogy, and cosmic analogy for the active item.
- **Zoom controls** — 1× to 3× zoom on the main visualization.
- **Animated StarField** — immersive deep-space background.
- **Context footer** — fun facts (e.g. "uploading a human brain at 100 Mbps would take ~7 years").
- Glassmorphism-inspired dark UI with smooth Motion animations.
- Fully responsive — works on mobile and desktop.

## Tech Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 3
- [Motion](https://motion.dev/) (Framer Motion) for animations
- Lucide React icons

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

## Deployment (GitHub Pages)

The Vite config sets `base: '/CosmicAnalogy/'` in production mode. The included `deploy.yml` workflow automatically builds and publishes the `dist/` directory to GitHub Pages on every push to `main`. It can also be triggered manually via `workflow_dispatch`.

After the first deployment, enable GitHub Pages in the repository settings and set the source to **GitHub Actions**.

## Continuous Integration

The CI workflow installs dependencies and runs the production build on each pull request and push to `main`.

## Contributing

Contributions are welcome! Please open issues or pull requests at:  
https://github.com/voku/CosmicAnalogy
