import React from 'react';
import { useSim } from '../context/SimContext';
import StatCard from '../components/StatCard';

export default function Offers() {
  const { compensations } = useSim();
  const totalValue = compensations.reduce((s, c) => s + c.value, 0);

  const RULES = [
    { icon:'🚚', title:'Free Delivery', trigger:'Delay 15-19 min', channel:'Auto SMS + In-App', bg:'bg-purple-50 border-purple-100', color:'text-purple-700' },
    { icon:'💳', title:'Wallet Credit, ₹100', trigger:'Delay 20-29 min', channel:'Auto SMS + In-App', bg:'bg-green-50 border-green-100', color:'text-green-700' },
    { icon:'🎟️', title:'Coupon Code, ₹150 off', trigger:'Delay 30+ min', channel:'Auto SMS + In-App', bg:'bg-amber-50 border-amber-100', color:'text-amber-700' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-xl">🎁</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compensation and Offers Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">Automatic recovery actions issued when delays cross set thresholds</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {RULES.map((r, i) => (
          <div key={i} className={`border rounded-2xl p-5 ${r.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{r.icon}</span>
              <span className={`font-semibold text-sm ${r.color}`}>{r.title}</span>
            </div>
            <div className="text-xs text-gray-500 mb-0.5">Trigger: {r.trigger}</div>
            <div className="text-xs text-gray-500">Channel: {r.channel}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🎟️" label="Total Issued" value={compensations.length} sub="compensation offers" />
        <StatCard icon="💳" label="Total Value" value={`₹${totalValue}`} sub="auto-compensated" />
        <StatCard icon="⏳" label="Pending" value="0" sub="eligible for manual comp" />
        <StatCard icon="📈" label="ROI Impact" value="3.2x" sub="retention saved vs cost" accent="text-green-600" />
      </div>

      <div className="border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">All Issued Compensation</h3>
          <span className="text-xs text-gray-400">{compensations.length} total</span>
        </div>
        {compensations.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">Start the simulation to see compensation triggered automatically.</p>
        ) : (
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight:440 }}>
            {compensations.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 fade-in">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{c.orderId}, {c.customer}</div>
                  <div className="text-xs text-gray-400">{c.restaurant}, {c.time.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit', second:'2-digit' })}</div>
                </div>
                <span className="text-sm font-bold text-green-700 bg-green-50 border border-green-100 px-3 py-1 rounded-full">{c.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
        All compensation is issued automatically by PulsePredict when a delay crosses a threshold. No manual intervention or customer complaint is required.
      </div>
    </div>
  );
}
