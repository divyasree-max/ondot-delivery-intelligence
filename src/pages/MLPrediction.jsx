import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useSim } from '../context/SimContext';
import Badge from '../components/Badge';

const FEATURES = [
  {key:'weather',label:'Weather',weight:25},
  {key:'traffic',label:'Traffic',weight:25},
  {key:'accidents',label:'Accidents',weight:20},
  {key:'peak',label:'Peak Load',weight:15},
  {key:'partner',label:'Partner Avail.',weight:15},
];

export default function MLPrediction() {
  const { signals, orders, historyData } = useSim();
  const scores = {
    weather: signals.rainIntensity,
    traffic: signals.traffic,
    accidents: Math.min(100, signals.accidents * 20),
    peak: signals.peakLoad ? 80 : 25,
    partner: 100 - signals.partnerAvailability,
  };
  const overallRisk = Math.round(scores.weather*0.25 + scores.traffic*0.25 + scores.accidents*0.20 + scores.peak*0.15 + scores.partner*0.15);
  const riskLevel = overallRisk >= 75 ? 'critical' : overallRisk >= 50 ? 'high' : overallRisk >= 25 ? 'medium' : 'low';
  const radarData = FEATURES.map(f => ({ subject: f.label, score: Math.round(scores[f.key]), fullMark: 100 }));

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-xl">🧠</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">PulsePredict, ML Prediction Engine</h1>
          <p className="text-sm text-gray-500 mt-0.5">Live delay-risk scoring from five real-time signal categories</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-36 h-36 mb-4">
            <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#f1f5f9" strokeWidth="12" />
              <circle cx="60" cy="60" r="52" fill="none"
                stroke={overallRisk >= 75 ? '#ef4444' : overallRisk >= 50 ? '#f59e0b' : overallRisk >= 25 ? '#fbbf24' : '#16a34a'}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(overallRisk / 100) * 327} 327`}
                className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{overallRisk}%</span>
              <span className="text-[10px] text-gray-400">Network Risk</span>
            </div>
          </div>
          <Badge level={riskLevel}>{riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk</Badge>
          <p className="text-xs text-gray-400 mt-3">Updates every few seconds from live signal inputs</p>
        </div>

        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Signal Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Radar name="Risk Score" dataKey="score" stroke="#16a34a" fill="#16a34a" fillOpacity={0.25} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Signal Breakdown</h3>
          <div className="space-y-3">
            {FEATURES.map(f => (
              <div key={f.key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{f.label} <span className="text-gray-400">({f.weight}%)</span></span>
                  <span className="font-bold text-gray-900">{Math.round(scores[f.key])}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-700" style={{ width: `${Math.min(100, scores[f.key])}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5 mb-5">
        <h3 className="font-semibold text-gray-900 mb-4">Risk Score History (live)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={historyData} margin={{ top:5, right:10, bottom:0, left:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="lateRate" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} name="Late Rate %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Per-Order Predictions (most recent)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                {['Order','Zone','Base ETA','Predicted Delay','Risk Score','Primary Cause'].map(h => <th key={h} className="pb-2 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm">Start the simulation to see live predictions.</td></tr>}
              {orders.slice(0, 10).map(o => (
                <tr key={o.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 font-semibold">{o.id}</td>
                  <td className="text-gray-500">{o.zone}</td>
                  <td className="text-gray-500">{o.baseEta} min</td>
                  <td className={o.delayMin > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>{o.delayMin > 0 ? `+${o.delayMin} min` : 'On time'}</td>
                  <td>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${o.riskScore >= 75 ? 'bg-red-500' : o.riskScore >= 50 ? 'bg-amber-500' : o.riskScore >= 25 ? 'bg-amber-400' : 'bg-green-500'}`}>
                      {o.riskScore}
                    </div>
                  </td>
                  <td className="text-gray-500">{o.causes[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5 bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm text-green-700">
        Prototype uses a transparent weighted-signal formula. In production, PulsePredict would use a trained XGBoost or LightGBM model on historical delivery data from 90+ days across all zones.
      </div>
    </div>
  );
}
