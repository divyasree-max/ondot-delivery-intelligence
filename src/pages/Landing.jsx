import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

const FEATURES = [
  {icon:'🧠',title:'ML risk prediction',desc:'Live delay-risk score from traffic, weather, accidents, kitchen load, and partner availability combined into one signal.'},
  {icon:'📡',title:'Live signal feed',desc:'Rain intensity, road conditions, accident reports, and peak-load all update in real time, every few seconds.'},
  {icon:'🔔',title:'Proactive alerts',desc:'Customers are told honestly before the ETA passes, not after. No more silent waits.'},
  {icon:'🎁',title:'Automatic recovery',desc:'Free delivery, wallet credit, or coupon code issued the moment a delay crosses a threshold.'},
  {icon:'🏍️',title:'Partner and kitchen sync',desc:'Riders get reroute prompts. Kitchens see live SLA risk flags before an order becomes late.'},
  {icon:'📈',title:'Full ops visibility',desc:'Zone heatmaps, rider utilization, restaurant scorecards, and live analytics in one place.'},
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white"/>
          </div>
          <span className="font-bold text-lg text-gray-900">OnDot</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Log in</Link>
          <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700">Get Started</Link>
        </div>
      </nav>

      <section className="px-8 pt-20 pb-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 blink"/> Real-time delay intelligence engine
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          We predict delivery delays<br/>before they happen.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          OnDot reads weather, traffic, accidents, and peak load in real time, warns customers honestly,
          and automatically applies compensation so no one waits in silence.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/register" className="flex items-center gap-2 px-6 py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
            Try the live prototype <ArrowRight size={16}/>
          </Link>
          <Link to="/login" className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="px-8 pb-20 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[{v:'3M+/day',l:'Orders monitored live'},{v:'< 60 sec',l:'Avg detection time'},{v:'35%',l:'Late rate reduction target'},{v:'99.2%',l:'Auto-compensation accuracy'}].map((s,i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-5 text-center">
              <div className="text-2xl font-bold text-gray-900">{s.v}</div>
              <div className="text-xs text-gray-500 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f,i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-6 hover:border-green-200 hover:shadow-sm transition-all">
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-gray-900 mb-1.5">{f.title}</div>
              <div className="text-sm text-gray-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-8 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        OnDot, Built by S. Divyasree, Tamil Nadu, India. Student prototype for portfolio and interview demonstration.
      </footer>
    </div>
  );
}
