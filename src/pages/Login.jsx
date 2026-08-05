import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {id:'customer',label:'Customer',icon:'👤',desc:'Order food and track delivery'},
  {id:'partner',label:'Delivery Partner',icon:'🏍️',desc:'Pick up and deliver orders'},
  {id:'restaurant',label:'Restaurant',icon:'🍽️',desc:'Manage kitchen and orders'},
  {id:'admin',label:'Admin / Ops',icon:'🛡️',desc:'Monitor and manage platform'},
];

export default function Login() {
  const [role, setRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = email ? email.split('@')[0].replace(/[^a-zA-Z ]/g,' ').trim() : '';
    const formatted = name ? name.charAt(0).toUpperCase() + name.slice(1) : undefined;
    login(role, formatted);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white"/>
          </div>
          <span className="font-bold text-lg text-gray-900">OnDot</span>
        </Link>
        <div className="border border-gray-200 rounded-2xl p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-5">Select your role, then sign in</p>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {ROLES.map(r => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)}
                className={`text-left p-3 rounded-xl border transition-all ${role===r.id?'border-green-500 bg-green-50':'border-gray-200 hover:border-gray-300'}`}>
                <span className="text-xl">{r.icon}</span>
                <div className={`text-sm font-semibold mt-1.5 ${role===r.id?'text-green-700':'text-gray-800'}`}>{r.label}</div>
                <div className="text-[11px] text-gray-400 mt-0.5 leading-tight">{r.desc}</div>
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Password</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Any password works in demo"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"/>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors mt-2">
              Sign in as {ROLES.find(r=>r.id===role)?.label} <ArrowRight size={16}/>
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            No account? <Link to="/register" className="text-green-600 font-semibold hover:underline">Register</Link>
          </p>
        </div>
        <p className="text-center text-xs text-gray-400 mt-5">Demo prototype. Any email and password will work.</p>
      </div>
    </div>
  );
}
