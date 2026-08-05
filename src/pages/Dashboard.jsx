import React, { useMemo, useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { useSim } from '../context/SimContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

const ZONE_POS = {
  'Koramangala':{x:2,y:5},'HSR Layout':{x:5,y:6},'Indiranagar':{x:4,y:8},
  'Whitefield':{x:9,y:6},'JP Nagar':{x:2,y:2},'BTM Layout':{x:5,y:3},
  'Electronic City':{x:7,y:1},'Marathahalli':{x:8,y:5},
};

function ZoneDot(props) {
  const { cx, cy, payload } = props;
  if (!payload) return null;
  const r = Math.max(14, Math.min(32, 12 + payload.count * 2.5));
  const fill = payload.avgRisk >= 75 ? '#ef4444' : payload.avgRisk >= 50 ? '#f59e0b' : '#16a34a';
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 5} fill={fill} fillOpacity={0.12}/>
      <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.88}/>
      <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="white" fontSize={11} fontWeight="bold">{payload.count}</text>
      <text x={cx} y={cy + r + 10} textAnchor="middle" fill="#6b7280" fontSize={9}>{payload.zone}</text>
    </g>
  );
}

function ZoneTip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
      <div className="font-bold text-gray-900 mb-1">{d.zone}</div>
      <div className="text-gray-500">{d.count} active orders</div>
      <div className="text-gray-500">Avg risk: {d.avgRisk}%</div>
    </div>
  );
}

export default function Dashboard() {
  const { orders, stats, historyData, running } = useSim();
  const { user } = useAuth();
  const [tab, setTab] = useState('map');

  const scatterData = useMemo(() => {
    const map = {};
    orders.filter(o => o.status !== 'delivered').forEach(o => {
      if (!map[o.zone]) map[o.zone] = { zone: o.zone, count: 0, riskSum: 0, ...ZONE_POS[o.zone] };
      map[o.zone].count++;
      map[o.zone].riskSum += o.riskScore;
    });
    return Object.values(map).map(z => ({ ...z, avgRisk: z.count ? Math.round(z.riskSum / z.count) : 0 }));
  }, [orders]);

  const critical = orders.filter(o => o.status !== 'delivered' && (o.riskLevel === 'critical' || o.riskLevel === 'high')).slice(0, 10);

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-xl">📊</div>
            <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-1.5 ml-14">
            <span className={`w-2 h-2 rounded-full ${running ? 'bg-green-500 blink' : 'bg-gray-300'}`}/>
            {running ? 'Live, real-time delivery monitoring' : 'Paused. Click Start Simulation to activate.'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <div className="text-right text-xs text-gray-400">
            <div className="font-semibold text-gray-600">{user.profile?.employeeId}</div>
            <div>{user.profile?.department}</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📦" label="Active Orders" value={stats.activeCount} sub={`${stats.total} total`}/>
        <StatCard icon="⏱️" label="Late Rate" value={`${stats.lateRate}%`} sub={`${stats.lateCount} at risk`}
          accent={stats.lateRate > 25 ? 'text-red-600' : stats.lateRate > 15 ? 'text-amber-600' : 'text-gray-900'}/>
        <StatCard icon="🚴" label="Avg Delivery"
          value={`${stats.activeCount ? Math.round(orders.filter(o=>o.status!=='delivered').reduce((s,o)=>s+o.eta,0)/(stats.activeCount||1)) : 0} min`}
          sub={`${stats.delivered} delivered`}/>
        <StatCard icon="💳" label="Compensation" value={`₹${stats.compTotal}`} sub="auto-issued today"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 border border-gray-200 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Zone Activity</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              {[['map','Zone Map'],['trend','Late Rate'],['vol','Volume']].map(([t,l]) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${tab===t?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          {tab === 'map' && (
            <>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500 inline-block"/>Low risk</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"/>Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/>High/Critical</span>
                <span className="text-gray-400">Bubble size = order count</span>
              </div>
              {scatterData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Start the simulation to see live zone data.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={270}>
                  <ScatterChart margin={{ top:20, right:20, bottom:30, left:10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                    <XAxis type="number" dataKey="x" domain={[0,12]} tick={{ fontSize:10, fill:'#d1d5db' }} tickLine={false} axisLine={false}
                      label={{ value:'West to East', position:'insideBottom', offset:-15, fontSize:10, fill:'#9ca3af' }}/>
                    <YAxis type="number" dataKey="y" domain={[0,10]} tick={{ fontSize:10, fill:'#d1d5db' }} tickLine={false} axisLine={false}
                      label={{ value:'South to North', angle:-90, position:'insideLeft', offset:10, fontSize:10, fill:'#9ca3af' }}/>
                    <Tooltip content={<ZoneTip/>}/>
                    <Scatter data={scatterData} shape={<ZoneDot/>}/>
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </>
          )}
          {tab === 'trend' && (
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart data={historyData} margin={{ top:10, right:10, bottom:0, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="time" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} interval={2}/>
                <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                <Tooltip/>
                <Area type="monotone" dataKey="lateRate" stroke="#ef4444" fill="#fee2e2" strokeWidth={2} name="Late Rate %"/>
              </AreaChart>
            </ResponsiveContainer>
          )}
          {tab === 'vol' && (
            <ResponsiveContainer width="100%" height={290}>
              <BarChart data={historyData} margin={{ top:10, right:10, bottom:0, left:0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="time" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} interval={2}/>
                <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                <Tooltip/>
                <Bar dataKey="orders" fill="#16a34a" radius={[3,3,0,0]} name="Orders"/>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border border-gray-200 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Live Alerts</h2>
            {critical.length > 0 && <span className="text-xs font-semibold bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{critical.length} critical</span>}
          </div>
          <div className="space-y-2 overflow-y-auto flex-1" style={{ maxHeight:330 }}>
            {critical.length === 0 && <p className="text-sm text-gray-400 text-center py-10">No critical alerts right now.</p>}
            {critical.map(o => (
              <div key={o.id} className={`p-3 rounded-xl border fade-in ${o.riskLevel==='critical'?'bg-red-50 border-red-100':'bg-amber-50 border-amber-100'}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{o.zone}, {o.restaurant}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{o.customer}, risk {o.riskScore}%</div>
                    <div className="text-[11px] text-gray-400">{o.causes[0]}</div>
                  </div>
                  <Badge level={o.riskLevel}>{o.riskLevel}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Live Order Feed</h2>
          <span className="text-xs text-gray-400">{stats.activeCount} active</span>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight:380 }}>
          {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-12">Start the simulation to see live orders.</p>}
          {orders.slice(0,30).map(o => (
            <div key={o.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 fade-in">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full flex-shrink-0 ${o.riskLevel==='critical'?'bg-red-500':o.riskLevel==='high'?'bg-amber-500':o.riskLevel==='medium'?'bg-amber-300':'bg-green-500'}`}/>
                <div>
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {o.id} <Badge level={o.status==='delivered'?'delivered':'default'}>{o.status.replace('_',' ')}</Badge>
                  </div>
                  <div className="text-[11px] text-gray-500">{o.customer}, {o.restaurant}, {o.zone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-gray-600">₹{o.price}</span>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white ${o.riskScore>=75?'bg-red-500':o.riskScore>=50?'bg-amber-500':'bg-green-500'}`}>{o.riskScore}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
