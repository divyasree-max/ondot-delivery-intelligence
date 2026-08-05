import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Zap, Play, Pause, Truck, LogOut } from 'lucide-react';
import { useSim } from '../context/SimContext';
import { useAuth } from '../context/AuthContext';

const TABS = [
  {to:'/app/dashboard',label:'Ops Dashboard',icon:'📊'},
  {to:'/app/customer',label:'Customer App',icon:'📱'},
  {to:'/app/restaurant',label:'Restaurant',icon:'🍽️'},
  {to:'/app/rider',label:'Rider Panel',icon:'🏍️'},
  {to:'/app/ml',label:'ML Prediction',icon:'🧠'},
  {to:'/app/signals',label:'Live Signals',icon:'📡'},
  {to:'/app/notifications',label:'Notifications',icon:'🔔'},
  {to:'/app/offers',label:'Offers',icon:'🎁'},
  {to:'/app/analytics',label:'Analytics',icon:'📈'},
  {to:'/app/scorecard',label:'Restaurant Scorecard',icon:'🏆'},
  {to:'/app/prd',label:'PRD',icon:'📋'},
];

export default function TopBar() {
  const { running, start, stop, speed, setSpeed, addOrder, stats } = useSim();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white" />
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm leading-tight">OnDot</div>
            <div className="text-[10px] text-gray-400 leading-tight">Delay Intelligence</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={running ? stop : start}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${running?'bg-red-50 text-red-600 hover:bg-red-100':'bg-green-600 text-white hover:bg-green-700'}`}>
            {running ? <Pause size={13}/> : <Play size={13} fill="white"/>}
            {running ? 'Stop' : 'Start Simulation'}
          </button>
          <button onClick={addOrder} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
            <Truck size={13}/> New Order
          </button>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            {[1,2,5,10].map(s => (
              <button key={s} onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors ${speed===s?'bg-white text-gray-900 shadow-sm':'text-gray-500 hover:text-gray-700'}`}>
                {s}x
              </button>
            ))}
          </div>
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold ${running?'bg-green-50 text-green-700':'bg-gray-100 text-gray-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${running?'bg-green-500 blink':'bg-gray-400'}`}/>
            {running ? `Live, ${stats.activeCount} orders` : 'Paused'}
          </div>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="text-right">
              <div className="text-xs font-semibold text-gray-700">{user?.name}</div>
              <div className="text-[10px] text-gray-400 capitalize">{user?.role}</div>
            </div>
            <button onClick={() => { logout(); navigate('/'); }} title="Log out"
              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200">
              <LogOut size={13}/>
            </button>
          </div>
        </div>
      </div>
      <div className="px-6 flex items-center gap-0.5 overflow-x-auto border-t border-gray-100" style={{scrollbarWidth:'none'}}>
        {TABS.map(tab => (
          <NavLink key={tab.to} to={tab.to}
            className={({isActive}) =>
              `whitespace-nowrap flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-medium border-b-2 transition-colors ${isActive?'border-green-600 text-gray-900':'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-200'}`
            }>
            <span>{tab.icon}</span>{tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
