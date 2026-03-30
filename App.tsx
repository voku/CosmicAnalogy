import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, HardDrive, Cpu, Network, Server, Globe, Sun, Image as ImageIcon, Info, ChevronRight, Zap, Map as MapIcon, ZoomIn, ZoomOut } from 'lucide-react';
import StarField from './components/StarField';

type Unit = 'Byte' | 'KB' | 'MB' | 'GB' | 'Photo';

interface Conversion {
  earth: string;
  sun: string;
  icon: React.ReactNode;
  description: string;
  bytes: number;
  color: string;
  scale: number;
}

const conversions: Record<Unit, Conversion> = {
  Byte: {
    bytes: 1,
    earth: 'A single grain of sand on all of Earth\'s beaches',
    sun: 'One hydrogen atom in the solar corona',
    icon: <Database className="w-5 h-5" />,
    description: 'The smallest addressable unit of data. 8 bits. A single ASCII character. 1 byte is to 1 GB what one second is to 31.7 years.',
    color: '#22d3ee',
    scale: 0.04,
  },
  KB: {
    bytes: 1_024,
    earth: 'A short poem or a plain-text email',
    sun: 'A speck of interplanetary dust',
    icon: <HardDrive className="w-5 h-5" />,
    description: '1,024 bytes. Early home computers ran on 48–64 KB. Enough for a full short story paragraph or the source code of the first Apollo guidance computer.',
    color: '#34d399',
    scale: 0.18,
  },
  MB: {
    bytes: 1_048_576,
    earth: 'A high-quality photograph or one minute of CD-quality audio',
    sun: 'A small meteoroid drifting through the asteroid belt',
    icon: <Cpu className="w-5 h-5" />,
    description: '1,048,576 bytes. A floppy disk held 1.44 MB. A 3-minute MP3 song is ~3 MB. Your current browser tab uses 50–200 MB of RAM.',
    color: '#a78bfa',
    scale: 0.44,
  },
  GB: {
    bytes: 1_073_741_824,
    earth: 'A full-length HD movie or an entire AAA game level',
    sun: 'Earth\'s volume — it takes 1.3 million Earths to fill the Sun',
    icon: <Server className="w-5 h-5" />,
    description: '1,073,741,824 bytes. Modern smartphones pack 64–512 GB. The human genome is ~3 GB. The entire printed collection of the US Library of Congress is ~10 TB (10,000 GB).',
    color: '#fb923c',
    scale: 0.76,
  },
  Photo: {
    bytes: 4_000_000,
    earth: '12 million pixels — reality frozen in silicon',
    sun: 'Earth\'s surface area vs. the Sun\'s — dwarfed 12,000×',
    icon: <ImageIcon className="w-5 h-5" />,
    description: '~4 MB per shot. A 12 MP photo stores 12 million RGB pixel values. At 1 photo per second, filling a 1 TB drive takes ~3 continuous days of shooting.',
    color: '#f472b6',
    scale: 0.38,
  },
};

const units: Unit[] = ['Byte', 'KB', 'MB', 'GB', 'Photo'];

const formatBytes = (n: number): string => {
  if (n < 1_024) return `${n} B`;
  if (n < 1_048_576) return `${(n / 1_024).toFixed(2)} KB`;
  if (n < 1_073_741_824) return `${(n / 1_048_576).toFixed(2)} MB`;
  return `${(n / 1_073_741_824).toFixed(2)} GB`;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

const App: React.FC = () => {
  const [activeUnit, setActiveUnit] = useState<Unit>('MB');
  const [showInfo, setShowInfo] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const current = conversions[activeUnit];

  const earthRadius = 48 + current.scale * 60;
  const sunRadius = 96;
  const zoomScale = 0.8 + zoomLevel * 0.4;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-x-hidden font-sans selection:bg-sky-500 selection:text-white">
      <StarField />

      {/* Header */}
      <header className="relative z-10 pt-6 pb-3 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-mono font-bold tracking-tight drop-shadow-lg transition-colors duration-500"
            style={{ color: current.color, textShadow: `0 0 30px ${current.color}60` }}
          >
            COSMIC_DATA_SCALE
          </h1>
          <p
            className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] bg-slate-900/80 backdrop-blur-md inline-block px-2 py-1 rounded border mt-1 transition-all duration-500"
            style={{ color: current.color, borderColor: `${current.color}50` }}
          >
            Data Size → Cosmic Analogy Visualizer
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

      {/* Unit Selector */}
      <nav className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 flex-wrap">
        {units.map((unit) => {
          const c = conversions[unit];
          const isActive = unit === activeUnit;
          return (
            <motion.button
              key={unit}
              onClick={() => { setActiveUnit(unit); setShowMap(false); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 shadow-md"
              style={{
                backgroundColor: isActive ? `${c.color}25` : 'rgba(15,23,42,0.7)',
                borderColor: isActive ? c.color : 'rgba(100,116,139,0.4)',
                color: isActive ? c.color : '#94a3b8',
                boxShadow: isActive ? `0 0 20px ${c.color}30` : 'none',
              }}
            >
              {c.icon}
              <span>{unit}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-4 sm:px-8 pb-8">

        {/* Cosmic Visualization */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeUnit}
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
              {/* Earth Side */}
              <div className="flex flex-col items-center gap-4 min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sky-400">
                  <Globe className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-widest">Earth Scale</span>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.03, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="rounded-full flex items-center justify-center shrink-0 shadow-2xl"
                  style={{
                    width: earthRadius * 2,
                    height: earthRadius * 2,
                    background: `radial-gradient(circle at 35% 35%, #60a5fa, #1d4ed8 60%, #172554)`,
                    boxShadow: `0 0 ${earthRadius}px #3b82f640, inset 0 0 ${earthRadius / 2}px #1e40af40`,
                  }}
                >
                  <Globe className="w-6 h-6 text-sky-200 opacity-40" />
                </motion.div>
                <p className="text-center text-xs sm:text-sm text-slate-300 max-w-[180px] leading-relaxed italic">
                  "{current.earth}"
                </p>
              </div>

              {/* Center: Data Particle */}
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
                <span
                  className="text-xs font-mono font-bold tracking-wider text-center"
                  style={{ color: current.color }}
                >
                  {activeUnit === 'Photo' ? '~4 MB' : formatBytes(current.bytes)}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>

              {/* Sun Side */}
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
                    width: sunRadius * 2,
                    height: sunRadius * 2,
                    background: `radial-gradient(circle at 35% 30%, #fde68a, #f59e0b 50%, #b45309 80%, #78350f)`,
                    boxShadow: `0 0 ${sunRadius}px #f59e0b50, inset 0 0 ${sunRadius / 2}px #d9770040`,
                  }}
                >
                  <Sun className="w-8 h-8 text-amber-100 opacity-30" />
                </motion.div>
                <p className="text-center text-xs sm:text-sm text-slate-300 max-w-[180px] leading-relaxed italic">
                  "{current.sun}"
                </p>
              </div>
            </div>

            {/* Zoom level indicator (overlay) */}
            <div className="absolute bottom-3 right-3">
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900/70 px-2 py-1 rounded border border-slate-700/60">
                {zoomLevel}×
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Map View — all units on a relative scale */}
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
                  Scale Map — all units relative to 1 GB
                </h3>
                <div className="space-y-3">
                  {units.map((unit) => {
                    const c = conversions[unit];
                    const gb = conversions['GB'].bytes;
                    const pct = Math.max(2, (Math.log10(c.bytes + 1) / Math.log10(gb + 1)) * 100);
                    return (
                      <button
                        key={unit}
                        onClick={() => { setActiveUnit(unit); setShowMap(false); }}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center gap-3 mb-1">
                          <span className="w-14 text-xs font-mono font-bold" style={{ color: c.color }}>{unit}</span>
                          <span className="text-xs font-mono text-slate-500">{formatBytes(c.bytes)}</span>
                        </div>
                        <div className="h-6 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full flex items-center px-2 group-hover:brightness-125 transition-all"
                            style={{ backgroundColor: `${c.color}50`, borderRight: `2px solid ${c.color}` }}
                          >
                            <span className="text-[9px] font-mono truncate" style={{ color: c.color }}>{unit}</span>
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

        {/* Info Panel */}
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
                  key={activeUnit}
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
                        {activeUnit} — {activeUnit === 'Photo' ? '~4 MB' : formatBytes(current.bytes)}
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
                        <div className="text-sm text-slate-200 leading-relaxed">{current.sun}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Controls */}
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

        {/* Fun comparison footer */}
        <div className="mt-8 mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2 text-slate-400">
              <Network className="w-4 h-4" />
              <span className="text-xs font-mono uppercase tracking-widest">Context: Human Brain</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              The human brain stores an estimated <span className="text-violet-400 font-semibold">~2.5 petabytes</span> (2,500 TB) of memories.
              At average internet speeds of <span className="text-cyan-400 font-semibold">100 Mbps</span>, uploading a human mind would take{' '}
              <span className="text-amber-400 font-semibold">~2,300 years</span>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
