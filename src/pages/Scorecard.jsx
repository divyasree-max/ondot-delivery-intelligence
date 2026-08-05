import React, { useState } from 'react';
import Badge from '../components/Badge';

const DATA = [
  {name:'Onesta',zone:'Marathahalli',accuracy:92,orders:412,late:8,rating:4.6,compensation:2100},
  {name:'Hotel Nandhana',zone:'JP Nagar',accuracy:71,orders:298,late:24,rating:4.1,compensation:8800},
  {name:'Meghana Foods',zone:'Koramangala',accuracy:88,orders:356,late:12,rating:4.5,compensation:3200},
  {name:'Paradise Biryani',zone:'Whitefield',accuracy:65,orders:271,late:31,rating:3.9,compensation:11400},
  {name:'Truffles',zone:'Koramangala',accuracy:79,orders:189,late:18,rating:4.3,compensation:5100},
  {name:"Leon's Sandwich",zone:'Electronic City',accuracy:84,orders:203,late:14,rating:4.4,compensation:4200},
  {name:'Empire Restaurant',zone:'Koramangala',accuracy:71,orders:320,late:22,rating:4.0,compensation:7600},
  {name:'Beijing Bites',zone:'BTM Layout',accuracy:76,orders:245,late:19,rating:4.2,compensation:5900},
];

function level(acc) {
  if (acc >= 85) return 'low';
  if (acc >= 70) return 'medium';
  return 'critical';
}
function label(acc) {
  if (acc >= 85) return 'Excellent';
  if (acc >= 70) return 'Needs Improvement';
  return 'At Risk';
}

export default function Scorecard() {
  const [sort, setSort] = useState('accuracy');
  const sorted = [...DATA].sort((a,b) => sort === 'accuracy' ? b.accuracy - a.accuracy : sort === 'late' ? b.late - a.late : b.compensation - a.compensation);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-xl">🏆</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Scorecard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Prep accuracy and delay performance across all partner restaurants</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort by:</span>
          {['accuracy','late','compensation'].map(s => (
            <button key={s} onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${sort===s?'bg-gray-900 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s === 'accuracy' ? 'Prep Accuracy' : s === 'late' ? 'Late Orders' : 'Compensation'}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs text-gray-400">
              <th className="px-5 py-3 font-medium">Restaurant</th>
              <th className="px-5 py-3 font-medium">Zone</th>
              <th className="px-5 py-3 font-medium">Prep Accuracy</th>
              <th className="px-5 py-3 font-medium">Orders (30d)</th>
              <th className="px-5 py-3 font-medium">Late Orders</th>
              <th className="px-5 py-3 font-medium">Rating</th>
              <th className="px-5 py-3 font-medium">Comp Paid</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r,i) => (
              <tr key={i} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-gray-900">{r.name}</td>
                <td className="px-5 py-3.5 text-gray-500">{r.zone}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.accuracy>=85?'bg-green-500':r.accuracy>=70?'bg-amber-500':'bg-red-500'}`} style={{width:`${r.accuracy}%`}} />
                    </div>
                    <span className="font-semibold">{r.accuracy}%</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-gray-500">{r.orders}</td>
                <td className="px-5 py-3.5">
                  <span className={`font-semibold ${r.late > 20 ? 'text-red-600' : r.late > 12 ? 'text-amber-600' : 'text-gray-700'}`}>{r.late}</span>
                </td>
                <td className="px-5 py-3.5 text-amber-600 font-medium">{'★'.repeat(Math.round(r.rating))} {r.rating}</td>
                <td className="px-5 py-3.5 text-gray-500">₹{r.compensation.toLocaleString()}</td>
                <td className="px-5 py-3.5"><Badge level={level(r.accuracy)}>{label(r.accuracy)}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-700">
        Restaurants below 70% prep accuracy automatically receive a red pre-order risk badge visible to customers before they place an order.
      </div>
    </div>
  );
}
