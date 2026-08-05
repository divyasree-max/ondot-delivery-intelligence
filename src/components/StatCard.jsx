import React from 'react';
export default function StatCard({ icon, label, value, sub, accent='text-gray-900', bg='bg-green-50' }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 font-medium">{label}</span>
        {icon && <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center text-base`}>{icon}</div>}
      </div>
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}
