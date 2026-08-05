import React from 'react';
import { useSim } from '../context/SimContext';
import Badge from '../components/Badge';

const WEATHER_LABEL = { clear:'Clear skies', light_rain:'Light rain', rain:'Moderate rain', heavy_rain:'Heavy rain' };
const WEATHER_ICON = { clear:'☀️', light_rain:'🌦️', rain:'🌧️', heavy_rain:'⛈️' };

function SignalCard({ icon, title, value, sub, barPct, barColor, badge, level }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-xl">{icon}</span>{title}
        </h3>
        <Badge level={level}>{badge}</Badge>
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-400 mb-3">{sub}</div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width:`${barPct}%` }} />
      </div>
    </div>
  );
}

export default function LiveSignals() {
  const { signals, running } = useSim();

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">📡</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Signal Feed</h1>
            <p className="text-sm text-gray-500 mt-0.5">Real-time environmental and operational conditions across the network</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${running?'bg-green-50 text-green-700':'bg-gray-100 text-gray-500'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${running?'bg-green-500 blink':'bg-gray-400'}`} />
          {running ? 'Streaming live' : 'Paused'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        <SignalCard
          icon={WEATHER_ICON[signals.weather] || '🌤️'} title="Weather"
          value={WEATHER_LABEL[signals.weather] || 'Clear'}
          sub={`Rain intensity: ${signals.rainIntensity}%`}
          barPct={signals.rainIntensity} barColor="bg-blue-500"
          badge={signals.rainIntensity > 50 ? 'Severe' : signals.rainIntensity > 15 ? 'Moderate' : 'Normal'}
          level={signals.rainIntensity > 50 ? 'critical' : signals.rainIntensity > 15 ? 'medium' : 'low'} />

        <SignalCard
          icon="🚗" title="Traffic Density"
          value={`${signals.traffic}% congestion`}
          sub="Network-wide average across all active zones"
          barPct={signals.traffic} barColor="bg-amber-500"
          badge={signals.traffic > 65 ? 'Heavy' : signals.traffic > 40 ? 'Moderate' : 'Light'}
          level={signals.traffic > 65 ? 'critical' : signals.traffic > 40 ? 'medium' : 'low'} />

        <div className="border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2"><span className="text-xl">⚠️</span>Accident Reports</h3>
            <Badge level={signals.accidents >= 3 ? 'critical' : signals.accidents >= 1 ? 'medium' : 'low'}>{signals.accidents} active</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{signals.accidents === 0 ? 'No incidents' : `${signals.accidents} incident${signals.accidents > 1 ? 's' : ''}`}</div>
          <div className="text-xs text-gray-400 mb-3">Reported on active delivery routes. Affected routes auto-adjusted.</div>
          <div className="flex gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i < signals.accidents ? 'bg-red-500' : 'bg-gray-100'}`} />
            ))}
          </div>
        </div>

        <SignalCard
          icon="📈" title="Peak Load"
          value={signals.peakLoad ? 'Peak hour active' : 'Off-peak'}
          sub="Order volume vs platform capacity"
          barPct={signals.peakLoad ? 85 : 30} barColor="bg-purple-500"
          badge={signals.peakLoad ? 'Active' : 'Normal'}
          level={signals.peakLoad ? 'high' : 'low'} />

        <SignalCard
          icon="🕐" title="Avg Kitchen Prep"
          value={`${signals.avgPrepTime} min`}
          sub="Network-wide average prep time across all restaurants"
          barPct={(signals.avgPrepTime / 35) * 100} barColor="bg-orange-500"
          badge={signals.avgPrepTime > 25 ? 'Slow' : 'Normal'}
          level={signals.avgPrepTime > 25 ? 'high' : 'low'} />

        <SignalCard
          icon="🧑‍🦯" title="Partner Availability"
          value={`${signals.partnerAvailability}% available`}
          sub="Riders ready to accept new orders right now"
          barPct={signals.partnerAvailability} barColor="bg-green-500"
          badge={signals.partnerAvailability < 60 ? 'Low' : 'Healthy'}
          level={signals.partnerAvailability < 60 ? 'high' : 'low'} />
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
        These six signals feed directly into PulsePredict's ML risk score on the ML Prediction page. Start the simulation to watch them drift in real time and influence each active order's risk level.
      </div>
    </div>
  );
}
