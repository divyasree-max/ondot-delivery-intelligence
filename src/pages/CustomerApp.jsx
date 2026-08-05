import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Send, X, MessageCircle, Star } from 'lucide-react';
import { useSim } from '../context/SimContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/Badge';

const STEPS = ['confirmed','preparing','picked_up','on_the_way','delivered'];
const STEP_LABELS = { confirmed:'Order Placed', preparing:'Restaurant Confirmed', picked_up:'Picked Up', on_the_way:'On The Way', delivered:'Delivered' };

export default function CustomerApp() {
  const { orders, chatMessages, sendChatMessage } = useSim();
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [section, setSection] = useState('orders');

  const isCustomer = user?.role === 'customer';
  const p = user?.profile;
  const liveOrders = orders.filter(o => o.status !== 'delivered').slice(0, 8);
  const selected = orders.find(o => o.id === selectedId) || liveOrders[0];

  useEffect(() => {
    if (!selectedId && liveOrders[0]) setSelectedId(liveOrders[0].id);
  }, [liveOrders.length]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    sendChatMessage(chatInput);
    setChatInput('');
  };

  const riskBg = (level) => ({ critical:'bg-red-500', high:'bg-amber-500', medium:'bg-amber-400', low:'bg-green-500' })[level] || 'bg-gray-400';

  return (
    <div className="max-w-[1500px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-xl">📱</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer App</h1>
            <p className="text-sm text-gray-500 mt-0.5">{isCustomer ? `Viewing as ${p?.name}` : 'Live mobile experience, real order tracking'}</p>
          </div>
        </div>
        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">Customer-Facing</span>
      </div>

      {isCustomer && p && (
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-5 mb-5 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">{p.name[0]}</div>
              <div>
                <div className="font-bold text-lg">{p.name}</div>
                <div className="text-green-100 text-sm">{p.city}, {p.preference}</div>
                <div className="text-green-200 text-xs mt-0.5">{p.phone}</div>
              </div>
            </div>
            <div className="flex gap-6 text-center">
              <div><div className="text-2xl font-bold">{p.totalOrders}</div><div className="text-green-100 text-xs">Total Orders</div></div>
              <div><div className="text-2xl font-bold">₹{p.wallet}</div><div className="text-green-100 text-xs">Wallet</div></div>
              <div><div className="text-2xl font-bold">{p.loyaltyPoints}</div><div className="text-green-100 text-xs">Points</div></div>
            </div>
          </div>
        </div>
      )}

      {isCustomer && (
        <div className="flex gap-2 mb-5">
          {['orders','history','profile'].map(s => (
            <button key={s} onClick={() => setSection(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${section===s?'bg-gray-900 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s === 'orders' ? 'Live Orders' : s}
            </button>
          ))}
        </div>
      )}

      {section === 'history' && isCustomer && p && (
        <div className="border border-gray-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {p.recentOrders.map((o, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center text-lg">🍽️</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{o.restaurant}</div>
                    <div className="text-xs text-gray-500">{o.item}, {o.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">₹{o.price}</div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({length:5}).map((_,j) => <Star key={j} size={10} fill={j<o.rating?'#f59e0b':'none'} className={j<o.rating?'text-amber-400':'text-gray-300'}/>)}
                    </div>
                  </div>
                  <Badge level="delivered">Delivered</Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-amber-700">{p.lateOrdersReceived}</div>
              <div className="text-xs text-amber-600">Orders that were late</div>
            </div>
            <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-green-700">₹{p.compensationEarned}</div>
              <div className="text-xs text-green-600">Total compensation received</div>
            </div>
          </div>
        </div>
      )}

      {section === 'profile' && isCustomer && p && (
        <div className="border border-gray-200 rounded-2xl p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4">Profile Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[['Full Name',p.name],['Email',p.email],['Phone',p.phone],['City',p.city],['Default Address',p.address],['Food Preference',p.preference],['Member Since',p.joinedDate],['Saved Addresses',p.savedAddresses]].map(([l,v],i) => (
              <div key={i}><div className="text-xs text-gray-400 mb-0.5">{l}</div><div className="font-medium text-gray-800">{v}</div></div>
            ))}
          </div>
        </div>
      )}

      {(section === 'orders' || !isCustomer) && (
        <>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
            <span className="text-xs text-gray-500 self-center shrink-0">Viewing:</span>
            {liveOrders.map(o => (
              <button key={o.id} onClick={() => setSelectedId(o.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${selectedId===o.id?'bg-gray-900 text-white border-gray-900':'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {o.id}
              </button>
            ))}
          </div>

          {!selected ? (
            <div className="text-center py-20 text-gray-400 text-sm">Start the simulation to see live order tracking.</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="mx-auto w-full max-w-sm">
                <div className="border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                  <div className={`p-5 text-white ${selected.delayMin>0?'bg-gradient-to-br from-amber-500 to-red-500':'bg-gradient-to-br from-green-500 to-green-700'}`}>
                    <div className="text-xs opacity-80 mb-3">{new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">🍽️</div>
                      <div>
                        <div className="font-semibold">{selected.restaurant}</div>
                        <div className="text-xs opacity-80">{selected.id}</div>
                      </div>
                    </div>
                    <div className="bg-white/15 rounded-xl p-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs opacity-80">Estimated Arrival</div>
                        <div className="text-2xl font-bold">{Math.max(0, selected.eta - Math.round(selected.eta*selected.progress/100))} min</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 ${selected.delayMin>0?'text-amber-600':'text-green-600'}`}>
                        {selected.delayMin>0?'Delayed':'On Time'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] font-semibold text-gray-400 mb-3">ORDER PROGRESS</div>
                    <div className="space-y-2.5 mb-4">
                      {STEPS.map((step,i) => {
                        const curIdx = STEPS.indexOf(selected.status);
                        const done = i <= curIdx;
                        const isNow = i === curIdx && step !== 'delivered';
                        return (
                          <div key={step} className="flex gap-3 items-start">
                            <div className="flex flex-col items-center">
                              <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${done?'bg-green-500':'bg-gray-200'}`}/>
                              {i < STEPS.length-1 && <div className={`w-0.5 h-5 ${done?'bg-green-200':'bg-gray-100'}`}/>}
                            </div>
                            <div className="text-xs font-medium text-gray-800 flex items-center gap-1.5">
                              {STEP_LABELS[step]}
                              {isNow && <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Now</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selected.compensation && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-3 fade-in">
                        <div className="text-xs font-semibold text-green-700">🎁 {selected.compensation.label} applied</div>
                        <div className="text-[11px] text-green-600 mt-0.5">Added automatically because your order was delayed.</div>
                      </div>
                    )}
                    <div className="border-t border-gray-100 pt-3 mb-3 text-xs">
                      <div className="flex justify-between py-1"><span className="text-gray-500">{selected.item}</span><span className="font-medium">₹{selected.price-30}</span></div>
                      <div className="flex justify-between py-1"><span className="text-gray-500">Delivery Fee</span><span className="font-medium">₹30</span></div>
                      <div className="flex justify-between pt-2 border-t border-gray-100 mt-1 font-bold"><span>Total</span><span>₹{selected.price}</span></div>
                    </div>
                    <button className="w-full bg-green-600 text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 mb-2">
                      <MapPin size={14}/> Track on Map
                    </button>
                    <button className="w-full border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
                      <Phone size={14}/> Call Support
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Order Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[['Order ID',selected.id],['Customer',selected.customer],['Restaurant',selected.restaurant],['Zone',selected.zone],['Placed At',selected.placedAt.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})],['Rider',selected.rider]].map(([l,v],i) => (
                      <div key={i}><div className="text-[11px] text-gray-400">{l}</div><div className="font-semibold">{v}</div></div>
                    ))}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Risk Assessment</h3>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Delay Risk Score</span>
                    <span className="font-bold">{selected.riskScore}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                    <div className={`h-full rounded-full transition-all duration-700 ${riskBg(selected.riskLevel)}`} style={{ width:`${selected.riskScore}%` }}/>
                  </div>
                  {selected.delayMin > 0 && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <div className="text-xs font-semibold text-amber-700 mb-1">Why it is delayed</div>
                      {selected.causes.map((c,i) => <div key={i} className="text-xs text-amber-700">• {c}</div>)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <button onClick={() => setChatOpen(v => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center hover:bg-green-700 z-50 transition-colors">
        <MessageCircle size={22}/>
      </button>

      {chatOpen && (
        <div className="fixed bottom-24 right-6 w-80 border border-gray-200 rounded-2xl shadow-xl bg-white z-50 flex flex-col" style={{ height:420 }}>
          <div className="flex items-center justify-between px-4 py-3 bg-green-600 rounded-t-2xl">
            <span className="text-white font-semibold text-sm">💬 OnDot AI Support</span>
            <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white"><X size={16}/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatMessages.map((m,i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.from==='user'?'bg-green-600 text-white ml-auto rounded-br-sm':'bg-gray-100 text-gray-700 rounded-bl-sm'}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-2.5 border-t border-gray-100 flex gap-2">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key==='Enter' && handleSend()}
              placeholder="Ask about your order..."
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500"/>
            <button onClick={handleSend} className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center"><Send size={13}/></button>
          </div>
        </div>
      )}
    </div>
  );
}
