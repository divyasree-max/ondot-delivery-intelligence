import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
const SimContext = createContext(null);
export const useSim = () => useContext(SimContext);

const ZONES = ['Koramangala','HSR Layout','Indiranagar','Whitefield','JP Nagar','BTM Layout','Electronic City','Marathahalli'];
const RESTAURANTS = ['Meghana Foods','Hotel Nandhana','Onesta','Paradise Biryani','Truffles','Leon\'s Sandwich','Empire Restaurant','Beijing Bites','Chai Point','Nandhana Palace'];
const CUSTOMERS = ['Divya Iyer','Rahul Verma','Swati Mishra','Karan Bhatt','Nisha Thomas','Meera Joshi','Rohit Kumar','Deepak Reddy','Priya S.','Arjun K.'];
const ITEMS = ['Chicken Biryani','Paneer Tikka + Naan','Veg Thali','Dal Fry + Rice','Butter Chicken','Masala Dosa','Chole Bhature','Hakka Noodles','Margherita Pizza','Mutton Biryani'];
const RIDERS = ['Arjun M.','Priya S.','Vikram R.','Suresh P.','Deepak K.','Rahul T.','Kavya N.','Manoj S.'];

const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const pick = arr => arr[Math.floor(Math.random()*arr.length)];
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
let orderCounter = 4830;

function makeOrder(sig) {
  orderCounter++;
  const zone = pick(ZONES);
  const weather = sig?.weather || 'clear';
  const traffic = sig?.traffic || 35;
  const rainPenalty = weather==='heavy_rain'?35:weather==='rain'?22:weather==='light_rain'?12:0;
  const trafficPenalty = traffic>70?20:traffic>50?12:traffic>35?5:0;
  const peakHour = [12,13,14,19,20,21].includes(new Date().getHours()) || Math.random()<0.15;
  const peakPenalty = peakHour ? rand(8,22) : rand(0,5);
  const accident = Math.random()<0.08;
  const accidentPenalty = accident ? rand(12,25) : 0;
  const partnerLoad = rand(1,5);
  const partnerPenalty = partnerLoad>3 ? rand(6,15) : 0;
  const riskScore = clamp(Math.round(traffic*0.3+rainPenalty+peakPenalty+accidentPenalty+partnerPenalty+rand(-5,5)),2,98);
  const riskLevel = riskScore>=75?'critical':riskScore>=50?'high':riskScore>=25?'medium':'low';
  const baseEta = rand(22,42);
  const delayMin = riskLevel==='critical'?rand(14,28):riskLevel==='high'?rand(7,15):riskLevel==='medium'?rand(2,7):0;
  const causes = [];
  if (rainPenalty>0) causes.push(weather==='heavy_rain'?'Heavy rain':weather==='rain'?'Moderate rain':'Light rain');
  if (accidentPenalty>0) causes.push('Accident on route');
  if (peakPenalty>12) causes.push('Peak-hour congestion');
  if (partnerPenalty>0) causes.push('Partner shortage');
  if (trafficPenalty>10) causes.push('Heavy traffic');
  if (causes.length===0) causes.push('Normal conditions');
  return {
    id:`ORD-${orderCounter}`, customer:pick(CUSTOMERS), restaurant:pick(RESTAURANTS),
    rider:pick(RIDERS), item:pick(ITEMS), zone, price:rand(120,960),
    placedAt:new Date(), status:'confirmed', progress:0,
    riskScore, riskLevel, eta:baseEta+delayMin, baseEta, delayMin, causes,
    weather, traffic, accident, peakHour, partnerLoad,
    compensation:null, notified:false,
  };
}

export function SimProvider({ children }) {
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [compensations, setCompensations] = useState([]);
  const [signals, setSignals] = useState({ weather:'clear', rainIntensity:0, traffic:35, accidents:0, peakLoad:false, avgPrepTime:18, partnerAvailability:82 });
  const [chatMessages, setChatMessages] = useState([
    { from:'bot', text:'Hi! I\'m your OnDot support assistant. Ask me about your order, delays, or compensation.', time:new Date() }
  ]);
  const [historyData, setHistoryData] = useState(
    Array.from({length:12},(_,i)=>({ time:`${(new Date().getHours()-11+i+24)%24}:00`, lateRate:rand(8,28), orders:rand(30,120), compensation:rand(1000,8000) }))
  );

  const sigRef = useRef(signals);
  useEffect(() => { sigRef.current = signals; }, [signals]);

  const addOrder = useCallback(() => {
    setOrders(prev => [makeOrder(sigRef.current), ...prev].slice(0,80));
  }, []);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setOrders(prev => prev.map(o => {
        if (o.status==='delivered') return o;
        const progress = Math.min(100, o.progress+rand(6,18));
        const status = progress>=100?'delivered':progress>75?'on_the_way':progress>50?'picked_up':progress>20?'preparing':'confirmed';
        let { compensation, notified } = o;
        if (!notified && o.delayMin>=15 && progress>30) {
          notified = true;
          compensation = o.delayMin>=30?{type:'coupon',label:'₹150 Coupon',value:150}
            :o.delayMin>=20?{type:'wallet',label:'₹100 Wallet Credit',value:100}
            :{type:'free_delivery',label:'Free Delivery',value:0};
          setCompensations(c => [{orderId:o.id,customer:o.customer,restaurant:o.restaurant,...compensation,time:new Date()},...c].slice(0,60));
          setNotifications(n => [{id:`${o.id}-d`,text:`Order ${o.id}: ${o.delayMin}min delay (${o.causes[0]}). ${compensation.label} sent to ${o.customer}.`,time:new Date(),type:'delay'},...n].slice(0,80));
        }
        return {...o,progress,status,compensation,notified};
      }));
    }, 900/speed);
    return () => clearInterval(iv);
  }, [running, speed]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      addOrder();
      setSignals(prev => {
        const weather = Math.random()<0.10 ? pick(['clear','clear','light_rain','rain','heavy_rain']) : prev.weather;
        return {
          weather, rainIntensity:weather==='heavy_rain'?rand(70,100):weather==='rain'?rand(40,69):weather==='light_rain'?rand(10,39):0,
          traffic:clamp(prev.traffic+rand(-10,10),15,95),
          accidents:Math.random()<0.1?clamp(prev.accidents+1,0,5):Math.max(0,prev.accidents-(Math.random()<0.25?1:0)),
          peakLoad:[12,13,14,19,20,21].includes(new Date().getHours())||Math.random()<0.15,
          avgPrepTime:clamp(prev.avgPrepTime+rand(-2,2),10,35),
          partnerAvailability:clamp(prev.partnerAvailability+rand(-6,6),40,98),
        };
      });
      setHistoryData(prev => [...prev.slice(1),{time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),lateRate:rand(8,28),orders:rand(30,120),compensation:rand(1000,8000)}]);
    }, 2800/speed);
    return () => clearInterval(iv);
  }, [running, speed, addOrder]);

  const sendChatMessage = useCallback((text) => {
    setChatMessages(prev => [...prev, {from:'user',text,time:new Date()}]);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = 'Could you share your order ID? I\'ll look it up right away.';
      const latest = orders[0];
      if (lower.includes('where')||lower.includes('order')||lower.includes('status')) {
        if (latest) reply = `Order ${latest.id} from ${latest.restaurant} is "${latest.status.replace('_',' ')}". ${latest.delayMin>0?`Running ${latest.delayMin}min late due to ${latest.causes[0].toLowerCase()}. ${latest.compensation?.label||'Compensation'} has been applied automatically.`:'No delays detected, you are on track.'}`;
      } else if (lower.includes('refund')||lower.includes('cancel')) {
        reply = 'I can process a full refund, or you can keep the order with automatic compensation already applied. Which would you prefer?';
      } else if (lower.includes('compens')||lower.includes('coupon')||lower.includes('offer')) {
        reply = 'Delays over 15 min: free delivery. Over 20 min: ₹100 wallet credit. Over 30 min: ₹150 coupon code. All applied automatically, no action needed from you.';
      } else if (lower.includes('why')||lower.includes('late')||lower.includes('delay')) {
        reply = `Current network conditions: weather is ${signals.weather}, traffic at ${signals.traffic}% congestion${signals.accidents>0?`, ${signals.accidents} accident(s) on active routes`:''}${signals.peakLoad?', peak-hour load is active':''}. Our ML engine adjusts your ETA based on all of these in real time.`;
      }
      setChatMessages(prev => [...prev, {from:'bot',text:reply,time:new Date()}]);
    }, 650);
  }, [orders, signals]);

  const active = orders.filter(o=>o.status!=='delivered');
  const late = active.filter(o=>o.riskLevel==='high'||o.riskLevel==='critical').length;

  return (
    <SimContext.Provider value={{
      running, start:()=>setRunning(true), stop:()=>setRunning(false), speed, setSpeed,
      orders, addOrder, notifications, compensations, signals, historyData,
      stats:{ activeCount:active.length, total:orders.length, lateRate:active.length?Math.round(late/active.length*100):0, lateCount:late, compTotal:compensations.reduce((s,c)=>s+c.value,0), delivered:orders.filter(o=>o.status==='delivered').length },
      chatMessages, sendChatMessage,
    }}>
      {children}
    </SimContext.Provider>
  );
}
