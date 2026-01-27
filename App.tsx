import React, { useState } from 'react';
import GalaxyMap from './components/GalaxyMap';
import HUD from './components/HUD';
import DataLogModal from './components/DataLogModal';
import { CelestialId } from './types';
import { CELESTIAL_DATA } from './constants';
import { ArrowRight, Github } from 'lucide-react';

const App: React.FC = () => {
  const [currentZone, setCurrentZone] = useState<CelestialId>(CelestialId.EARTH);
  const [modalMode, setModalMode] = useState<'logs' | 'sim' | null>(null);
  const [pingData, setPingData] = useState<{ zone: CelestialId, timestamp: number } | null>(null);
  
  const [cameraFlyTo, setCameraFlyTo] = useState<((zone: CelestialId) => void) | null>(null);

  const activeData = CELESTIAL_DATA[currentZone];
  const themeColor = activeData.color;

  // Used for HUD navigation - just moves camera
  const handleNavigate = (zone: CelestialId) => {
    setCurrentZone(zone);
    if (cameraFlyTo) {
      cameraFlyTo(zone);
    }
  };

  // Used for direct Map clicks - just moves camera, details shown in HUD
  const handleMapObjectClick = (zone: CelestialId) => {
    setCurrentZone(zone);
    if (cameraFlyTo) {
      cameraFlyTo(zone);
    }
  };

  const handlePing = () => {
    if (currentZone !== CelestialId.EARTH) {
      setPingData({ zone: currentZone, timestamp: Date.now() });
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative text-slate-100 font-sans bg-[#020617] selection:bg-brand-cyan selection:text-space-950">
      
      <GalaxyMap 
        activeZone={currentZone} 
        onZoneSelect={handleMapObjectClick}
        setCameraControl={setCameraFlyTo}
        pingData={pingData}
      />
      
      <header className="absolute top-6 left-6 z-50 pointer-events-none transition-colors duration-500">
        <h1 
          className="text-2xl md:text-3xl font-mono font-bold tracking-tighter drop-shadow-lg transition-colors duration-500"
          style={{ color: themeColor, textShadow: `0 0 30px ${themeColor}40` }}
        >
          COSMIC_SYSTEM_PROFILER_v1.0
        </h1>
        <p 
          className="text-[10px] md:text-xs font-mono uppercase tracking-widest bg-slate-900/80 backdrop-blur-md inline-block px-2 py-1 rounded border mt-2 transition-all duration-500 shadow-lg"
          style={{ color: themeColor, borderColor: `${themeColor}50`, boxShadow: `0 0 20px ${themeColor}20` }}
        >
          Scale: 0.5ns (CPU) = 1s (Human) | Protocol: LIGHT_SPEED_v1
        </p>
      </header>
      
      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={() => setModalMode('logs')}
            className="flex items-center gap-2 text-xs md:text-sm transition-all duration-300 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-lg border shadow-lg font-mono uppercase tracking-wider hover:text-white hover:border-white/80 hover:bg-slate-800"
            style={{ color: themeColor, borderColor: `${themeColor}60`, boxShadow: `0 0 15px ${themeColor}10` }}
          >
            <span>Mission_Brief</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <a
            href="https://github.com/voku/CosmicAnalogy"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[10px] md:text-xs transition-all duration-300 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-lg border shadow-lg font-mono uppercase tracking-wider hover:text-white hover:border-white/80 hover:bg-slate-800"
            style={{ color: themeColor, borderColor: `${themeColor}40`, boxShadow: `0 0 10px ${themeColor}10` }}
          >
            <Github className="w-3 h-3" />
            <span>Contribute</span>
          </a>
        </div>
      </div>

      <HUD 
        currentZone={currentZone}
        onNavigate={handleNavigate}
        onPing={handlePing}
      />

      <DataLogModal 
        isOpen={!!modalMode} 
        mode={modalMode} 
        onClose={() => setModalMode(null)} 
        currentZone={currentZone}
      />
    </div>
  );
};

export default App;
