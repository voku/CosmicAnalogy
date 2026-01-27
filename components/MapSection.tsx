import React from 'react';
import { CosmicZone } from '../types';
import { ZONES } from '../constants';
import UniverseObject from './UniverseObject';
import { ArrowDown } from 'lucide-react';

interface MapSectionProps {
  zone: CosmicZone;
  isLast?: boolean;
}

const MapSection: React.FC<MapSectionProps> = ({ zone, isLast }) => {
  const data = ZONES[zone];

  return (
    <div 
      id={`zone-${zone}`}
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 snap-start border-l border-slate-800/50 ml-4 md:ml-0 md:border-l-0"
    >
      {/* Visual Object */}
      <div className="relative w-full h-[400px] flex items-center justify-center mb-12 perspective-1000">
        <UniverseObject type={zone} />
      </div>

      {/* Info Card */}
      <div className="z-20 max-w-xl w-full mx-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-6 md:p-8 rounded-2xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full transition-all duration-500 group-hover:w-2" style={{ backgroundColor: data.color }}></div>
        
        <div className="flex justify-between items-start mb-4">
            <div>
                <h2 className="text-3xl font-bold text-white">{data.metaphor}</h2>
                <div className="text-sm font-mono text-slate-400 uppercase tracking-widest mt-1">{data.name}</div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-mono text-brand-cyan font-bold">{data.latencyNative}</div>
                <div className="text-xs text-slate-500 mt-1 uppercase">Latency</div>
            </div>
        </div>

        <p className="text-slate-300 leading-relaxed mb-6 border-t border-slate-800 pt-4">
            {data.description}
        </p>

        <div className="flex items-center justify-between text-xs font-mono text-slate-500 bg-slate-950/50 p-3 rounded border border-slate-800">
            <span>DISTANCE FROM CPU</span>
            <span className="text-white">{data.distance}</span>
        </div>
      </div>
        
      {/* Connecting Line Segment */}
      {!isLast && (
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-slate-800 to-transparent flex flex-col items-center justify-end pb-4 opacity-50">
            <ArrowDown className="w-4 h-4 text-slate-600 animate-bounce" />
         </div>
      )}
    </div>
  );
};

export default MapSection;