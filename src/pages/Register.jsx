import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {id:'customer',label:'Customer',icon:'👤'},
  {id:'partner',label:'Delivery Partner',icon:'🏍️'},
  {id:'restaurant',label:'Restaurant',icon:'🍽️'},
  {id:'admin',label:'Admin / Ops',icon:'🛡️'},
];

const inp = "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white";
const sel = inp;

function F({ label, children }) {
  return <div><label className="text-xs font-medium text-gray-600 mb-1 block">{label}</label>{children}</div>;
}

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    login(role, name || undefined);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Link to="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <Zap size={18} className="text-white" fill="white"/>
          </div>
          <span className="font-bold text-lg text-gray-900">OnDot</span>
        </Link>
        <div className="border border-gray-200 rounded-2xl p-8">
          {step === 1 && (
            <>
              <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
              <p className="text-sm text-gray-500 mb-6">Who are you signing up as?</p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button key={r.id} type="button" onClick={() => { setRole(r.id); setStep(2); }}
                    className="text-left p-4 rounded-xl border border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all group">
                    <span className="text-2xl">{r.icon}</span>
                    <div className="text-sm font-semibold mt-2 text-gray-800 group-hover:text-green-700">{r.label}</div>
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-6">
                Already registered? <Link to="/login" className="text-green-600 font-semibold hover:underline">Log in</Link>
              </p>
            </>
          )}
          {step === 2 && (
            <form onSubmit={submit}>
              <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-4">
                <ArrowLeft size={12}/> Change role
              </button>
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {role==='customer'&&'Customer details'}
                {role==='partner'&&'Delivery partner details'}
                {role==='restaurant'&&'Restaurant details'}
                {role==='admin'&&'Admin details'}
              </h1>
              <p className="text-sm text-gray-500 mb-5">Fill in your details to get started</p>
              <div className="space-y-3 overflow-y-auto pr-1" style={{maxHeight:'55vh'}}>
                {role==='customer' && <>
                  <F label="Full name"><input required className={inp} placeholder="Your name" onChange={e=>setName(e.target.value)}/></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Email"><input type="email" required className={inp} placeholder="you@example.com"/></F>
                    <F label="Phone number"><input type="tel" required className={inp} placeholder="+91 98765 43210"/></F>
                  </div>
                  <F label="Password"><input type="password" required className={inp} placeholder="Min 8 characters"/></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="City"><select className={sel}><option>Bengaluru</option><option>Chennai</option><option>Hyderabad</option><option>Vijayawada</option><option>Other</option></select></F>
                    <F label="Food preference"><select className={sel}><option>Both</option><option>Vegetarian</option><option>Non-vegetarian</option></select></F>
                  </div>
                  <F label="Default delivery address"><input className={inp} placeholder="Flat, street, landmark"/></F>
                  <F label="How did you hear about us?"><select className={sel}><option>Friend or family</option><option>Social media</option><option>College or campus</option><option>Search</option><option>Other</option></select></F>
                </>}
                {role==='partner' && <>
                  <F label="Full name"><input required className={inp} placeholder="Your name" onChange={e=>setName(e.target.value)}/></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Email"><input type="email" required className={inp} placeholder="you@example.com"/></F>
                    <F label="Phone number"><input type="tel" required className={inp} placeholder="+91 98765 43210"/></F>
                  </div>
                  <F label="Password"><input type="password" required className={inp} placeholder="Min 8 characters"/></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="City"><select className={sel}><option>Bengaluru</option><option>Chennai</option><option>Hyderabad</option><option>Vijayawada</option></select></F>
                    <F label="Vehicle type"><select className={sel}><option>Bike</option><option>Scooter</option><option>Bicycle</option><option>On foot</option></select></F>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Driving licence number"><input className={inp} placeholder="DL-XXXXXXXXXXXX"/></F>
                    <F label="Years of experience"><input type="number" min="0" className={inp} placeholder="2"/></F>
                  </div>
                  <F label="Preferred working hours"><select className={sel}><option>Flexible</option><option>Morning (6 AM to 12 PM)</option><option>Afternoon (12 PM to 6 PM)</option><option>Evening (6 PM to 12 AM)</option></select></F>
                  <F label="Bank account number (for payouts)"><input className={inp} placeholder="XXXXXXXXXXXXXX"/></F>
                </>}
                {role==='restaurant' && <>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Restaurant name"><input required className={inp} placeholder="Your restaurant" onChange={e=>setName(e.target.value)}/></F>
                    <F label="Owner or manager name"><input className={inp} placeholder="Your name"/></F>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Email"><input type="email" required className={inp} placeholder="restaurant@example.com"/></F>
                    <F label="Phone number"><input type="tel" required className={inp} placeholder="+91 98765 43210"/></F>
                  </div>
                  <F label="Password"><input type="password" required className={inp} placeholder="Min 8 characters"/></F>
                  <F label="Full address"><input className={inp} placeholder="Shop, street, area, city"/></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Cuisine type"><select className={sel}><option>Indian</option><option>South Indian</option><option>Chinese</option><option>Italian</option><option>Multi-cuisine</option><option>Other</option></select></F>
                    <F label="Average prep time"><select className={sel}><option>Under 15 min</option><option>15 to 30 min</option><option>30 to 45 min</option><option>45 min+</option></select></F>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="FSSAI licence number"><input className={inp} placeholder="14-digit number"/></F>
                    <F label="Service type"><select className={sel}><option>Delivery only</option><option>Dine-in + delivery</option></select></F>
                  </div>
                  <F label="Seating capacity (if dine-in)"><input type="number" min="0" className={inp} placeholder="40"/></F>
                </>}
                {role==='admin' && <>
                  <F label="Full name"><input required className={inp} placeholder="Your name" onChange={e=>setName(e.target.value)}/></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Work email"><input type="email" required className={inp} placeholder="you@ondot.in"/></F>
                    <F label="Employee ID"><input className={inp} placeholder="EMP-0042"/></F>
                  </div>
                  <F label="Password"><input type="password" required className={inp} placeholder="Min 8 characters"/></F>
                  <div className="grid grid-cols-2 gap-3">
                    <F label="Department"><select className={sel}><option>Operations</option><option>Technology</option><option>Customer Support</option><option>Business</option></select></F>
                    <F label="Access level"><select className={sel}><option>Read only</option><option>Read and Write</option><option>Full access</option></select></F>
                  </div>
                  <F label="Reason for access"><input className={inp} placeholder="Brief justification"/></F>
                </>}
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors mt-5">
                Create account <ArrowRight size={16}/>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
