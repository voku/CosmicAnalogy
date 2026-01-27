import React, { useState } from 'react';
import { CosmicZone } from '../types';
import { ZONES, ZONE_ICONS } from '../constants';
import { ArrowRight, Info } from 'lucide-react';

interface ZoneVisualizerProps {
  activeZone: CosmicZone;
  onZoneChange: (zone: CosmicZone) => void;
}

const ZoneVisualizer: React.FC<ZoneVisualizerProps> = ({ activeZone, onZoneChange }) => {
  const currentData = ZONES[activeZone];

  // Calculate relative scale for visual bar width (logarithmic representation simplified)
  const getWidth = (zone: CosmicZone) => {
    switch (zone) {
      case CosmicZone.CPU: return 'w-1';
      case CosmicZone.RAM: return 'w-4';
      case CosmicZone.SSD: return 'w-16';
      case CosmicZone.NETWORK: return 'w-full';
      default: return 'w-0';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.values(ZONES).map((zone) => (
          <button
            key={zone.id}
            onClick={() => onZoneChange(zone.id)}
            className={`
              flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300
              ${activeZone === zone.id 
                ? 'bg-white/10 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]' 
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'}
            `}
          >
            {ZONE_ICONS[zone.id]}
            <span className="font-mono uppercase tracking-wider text-sm md:text-base">
              {zone.metaphor}
            </span>
          </button>
        ))}
      </div>

      {/* Main Display */}
      <div className="relative bg-slate-900/80 border border-slate-700 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
        {/* Header Strip */}
        <div className="h-2 w-full flex">
            <div className={`h-full bg-emerald-500 transition-all duration-500 ${activeZone === CosmicZone.CPU ? 'w-full' : 'w-1/4 opacity-30'}`} />
            <div className={`h-full bg-blue-500 transition-all duration-500 ${activeZone === CosmicZone.RAM ? 'w-full' : 'w-1/4 opacity-30'}`} />
            <div className={`h-full bg-amber-500 transition-all duration-500 ${activeZone === CosmicZone.SSD ? 'w-full' : 'w-1/4 opacity-30'}`} />
            <div className={`h-full bg-red-500 transition-all duration-500 ${activeZone === CosmicZone.NETWORK ? 'w-full' : 'w-1/4 opacity-30'}`} />
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          
          {/* Visual Metaphor Area */}
          <div className="flex flex-col justify-center items-center relative min-h-[300px] border border-slate-800 bg-black/40 rounded-xl p-6">
            <div className={`
              absolute inset-0 bg-gradient-to-br opacity-20 pointer-events-none rounded-xl transition-colors duration-500
              ${activeZone === CosmicZone.CPU ? 'from-emerald-500 to-transparent' : ''}
              ${activeZone === CosmicZone.RAM ? 'from-blue-500 to-transparent' : ''}
              ${activeZone === CosmicZone.SSD ? 'from-amber-500 to-transparent' : ''}
              ${activeZone === CosmicZone.NETWORK ? 'from-red-500 to-transparent' : ''}
            `} />

            {/* Central Planet/Object */}
            <div className={`
              w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl flex items-center justify-center text-center p-4 transition-all duration-700 animate-float
              ${activeZone === CosmicZone.CPU ? 'bg-emerald-900 shadow-[0_0_50px_rgba(16,185,129,0.5)] border-4 border-emerald-400' : ''}
              ${activeZone === CosmicZone.RAM ? 'bg-slate-300 shadow-[0_0_50px_rgba(148,163,184,0.5)] border-4 border-slate-100' : ''}
              ${activeZone === CosmicZone.SSD ? 'bg-amber-600 shadow-[0_0_50px_rgba(245,158,11,0.6)] border-4 border-amber-300' : ''}
              ${activeZone === CosmicZone.NETWORK ? 'bg-black shadow-[0_0_50px_rgba(239,68,68,0.3)] border border-red-500/50' : ''}
            `}>
                {activeZone === CosmicZone.NETWORK ? (
                    <div className="space-y-1">
                        <div className="w-1 h-1 bg-white rounded-full absolute top-10 left-10 animate-pulse"></div>
                        <div className="w-1 h-1 bg-white rounded-full absolute bottom-10 right-20 animate-pulse delay-75"></div>
                        <span className="text-red-400 font-mono tracking-widest text-xs">VOID</span>
                    </div>
                ) : (
                    <span className={`font-bold text-lg ${activeZone === CosmicZone.RAM ? 'text-slate-900' : 'text-white'}`}>
                        {currentData.metaphor}
                    </span>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4 text-slate-400">
               <span className="text-xs uppercase tracking-widest">Tech Component</span>
               <ArrowRight className="w-4 h-4" />
               <span className="text-white font-mono font-bold">{currentData.name}</span>
            </div>
          </div>

          {/* Data & Info Area */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{currentData.name}</h2>
              <p className="text-brand-cyan font-mono text-xl">{currentData.latencyNative}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border-l-4" style={{ borderLeftColor: currentData.color }}>
                <div className="text-xs uppercase text-slate-500 mb-1 font-bold tracking-wider">Distance Metaphor</div>
                <div className="text-lg text-white">{currentData.distance}</div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg border-l-4 border-slate-600">
                <div className="text-xs uppercase text-slate-500 mb-1 font-bold tracking-wider">Scale Factor</div>
                <div className="text-lg text-white">
                    {activeZone === CosmicZone.CPU ? '1x (Baseline)' : 
                     `${(currentData.latencyNs / ZONES[CosmicZone.CPU].latencyNs).toLocaleString()}x Slower`}
                </div>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed text-sm md:text-base border-t border-slate-700 pt-4">
              {currentData.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneVisualizer;