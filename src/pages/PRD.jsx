import React, { useState } from 'react';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-2xl mb-4 overflow-hidden">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="font-bold text-gray-900">{title}</span>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-6 pb-6 pt-1">{children}</div>}
    </div>
  );
}

function KV({ label, value }) {
  return (
    <div className="py-1.5 flex gap-4 text-sm border-b border-gray-50 last:border-0">
      <span className="text-gray-400 w-40 flex-shrink-0">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function Tag({ color, children }) {
  const colors = {
    green: 'bg-green-50 text-green-700 border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${colors[color]||colors.gray}`}>{children}</span>;
}

export default function PRD() {
  return (
    <div className="max-w-[1000px] mx-auto px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-green-50 flex items-center justify-center text-xl">📋</div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Requirements Document</h1>
          <div className="flex items-center gap-2 mt-1">
            <Tag color="amber">Draft v1.0</Tag>
            <Tag color="blue">Pre-Discovery</Tag>
            <span className="text-xs text-gray-400">OnDot, Real-Time Delay Intelligence Platform</span>
          </div>
        </div>
      </div>

      <Section title="1. Product Overview">
        <KV label="Product Name" value="OnDot, Real-Time Delay Intelligence Platform" />
        <KV label="Version" value="1.0, MVP" />
        <KV label="Status" value="Draft for Accelerator Review" />
        <KV label="Author" value="S. Divyasree, AI and Data Science, DSU Tiruchirappalli" />
        <KV label="Target Platform" value="Swiggy (primary), any food delivery platform" />
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-800 mb-2">Problem Statement</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Customers placing food orders face unpredictable and poorly explained delivery delays. ETAs are shown as confident numbers but are only approximate estimates per Swiggy's own terms. Limited visibility into delay causes, no proactive updates, and reactive support flows erode customer trust and drive churn.
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-2">Solution Vision</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Build a predictive delay engine combining real-time weather, traffic, accident, peak-load, and partner-availability signals into a per-order risk score. Shift delivery management from reactive complaint handling to predictive prevention and transparent communication, with automatic recovery built in.
          </p>
        </div>
      </Section>

      <Section title="2. Goals and Success Metrics">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ['Reduce late delivery rate','-25% in 3 months'],
            ['Improve delivery NPS','+15 points'],
            ['Reduce support tickets','-40% "where is my order"'],
            ['Restaurant prep accuracy','85%+ within ETA range'],
          ].map(([t,v],i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-3.5">
              <div className="text-xs text-gray-500">{t}</div>
              <div className="text-lg font-bold text-gray-900 mt-0.5">{v}</div>
            </div>
          ))}
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100">
            <th className="pb-2 font-medium">Metric</th><th className="pb-2 font-medium">Owner</th>
            <th className="pb-2 font-medium text-right">Baseline</th><th className="pb-2 font-medium text-right">Target</th>
          </tr></thead>
          <tbody>
            {[
              ['Late Delivery Rate','Ops','~15-22%','< 10%'],
              ['Avg Delivery Time','Ops','38 min','32 min'],
              ['Customer NPS (Delivery)','Product','42','57'],
              ['Support Ticket Volume','Support','12K/day','7.2K/day'],
              ['Prep Time Accuracy','Restaurant','61%','85%'],
              ['Proactive Notification Rate','Product','0%','80%'],
              ['Auto-Compensation Rate','Finance','Manual','70% auto'],
            ].map(([k,o,from,to],i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-2 text-gray-700">{k}</td>
                <td className="py-2"><Tag color="gray">{o}</Tag></td>
                <td className="py-2 text-gray-400 text-right">{from}</td>
                <td className="py-2 text-green-600 font-semibold text-right">{to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="3. Target Users and Personas">
        {[
          { role:'Customer', emoji:'👤', needs:['Accurate honest ETAs that update in real time','Proactive delay alerts before they check the app','Fair automatic compensation, no need to ask'], pain:['ETA keeps changing with no explanation','Has to contact support to find order status','Feels ignored when order is 30+ minutes late'] },
          { role:'Restaurant Partner', emoji:'🍽️', needs:['Live kitchen queue with SLA risk flags','Feedback on how prep time affects platform rating','Demand forecast before peak hours'], pain:['No visibility into how delays affect Swiggy ranking','Overwhelmed during peak hours with no signal','Blamed for delays caused by platform routing'] },
          { role:'Delivery Rider', emoji:'🏍️', needs:['Reroute prompts before congestion builds','Fair order distribution across the zone','Visibility into restaurant prep status before arriving'], pain:['Sometimes arrives at restaurant before food is ready','Penalised for delays caused by kitchen or traffic','Uneven order load across zones'] },
          { role:'Ops Manager', emoji:'🛡️', needs:['Real-time view of all active orders and risk levels','Ability to intervene proactively, not reactively','Single dashboard across zones, restaurants, and riders'], pain:['No centralised view of delivery health','Learns about delays only from customer complaints','Manual compensation process is slow and inconsistent'] },
        ].map((p,i) => (
          <div key={i} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0 mb-2">
            <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><span>{p.emoji}</span>{p.role}</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><div className="text-green-600 font-semibold text-xs mb-1.5">NEEDS</div>{p.needs.map((n,j)=><div key={j} className="text-gray-600 text-xs mb-1">+ {n}</div>)}</div>
              <div><div className="text-red-500 font-semibold text-xs mb-1.5">PAIN POINTS</div>{p.pain.map((n,j)=><div key={j} className="text-gray-600 text-xs mb-1">- {n}</div>)}</div>
            </div>
          </div>
        ))}
      </Section>

      <Section title="4. Feature Specifications">
        {[
          { name:'PulsePredict', tag:'Core', desc:'ML risk engine combining weather, traffic, accident reports, peak-load, and partner availability into a per-order delay-risk score updated every 60 seconds.' },
          { name:'PulseNotify', tag:'Customer', desc:'Proactive in-app and push notification fired automatically once delay risk crosses 50%, with honest revised ETA and two-option resolution flow.' },
          { name:'PulseAlert', tag:'Operations', desc:'Live alerts to delivery riders (reroute suggestions) and restaurant kitchens (SLA risk flags) before delays cascade into the customer experience.' },
          { name:'Auto-Compensation', tag:'Finance', desc:'Tiered automatic recovery: free delivery at 15+ min delay, ₹100 wallet credit at 20+ min, ₹150 coupon at 30+ min. No customer action required.' },
          { name:'AI Support Chatbot', tag:'Customer', desc:'Instant natural-language answers to "where is my order" and "why is it late" using live order data and current signal conditions.' },
          { name:'Pre-Order Risk Badge', tag:'Customer', desc:'Green, amber, or red delay-risk indicator shown on restaurant listings before the customer places an order, based on current kitchen load and weather.' },
          { name:'Restaurant Scorecard', tag:'Operations', desc:'Per-restaurant prep accuracy benchmarked against zone average, city average, and top 10%, with actionable coaching insights.' },
          { name:'Zone Demand Forecast', tag:'Operations', desc:'30-minute demand forecast per zone to proactively position riders and trigger incentives before supply-demand gaps cause delays.' },
        ].map((f,i) => (
          <div key={i} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 mb-1">
            <div className="w-40 flex-shrink-0">
              <div className="text-sm font-semibold text-gray-900">{f.name}</div>
              <Tag color={f.tag==='Core'?'blue':f.tag==='Customer'?'green':f.tag==='Finance'?'amber':'gray'}>{f.tag}</Tag>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </Section>

      <Section title="5. System Architecture">
        <p className="text-sm text-gray-600 mb-4">OnDot sits as an intelligence layer on top of the delivery platform. It does not replace any existing infrastructure. It reads events via webhook, enriches them with external signals, and writes back decisions via the platform API.</p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-xs text-gray-700 mb-4 leading-loose">
          <div className="text-gray-400 mb-2">// Request flow</div>
          <div>Customer places order (Swiggy app)</div>
          <div className="ml-4 text-green-600">→ Swiggy webhook fires to OnDot ingestion service</div>
          <div className="ml-4">→ PulsePredict scores delay risk using:</div>
          <div className="ml-8 text-blue-600">• Google Maps API (traffic, route ETA)</div>
          <div className="ml-8 text-blue-600">• OpenWeatherMap API (rain, conditions)</div>
          <div className="ml-8 text-blue-600">• Internal signals (kitchen load, partner availability)</div>
          <div className="ml-4">→ Risk score stored in Redis (TTL: 90 seconds)</div>
          <div className="ml-4">→ If risk {">"} 50%: PulseNotify fires via Swiggy Push API</div>
          <div className="ml-4">→ If risk {">"} 75%: PulseAlert fires to rider app + kitchen display</div>
          <div className="ml-4 text-amber-600">→ If delay confirmed: Auto-Compensation rule engine triggers</div>
        </div>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100">
            <th className="pb-2 font-medium">Layer</th><th className="pb-2 font-medium">Technology</th><th className="pb-2 font-medium">Purpose</th>
          </tr></thead>
          <tbody>
            {[
              ['Ingestion','Webhook receiver (Node.js + Express)','Receives order lifecycle events from Swiggy'],
              ['Prediction','Python ML service (FastAPI)','Runs PulsePredict risk scoring model'],
              ['Cache','Redis','Stores live risk scores with 90-second TTL'],
              ['Database','PostgreSQL','Persists orders, signals, compensation records'],
              ['Notification','Swiggy Push API / FCM','Delivers PulseNotify alerts to customer app'],
              ['Frontend','React + Vite','Ops dashboard, restaurant tablet, rider panel'],
              ['Signal sources','Google Maps API, OpenWeatherMap','Real-time traffic and weather data'],
            ].map(([l,t,p],i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0">
                <td className="py-2 font-medium text-gray-900">{l}</td>
                <td className="py-2 text-gray-500 font-mono text-xs">{t}</td>
                <td className="py-2 text-gray-600">{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="6. Data Models">
        <div className="space-y-4">
          {[
            { name:'Order', fields:[
              ['id','string','ORD-4821'],['customer_id','uuid','FK to Users'],['restaurant_id','uuid','FK to Restaurants'],
              ['rider_id','uuid','FK to Riders, nullable'],['status','enum','confirmed, preparing, picked_up, on_the_way, delivered'],
              ['base_eta_min','integer','ML baseline ETA in minutes'],['delay_min','integer','Predicted additional delay'],
              ['risk_score','integer','0-100 from PulsePredict'],['risk_level','enum','low, medium, high, critical'],
              ['compensation_id','uuid','FK to Compensation, nullable'],['placed_at','timestamp','UTC'],
            ]},
            { name:'Signal', fields:[
              ['id','uuid','Primary key'],['captured_at','timestamp','UTC'],['weather_condition','enum','clear, light_rain, rain, heavy_rain'],
              ['rain_intensity_pct','integer','0-100'],['traffic_pct','integer','0-100, network-wide avg'],
              ['active_accidents','integer','Count on live delivery routes'],['peak_load_active','boolean','True during 12-2 PM and 7-9 PM'],
              ['avg_prep_time_min','float','Network-wide kitchen average'],['partner_availability_pct','integer','0-100'],
            ]},
            { name:'Compensation', fields:[
              ['id','uuid','Primary key'],['order_id','uuid','FK to Orders'],['customer_id','uuid','FK to Users'],
              ['type','enum','free_delivery, wallet_credit, coupon'],['value_inr','integer','0, 100, or 150'],
              ['trigger_delay_min','integer','Delay that triggered this'],['issued_at','timestamp','UTC'],
              ['redeemed','boolean','Default false'],
            ]},
          ].map(m => (
            <div key={m.name}>
              <div className="text-sm font-semibold text-gray-900 mb-2 font-mono">{m.name}</div>
              <table className="w-full text-xs mb-1">
                <thead><tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-1.5 font-medium">Field</th><th className="pb-1.5 font-medium">Type</th><th className="pb-1.5 font-medium">Notes</th>
                </tr></thead>
                <tbody>
                  {m.fields.map(([f,t,n],i) => (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-1.5 font-mono text-green-700">{f}</td>
                      <td className="py-1.5 text-blue-600 font-mono">{t}</td>
                      <td className="py-1.5 text-gray-500">{n}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </Section>

      <Section title="7. Roadmap and Phases">
        <div className="space-y-4">
          {[
            { phase:'Phase 0', time:'Month 1-2', title:'Foundation', color:'bg-gray-200 text-gray-700', items:['Rule-based prediction model v1','Webhook ingestion from Swiggy sandbox API','Internal ops dashboard (read-only)','Redis cache setup'] },
            { phase:'Phase 1', time:'Month 3-4', title:'Pilot', color:'bg-green-100 text-green-800', items:['Restaurant kitchen tablet app','Rider push notification alerts','3 cloud kitchen pilot (free tier)','First real delay data collected'] },
            { phase:'Phase 2', time:'Month 5-6', title:'Customer Layer', color:'bg-amber-100 text-amber-800', items:['PulseNotify customer flow live','A/B test notification copy','Auto-compensation engine','First paid client at Growth tier'] },
            { phase:'Phase 3', time:'Month 7-9', title:'ML Upgrade', color:'bg-blue-100 text-blue-800', items:['Replace rules with XGBoost model','Model retraining pipeline (weekly)','Accuracy dashboard for clients','Zone-level demand forecasting'] },
            { phase:'Phase 4', time:'Month 10-12', title:'Enterprise', color:'bg-purple-100 text-purple-800', items:['Enterprise API with SLA contract','Swiggy and Zomato pitch ready','Series A data room prepared','Multi-city expansion scoping'] },
          ].map(p => (
            <div key={p.phase} className="flex gap-4">
              <div className="flex-shrink-0 w-28">
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${p.color}`}>{p.phase}</span>
                <div className="text-xs text-gray-400 mt-1">{p.time}</div>
              </div>
              <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
                <div className="text-sm font-semibold text-gray-900 mb-1">{p.title}</div>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {p.items.map((item,i) => <li key={i}>+ {item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="8. Risks and Mitigations">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100">
            <th className="pb-2 font-medium">Risk</th><th className="pb-2 font-medium">Impact</th><th className="pb-2 font-medium">Mitigation</th>
          </tr></thead>
          <tbody>
            {[
              ['Platform API access denied by Swiggy','High','Build pilot using restaurant tablet app as standalone entry point. No API dependency for Phase 1.'],
              ['Prediction model inaccuracy in early months','Medium','Ship with wide confidence intervals. Never over-promise revised ETAs. Show "approx" labels.'],
              ['Low customer trust in proactive notifications','Medium','A/B test copy. Offer opt-out. Build trust through accuracy over first 90 days before scaling.'],
              ['Data privacy regulation (PDPB India)','High','No PII stored from day one. Anonymised signals only. Legal review before any enterprise contract.'],
              ['Platform builds this in-house after pilot','High','Contract IP clauses on delivery. Build data moat (90+ days of signal history) that is hard to replicate quickly.'],
              ['Rider or restaurant adoption resistance','Medium','Free tier with zero friction. Tablet app needs no app install. Push alerts are passive, not mandatory.'],
            ].map(([r,i,m],idx) => (
              <tr key={idx} className="border-b border-gray-50 last:border-0">
                <td className="py-2.5 text-gray-800 font-medium w-56">{r}</td>
                <td className="py-2.5 w-16"><Tag color={i==='High'?'red':'amber'}>{i}</Tag></td>
                <td className="py-2.5 text-gray-600">{m}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="9. Wireframes and UI Mockups">
        <p className="text-sm text-gray-600 mb-4">This prototype serves as the interactive wireframe. Each tab in the navigation above corresponds to a screen described here.</p>
        <div className="space-y-3">
          {[
            { screen:'Ops Dashboard', desc:'Live zone scatter heatmap (bubble size = order count, color = risk level), stat cards for active orders, late rate, avg delivery, and compensation, live alert feed, and order feed with per-order risk scores.' },
            { screen:'Customer App', desc:'Mobile phone frame with gradient header (green on-time, amber-to-red delayed), order progress stepper, risk assessment bar, delay cause breakdown, compensation confirmation card, and floating AI support chatbot.' },
            { screen:'Restaurant Panel', desc:'Per-restaurant header with real-time delay-risk badge, stat cards, 7-day order and late rate bar chart, performance benchmarks vs zone and city, live kitchen queue with Late/At Risk/On Track status, and coaching insight card.' },
            { screen:'Rider Panel', desc:'Personal earnings and order stats for partner role, zone pie chart showing where most orders are taken, weekly earnings bar chart, zone demand-supply bars for admin role, and active incentive zone cards.' },
            { screen:'ML Prediction', desc:'Circular risk gauge with live network risk percentage, radar chart across five signal categories, signal contribution bar breakdown, risk score history area chart, and per-order prediction table.' },
            { screen:'Live Signals', desc:'Six signal cards for weather, traffic, accidents, peak load, kitchen prep time, and partner availability, each with a live bar, badge, and plain-English interpretation.' },
            { screen:'Notifications', desc:'Custom SMS/push sender form, chronological notification feed with delay context, stat panel (total sent, SMS, push, in-app), and a three-step explanation of the notification flow.' },
            { screen:'Offers', desc:'Three auto-compensation rule cards (free delivery, wallet credit, coupon), stat cards for total issued and ROI impact, and a live feed of all issued compensation with order and customer context.' },
            { screen:'Analytics', desc:'Late rate 7-day area chart, compensation cost line chart, live risk distribution pie chart, zone volume horizontal bar chart, and four KPI delta cards.' },
            { screen:'Restaurant Scorecard', desc:'Sortable table of all partner restaurants with prep accuracy bar, orders, late count, customer rating, and status badge (Excellent, Needs Improvement, At Risk).' },
            { screen:'PRD', desc:'This document. Collapsible sections, interactive tables, code-style architecture diagram, data model schemas, and full risk and roadmap detail. Updates live as the product evolves.' },
          ].map((w,i) => (
            <div key={i} className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-sm font-semibold text-gray-900 w-48 flex-shrink-0">{w.screen}</span>
              <span className="text-sm text-gray-600">{w.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="10. Out of Scope (v1.0)" defaultOpen={false}>
        <ul className="text-sm text-gray-600 space-y-1.5">
          {[
            'Payment gateway and refund processing backend',
            'Native iOS or Android builds (web prototype only for MVP)',
            'Production-grade trained ML model (v1 uses a transparent weighted formula for demonstration)',
            'Real third-party API integration (weather, maps, accident feeds are simulated in this prototype)',
            'Multi-language support beyond English',
            'B2C consumer product, OnDot is a B2B integration layer',
          ].map((item,i) => <li key={i} className="flex items-start gap-2"><span className="text-gray-400 mt-0.5">-</span>{item}</li>)}
        </ul>
      </Section>
    </div>
  );
}
