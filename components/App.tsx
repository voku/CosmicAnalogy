import React, { useState } from 'react';
import GalaxyMap from './components/GalaxyMap';
import HUD from './components/HUD';
import DataLogModal from './components/DataLogModal';
import { CelestialId } from './types';
import { ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  const [currentZone, setCurrentZone] = useState<CelestialId>(CelestialId.EARTH);
  const [modalMode, setModalMode] = useState<'logs' | 'sim' | null>(null);
  const [pingData, setPingData] = useState<{ zone: CelestialId, timestamp: number } | null>(null);
  
  const [cameraFlyTo, setCameraFlyTo] = useState<((zone: CelestialId) => void) | null>(null);

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
    <div className="h-screen w-screen overflow-hidden relative text-slate-100 font-sans bg-space-950 selection:bg-brand-cyan selection:text-space-950">
      
      <GalaxyMap 
        activeZone={currentZone} 
        onZoneSelect={handleMapObjectClick}
        setCameraControl={setCameraFlyTo}
        pingData={pingData}
      />
      
      <header className="absolute top-6 left-6 z-50 pointer-events-none">
        <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-tighter text-brand-cyan drop-shadow-lg">
          COSMIC_SYSTEM_PROFILER_v1.0
        </h1>
        <p className="text-[10px] md:text-xs font-mono text-brand-cyan/90 uppercase tracking-widest bg-space-900/60 backdrop-blur-sm inline-block px-2 py-1 rounded border border-brand-cyan/30 mt-2">
          Scale: 0.5ns (CPU) = 1s (Human) | Protocol: LIGHT_SPEED_v1
        </p>
      </header>
      
      <div className="absolute top-6 right-6 z-50 pointer-events-auto">
             <button 
                onClick={() => setModalMode('logs')}
                className="flex items-center gap-2 text-xs md:text-sm text-brand-cyan hover:text-white transition-colors bg-space-900/60 backdrop-blur px-4 py-2 rounded-lg border border-brand-cyan/40 hover:border-brand-cyan hover:shadow-lg font-mono uppercase tracking-wider"
            >
                <span>Mission_Brief</span>
                <ArrowRight className="w-3 h-3" />
            </button>
      </div>

      <HUD 
        currentZone={currentZone}
        onNavigate={handleNavigate}
        onToggleLogs={() => setModalMode('logs')}
        onToggleSim={() => setModalMode('sim')}
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