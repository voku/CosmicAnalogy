import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { ZONES } from '../constants';
import { CosmicZone } from '../types';

const data = [
  { name: 'CPU', value: 1, label: '1x', color: ZONES[CosmicZone.CPU].color },
  { name: 'RAM', value: 1000, label: '1,000x', color: ZONES[CosmicZone.RAM].color },
  { name: 'SSD', value: 1000000, label: '1M x', color: ZONES[CosmicZone.SSD].color },
  { name: 'Network', value: 1000000000, label: '1B x', color: ZONES[CosmicZone.NETWORK].color },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded shadow-xl">
        <p className="font-bold text-white mb-2">{label}</p>
        <p className="text-sm text-slate-300">Relative Latency: <span className="text-brand-cyan">{payload[0].payload.label}</span></p>
        <p className="text-xs text-slate-500 mt-1">Logarithmic Scale</p>
      </div>
    );
  }
  return null;
};

const BenchmarkGraph: React.FC = () => {
  return (
    <div className="w-full bg-slate-900/50 p-4 rounded-xl border border-slate-800">
      <h4 className="text-center text-slate-400 text-sm font-mono mb-4 uppercase tracking-widest">Latency Hierarchy (Log Scale)</h4>
      {/* Explicit height container for Recharts */}
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" scale="log" domain={[1, 1000000000]} hide />
            <YAxis type="category" dataKey="name" stroke="#94a3b8" width={60} tick={{fontSize: 12, fill: '#94a3b8'}} />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <LabelList dataKey="label" position="right" fill="#e2e8f0" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BenchmarkGraph;