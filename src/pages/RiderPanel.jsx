import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSim } from '../context/SimContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Badge from '../components/Badge';

const UTIL = [{h:'6 AM',v:35},{h:'8 AM',v:78},{h:'10 AM',v:65},{h:'12 PM',v:98},{h:'2 PM',v:72},{h:'4 PM',v:60},{h:'6 PM',v:90},{h:'8 PM',v:95},{h:'10 PM',v:55}];
const ZONES = [{zone:'Koramangala',cur:142,cap:160,status:'Deficit'},{zone:'HSR Layout',cur:98,cap:145,status:'Critical'},{zone:'Indiranagar',cur:87,cap:80,status:'Surplus'},{zone:'Whitefield',cur:64,cap:120,status:'Critical'},{zone:'JP Nagar',cur:78,cap:90,status:'Deficit'}];
const INCENTIVES = [{zone:'Whitefield',sub:'High demand, low supply',amt:'₹15/order',exp:'45 min'},{zone:'BTM Layout',sub:'Peak hour surge',amt:'₹12/order',exp:'30 min'},{zone:'Electronic City',sub:'Rider deficit',amt:'₹20/order',exp:'60 min'}];
const PIE_COLORS = ['#16a34a','#3b82f6','#f59e0b','#94a3b8'];

export default function RiderPanel() {
  const { useSim: _s } = {};
  const sim = useSim();
  const { user } = useAuth();
  const isPartner = user?.role === 'partner';
  const p = user?.profile;

  const stats = isPartner && p ? p.stats : { ordersToday:18, ordersThisWeek:94, avgDeliveryTime:28, totalEarningsToday:1240, totalEarningsWeek:5820 };
  const zoneActivity = isPartner && p ? p.zoneActivity : [];
  const recentDeliveries = isPartner && p ? p.recentDeliveries : [];
  const weeklyEarnings = isPartner && p ? p.weeklyEarnings : [{day:'Mon',earnings:820},{day:'Tue',earnings:760},{day:'Wed',earnings:910},{day:'Thu',earnings:1050},{day:'Fri',earnings:880},{day:'Sat',earnings:400},{day:'Sun',earnings:0}];

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl">🏍️</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rider Panel</h1>
            <p className="text-sm text-gray-500 mt-0.5">{isPartner ? `Viewing as ${p?.name}` : 'Demand-supply balancing and zone management'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 blink"/> Live Tracking
          </span>
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50">Boost Incentives</button>
        </div>
      </div>

      {isPartner && p && (
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 mb-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">{p.name[0]}</div>
              <div>
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-indigo-100 text-sm">{p.zone}, {p.vehicle}, {p.experience} experience</div>
                <div className="text-indigo-200 text-xs mt-0.5">Licence: {p.licence}</div>
                <div className="text-yellow-300 text-sm mt-0.5">{'★'.repeat(Math.round(p.rating))} {p.rating}/5.0</div>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div><div className="text-2xl font-bold">{stats.ordersToday}</div><div className="text-indigo-100 text-xs">Orders today</div></div>
              <div><div className="text-2xl font-bold">₹{stats.totalEarningsToday}</div><div className="text-indigo-100 text-xs">Earned today</div></div>
              <div><div className="text-2xl font-bold">{stats.avgDeliveryTime}m</div><div className="text-indigo-100 text-xs">Avg delivery</div></div>
            </div>
          </div>
          {p.currentIncentive && (
            <div className="mt-4 bg-white/10 rounded-xl p-3 flex items-center justify-between text-sm">
              <span><strong>Active incentive:</strong> {p.currentIncentive.zone}, {p.currentIncentive.reason}</span>
              <span className="font-bold text-yellow-300">₹{p.currentIncentive.amount}/order, expires in {p.currentIncentive.expiresIn} min</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon="🚴" label="Orders Today" value={stats.ordersToday} sub={`${stats.ordersThisWeek} this week`}/>
        <StatCard icon="⏱️" label="Avg Delivery" value={`${stats.avgDeliveryTime} min`} sub="per order"/>
        <StatCard icon="💰" label="Earned Today" value={`₹${stats.totalEarningsToday}`} accent="text-green-600"/>
        <StatCard icon="📅" label="This Week" value={`₹${stats.totalEarningsWeek}`} accent="text-green-600"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {isPartner ? (
          <>
            <div className="border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Where You Deliver Most</h3>
              {zoneActivity.length > 0 ? (
                <ResponsiveContainer width="100%" height={230}>
                  <PieChart>
                    <Pie data={zoneActivity} dataKey="orders" nameKey="zone" cx="50%" cy="50%" outerRadius={85} label={({zone})=>zone}>
                      {zoneActivity.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}
                    </Pie>
                    <Tooltip/>
                  </PieChart>
                </ResponsiveContainer>
              ) : <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No zone data available.</div>}
            </div>
            <div className="border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Weekly Earnings</h3>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={weeklyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="day" tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                  <Tooltip formatter={v => [`₹${v}`,'Earnings']}/>
                  <Bar dataKey="earnings" fill="#16a34a" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <>
            <div className="border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Zone Demand-Supply</h3>
              <div className="space-y-3.5">
                {ZONES.map(z => (
                  <div key={z.zone}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 font-medium">{z.zone}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{z.cur}/{z.cap}</span>
                        <Badge level={z.status==='Critical'?'critical':z.status==='Deficit'?'medium':'on_track'}>{z.status}</Badge>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${z.status==='Critical'?'bg-red-500':z.status==='Deficit'?'bg-amber-500':'bg-green-500'}`} style={{ width:`${Math.min(100,(z.cur/z.cap)*100)}%` }}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 mb-4">Rider Utilization</h3>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={UTIL}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="h" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize:11, fill:'#9ca3af' }} axisLine={false} tickLine={false}/>
                  <Tooltip/>
                  <Line type="monotone" dataKey="v" stroke="#16a34a" strokeWidth={2} dot={false} name="Utilization %"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      {isPartner && recentDeliveries.length > 0 && (
        <div className="border border-gray-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Deliveries</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-xs text-gray-400 border-b border-gray-100">
              {['Order','Restaurant','Customer','Time','Earnings','Status'].map(h => <th key={h} className="pb-2 text-left font-medium">{h}</th>)}
            </tr></thead>
            <tbody>
              {recentDeliveries.map((d,i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2.5 font-semibold">{d.id}</td>
                  <td className="text-gray-500">{d.restaurant}</td>
                  <td className="text-gray-500">{d.customer}</td>
                  <td className="text-gray-500">{d.time}</td>
                  <td className="font-semibold text-green-600">₹{d.earnings}</td>
                  <td><Badge level={d.status==='on_time'?'on_time':'late'}>{d.status==='on_time'?'On Time':'Late'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isPartner && (
        <div className="border border-gray-200 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Active Incentive Zones</h3>
          <div className="space-y-2.5">
            {INCENTIVES.map(inc => (
              <div key={inc.zone} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl p-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center font-bold text-amber-600 text-sm">₹</div>
                  <div><div className="text-sm font-semibold text-gray-900">{inc.zone}</div><div className="text-xs text-gray-500">{inc.sub}</div></div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-700">{inc.amt}</div>
                  <div className="text-[10px] text-gray-400">expires in {inc.exp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
