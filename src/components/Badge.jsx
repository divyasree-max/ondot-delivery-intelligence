import React from 'react';
const S = {
  low:'bg-green-50 text-green-700 border-green-200',medium:'bg-amber-50 text-amber-700 border-amber-200',
  high:'bg-orange-50 text-orange-700 border-orange-200',critical:'bg-red-50 text-red-700 border-red-200',
  on_track:'bg-green-50 text-green-700 border-green-200',on_time:'bg-green-50 text-green-700 border-green-200',
  delayed:'bg-red-50 text-red-700 border-red-200',late:'bg-red-50 text-red-700 border-red-200',
  at_risk:'bg-amber-50 text-amber-700 border-amber-200',
  delivered:'bg-gray-100 text-gray-600 border-gray-200',default:'bg-gray-100 text-gray-600 border-gray-200',
  surplus:'bg-green-50 text-green-700 border-green-200',deficit:'bg-amber-50 text-amber-700 border-amber-200',
};
export default function Badge({ level='default', children }) {
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${S[level?.toLowerCase()]||S.default}`}>{children}</span>;
}
