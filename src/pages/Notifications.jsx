import React, { useState } from 'react';
import { useSim } from '../context/SimContext';

export default function Notifications() {
  const { notifications, orders, running } = useSim();
  const [selected, setSelected] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState([]);

  const sendCustom = () => {
    if (!msg.trim()) return;
    setSent(prev => [{ text: msg, orderId: selected, time: new Date() }, ...prev]);
    setMsg('');
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-yellow-50 flex items-center justify-center text-xl">🔔</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notification Center</h1>
            <p className="text-sm text-gray-500 mt-0.5">Real-time customer notifications for delay alerts and updates</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${running ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {running ? 'Simulation Running' : 'Simulation Paused'}
        </span>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Send Custom Notification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Select Order</label>
            <select value={selected} onChange={e => setSelected(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm bg-white">
              <option value="">Choose an active order...</option>
              {orders.filter(o => o.status !== 'delivered').slice(0, 15).map(o => (
                <option key={o.id} value={o.id}>{o.id}, {o.customer}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Message</label>
            <input value={msg} onChange={e => setMsg(e.target.value)}
              placeholder="Your order is delayed. New ETA: 8:15 PM..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm" />
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={sendCustom} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700">
            Send SMS
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50">
            Send Push
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Auto-Generated Alerts</h3>
            <span className="text-xs text-gray-400">{notifications.length} total</span>
          </div>
          <div className="overflow-y-auto space-y-2" style={{ maxHeight: 480 }}>
            {sent.map((n, i) => (
              <div key={`custom-${i}`} className="flex items-start gap-2.5 p-3 rounded-xl bg-green-50 border border-green-100 fade-in">
                <span className="text-sm">✉️</span>
                <div>
                  <div className="text-xs font-semibold text-green-700">Manual, {n.orderId || 'All'}</div>
                  <div className="text-sm text-gray-700">{n.text}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && sent.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-12">Notifications appear here once delays are detected.</p>
            )}
            {notifications.map(n => (
              <div key={n.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 fade-in">
                <span className="text-sm">🔔</span>
                <div>
                  <div className="text-sm text-gray-700">{n.text}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}, In-App</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Notification Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Total sent</span><span className="font-bold">{notifications.length + sent.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Manual (SMS/Push)</span><span className="font-bold">{sent.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Auto-generated</span><span className="font-bold text-green-600">{notifications.length}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Open rate (est.)</span><span className="font-bold">74%</span></div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
            <div className="space-y-3 text-xs text-gray-500">
              {[
                ['1', 'Delay Detected', 'Risk score crosses 50% or delay exceeds 15 minutes.'],
                ['2', 'Alert Fires', 'In-app card and push notification with honest revised ETA.'],
                ['3', 'Compensation Issued', 'Free delivery, credit, or coupon applied automatically.'],
              ].map(([n, t, d]) => (
                <div key={n} className="flex gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold flex-shrink-0 text-[10px]">{n}</span>
                  <div><strong className="text-gray-700">{t}:</strong> {d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
