import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { ZONES } from '../constants';
import { CosmicZone } from '../types';

const TimeRelativity: React.FC = () => {
  const [humanScale, setHumanScale] = useState<number>(1); // 1 second
  
  // Constants
  const CPU_CYCLE_NS = ZONES[CosmicZone.CPU].latencyNs; // 0.1 ns
  
  // Calculate multipliers based on the ratios
  const RAM_MULTIPLIER = ZONES[CosmicZone.RAM].latencyNs / CPU_CYCLE_NS;
  const SSD_MULTIPLIER = ZONES[CosmicZone.SSD].latencyNs / CPU_CYCLE_NS;
  const NET_MULTIPLIER = ZONES[CosmicZone.NETWORK].latencyNs / CPU_CYCLE_NS;

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)} minutes`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} hours`;
    const days = hours / 24;
    if (days < 365) return `${days.toFixed(1)} days`;
    const years = days / 365;
    return `${years.toFixed(1)} years`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-16 bg-slate-900/90 border border-brand-purple/30 rounded-2xl p-6 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <Clock className="text-brand-purple" />
          Time Dilation Simulator
        </h3>
        
        <p className="text-slate-300 mb-8 max-w-2xl">
          Humans are terrible at grasping exponential gaps. Let's adjust the timescale.
          If a single <strong>CPU cycle</strong> took...
        </p>

        <div className="mb-10">
          <label className="block text-sm font-mono text-brand-cyan mb-2">
            ADJUST HUMAN PERCEPTION: {humanScale} SECOND{humanScale !== 1 ? 'S' : ''}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={humanScale}
            onChange={(e) => setHumanScale(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-cyan"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
            <span>1s</span>
            <span>10s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* RAM Card */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-2 text-blue-400">
              <Zap className="w-4 h-4" />
              <span className="font-bold uppercase text-xs tracking-wider">RAM Access</span>
            </div>
            <div className="text-2xl text-white font-mono">
              {formatDuration(humanScale * RAM_MULTIPLIER)}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              ~{RAM_MULTIPLIER.toLocaleString()}x slower
            </div>
          </div>

          {/* SSD Card */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
             <div className="flex items-center gap-2 mb-2 text-amber-400">
              <Zap className="w-4 h-4" />
              <span className="font-bold uppercase text-xs tracking-wider">SSD Read</span>
            </div>
            <div className="text-2xl text-white font-mono">
              {formatDuration(humanScale * SSD_MULTIPLIER)}
            </div>
             <div className="text-xs text-slate-500 mt-2">
              ~{SSD_MULTIPLIER.toLocaleString()}x slower
            </div>
          </div>

          {/* Network Card */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
             <div className="flex items-center gap-2 mb-2 text-red-400">
              <Zap className="w-4 h-4" />
              <span className="font-bold uppercase text-xs tracking-wider">Network Request</span>
            </div>
            <div className="text-2xl text-white font-mono font-bold">
              {formatDuration(humanScale * NET_MULTIPLIER)}
            </div>
             <div className="text-xs text-slate-500 mt-2">
              ~{NET_MULTIPLIER.toLocaleString()}x slower
            </div>
          </div>

        </div>

        <div className="mt-8 p-4 bg-brand-purple/10 border border-brand-purple/20 rounded-lg text-sm text-slate-300 text-center">
            If 1 CPU op is a heartbeat, a network request is a human lifetime.
        </div>
      </div>
    </div>
  );
};

export default TimeRelativity;