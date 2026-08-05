import React, { useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { useSim } from '../context/SimContext';

const WEEK = [
  {day:'Mon',late:22,onTime:78},{day:'Tue',late:19,onTime:81},{day:'Wed',late:24,onTime:76},
  {day:'Thu',late:15,onTime:85},{day:'Fri',late:18,onTime:82},{day:'Sat',late:28,onTime:72},{day:'Sun',late:20,onTime:80},
];
const COMP_WEEK = [
  {day:'Mon',value:4200},{day:'Tue',value:3100},{day:'Wed',value:5600},
  {day:'Thu',value:2400},{day:'Fri',value:3800},{day:'Sat',value:6900},{day:'Sun',value:4500},
];
const PIE_COLORS = ['#16a34a','#fbbf24','#f97316','#ef4444'];

export default function Analytics() {
  const { orders, historyData } = useSim();

  const riskDist = useMemo(() => {
    const c = { low:0, medium:0, high:0, critical:0 };
    orders.forEach(o => c[o.riskLevel]++);
    return [{name:'Low',value:c.low},{name:'Medium',value:c.medium},{name:'High',value:c.high},{name:'Critical',value:c.critical}];
  }, [orders]);

  const zoneVolume = useMemo(() => {
    const map = {};
    orders.forEach(o => { map[o.zone] = (map[o.zone]||0)+1; });
    return Object.entries(map).map(([zone,count]) => ({zone,count})).sort((a,b) => b.count-a.count);
  }, [orders]);

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl">📈</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Trends, risk distribution, and performance changes over time</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {label:'Late delivery rate',from:'~15%',to:'< 10%',dir:'down'},
          {label:'Customer CSAT',from:'3.6/5',to:'> 4.1/5',dir:'up'},
          {label:'Support tickets',from:'Baseline',to:'-50%',dir:'down'},
          {label:'Partner avg rating',from:'3.9',to:'> 4.2',dir:'up'},
        ].map((m,i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-4 text-center">
            <div className="text-xs text-gray-500 mb-1">{m.label}</div>
            <div className="text-xs text-gray-400">{m.from}</div>
            <div className="text-lg font-bold text-green-600">{m.dir==='up'?'↑':'↓'} {m.to}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">target (6 months)</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Late Delivery Rate (7-day trend)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={WEEK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="late" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} name="Late %" />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-1">Rate dropped from 24% (Wed) to 15% (Thu) after peak-hour routing improvements.</p>
        </div>
        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Compensation Cost (7-day trend)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={COMP_WEEK}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => [`₹${v}`, 'Cost']} />
              <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={{r:3}} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-400 mt-1">Saturday spike (₹6,900) tied to peak weekend demand combined with rain.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Live Risk Distribution (this session)</h3>
          {orders.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">Start the simulation to populate live data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={riskDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({name,percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                  {riskDist.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Order Volume by Zone (this session)</h3>
          {zoneVolume.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-16">Start the simulation to populate live data.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={zoneVolume} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
                <YAxis dataKey="zone" type="category" width={90} tick={{fontSize:11,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#16a34a" radius={[0,4,4,0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Live Session History (risk rate over time)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="time" tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false} interval={2} />
            <YAxis tick={{fontSize:10,fill:'#9ca3af'}} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="lateRate" stroke="#16a34a" fill="#dcfce7" strokeWidth={2} name="Late Rate %" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
