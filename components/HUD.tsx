import React, { useState } from 'react';
import { CelestialId } from '../types';
import { CELESTIAL_DATA, ZONE_ICONS } from '../constants';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';

interface HUDProps {
  currentZone: CelestialId;
  onNavigate: (zone: CelestialId) => void;
  onPing: () => void;
}

const HUD: React.FC<HUDProps> = ({ currentZone, onNavigate, onPing }) => {
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const currentData = CELESTIAL_DATA[currentZone];
  const { component } = currentData;
  const HUD_PANEL_OFFSETS = {
    base: '320px',
    sm: '360px',
    lg: '420px',
  };
  const HUD_NAV_OFFSET_ADJUST = '8rem';
  const navBaseClasses = 'left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:right-8 flex flex-row md:flex-col gap-2 pointer-events-auto';
  const navPositionClasses = isPanelVisible
    ? `bottom-[calc(var(--hud-panel-offset)-var(--hud-nav-adjust))] ${navBaseClasses} [--hud-panel-offset:${HUD_PANEL_OFFSETS.base}] [--hud-nav-adjust:${HUD_NAV_OFFSET_ADJUST}] sm:[--hud-panel-offset:${HUD_PANEL_OFFSETS.sm}] lg:[--hud-panel-offset:${HUD_PANEL_OFFSETS.lg}]`
    : `bottom-4 sm:bottom-6 ${navBaseClasses}`;
  const dashboardPaddingClasses = isPanelVisible ? '' : 'pb-24 sm:pb-28 md:pb-0';

  return (
    <div className="fixed inset-0 pointer-events-none z-[70] flex flex-col justify-end">
      
      {/* Sector Navigation (Right Side) */}
      <div
        className={`absolute z-[80] ${navPositionClasses}`}
      >
        <div className="bg-slate-50/95 backdrop-blur-md border border-slate-200 rounded-xl p-2 shadow-xl flex flex-row md:flex-col gap-1">
             <div className="text-[10px] text-slate-500 text-center font-mono font-bold tracking-widest mb-1 opacity-90">NODES</div>
             {Object.values(CELESTIAL_DATA).map((data) => (
                <button
                    key={data.id}
                    onClick={() => onNavigate(data.id)}
                    className={`
                        w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 relative group
                        ${currentZone === data.id ? 'shadow-md scale-105' : 'bg-transparent hover:bg-slate-100'}
                    `}
                    style={{
                        backgroundColor: currentZone === data.id ? data.color : 'transparent',
                        color: currentZone === data.id ? '#ffffff' : data.color,
                        textShadow: currentZone === data.id ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                    }}
                    title={data.name}
                >
                    {ZONE_ICONS[data.id]}
                    
                    {/* Tooltip on hover - High contrast */}
                    <span className="absolute right-full mr-3 bg-white border border-slate-300 text-slate-800 text-xs font-mono px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none backdrop-blur-sm shadow-xl font-bold hidden md:inline-flex">
                        {data.component?.role || data.name}
                    </span>
                </button>
            ))}
        </div>
      </div>

      {/* Main Dashboard */}
      <div className={`w-full pointer-events-auto ${dashboardPaddingClasses}`}>
        {/* Action Buttons - High opacity background */}
        <div className="max-w-4xl mx-auto mb-3 sm:mb-4 flex justify-center md:justify-end gap-3 px-4">
            <button 
                onClick={onPing}
                disabled={currentZone === CelestialId.EARTH}
                className={`
                    flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/95 backdrop-blur border rounded-lg transition-all text-[11px] sm:text-sm font-mono uppercase tracking-wider shadow-lg font-semibold
                    ${currentZone === CelestialId.EARTH 
                        ? 'border-slate-300 text-slate-400 cursor-not-allowed' 
                        : 'border-brand-cyan/40 text-brand-cyan hover:bg-slate-50'}
                `}
            >
                <Send className="w-4 h-4" />
                <span>Ping_Node</span>
            </button>
            <button
                onClick={() => setIsPanelVisible((prev) => !prev)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/95 backdrop-blur border border-slate-300 rounded-lg transition-all text-[11px] sm:text-sm font-mono uppercase tracking-wider shadow-lg font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
                {isPanelVisible ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                <span>{isPanelVisible ? 'Hide_Panel' : 'Show_Panel'}</span>
            </button>
        </div>

        {/* Terminal / JSON Output Panel - High opacity to block map noise */}
        {isPanelVisible && (
          <div
            className="bg-slate-50/95 border-t border-slate-300 backdrop-blur-xl p-3 sm:p-4 md:p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] max-h-[77vh] sm:max-h-[70vh] lg:max-h-[65vh] overflow-y-auto"
          >
            <div className="max-w-5xl mx-auto font-mono text-[10px] sm:text-[11px] md:text-sm lg:text-base leading-relaxed">
                
                {/* JSON Representation - High Contrast Text */}
                <div className="bg-white rounded-xl border border-slate-300 p-4 sm:p-5 md:p-6 relative overflow-hidden group shadow-sm">
                    {/* Decorative Terminal Header */}
                    <div className="absolute top-0 left-0 right-0 h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                        <span className="text-[10px] text-slate-500 ml-2 font-bold tracking-wider">node_inspector --json</span>
                    </div>

                    <div className="mt-6 text-slate-800 overflow-x-auto font-medium">
                        <span className="text-slate-500">{`{`}</span>
                        <div className="pl-4">
                            <div>
                                <span className="text-brand-cyan font-semibold">"id"</span>: <span className="text-brand-green">"{currentData.id}"</span>,
                            </div>
                            <div>
                                <span className="text-brand-cyan font-semibold">"alias"</span>: <span className="text-brand-green">"{component?.role || currentData.name}"</span>,
                            </div>
                            <div>
                                <span className="text-brand-cyan font-semibold">"system_role"</span>: <span className="text-brand-green">"{component?.name}"</span>,
                            </div>
                            <div>
                                <span className="text-brand-cyan font-semibold">"metrics"</span>: <span className="text-slate-500">{`{`}</span>
                            </div>
                            <div className="pl-4">
                                <div>
                                    <span className="text-brand-cyan font-semibold">"latency_horizon"</span>: <span className="text-amber-600 font-semibold">"{currentData.distance_km.toLocaleString()} km"</span>,
                                </div>
                                <div>
                                    <span className="text-brand-cyan font-semibold">"packet_ttl"</span>: <span className="text-amber-600 font-semibold">"{currentData.human_readable_latency}"</span>,
                                </div>
                                <div>
                                    <span className="text-brand-cyan font-semibold">"time_dilation"</span>: <span className="text-amber-600 font-semibold">"{component?.latency_human} (scaled)"</span>
                                </div>
                            </div>
                            <div>
                                <span className="text-slate-500">{`}`}</span>,
                            </div>
                            <div>
                                <span className="text-brand-cyan font-semibold">"description"</span>: <span className="text-slate-600">"{currentData.description}"</span>,
                            </div>
                            
                            {/* Facts Section inside JSON */}
                            <div>
                                <span className="text-brand-cyan font-semibold">"kernel_notes"</span>: <span className="text-slate-500">{"["}</span>
                            </div>
                            <div className="pl-4">
                                 {currentData.facts.map((fact, i) => (
                                    <div key={i} className="whitespace-normal">
                                        <span className="text-brand-green">"{fact}"</span>{i < currentData.facts.length - 1 ? ',' : ''}
                                    </div>
                                 ))}
                            </div>
                            <div>
                                <span className="text-slate-500">{"]"}</span>
                            </div>
                        </div>
                        <span className="text-slate-500">{`}`}</span>
                        <span className="inline-block w-2 h-4 bg-brand-cyan ml-1 animate-pulse align-middle"></span>
                    </div>

                </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HUD;
