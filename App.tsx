import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database, HardDrive, Cpu, Network, Server, Globe, Sun,
  Image as ImageIcon, Info, ChevronRight, Zap,
  Map as MapIcon, ZoomIn, ZoomOut, Timer, Layers, Gauge,
} from 'lucide-react';
import StarField from './components/StarField';

/* ─── Mode type ──────────────────────────────────────────── */
type Mode = 'storage' | 'speed';

/* ─── Shared item shape used by both modes ───────────────── */
interface CosmicItem {
  label: string;
  value: number;          // bytes (storage) or nanoseconds (speed)
  formattedValue: string; // human-readable value
  earth: string;          // Earth-scale analogy
  cosmic: string;         // Sun / deep-space analogy
  icon: React.ReactNode;
  description: string;
  color: string;
  scale: number;          // 0 → 1 relative visual weight
  distance_km: number;    // mapped cosmic distance in km
}

/* ─── Storage items ──────────────────────────────────────── */
const storageItems: CosmicItem[] = [
  {
    label: 'Byte',
    value: 1,
    formattedValue: '1 B',
    earth: 'A single grain of sand on all of Earth\'s beaches',
    cosmic: 'One hydrogen atom in the solar corona',
    icon: <Database className="w-5 h-5" />,
    description: 'The smallest addressable unit of data. 8 bits. A single ASCII character. 1 byte is to 1 GB what one second is to 31.7 years.',
    color: '#22d3ee',
    scale: 0.04,
    distance_km: 1,
  },
  {
    label: 'KB',
    value: 1_024,
    formattedValue: '1 KB',
    earth: 'A short poem or a plain-text email',
    cosmic: 'A speck of interplanetary dust',
    icon: <HardDrive className="w-5 h-5" />,
    description: '1,024 bytes. Early home computers ran on 48–64 KB. Enough for a full short story paragraph or the source code of the first Apollo guidance computer.',
    color: '#34d399',
    scale: 0.18,
    distance_km: 384_400,
  },
  {
    label: 'MB',
    value: 1_048_576,
    formattedValue: '1 MB',
    earth: 'A high-quality photograph or one minute of CD-quality audio',
    cosmic: 'A small meteoroid drifting through the asteroid belt',
    icon: <Cpu className="w-5 h-5" />,
    description: '1,048,576 bytes. A floppy disk held 1.44 MB. A 3-minute MP3 song is ~3 MB. Your current browser tab uses 50–200 MB of RAM.',
    color: '#a78bfa',
    scale: 0.44,
    distance_km: 54_600_000,
  },
  {
    label: 'GB',
    value: 1_073_741_824,
    formattedValue: '1 GB',
    earth: 'A full-length HD movie or an entire AAA game level',
    cosmic: 'Earth\'s volume — it takes 1.3 million Earths to fill the Sun',
    icon: <Server className="w-5 h-5" />,
    description: '1,073,741,824 bytes. Modern smartphones pack 64–512 GB. The human genome is ~3 GB. The entire printed collection of the US Library of Congress is ~10 TB (10,000 GB).',
    color: '#fb923c',
    scale: 0.76,
    distance_km: 149_600_000,
  },
  {
    label: 'Photo',
    value: 4_000_000,
    formattedValue: '~4 MB',
    earth: '12 million pixels — reality frozen in silicon',
    cosmic: 'Earth\'s surface area vs. the Sun\'s — dwarfed 12,000×',
    icon: <ImageIcon className="w-5 h-5" />,
    description: '~4 MB per shot. A 12 MP photo stores 12 million RGB pixel values. At 1 photo per second, filling a 1 TB drive takes ~3 continuous days of shooting.',
    color: '#f472b6',
    scale: 0.38,
    distance_km: 78_340_000, // midway between Mars and Sun — proportional to ~4 MB in the byte→GB log scale
  },
];

/* ─── Speed / Latency items ──────────────────────────────── */
const speedItems: CosmicItem[] = [
  {
    label: 'CPU Cycle',
    value: 0.5,
    formattedValue: '0.5 ns',
    earth: 'Blinking your eyes — instantaneous',
    cosmic: 'Standing on the surface of Earth — distance zero',
    icon: <Zap className="w-5 h-5" />,
    description: 'One clock tick at 2 GHz. The absolute reference. If this were 1 human second, every other operation stretches to cosmic timescales.',
    color: '#34d399',
    scale: 0.04,
    distance_km: 0,
  },
  {
    label: 'RAM Access',
    value: 100,
    formattedValue: '100 ns',
    earth: 'Walking to the coffee machine and back',
    cosmic: 'Earth → Moon (384,400 km). A context switch away.',
    icon: <Layers className="w-5 h-5" />,
    description: '100 nanoseconds. 200× slower than a CPU cycle. DRAM must charge tiny capacitors — fast, but a bus ride away in processor time.',
    color: '#60a5fa',
    scale: 0.22,
    distance_km: 384_400,
  },
  {
    label: 'SSD Read',
    value: 150_000,
    formattedValue: '150 µs',
    earth: 'A long weekend trip — 3.5 days relative to CPU',
    cosmic: 'Earth → Sun (149.6M km). Heavy infrastructure.',
    icon: <HardDrive className="w-5 h-5" />,
    description: '150 microseconds. NVMe flash must locate the block, transfer through the controller, cross the PCIe bus. 300,000× slower than a CPU tick.',
    color: '#fbbf24',
    scale: 0.50,
    distance_km: 149_600_000,
  },
  {
    label: 'HDD Seek',
    value: 10_000_000,
    formattedValue: '10 ms',
    earth: 'Waiting for seasons to change — ~8 months in CPU time',
    cosmic: 'Earth → Heliopause (18.1B km). Edge of the solar system.',
    icon: <Database className="w-5 h-5" />,
    description: '10 milliseconds. A spinning platter must physically rotate and a head must swing into position. 20,000,000× slower than a CPU tick.',
    color: '#8b5cf6',
    scale: 0.72,
    distance_km: 18_100_000_000,
  },
  {
    label: 'Internet Ping',
    value: 150_000_000,
    formattedValue: '150 ms',
    earth: 'A decade-long voyage — ~9.5 years in CPU time',
    cosmic: 'Earth → Proxima Centauri (4.24 light years). Deep space.',
    icon: <Globe className="w-5 h-5" />,
    description: '150 milliseconds. Your packet crosses undersea cables, hops through routers on 3 continents. 300,000,000× slower than a single CPU tick.',
    color: '#f87171',
    scale: 1.0,
    distance_km: 40_207_975_000_000,
  },
];

/* ─── Helpers ────────────────────────────────────────────── */
const formatBytes = (n: number): string => {
  if (n < 1_024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1_024).toFixed(2)} KB`;
  if (n < 1_073_741_824) return `${(n / 1_048_576).toFixed(2)} MB`;
  return `${(n / 1_073_741_824).toFixed(2)} GB`;
};

const formatDistance = (km: number): string => {
  if (km === 0) return '0 km (local)';
  if (km < 1_000_000) return `${km.toLocaleString()} km`;
  if (km < 1_000_000_000) return `${(km / 1_000_000).toFixed(1)}M km`;
  if (km < 1_000_000_000_000) return `${(km / 1_000_000_000).toFixed(1)}B km`;
  return `${(km / 1_000_000_000_000).toFixed(1)}T km`;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

/* ─── Celestial body rendering helpers ───────────────────── */
const CELESTIAL_BODIES = [
  { name: 'Earth',           km: 0,                   size: 12,  color: '#3b82f6', gradient: 'radial-gradient(circle at 35% 35%, #60a5fa, #1d4ed8 60%, #172554)' },
  { name: 'Moon',            km: 384_400,             size: 6,   color: '#94a3b8', gradient: 'radial-gradient(circle at 40% 35%, #e2e8f0, #94a3b8 60%, #475569)' },
  { name: 'Mars',            km: 54_600_000,          size: 10,  color: '#ef4444', gradient: 'radial-gradient(circle at 35% 35%, #fca5a5, #ef4444 60%, #7f1d1d)' },
  { name: 'Sun',             km: 149_600_000,         size: 24,  color: '#f59e0b', gradient: 'radial-gradient(circle at 35% 30%, #fde68a, #f59e0b 50%, #b45309 80%, #78350f)' },
  { name: 'Heliopause',      km: 18_100_000_000,      size: 4,   color: '#8b5cf6', gradient: 'radial-gradient(circle at 40% 40%, #c4b5fd, #8b5cf6 60%, #4c1d95)' },
  { name: 'Proxima Centauri', km: 40_207_975_000_000, size: 8,   color: '#ec4899', gradient: 'radial-gradient(circle at 35% 35%, #fbcfe8, #ec4899 60%, #831843)' },
];

/* ─── App ────────────────────────────────────────────────── */
const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('storage');
  const [activeIndex, setActiveIndex] = useState(2); // start on MB / SSD Read
  const [showInfo, setShowInfo] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const items = mode === 'storage' ? storageItems : speedItems;
  const current = items[activeIndex] ?? items[0];
  const zoomScale = 0.8 + zoomLevel * 0.4;

  /* derived sizes */
  const earthRadius = 48 + current.scale * 60;
  const cosmicRadius = 96;

  /* accent for mode toggle */
  const modeAccent = mode === 'storage' ? '#22d3ee' : '#34d399';

  /* map reference max */
  const mapMaxValue = Math.max(...items.map((i) => i.value));

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden font-sans selection:bg-sky-500 selection:text-white">
      <StarField />

      {/* ── Header ──────────────────────────────── */}
      <header className="relative z-10 pt-6 pb-2 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-tight drop-shadow-lg transition-colors duration-500"
            style={{ color: current.color, textShadow: `0 0 30px ${current.color}60` }}
          >
            COSMIC_ANALOGY
          </h1>
          <p
            className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] bg-slate-900/80 backdrop-blur-md inline-block px-2 py-1 rounded border mt-1 transition-all duration-500"
            style={{ color: current.color, borderColor: `${current.color}50` }}
          >
            {mode === 'storage' ? 'Data Size → Space Dimensions' : 'Computer Latency → Space Distances'}
          </p>
        </div>
        <a
          href="https://github.com/voku/CosmicAnalogy"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-[10px] sm:text-xs transition-all duration-300 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border shadow-lg font-mono uppercase tracking-wider hover:text-white hover:border-white/60 hover:bg-slate-800 shrink-0"
          style={{ color: current.color, borderColor: `${current.color}40` }}
        >
          <Zap className="w-3 h-3" />
          <span>GitHub</span>
        </a>
      </header>

      {/* ── Mode Toggle ─────────────────────────── */}
      <div className="relative z-10 flex justify-center px-4 pt-2 pb-1">
        <div className="inline-flex rounded-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm p-1 gap-1">
          {([
            { key: 'storage' as Mode, label: 'Storage Size', icon: <Database className="w-3.5 h-3.5" /> },
            { key: 'speed' as Mode,   label: 'Computer Speed', icon: <Gauge className="w-3.5 h-3.5" /> },
          ]).map(({ key, label, icon }) => (
            <motion.button
              key={key}
              onClick={() => { setMode(key); setActiveIndex(2); setShowMap(false); setShowInfo(false); }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300"
              style={{
                backgroundColor: mode === key ? `${modeAccent}20` : 'transparent',
                color: mode === key ? modeAccent : '#64748b',
                boxShadow: mode === key ? `0 0 16px ${modeAccent}25` : 'none',
              }}
            >
              {icon}
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Item Selector ───────────────────────── */}
      <nav className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 flex-wrap">
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <motion.button
              key={item.label}
              onClick={() => { setActiveIndex(idx); setShowMap(false); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 shadow-md"
              style={{
                backgroundColor: isActive ? `${item.color}25` : 'rgba(15,23,42,0.7)',
                borderColor: isActive ? item.color : 'rgba(100,116,139,0.4)',
                color: isActive ? item.color : '#94a3b8',
                boxShadow: isActive ? `0 0 20px ${item.color}30` : 'none',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* ── Main Content ────────────────────────── */}
      <main className="relative z-10 px-4 sm:px-8 pb-8">

        {/* Cosmic Visualization */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${mode}-${current.label}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-2xl border bg-slate-950/60 backdrop-blur-sm mx-auto max-w-4xl"
            style={{ borderColor: `${current.color}30`, boxShadow: `0 0 60px ${current.color}15` }}
          >
            <div
              className="flex items-center justify-center py-8 sm:py-12 px-4"
              style={{ transform: `scale(${zoomScale})`, transition: 'transform 0.4s ease', transformOrigin: 'center center' }}
            >
              {/* Left: Earth / Origin */}
              <div className="flex flex-col items-center gap-4 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sky-400">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">
                    {mode === 'speed' ? 'CPU (Origin)' : 'Earth Scale'}
                  </span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.03, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full flex items-center justify-center shrink-0 shadow-2xl"
                  style={{
                    width: earthRadius * 2,
                    height: earthRadius * 2,
                    background: 'radial-gradient(circle at 35% 35%, #60a5fa, #1d4ed8 60%, #172554)',
                    boxShadow: `0 0 ${earthRadius}px #3b82f640, inset 0 0 ${earthRadius / 2}px #1e40af40`,
                  }}
                >
                  <Globe className="w-6 h-6 text-sky-200 opacity-40" />
                </motion.div>
                <p className="text-center text-xs sm:text-sm text-slate-300 max-w-[180px] leading-relaxed italic">
                  &ldquo;{current.earth}&rdquo;
                </p>
              </div>

              {/* Center: The item */}
              <div className="flex flex-col items-center gap-3 px-4 sm:px-8 shrink-0">
                <ChevronRight className="w-5 h-5 text-slate-500" />
                <motion.div
                  animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full shadow-lg flex items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: `${current.color}30`,
                    border: `2px solid ${current.color}`,
                    boxShadow: `0 0 20px ${current.color}80`,
                    color: current.color,
                  }}
                >
                  {current.icon}
                </motion.div>
                <span className="text-xs font-mono font-bold tracking-wider text-center" style={{ color: current.color }}>
                  {current.formattedValue}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  ≈ {formatDistance(current.distance_km)}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>

              {/* Right: Cosmic body */}
              <div className="flex flex-col items-center gap-4 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-amber-400">
                  <Sun className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Cosmic Scale</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full flex items-center justify-center shrink-0 shadow-2xl"
                  style={{
                    width: cosmicRadius * 2,
                    height: cosmicRadius * 2,
                    background: 'radial-gradient(circle at 35% 30%, #fde68a, #f59e0b 50%, #b45309 80%, #78350f)',
                    boxShadow: `0 0 ${cosmicRadius}px #f59e0b50, inset 0 0 ${cosmicRadius / 2}px #d9770040`,
                  }}
                >
                  <Sun className="w-8 h-8 text-amber-100 opacity-30" />
                </motion.div>
                <p className="text-center text-xs sm:text-sm text-slate-300 max-w-[180px] leading-relaxed italic">
                  &ldquo;{current.cosmic}&rdquo;
                </p>
              </div>
            </div>

            {/* Zoom indicator */}
            <div className="absolute bottom-3 right-3">
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900/70 px-2 py-1 rounded border border-slate-700/60">
                {zoomLevel}×
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Scale Map ─────────────────────────── */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden mt-4 mx-auto max-w-4xl"
            >
              <div className="rounded-2xl border border-slate-700/60 bg-slate-950/70 backdrop-blur-sm p-5 sm:p-7">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                  <MapIcon className="w-4 h-4" />
                  {mode === 'storage'
                    ? 'Scale Map — storage sizes vs. cosmic distance'
                    : 'Scale Map — latency vs. cosmic distance'}
                </h3>

                {/* Cosmic distance ruler */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Earth</span>
                    <span>Moon</span>
                    <span>Mars</span>
                    <span>Sun</span>
                    <span>Heliopause</span>
                    <span>Proxima ★</span>
                  </div>
                  <div className="relative h-2 bg-slate-800 rounded-full overflow-visible">
                    {CELESTIAL_BODIES.map((body) => {
                      const maxKm = CELESTIAL_BODIES[CELESTIAL_BODIES.length - 1].km;
                      const pct = maxKm === 0 ? 0 : Math.max(0, (Math.log10(body.km + 1) / Math.log10(maxKm + 1)) * 100);
                      return (
                        <div
                          key={body.name}
                          className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-slate-900"
                          style={{
                            left: `${pct}%`,
                            width: body.size,
                            height: body.size,
                            background: body.gradient,
                            boxShadow: `0 0 ${body.size}px ${body.color}60`,
                            transform: `translate(-50%, -50%)`,
                          }}
                          title={`${body.name}: ${formatDistance(body.km)}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Bars */}
                <div className="space-y-3">
                  {items.map((item, idx) => {
                    const pct = Math.max(2, (Math.log10(item.value + 1) / Math.log10(mapMaxValue + 1)) * 100);
                    return (
                      <button
                        key={item.label}
                        onClick={() => { setActiveIndex(idx); setShowMap(false); }}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-24 text-xs font-mono font-bold truncate" style={{ color: item.color }}>
                            {item.label}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {item.formattedValue} — {formatDistance(item.distance_km)}
                          </span>
                        </div>
                        <div className="h-6 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full flex items-center px-2 group-hover:brightness-125 transition-all"
                            style={{ backgroundColor: `${item.color}50`, borderRight: `2px solid ${item.color}` }}
                          >
                            <span className="text-[9px] font-mono truncate" style={{ color: item.color }}>
                              {item.label}
                            </span>
                          </motion.div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Info Panel ─────────────────────────── */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="overflow-hidden mt-4 mx-auto max-w-4xl"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${current.label}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl border bg-slate-950/70 backdrop-blur-sm p-5 sm:p-7"
                  style={{ borderColor: `${current.color}40` }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-2.5 rounded-xl shrink-0"
                      style={{ backgroundColor: `${current.color}20`, color: current.color }}
                    >
                      {current.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-mono font-bold mb-1" style={{ color: current.color }}>
                        {current.label} — {current.formattedValue}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">{current.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-sky-950/40 border border-sky-800/40 p-4 flex gap-3">
                      <Globe className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-sky-400 mb-1">Earth Analogy</div>
                        <div className="text-sm text-slate-200 leading-relaxed">{current.earth}</div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-amber-950/40 border border-amber-700/40 p-4 flex gap-3">
                      <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-1">Cosmic Analogy</div>
                        <div className="text-sm text-slate-200 leading-relaxed">{current.cosmic}</div>
                      </div>
                    </div>
                  </div>

                  {/* Distance badge */}
                  <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500">
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Mapped cosmic distance: <span className="text-slate-300 font-semibold">{formatDistance(current.distance_km)}</span></span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Bottom Controls ───────────────────── */}
        <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setShowMap((v) => !v); setShowInfo(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all duration-300"
            style={{
              backgroundColor: showMap ? `${current.color}20` : 'rgba(15,23,42,0.8)',
              borderColor: showMap ? current.color : 'rgba(100,116,139,0.4)',
              color: showMap ? current.color : '#94a3b8',
            }}
          >
            <MapIcon className="w-4 h-4" />
            <span>Scale Map</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => { setShowInfo((v) => !v); setShowMap(false); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-xs uppercase tracking-wider transition-all duration-300"
            style={{
              backgroundColor: showInfo ? `${current.color}20` : 'rgba(15,23,42,0.8)',
              borderColor: showInfo ? current.color : 'rgba(100,116,139,0.4)',
              color: showInfo ? current.color : '#94a3b8',
            }}
          >
            <Info className="w-4 h-4" />
            <span>Info</span>
          </motion.button>

          <div className="flex items-center gap-1 border border-slate-700/60 bg-slate-900/80 rounded-xl px-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(MIN_ZOOM, z - 1))}
              disabled={zoomLevel <= MIN_ZOOM}
              className="p-2 disabled:opacity-30 hover:text-white transition-colors text-slate-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-500 px-1">{zoomLevel}×</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(MAX_ZOOM, z + 1))}
              disabled={zoomLevel >= MAX_ZOOM}
              className="p-2 disabled:opacity-30 hover:text-white transition-colors text-slate-400"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Context Footer ────────────────────── */}
        <div className="mt-8 mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5 text-center">
            {mode === 'storage' ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                  <Network className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Context: Human Brain</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  The human brain stores an estimated <span className="text-violet-400 font-semibold">~2.5 petabytes</span> (2,500 TB) of memories.
                  At average internet speeds of <span className="text-cyan-400 font-semibold">100 Mbps</span>, uploading a human mind would take{' '}
                  <span className="text-amber-400 font-semibold">~7 years</span> of non-stop transfer.
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
                  <Timer className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Context: If a CPU cycle were 1 second</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                  A single network packet to Europe would take{' '}
                  <span className="text-red-400 font-semibold">~9.5 years</span>.{' '}
                  Reading from an SSD is a <span className="text-amber-400 font-semibold">3.5-day trip</span>.{' '}
                  Even RAM access feels like a <span className="text-sky-400 font-semibold">3.5-minute coffee break</span>.{' '}
                  This is why async I/O and caching are critical.
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
