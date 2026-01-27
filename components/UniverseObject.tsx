import React from 'react';
import { CosmicZone } from '../types';

interface UniverseObjectProps {
  type: CosmicZone;
  scale?: number;
}

const UniverseObject: React.FC<UniverseObjectProps> = ({ type, scale = 1 }) => {
  const baseClasses = "rounded-full transition-all duration-1000 absolute left-1/2 -translate-x-1/2";
  
  if (type === CosmicZone.CPU) {
    // Earth
    return (
      <div 
        className={`${baseClasses} w-64 h-64 md:w-96 md:h-96 shadow-[0_0_100px_rgba(59,130,246,0.3)] animate-float`}
        style={{
          background: 'radial-gradient(circle at 30% 30%, #4ade80, #3b82f6 60%, #1e3a8a)',
          zIndex: 10
        }}
      >
        <div className="absolute inset-0 rounded-full opacity-50 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      </div>
    );
  }

  if (type === CosmicZone.RAM) {
    // Moon
    return (
      <div 
        className={`${baseClasses} w-32 h-32 md:w-48 md:h-48 shadow-[0_0_50px_rgba(255,255,255,0.2)]`}
        style={{
          background: 'radial-gradient(circle at 70% 20%, #f8fafc, #94a3b8 50%, #475569)',
          zIndex: 10
        }}
      >
        {/* Craters */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-slate-600/20 rounded-full shadow-inner"></div>
        <div className="absolute bottom-1/3 right-1/3 w-8 h-8 bg-slate-600/20 rounded-full shadow-inner"></div>
      </div>
    );
  }

  if (type === CosmicZone.SSD) {
    // Sun
    return (
      <div 
        className={`${baseClasses} w-[600px] h-[600px] md:w-[800px] md:h-[800px] shadow-[0_0_150px_#f59e0b]`}
        style={{
          background: 'radial-gradient(circle at center, #fef3c7, #f59e0b, #ea580c, #7c2d12)',
          zIndex: 5
        }}
      >
        <div className="absolute inset-0 rounded-full animate-pulse-slow opacity-80" style={{background: 'radial-gradient(circle at center, transparent 40%, #f59e0b 80%)'}}></div>
      </div>
    );
  }

  if (type === CosmicZone.NETWORK) {
    // Alpha Centauri / Void
    return (
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
         <div className="relative w-8 h-8 md:w-12 md:h-12 bg-white rounded-full shadow-[0_0_60px_#ef4444] animate-pulse">
            <div className="absolute inset-0 bg-red-500 blur-md rounded-full"></div>
            <div className="absolute -inset-10 bg-red-900/30 blur-xl rounded-full"></div>
         </div>
         {/* Distant stars */}
         <div className="absolute w-[800px] h-[800px] bg-red-900/5 rounded-full blur-3xl -z-10"></div>
      </div>
    );
  }

  return null;
};

export default UniverseObject;