import React, { useState } from 'react';
import { X, Layers, AlertTriangle, Rocket, Info, Clock, Zap, Cpu, HardDrive, Globe, Terminal } from 'lucide-react';
import { PHP_CODE, CELESTIAL_DATA, ZONES } from '../constants';
import { CelestialId, CosmicZone } from '../types';

interface DataLogModalProps {
  isOpen: boolean;
  mode: 'logs' | 'sim' | null;
  onClose: () => void;
  currentZone: CelestialId;
}

const DataLogModal: React.FC<DataLogModalProps> = ({ isOpen, mode, onClose, currentZone }) => {
  const [humanScale, setHumanScale] = useState<number>(1);
  
  if (!isOpen || !mode) return null;

  const zoneData = CELESTIAL_DATA[currentZone];

  const formatDuration = (seconds: number): string => {
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
    if (seconds < 60) return `${seconds.toFixed(1)} sec`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${minutes.toFixed(1)} min`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} hrs`;
    const days = hours / 24;
    if (days < 365) return `${days.toFixed(1)} days`;
    const years = days / 365;
    if (years < 1000) return `${years.toFixed(1)} years`;
    return `${(years / 1000).toFixed(1)} millennia`;
  };

  const getSimData = () => {
      const cpuNs = ZONES[CosmicZone.CPU].latencyNs;
      return [
          {
              zone: CosmicZone.CPU,
              label: "CPU Cycle",
              icon: <Cpu className="w-5 h-5 text-emerald-600" />,
              real: "0.5 ns",
              factor: 1,
              desc: "One heartbeat."
          },
          {
              zone: CosmicZone.RAM,
              label: "RAM Access",
              icon: <Layers className="w-5 h-5 text-blue-600" />,
              real: "100 ns",
              factor: ZONES[CosmicZone.RAM].latencyNs / cpuNs,
              desc: "Fetching a memory reference."
          },
          {
              zone: CosmicZone.SSD,
              label: "SSD Read",
              icon: <HardDrive className="w-5 h-5 text-amber-600" />,
              real: "150 µs",
              factor: ZONES[CosmicZone.SSD].latencyNs / cpuNs,
              desc: "Loading a file from disk."
          },
          {
              zone: CosmicZone.NETWORK,
              label: "Internet Ping",
              icon: <Globe className="w-5 h-5 text-red-600" />,
              real: "50 ms",
              factor: ZONES[CosmicZone.NETWORK].latencyNs / cpuNs,
              desc: "Round trip packet SF to NYC."
          }
      ];
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-slate-800">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3 tracking-tight">
                {mode === 'logs' ? (
                    <>
                        <Terminal className="w-6 h-6 text-brand-cyan" />
                        <span className="text-brand-cyan">README.md</span>
                    </>
                ) : (
                    <>
                        <Clock className="w-6 h-6 text-brand-purple" />
                        <span className="text-brand-purple">Latency_Sim_v1</span>
                    </>
                )}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-400 hover:text-slate-800">
                <X className="w-6 h-6" />
            </button>
        </div>

        <div className="overflow-y-auto p-6 md:p-10 space-y-12 bg-white scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
            
            {mode === 'sim' && (
                <div className="max-w-3xl mx-auto space-y-10">
                    <div className="bg-slate-50 p-6 rounded-xl border border-brand-purple/20">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-brand-purple" />
                            Time Dilation Control
                        </h3>
                        <p className="text-slate-600 text-sm mb-8">
                            Humans cannot perceive nanoseconds. Use the slider to scale <strong>1 CPU Cycle</strong> up to human-perceivable time (seconds), and watch how other latencies explode.
                        </p>
                        
                        <div className="relative pt-6 pb-2">
                             <input 
                                type="range" 
                                min="1" 
                                max="10" 
                                step="1" 
                                value={humanScale} 
                                onChange={(e) => setHumanScale(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-purple"
                             />
                             <div className="flex justify-between mt-4 text-xs font-mono text-slate-500 uppercase tracking-wider">
                                <span>1 Second</span>
                                <span>10 Seconds</span>
                             </div>
                             <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 bg-brand-purple text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                1 Cycle = {humanScale} sec
                             </div>
                        </div>
                    </div>

                    <div className="grid gap-4">
                        {getSimData().map((item) => (
                            <div key={item.zone} className="group relative bg-white border border-slate-200 hover:border-brand-cyan/50 rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-md">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    
                                    {/* Component Info */}
                                    <div className="flex items-center gap-4 min-w-[200px]">
                                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 group-hover:border-slate-300 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <div className="text-slate-800 font-bold">{item.label}</div>
                                            <div className="text-xs text-slate-500 font-mono">Real: {item.real}</div>
                                        </div>
                                    </div>

                                    {/* Visualization Bar */}
                                    <div className="flex-1 hidden md:flex items-center px-4 opacity-30">
                                         <div className="h-px w-full bg-gradient-to-r from-slate-400 to-transparent dashed-line"></div>
                                    </div>

                                    {/* Simulated Time */}
                                    <div className="text-right min-w-[180px]">
                                        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Perceived Time</div>
                                        <div className={`text-2xl font-mono font-bold ${item.zone === CosmicZone.NETWORK ? 'text-red-600' : item.zone === CosmicZone.SSD ? 'text-amber-600' : 'text-slate-700'}`}>
                                            {formatDuration(humanScale * item.factor)}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 italic">
                                    "{item.desc}"
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-center">
                        <p className="text-red-700 text-sm">
                            <span className="font-bold">Insight:</span> If a CPU cycle were 1 second, a single network packet to Europe would take {formatDuration(humanScale * (ZONES[CosmicZone.NETWORK].latencyNs / ZONES[CosmicZone.CPU].latencyNs))}. 
                            <br/>This is why async I/O is critical.
                        </p>
                    </div>
                </div>
            )}

            {mode === 'logs' && (
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* The Core Text */}
                    <section className="space-y-4 border-l-4 border-brand-cyan pl-6">
                        <h3 className="text-2xl font-bold text-slate-900">The Universe is just a high-latency network.</h3>
                        <p className="leading-relaxed text-slate-600 text-lg">
                            In this simulation, we have mapped the Solar System using the Architecture Scale: where <span className="text-brand-cyan font-bold">one CPU cycle (0.5 ns) is scaled to one human second.</span>
                        </p>
                        <p className="leading-relaxed text-slate-600">
                            This map isn't about kilometers; it’s about Data Availability. From the L1 Cache of Earth to the high-ping Interstellar WAN of Proxima Centauri, this tool helps you visualize why the speed of light is the ultimate "bottleneck" for any truly distributed system.
                        </p>
                    </section>

                    <section>
                         <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-widest text-brand-purple flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Architecture Overview
                         </h3>
                         <div className="grid gap-3">
                             <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex gap-4 items-baseline shadow-sm">
                                 <span className="text-brand-green font-bold min-w-[120px]">Localhost (Earth)</span>
                                 <span className="text-slate-600">0.5 ns access time. Perfect cache hit.</span>
                             </div>
                             <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex gap-4 items-baseline shadow-sm">
                                 <span className="text-blue-600 font-bold min-w-[120px]">The RAM Moon</span>
                                 <span className="text-slate-600">100 ns latency. A context switch away.</span>
                             </div>
                             <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex gap-4 items-baseline shadow-sm">
                                 <span className="text-amber-600 font-bold min-w-[120px]">The SSD Sun</span>
                                 <span className="text-slate-600">150 µs read time. Heavy infrastructure.</span>
                             </div>
                             <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 flex gap-4 items-baseline shadow-sm">
                                 <span className="text-red-600 font-bold min-w-[120px]">Deep Web (Proxima)</span>
                                 <span className="text-slate-600">150 ms ping. The edge of the reachable network.</span>
                             </div>
                         </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-widest text-slate-500 flex items-center gap-2">
                             <Info className="w-5 h-5" />
                             System Logs & Facts
                        </h3>
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 shadow-inner">
                            <ul className="grid md:grid-cols-2 gap-4">
                                {zoneData.facts.map((fact, i) => (
                                    <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                                        <span className="text-brand-cyan mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"></span>
                                        {fact}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-widest text-slate-500">Protocol Constraints</h3>
                        <p className="text-slate-600 mb-6 text-sm">The universal speed limit (c) is 299,792 km/s. This dictates the minimum possible latency for any signal.</p>
                        
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 overflow-x-auto shadow-lg">
                            <pre className="text-xs font-mono text-slate-300 leading-relaxed">{PHP_CODE}</pre>
                        </div>
                    </section>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default DataLogModal;