import React, { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const PROFILES = {
  customer: {
    name:'Divya Iyer', email:'divya@example.com', city:'Bengaluru',
    address:'Flat 4B, 12th Cross, Indiranagar', preference:'Non-vegetarian',
    phone:'+91 98765 43210', joinedDate:'March 2024', totalOrders:47,
    wallet:230, loyaltyPoints:840, lateOrdersReceived:6, compensationEarned:780,
    recentOrders:[
      {id:'ORD-4821',restaurant:'Meghana Foods',item:'Chicken Biryani',price:348,rating:4,date:'Today 1:15 PM'},
      {id:'ORD-4790',restaurant:'Truffles',item:'Butter Chicken + Naan',price:520,rating:5,date:'Yesterday 8:30 PM'},
      {id:'ORD-4751',restaurant:'Hotel Nandhana',item:'Paneer Tikka',price:280,rating:3,date:'28 Jun, 12:45 PM'},
      {id:'ORD-4720',restaurant:'Paradise Biryani',item:'Mutton Biryani',price:420,rating:4,date:'26 Jun, 7:00 PM'},
    ],
  },
  restaurant: {
    name:'Meghana Foods', ownerName:'Meghana Reddy', email:'meghana@meghanafoods.in',
    zone:'Koramangala', city:'Bengaluru', cuisine:'South Indian, Biryani',
    fssai:'10020022008171', prepTimeTarget:18, serviceType:'Delivery + Dine-in',
    joinedDate:'January 2023', rating:4.5,
    stats:{ordersToday:64,ordersThisWeek:412,lateRate:12,avgPrepTime:22,compensation:8200,revenue:124800},
    weeklyOrders:[
      {day:'Mon',orders:54,late:6},{day:'Tue',orders:61,late:7},{day:'Wed',orders:58,late:9},
      {day:'Thu',orders:72,late:8},{day:'Fri',orders:69,late:7},{day:'Sat',orders:88,late:14},{day:'Sun',orders:71,late:10},
    ],
    currentQueue:[
      {id:'ORD-4821',item:'Chicken Biryani x2',customer:'Divya Iyer',prepTime:22,status:'late'},
      {id:'ORD-4822',item:'Veg Thali',customer:'Rahul Verma',prepTime:15,status:'on_track'},
      {id:'ORD-4823',item:'Paneer Tikka + Naan',customer:'Swati Mishra',prepTime:18,status:'at_risk'},
      {id:'ORD-4824',item:'Dal Fry + Rice',customer:'Karan Bhatt',prepTime:10,status:'on_track'},
    ],
    benchmarks:{ownAccuracy:71,zoneAvg:78,top10:92,cityAvg:74},
  },
  partner: {
    name:'Arjun M.', email:'arjun@ondot.in', phone:'+91 90123 45678',
    zone:'Koramangala', city:'Bengaluru', vehicle:'Bike',
    licence:'KA-01-2021-0099', experience:'2 years',
    joinedDate:'February 2024', rating:4.9,
    stats:{ordersToday:18,ordersThisWeek:94,avgDeliveryTime:28,totalEarningsToday:1240,totalEarningsWeek:5820},
    zoneActivity:[
      {zone:'Koramangala',orders:42,pct:45},{zone:'Indiranagar',orders:24,pct:26},
      {zone:'HSR Layout',orders:18,pct:19},{zone:'BTM Layout',orders:10,pct:10},
    ],
    recentDeliveries:[
      {id:'ORD-4810',restaurant:'Meghana Foods',customer:'Divya Iyer',time:'28 min',earnings:72,status:'on_time'},
      {id:'ORD-4798',restaurant:'Truffles',customer:'Rahul Verma',time:'35 min',earnings:68,status:'late'},
      {id:'ORD-4782',restaurant:'Hotel Nandhana',customer:'Swati Mishra',time:'26 min',earnings:70,status:'on_time'},
      {id:'ORD-4771',restaurant:'Beijing Bites',customer:'Meera Joshi',time:'31 min',earnings:65,status:'on_time'},
    ],
    currentIncentive:{zone:'Whitefield',amount:15,reason:'High demand, low supply',expiresIn:42},
    weeklyEarnings:[
      {day:'Mon',earnings:820},{day:'Tue',earnings:760},{day:'Wed',earnings:910},
      {day:'Thu',earnings:1050},{day:'Fri',earnings:880},{day:'Sat',earnings:400},{day:'Sun',earnings:0},
    ],
  },
  admin: {
    name:'Ops Manager', email:'ops@ondot.in',
    department:'Operations', employeeId:'EMP-0042', accessLevel:'Full access',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const login = (role, name) => setUser({ role, name: name || PROFILES[role]?.name || 'User', profile: PROFILES[role] });
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
