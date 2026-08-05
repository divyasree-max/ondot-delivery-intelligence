import React, { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSim } from '../context/SimContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

export default function RestaurantPanel() {
  const { orders, signals } = useSim();
  const { user } = useAuth();
  const isRestaurant = user?.role === 'restaurant';
  const p = user?.profile;

  const liveQueue = useMemo(() => orders.filter(o => o.status !== 'delivered').slice(0, 8), [orders]);
  const riskNow = signals.rainIntensity > 50 || signals.peakLoad ? 'high' : signals.rainIntensity > 15 ? 'medium' : 'low';
  const riskDot = { high:'bg-red-500', medium:'bg-amber-500', low:'bg-green-500' }[riskNow];

  const stats = isRestaurant && p ? p.stats : { ordersToday:liveQueue.length, ordersThisWeek:412, lateRate:12, avgPrepTime:Math.round(signals.avgPrepTime), compensation:8200 };
  const weekly = isRestaurant && p ? p.weeklyOrders : [{day:'Mon',orders:54,late:6},{day:'Tue',orders:61,late:7},{day:'Wed',orders:58,late:9},{day:'Thu',orders:72,late:8},{day:'Fri',orders:69,late:7},{day:'Sat',orders:88,late:14},{day:'Sun',orders:71,late:10}];
  const bench = isRestaurant && p ? p.benchmarks : { ownAccuracy:71, zoneAvg:78, top10:92, cityAvg:74 };
  const queue = isRestaurant && p ? p.currentQueue : liveQueue.map(o => ({ id:o.id, item:o.item, customer:o.customer, prepTime:Math.round(o.eta*0.6), status:o.riskLevel==='critical'?'late':o.riskLevel==='high'?'at_risk':'on_track' }));

  const restName = isRestaurant ? p?.name : 'Empire Restaurant';
  const restZone = isRestaurant ? p?.zone : 'Koramangala';

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl">🍽️</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{restName}</h1>
              <span className={`w-2.5 h-2.5 rounded-full ${riskDot}`} title={`Current delay risk: ${riskNow}`}/>
            </div>
            <p className="text-sm text-gray-500">{restZone}, Bengaluru, {isRestaurant ? p?.cuisine : 'Biryani and North Indian'}</p>
          </div>
        </div>
        <Badge level={bench.ownAccuracy>=85?'on_track':bench.ownAccuracy>=70?'medium':'high'}>
          {bench.ownAccuracy>=85?'Excellent':bench.ownAccuracy>=70?'Needs Improvement':'At Risk'}
        </Badge>
      </div>

      {isRestaurant && p && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 mb-5 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {[['Owner',p.ownerName],['FSSAI',p.fssai],['Prep Target',`${p.prepTimeTarget} min`],['Rating',`${p.rating}/5.0`]].map(([l,v],i) => (
              <div key={i}><div className="text-orange-100 text-xs">{l}</div><div className="font-bold">{v}</div></div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 mb-5 text-xs text-blue-700 flex items-center gap-2">
        <span>Pre-order risk badge visible to customers right now:</span>
        <strong className="capitalize">{riskNow} risk</strong>
        <span>based on current weather ({signals.weather}) and kitchen load.</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="📦" label="Orders Today" value={stats.ordersToday} sub={`${stats.ordersThisWeek} this week`}/>
        <StatCard icon="⏱️" label="Late Rate" value={`${stats.lateRate}%`} sub="of today's orders" accent={stats.lateRate>15?'text-red-600':'text-gray-900'}/>
        <StatCard icon="🕐" label="Avg Prep Time" value={`${stats.avgPrepTime} min`} sub={`Target: ${isRestaurant?p?.prepTimeTarget:18} min`}/>
        <StatCard icon="💳" label="Compensation Paid" value={`₹${stats.compensation.toLocaleString()}`} sub="this week" accent="text-red-600"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Orders This Week</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="day" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Bar dataKey="orders" fill="#16a34a" radius={[4,4,0,0]} name="Total"/>
              <Bar dataKey="late" fill="#ef4444" radius={[4,4,0,0]} name="Late"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Performance vs Benchmarks</h3>
          <div className="space-y-4">
            {[{label:'Your Restaurant',pct:bench.ownAccuracy,color:bench.ownAccuracy<75?'bg-red-500':'bg-amber-500'},{label:'Zone Average',pct:bench.zoneAvg,color:'bg-blue-500'},{label:'Top 10% Restaurants',pct:bench.top10,color:'bg-green-500'},{label:'City Average',pct:bench.cityAvg,color:'bg-gray-400'}].map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{b.label}</span><span className="font-bold">{b.pct}%</span></div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${b.color} rounded-full`} style={{ width:`${b.pct}%` }}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Live Order Queue</h3>
          <span className="text-xs text-gray-400">{queue.length} active</span>
        </div>
        <div className="space-y-2">
          {queue.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Start the simulation to see live kitchen orders.</p>}
          {queue.map((o,i) => (
            <div key={o.id||i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-8 rounded-full ${o.status==='late'?'bg-red-500':o.status==='at_risk'?'bg-amber-500':'bg-green-500'}`}/>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{o.item}</div>
                  <div className="text-xs text-gray-400">#{o.id}, {o.customer}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{o.prepTime} min</span>
                <Badge level={o.status==='late'?'late':o.status==='at_risk'?'at_risk':'on_track'}>
                  {o.status==='late'?'Late':o.status==='at_risk'?'At Risk':'On Track'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-5 flex items-start gap-2 text-sm text-amber-700">
        <span className="mt-0.5">⚠️</span>
        <div>
          <div className="font-semibold mb-0.5">Coaching Insight</div>
          <div>Prep time accuracy drops 17% during 12-2 PM and 6-8 PM. Pre-prepare high-demand items like biryani base and curry gravies before peak hours to cut the late rate.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[{tag:'High',title:'Update prep time estimates for Biryani items',sub:'Could reduce late rate by ~8%'},{tag:'High',title:'Pre-prep curry bases before 12 PM rush',sub:'Reduces queue depth by ~40% during peak'},{tag:'Medium',title:'Mark menu items with accurate complexity tags',sub:'Improves customer ETA accuracy by ~15%'}].map((a,i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-4">
            <Badge level={a.tag==='High'?'high':'medium'}>{a.tag}</Badge>
            <div className="text-sm font-semibold text-gray-900 mt-2">{a.title}</div>
            <div className="text-xs text-gray-500 mt-1">{a.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
