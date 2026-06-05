import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════
   STRIDE — The Future of Athletic Intelligence
   Powered by ARIA · Built for Champions
═══════════════════════════════════════════════════════════════════ */

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Exo+2:ital,wght@0,200;0,300;0,400;0,600;0,700;1,300&family=JetBrains+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --void:       #020408;
    --deep:       #040810;
    --surface:    #080F1A;
    --card:       #0A1628;
    --card2:      #0D1C32;
    --border:     rgba(0,180,255,0.1);
    --border2:    rgba(0,180,255,0.2);
    --electric:   #00B4FF;
    --cyan:       #00FFE5;
    --neon:       #AAFF00;
    --plasma:     #FF4D8D;
    --gold:       #FFB800;
    --muted:      rgba(180,220,255,0.4);
    --text:       #E8F4FF;
    --text2:      rgba(232,244,255,0.7);
    --font-head:  'Orbitron', sans-serif;
    --font-body:  'Exo 2', sans-serif;
    --font-mono:  'JetBrains Mono', monospace;
    --r:          10px;
    --r-lg:       18px;
    --r-xl:       24px;
  }

  html, body, #root {
    height: 100%;
    background: var(--void);
    color: var(--text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--electric); border-radius: 1px; }

  input, textarea, select {
    background: rgba(0,180,255,0.05);
    border: 1px solid var(--border2);
    border-radius: var(--r);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    width: 100%;
    transition: border-color .2s, box-shadow .2s;
  }
  input:focus, textarea:focus, select:focus {
    border-color: var(--electric);
    box-shadow: 0 0 0 3px rgba(0,180,255,0.1);
  }
  input::placeholder, textarea::placeholder { color: var(--muted); }
  select option { background: var(--card); }

  @keyframes fadeUp    { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn   { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse     { 0%,100%{opacity:1;} 50%{opacity:.3;} }
  @keyframes glow-e    { 0%,100%{box-shadow:0 0 10px rgba(0,180,255,.3);} 50%{box-shadow:0 0 30px rgba(0,180,255,.7), 0 0 60px rgba(0,180,255,.3);} }
  @keyframes glow-c    { 0%,100%{box-shadow:0 0 10px rgba(0,255,229,.2);} 50%{box-shadow:0 0 25px rgba(0,255,229,.6);} }
  @keyframes glow-n    { 0%,100%{box-shadow:0 0 8px rgba(170,255,0,.2);} 50%{box-shadow:0 0 20px rgba(170,255,0,.5);} }
  @keyframes rotate    { to { transform: rotate(360deg); } }
  @keyframes scanline  { 0%{top:-20%;} 100%{top:110%;} }
  @keyframes float     { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }
  @keyframes ripple    { 0%{transform:scale(1);opacity:.6;} 100%{transform:scale(2.5);opacity:0;} }
  @keyframes shimmer   { 0%{background-position:-200% center;} 100%{background-position:200% center;} }
  @keyframes blink     { 0%,100%{opacity:1;} 50%{opacity:0;} }
  @keyframes countUp   { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }

  .stagger-1 { animation-delay: .05s !important; }
  .stagger-2 { animation-delay: .1s !important; }
  .stagger-3 { animation-delay: .15s !important; }
  .stagger-4 { animation-delay: .2s !important; }
  .stagger-5 { animation-delay: .25s !important; }
`;

/* ── DESIGN TOKENS ─────────────────────────────────────────────── */
const C = {
  electric: "#00B4FF",
  cyan:     "#00FFE5",
  neon:     "#AAFF00",
  plasma:   "#FF4D8D",
  gold:     "#FFB800",
  muted:    "rgba(180,220,255,0.4)",
};

/* ── ATOMIC COMPONENTS ─────────────────────────────────────────── */

const GlowDot = ({ color = C.electric, size = 8, pulse = false }) => (
  <span style={{
    display:"inline-block", width:size, height:size, borderRadius:"50%",
    background:color, flexShrink:0,
    boxShadow:`0 0 ${size*1.5}px ${color}`,
    animation: pulse ? "pulse 2s ease-in-out infinite" : "none"
  }}/>
);

const Chip = ({ children, color = C.electric, glow = false }) => (
  <span style={{
    fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".12em",
    padding:"3px 8px", borderRadius:4,
    border:`1px solid ${color}40`, color,
    background:`${color}10`, textTransform:"uppercase",
    animation: glow ? "glow-e 2s ease infinite" : "none"
  }}>{children}</span>
);

const Panel = ({ children, style={}, glow=false, accent=false }) => (
  <div style={{
    background: accent
      ? `linear-gradient(135deg, rgba(0,180,255,0.08) 0%, rgba(0,255,229,0.04) 100%)`
      : "var(--card)",
    border: `1px solid ${glow ? "rgba(0,180,255,0.3)" : "var(--border)"}`,
    borderRadius:"var(--r-lg)",
    padding:"18px",
    position:"relative",
    overflow:"hidden",
    animation: glow ? "glow-e 3s ease infinite" : "none",
    ...style
  }}>
    {glow && <div style={{
      position:"absolute", top:0, left:0, right:0, height:1,
      background:"linear-gradient(90deg, transparent, var(--electric), transparent)"
    }}/>}
    {children}
  </div>
);

const CyberBtn = ({ children, onClick, variant="primary", style={}, disabled=false, size="md" }) => {
  const sizes = { sm:{padding:"7px 14px",fontSize:11}, md:{padding:"11px 22px",fontSize:12}, lg:{padding:"14px 28px",fontSize:13} };
  const variants = {
    primary: { background:"linear-gradient(135deg, #00B4FF, #0080CC)", color:"#fff", border:"none" },
    cyan:    { background:"linear-gradient(135deg, #00FFE5, #00B4AA)", color:"#020408", border:"none" },
    neon:    { background:"linear-gradient(135deg, #AAFF00, #77CC00)", color:"#020408", border:"none" },
    plasma:  { background:"linear-gradient(135deg, #FF4D8D, #CC2266)", color:"#fff", border:"none" },
    ghost:   { background:"transparent", color:"var(--electric)", border:"1px solid var(--border2)" },
    subtle:  { background:"rgba(0,180,255,0.07)", color:"var(--muted)", border:"1px solid var(--border)" },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily:"var(--font-head)", fontWeight:700, letterSpacing:".08em", textTransform:"uppercase",
      borderRadius:8, cursor:disabled?"not-allowed":"pointer",
      opacity:disabled?.5:1, transition:"all .2s",
      display:"inline-flex", alignItems:"center", gap:8,
      ...sizes[size], ...variants[variant], ...style
    }}
      onMouseEnter={e=>{ if(!disabled){ e.currentTarget.style.transform="translateY(-1px)"; e.currentTarget.style.filter="brightness(1.15)"; }}}
      onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.filter="brightness(1)"; }}
    >{children}</button>
  );
};

/* ── SVG ICONS ─────────────────────────────────────────────────── */
const Ico = ({ n, s=18, c="currentColor" }) => {
  const d = {
    home:    "M3 12L12 3l9 9M5 10v9h5v-5h4v5h5v-9",
    bolt:    "M13 2L3 14h9l-1 8 10-12h-9z",
    chart:   "M3 3v18h18M7 16l4-4 4 4 4-4",
    run:     "M5 16l3-5 3 3 3-4 3 3M13 4a1 1 0 100-2 1 1 0 000 2z",
    user:    "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
    send:    "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
    heart:   "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    target:  "M12 22a10 10 0 100-20 10 10 0 000 20zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z",
    clock:   "M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
    medal:   "M12 15a7 7 0 100-14 7 7 0 000 14zM8.21 13.89L7 23l5-3 5 3-1.21-9.12",
    plus:    "M12 5v14M5 12h14",
    trash:   "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
    edit:    "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    refresh: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15",
    check:   "M20 6L9 17l-5-5",
    zap:     "M13 2L3 14h9l-1 8 10-12h-9z",
    brain:   "M12 2a4 4 0 014 4c2 0 4 1.5 4 4a4 4 0 01-2 3.46V18a2 2 0 01-2 2H8a2 2 0 01-2-2v-4.54A4 4 0 014 10c0-2.5 2-4 4-4a4 4 0 014-4z",
    shield:  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    apple:   "M12 3C8 3 5 7 5 12s3 9 7 9 7-4 7-9-3-9-7-9zM9 12a3 3 0 016 0",
    fire:    "M12 2s-5 5-5 10a5 5 0 0010 0C17 7 12 2 12 2z",
    star:    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    trophy:  "M6 9H2V3h4M18 9h4V3h-4M12 17v4M8 21h8M12 17a5 5 0 005-5V3H7v9a5 5 0 005 5z",
    moon:    "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    drop:    "M12 2.69l5.66 5.66a8 8 0 11-11.31 0z",
    wave:    "M2 12s2-6 5-6 4 6 7 6 5-6 8-6",
    dna:     "M2 12h4M18 12h4M6 12c0-3 2-5 6-5s6 2 6 5M6 12c0 3 2 5 6 5s6-2 6-5",
    warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
    info:    "M12 22a10 10 0 100-20 10 10 0 000 20zM12 8v4M12 16h.01",
    food:    "M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8zM6 1v3M10 1v3M14 1v3",
    bed:     "M2 4v16M2 8h18a2 2 0 012 2v10M2 16h20",
    social:  "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    settings:"M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d={d[n]||d.bolt}/>
    </svg>
  );
};

/* ── RADIAL GAUGE ──────────────────────────────────────────────── */
const Gauge = ({ value, max=100, label, sublabel, color=C.electric, size=90, showPct=true }) => {
  const r = (size-12)/2, circ = 2*Math.PI*r;
  const pct = Math.min(value/max,1);
  const trackColor = "rgba(255,255,255,0.05)";
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <svg width={size} height={size} style={{overflow:"visible"}}>
        <defs>
          <filter id={`gf-${label}`}>
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={6}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
          filter={`url(#gf-${label})`} style={{transition:"stroke-dashoffset 1s ease"}}/>
        {showPct && (
          <text x={size/2} y={size/2+5} textAnchor="middle"
            style={{fontFamily:"var(--font-head)",fontSize:14,fill:"var(--text)",fontWeight:700}}>
            {Math.round(pct*100)}
          </text>
        )}
        {!showPct && (
          <text x={size/2} y={size/2+5} textAnchor="middle"
            style={{fontFamily:"var(--font-head)",fontSize:14,fill:color,fontWeight:700}}>
            {value}
          </text>
        )}
      </svg>
      <span style={{fontFamily:"var(--font-mono)",fontSize:9,color,letterSpacing:".1em",textTransform:"uppercase"}}>{label}</span>
      {sublabel && <span style={{fontFamily:"var(--font-mono)",fontSize:8,color:"var(--muted)"}}>{sublabel}</span>}
    </div>
  );
};

/* ── SPARKLINE ─────────────────────────────────────────────────── */
const Spark = ({ data, color=C.electric, w=100, h=36, fill=true }) => {
  if (!data?.length) return null;
  const min=Math.min(...data), max=Math.max(...data), range=max-min||1;
  const pts = data.map((v,i)=>{
    const x=(i/(data.length-1))*w;
    const y=h-((v-min)/range)*(h-6)-3;
    return `${x},${y}`;
  });
  const linePts = pts.join(" ");
  const fillPts = `0,${h} ${linePts} ${w},${h}`;
  return (
    <svg width={w} height={h} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {fill && <polygon points={fillPts} fill={`url(#sg-${color.replace('#','')})`}/>}
      <polyline points={linePts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round"/>
      <circle cx={pts[pts.length-1].split(",")[0]} cy={pts[pts.length-1].split(",")[1]}
        r={3} fill={color} style={{filter:`drop-shadow(0 0 4px ${color})`}}/>
    </svg>
  );
};

/* ── BAR CHART ─────────────────────────────────────────────────── */
const BarChart = ({ data, labels, color=C.electric, h=80 }) => {
  const max = Math.max(...data)||1;
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:4,height:h}}>
      {data.map((v,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
          <div style={{
            width:"100%", height:`${(v/max)*h*0.85}px`,
            background:`linear-gradient(to top, ${color}CC, ${color}40)`,
            borderRadius:"3px 3px 0 0", minHeight:3,
            boxShadow:`0 0 8px ${color}40`,
            transition:"height .6s ease"
          }}/>
          {labels && <span style={{fontFamily:"var(--font-mono)",fontSize:8,color:"var(--muted)"}}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
};

/* ── SCORE RING ─────────────────────────────────────────────────── */
const ScoreRing = ({ score, label, color, size=70 }) => {
  const colors = {
    high:   C.cyan,
    medium: C.gold,
    low:    C.plasma,
  };
  const c = color || (score>=70?colors.high:score>=40?colors.medium:colors.low);
  return <Gauge value={score} max={100} label={label} color={c} size={size} />;
};

/* ══════════════════════════════════════════════════════════════════
   DATA & STATE
══════════════════════════════════════════════════════════════════ */

const PROFILE = {
  name:"Jérémy", age:34, level:"Compétiteur",
  club:"Team Cardio Apéro", city:"Corbeil-Essonnes",
  weight:72, height:178, restHR:52, maxHR:188, vo2max:54,
  goal:"Semi-marathon < 1h45", weeklyKm:55,
  tier:"Or", xp:8420, xpNext:10000,
};

const SESSIONS = [
  {id:1,date:"2026-06-02",type:"EF",dist:12.4,dur:75,pace:"6:03",hr:138,feel:4,kcal:620,notes:"Sortie tranquille, jambes légères"},
  {id:2,date:"2026-06-04",type:"Fractionné",dist:8.2,dur:52,pace:"4:45",hr:172,feel:3,kcal:510,notes:"4×1000m — 3ème répétition difficile"},
  {id:3,date:"2026-06-01",type:"Long",dist:18,dur:112,pace:"6:13",hr:145,feel:5,kcal:940,notes:"Sortie dominicale parfaite"},
  {id:4,date:"2026-05-30",type:"Récup",dist:6,dur:42,pace:"7:00",hr:128,feel:4,kcal:290,notes:""},
  {id:5,date:"2026-05-28",type:"Tempo",dist:10,dur:58,pace:"5:48",hr:165,feel:3,kcal:580,notes:"Vent de face sur le retour"},
  {id:6,date:"2026-05-25",type:"Long",dist:20,dur:128,pace:"6:24",hr:148,feel:4,kcal:1050,notes:""},
  {id:7,date:"2026-05-22",type:"VMA",dist:7,dur:45,pace:"4:32",hr:181,feel:2,kcal:440,notes:"Épuisant mais efficace"},
];

const TYPE_CFG = {
  EF:         {color:C.cyan,   label:"Endurance Fondamentale"},
  Fractionné: {color:C.plasma, label:"Fractionné"},
  Long:       {color:C.electric,label:"Sortie Longue"},
  Récup:      {color:C.muted,  label:"Récupération"},
  Tempo:      {color:"#A78BFA",label:"Tempo"},
  VMA:        {color:C.gold,   label:"VMA"},
  Côtes:      {color:C.neon,   label:"Côtes"},
};

const BADGES = [
  {id:1,name:"Premier 10km",icon:"medal",color:C.gold,earned:true},
  {id:2,name:"Régularité",icon:"fire",color:C.plasma,earned:true},
  {id:3,name:"Night Runner",icon:"moon",color:C.electric,earned:true},
  {id:4,name:"Semi-Finisher",icon:"trophy",color:C.cyan,earned:false},
  {id:5,name:"Centurion",icon:"shield",color:C.neon,earned:false},
  {id:6,name:"VO2 Legend",icon:"zap",color:C.gold,earned:false},
];

const WEEK_KM   = [38,42,50,47,55,48,55];
const WEEK_DAYS = ["L","M","M","J","V","S","D"];
const PACE_DATA = [6.1,5.95,5.8,6.0,5.75,5.85,5.52];
const HR_DATA   = [145,148,155,142,158,150,145];

/* ══════════════════════════════════════════════════════════════════
   SPLASH SCREEN
══════════════════════════════════════════════════════════════════ */
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);
  useEffect(()=>{
    const t1 = setTimeout(()=>setPhase(1), 600);
    const t2 = setTimeout(()=>setPhase(2), 1400);
    const t3 = setTimeout(()=>onDone(), 2600);
    return ()=>{ clearTimeout(t1);clearTimeout(t2);clearTimeout(t3); };
  },[]);
  return (
    <div style={{
      position:"fixed", inset:0, background:"var(--void)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      zIndex:9999, gap:20
    }}>
      {/* Animated rings */}
      <div style={{position:"relative",width:120,height:120,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{
            position:"absolute", borderRadius:"50%",
            width:120-i*28, height:120-i*28,
            border:`1px solid ${[C.electric,C.cyan,C.neon][i]}${["60","40","20"][i]}`,
            animation:`rotate ${3+i}s linear infinite ${i%2===0?"":"reverse"}`,
          }}/>
        ))}
        <div style={{
          width:52, height:52, borderRadius:"50%",
          background:`linear-gradient(135deg, ${C.electric}, ${C.cyan})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:`0 0 40px ${C.electric}80`
        }}>
          <Ico n="bolt" s={24} c="#020408"/>
        </div>
      </div>
      <div style={{textAlign:"center", opacity:phase>=1?1:0, transition:"opacity .6s"}}>
        <div style={{
          fontFamily:"var(--font-head)", fontSize:36, fontWeight:900,
          letterSpacing:".15em",
          background:`linear-gradient(90deg, ${C.electric}, ${C.cyan}, ${C.neon})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>STRIDE</div>
        <div style={{
          fontFamily:"var(--font-mono)", fontSize:11, color:"var(--muted)",
          letterSpacing:".2em", marginTop:4, opacity:phase>=2?1:0, transition:"opacity .6s"
        }}>PROPULSÉ PAR ARIA</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════════ */
function Dashboard({ sessions, profile }) {
  const totalKm = sessions.reduce((s,x)=>s+x.dist,0);
  const totalCal = sessions.reduce((s,x)=>s+(x.kcal||0),0);
  const injuryRisk = 28;
  const formScore = 82;
  const recovScore = 74;
  const fatigScore = 31;
  const sleepScore = 87;

  return (
    <div style={{animation:"fadeUp .5s ease both"}}>

      {/* Header */}
      <div style={{marginBottom:20,position:"relative"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
          <GlowDot color={C.neon} size={7} pulse/>
          <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:C.neon,letterSpacing:".15em",textTransform:"uppercase"}}>Système actif</span>
        </div>
        <h1 style={{fontFamily:"var(--font-head)",fontSize:24,fontWeight:900,letterSpacing:"-.01em",lineHeight:1.1}}>
          Bienvenue,<br/>
          <span style={{
            background:`linear-gradient(90deg, ${C.electric}, ${C.cyan})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent"
          }}>{profile.name}</span>
        </h1>
        <p style={{color:"var(--muted)",fontSize:13,marginTop:6,fontFamily:"var(--font-body)"}}>
          {new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}
        </p>
      </div>

      {/* ARIA Message du jour */}
      <Panel glow accent style={{marginBottom:14}}>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,overflow:"hidden",borderRadius:"var(--r-lg)",pointerEvents:"none"}}>
          <div style={{position:"absolute",top:"-10%",width:"60%",height:2,background:`linear-gradient(90deg, transparent, ${C.electric}60, transparent)`,animation:"scanline 4s linear infinite"}}/>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"flex-start",position:"relative"}}>
          <div style={{
            width:38,height:38,borderRadius:"50%",flexShrink:0,
            background:`linear-gradient(135deg, ${C.electric}, ${C.cyan})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 0 20px ${C.electric}60`
          }}>
            <Ico n="brain" s={16} c="#020408"/>
          </div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontFamily:"var(--font-head)",fontSize:11,color:C.electric,letterSpacing:".1em"}}>ARIA</span>
              <GlowDot color={C.neon} size={5} pulse/>
              <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)"}}>Coach IA Personnel</span>
            </div>
            <p style={{fontSize:13,color:"var(--text2)",lineHeight:1.6,fontFamily:"var(--font-body)"}}>
              Salut <strong style={{color:"var(--text)"}}>{profile.name}</strong> — ta récupération est excellente aujourd'hui. 
              Ton score de forme est à <strong style={{color:C.cyan}}>{formScore}/100</strong>. 
              Une séance de seuil serait idéale ce soir. Tu es à <strong style={{color:C.neon}}>68%</strong> de ta préparation semi-marathon. Continue !
            </p>
          </div>
        </div>
      </Panel>

      {/* Scores vitaux */}
      <Panel style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase"}}>Scores vitaux</span>
          <Chip color={C.neon}>EN DIRECT</Chip>
        </div>
        <div style={{display:"flex",justifyContent:"space-around"}}>
          <ScoreRing score={formScore} label="Forme" size={72}/>
          <ScoreRing score={recovScore} label="Récup" size={72}/>
          <ScoreRing score={sleepScore} label="Sommeil" size={72}/>
          <ScoreRing score={fatigScore} label="Fatigue" color={fatigScore<40?C.neon:C.plasma} size={72}/>
        </div>
      </Panel>

      {/* Stats rapides */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
        {[
          {label:"Volume total",val:totalKm.toFixed(1),unit:"km",icon:"run",color:C.electric,spark:WEEK_KM,delta:"+8%"},
          {label:"VO₂ Max",val:profile.vo2max,unit:"ml/kg/min",icon:"zap",color:C.cyan,delta:"+2"},
          {label:"Calories",val:(totalCal/1000).toFixed(1)+"k",unit:"kcal",icon:"fire",color:C.plasma,delta:"+5%"},
          {label:"FC repos",val:profile.restHR,unit:"bpm",icon:"heart",color:C.gold,delta:"-3"},
        ].map((s,i)=>(
          <Panel key={i} style={{padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{background:`${s.color}15`,borderRadius:8,padding:7}}>
                <Ico n={s.icon} s={14} c={s.color}/>
              </div>
              {s.delta && <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:s.delta.startsWith("+")?C.neon:C.plasma}}>{s.delta}</span>}
            </div>
            <div style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:800,color:"var(--text)",marginBottom:2}}>{s.val}</div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em"}}>{s.unit}</div>
            {s.spark && <div style={{marginTop:8}}><Spark data={s.spark} color={s.color} w={100} h={28}/></div>}
          </Panel>
        ))}
      </div>

      {/* Injury Risk */}
      <Panel style={{marginBottom:14,border:`1px solid ${injuryRisk<40?"rgba(0,255,229,.2)":"rgba(255,77,141,.3)"}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Ico n="shield" s={16} c={injuryRisk<40?C.cyan:C.plasma}/>
            <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase"}}>Injury Risk Score</span>
          </div>
          <Chip color={injuryRisk<40?C.cyan:C.plasma}>{injuryRisk<40?"Faible":"Modéré"}</Chip>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{fontFamily:"var(--font-head)",fontSize:36,fontWeight:900,color:injuryRisk<40?C.cyan:C.plasma}}>{injuryRisk}</div>
          <div style={{flex:1}}>
            <div style={{height:6,background:"rgba(255,255,255,.06)",borderRadius:3,overflow:"hidden"}}>
              <div style={{
                height:"100%", width:`${injuryRisk}%`,
                background:`linear-gradient(90deg, ${C.cyan}, ${injuryRisk>60?C.plasma:C.cyan})`,
                borderRadius:3, transition:"width 1s ease",
                boxShadow:`0 0 10px ${C.cyan}60`
              }}/>
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginTop:4}}>Sur 100 · Risque {injuryRisk<40?"faible":injuryRisk<70?"modéré":"élevé"}</div>
          </div>
        </div>
      </Panel>

      {/* Volume semaine */}
      <Panel style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase"}}>Volume hebdomadaire</span>
          <span style={{fontFamily:"var(--font-head)",fontSize:13,color:C.electric}}>55 km</span>
        </div>
        <BarChart data={WEEK_KM} labels={WEEK_DAYS} color={C.electric} h={64}/>
      </Panel>

      {/* Objectif */}
      <Panel accent style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <Chip color={C.gold}>Objectif actif</Chip>
            <p style={{fontFamily:"var(--font-head)",fontSize:15,fontWeight:700,marginTop:6}}>{profile.goal}</p>
          </div>
          <Gauge value={68} max={100} label="Prépa" color={C.neon} size={64}/>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["7","sem. restantes",C.electric],["4","séances/sem",C.cyan],["55","km/sem",C.neon]].map(([v,l,c])=>(
            <div key={l} style={{flex:1,background:`${c}08`,border:`1px solid ${c}20`,borderRadius:8,padding:"8px 10px",textAlign:"center",minWidth:60}}>
              <div style={{fontFamily:"var(--font-head)",fontSize:18,fontWeight:800,color:c}}>{v}</div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:8,color:"var(--muted)",textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Dernières séances */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <span style={{fontFamily:"var(--font-head)",fontSize:14,fontWeight:700,letterSpacing:".05em"}}>Activité récente</span>
        <Chip color={C.muted}>{sessions.length} séances</Chip>
      </div>
      {sessions.slice(0,3).map((s,i)=>(
        <SessionCard key={s.id} session={s} style={{animationDelay:`${i*.08}s`}}/>
      ))}

      {/* Badges */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,marginTop:4}}>
        <span style={{fontFamily:"var(--font-head)",fontSize:14,fontWeight:700,letterSpacing:".05em"}}>Badges</span>
      </div>
      <Panel>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
          {BADGES.map(b=>(
            <div key={b.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,opacity:b.earned?1:.3}}>
              <div style={{
                width:38,height:38,borderRadius:10,
                background:b.earned?`${b.color}20`:"rgba(255,255,255,.03)",
                border:`1px solid ${b.earned?b.color+"40":"rgba(255,255,255,.05)"}`,
                display:"flex",alignItems:"center",justifyContent:"center",
                boxShadow:b.earned?`0 0 12px ${b.color}30`:"none"
              }}>
                <Ico n={b.icon} s={16} c={b.earned?b.color:"var(--muted)"}/>
              </div>
              <span style={{fontFamily:"var(--font-mono)",fontSize:7,color:b.earned?b.color:"var(--muted)",textAlign:"center",letterSpacing:".04em",lineHeight:1.2}}>{b.name}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ── SESSION CARD ───────────────────────────────────────────────── */
function SessionCard({ session, onDelete, style:extraStyle={} }) {
  const cfg = TYPE_CFG[session.type]||{color:C.electric};
  return (
    <div style={{
      display:"flex",alignItems:"center",gap:12,
      padding:"12px 14px",marginBottom:8,
      background:"var(--card)",borderRadius:12,
      border:`1px solid var(--border)`,
      borderLeft:`3px solid ${cfg.color}`,
      animation:"fadeUp .35s ease both",
      transition:"border-color .2s",
      ...extraStyle
    }}
      onMouseEnter={e=>e.currentTarget.style.borderColor=`${cfg.color}50`}
      onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}
    >
      <div style={{background:`${cfg.color}15`,borderRadius:8,padding:8,flexShrink:0}}>
        <Ico n="run" s={14} c={cfg.color}/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
          <span style={{fontFamily:"var(--font-head)",fontSize:12,fontWeight:700,color:"var(--text)"}}>{session.type}</span>
          <Chip color={cfg.color}>{session.dist} km</Chip>
        </div>
        <div style={{display:"flex",gap:10,fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)"}}>
          <span>{session.pace}/km</span>
          <span>FC {session.hr}</span>
          <span>{session.dur}min</span>
        </div>
        <div style={{fontFamily:"var(--font-mono)",fontSize:9,color:"rgba(180,220,255,.25)",marginTop:2}}>{session.date}</div>
      </div>
      <div style={{display:"flex",gap:1}}>
        {[1,2,3,4,5].map(n=>(
          <span key={n} style={{fontSize:9,color:session.feel>=n?C.gold:"rgba(255,255,255,.1)"}}>★</span>
        ))}
      </div>
      {onDelete && (
        <button onClick={()=>onDelete(session.id)} style={{background:"transparent",border:"none",cursor:"pointer",padding:4,color:"var(--muted)"}}>
          <Ico n="trash" s={13} c={C.plasma}/>
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   JOURNAL
══════════════════════════════════════════════════════════════════ */
function Journal({ sessions, setSessions, apiKey }) {
  const [adding, setAdding] = useState(false);
  const [analyzing, setAnalyzing] = useState(null);
  const [analysis, setAnalysis] = useState({});
  const [form, setForm] = useState({
    date:new Date().toISOString().slice(0,10),
    type:"EF",dist:"",dur:"",pace:"",hr:"",feel:3,kcal:"",notes:""
  });

  const lbl = {fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:5,display:"block"};

  const handleAdd = () => {
    if(!form.dist||!form.dur) return;
    const s = {...form,id:Date.now(),dist:parseFloat(form.dist),dur:parseInt(form.dur),hr:parseInt(form.hr)||150,kcal:parseInt(form.kcal)||Math.round(parseFloat(form.dist)*50)};
    setSessions(p=>[s,...p]);
    setAdding(false);
    setForm({date:new Date().toISOString().slice(0,10),type:"EF",dist:"",dur:"",pace:"",hr:"",feel:3,kcal:"",notes:""});
  };

  const analyzeSession = async (session) => {
    if(analysis[session.id]) return;
    setAnalyzing(session.id);
    try {
      const GEMINI_KEY = apiKey;
      const prompt = `Tu es ARIA, coach running IA. Analyse cette séance et génère un rapport en JSON strict (sans backticks ni markdown) avec ces champs : {"summary":"string","positives":["string"],"improvements":["string"],"recovery":"string","nextSession":"string","intensityZone":"string","effortScore":number}. Max 40 mots par champ. Séance : ${session.type} · ${session.dist}km · ${session.dur}min · Allure ${session.pace}/km · FC moy ${session.hr}bpm · Ressenti ${session.feel}/5 · Notes: ${session.notes||"aucune"}`;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({contents:[{role:"user",parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:600}})
      });
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text||"{}";
      const clean = text.replace(/```json?|```/g,"").trim();
      setAnalysis(p=>({...p,[session.id]:JSON.parse(clean)}));
    } catch {
      setAnalysis(p=>({...p,[session.id]:{summary:"Analyse temporairement indisponible.",positives:[],improvements:[],recovery:"Repos 24h recommandé.",nextSession:"Voir ton plan."}}));
    }
    setAnalyzing(null);
  };

  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,letterSpacing:".05em"}}>Journal</h1>
          <p style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:".08em"}}>{sessions.length} SÉANCES ENREGISTRÉES</p>
        </div>
        <CyberBtn onClick={()=>setAdding(a=>!a)} variant={adding?"ghost":"primary"} size="sm">
          <Ico n={adding?"check":"plus"} s={13}/> {adding?"Annuler":"Ajouter"}
        </CyberBtn>
      </div>

      {adding && (
        <Panel glow style={{marginBottom:16,animation:"fadeUp .25s ease both"}}>
          <p style={{fontFamily:"var(--font-head)",fontSize:13,fontWeight:700,color:C.electric,marginBottom:14,letterSpacing:".08em"}}>NOUVELLE SÉANCE</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/></div>
            <div>
              <label style={lbl}>Type</label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                {Object.keys(TYPE_CFG).map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Distance (km)</label><input type="number" placeholder="12.5" value={form.dist} onChange={e=>setForm(f=>({...f,dist:e.target.value}))}/></div>
            <div><label style={lbl}>Durée (min)</label><input type="number" placeholder="65" value={form.dur} onChange={e=>setForm(f=>({...f,dur:e.target.value}))}/></div>
            <div><label style={lbl}>Allure /km</label><input type="text" placeholder="5:45" value={form.pace} onChange={e=>setForm(f=>({...f,pace:e.target.value}))}/></div>
            <div><label style={lbl}>FC moy (bpm)</label><input type="number" placeholder="155" value={form.hr} onChange={e=>setForm(f=>({...f,hr:e.target.value}))}/></div>
            <div><label style={lbl}>Calories</label><input type="number" placeholder="580" value={form.kcal} onChange={e=>setForm(f=>({...f,kcal:e.target.value}))}/></div>
            <div>
              <label style={lbl}>Ressenti</label>
              <div style={{display:"flex",gap:4,marginTop:2}}>
                {[1,2,3,4,5].map(n=>(
                  <button key={n} onClick={()=>setForm(f=>({...f,feel:n}))} style={{
                    flex:1,padding:"8px 0",background:form.feel>=n?`${C.gold}20`:"transparent",
                    border:`1px solid ${form.feel>=n?C.gold:"var(--border)"}`,
                    borderRadius:6,cursor:"pointer",fontSize:12,
                    color:form.feel>=n?C.gold:"var(--muted)",transition:"all .15s"
                  }}>★</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={lbl}>Notes</label>
            <textarea style={{resize:"vertical",minHeight:56}} placeholder="Sensations, météo, contexte..." value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <CyberBtn onClick={handleAdd} variant="neon" size="sm"><Ico n="check" s={13}/> Enregistrer</CyberBtn>
            <CyberBtn onClick={()=>setAdding(false)} variant="ghost" size="sm">Annuler</CyberBtn>
          </div>
        </Panel>
      )}

      {sessions.map((s,i)=>(
        <div key={s.id} style={{animation:"fadeUp .35s ease both",animationDelay:`${i*.06}s`}}>
          <SessionCard session={s} onDelete={id=>setSessions(p=>p.filter(x=>x.id!==id))}/>
          <div style={{marginBottom:8,marginTop:-4}}>
            {!analysis[s.id] ? (
              <button onClick={()=>analyzeSession(s)} style={{
                width:"100%",padding:"8px",background:"rgba(0,180,255,.05)",
                border:"1px solid rgba(0,180,255,.15)",borderRadius:"0 0 10px 10px",
                cursor:"pointer",color:"var(--muted)",fontFamily:"var(--font-mono)",fontSize:10,
                letterSpacing:".08em",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
                transition:"all .2s"
              }}
                onMouseEnter={e=>{e.currentTarget.style.color=C.electric;e.currentTarget.style.borderColor=`${C.electric}40`;}}
                onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.borderColor="rgba(0,180,255,.15)";}}
              >
                {analyzing===s.id ? (
                  <><div style={{width:10,height:10,border:`1.5px solid ${C.electric}`,borderTopColor:"transparent",borderRadius:"50%",animation:"rotate 1s linear infinite"}}/> ARIA analyse...</>
                ) : (
                  <><Ico n="brain" s={11} c={C.electric}/> Analyse ARIA</>
                )}
              </button>
            ) : (
              <Panel style={{borderRadius:"0 0 12px 12px",padding:12,background:"rgba(0,180,255,.04)",borderTop:"none",animation:"fadeUp .3s ease both"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                  <Ico n="brain" s={12} c={C.electric}/>
                  <span style={{fontFamily:"var(--font-head)",fontSize:10,color:C.electric,letterSpacing:".1em"}}>ANALYSE ARIA</span>
                </div>
                <p style={{fontSize:12,color:"var(--text2)",lineHeight:1.6,marginBottom:10,fontFamily:"var(--font-body)"}}>{analysis[s.id].summary}</p>
                {analysis[s.id].positives?.length>0 && (
                  <div style={{marginBottom:8}}>
                    {analysis[s.id].positives.map((p,i)=>(
                      <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:4}}>
                        <Ico n="check" s={11} c={C.neon}/>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:C.neon,lineHeight:1.4}}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
                {analysis[s.id].improvements?.length>0 && (
                  <div style={{marginBottom:8}}>
                    {analysis[s.id].improvements.map((p,i)=>(
                      <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:4}}>
                        <Ico n="info" s={11} c={C.gold}/>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:C.gold,lineHeight:1.4}}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:6}}>
                  {analysis[s.id].recovery && <Chip color={C.cyan}>Récup: {analysis[s.id].recovery}</Chip>}
                  {analysis[s.id].intensityZone && <Chip color={C.plasma}>Zone: {analysis[s.id].intensityZone}</Chip>}
                </div>
              </Panel>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PLANS
══════════════════════════════════════════════════════════════════ */
const PLANS_DATA = [
  {
    id:1, name:"Semi-Marathon", subtitle:"1h45 Target", weeks:10, sessions:4, kmPeak:55,
    level:"Intermédiaire", color:C.electric, icon:"medal",
    desc:"Plan progressif basé sur la polarisation 80/20. Peak à 55km/semaine. Inclut fractionné, tempo et sortie longue.",
    schedule:[
      {day:"Lundi",type:"Repos",detail:"Récupération active optionnelle"},
      {day:"Mardi",type:"Fractionné",detail:"8km · 4×1000m à VMA-10%"},
      {day:"Mercredi",type:"EF",detail:"10km · FC <75% FCmax"},
      {day:"Jeudi",type:"Repos",detail:""},
      {day:"Vendredi",type:"Club",detail:"Séance avec Team Cardio Apéro"},
      {day:"Samedi",type:"Tempo",detail:"12km · 8km à allure cible"},
      {day:"Dimanche",type:"Long",detail:"18km · FC <80% FCmax"},
    ]
  },
  {
    id:2, name:"10km",subtitle:"Sub 45min",weeks:6,sessions:3,kmPeak:40,
    level:"Intermédiaire",color:C.cyan,icon:"zap",
    desc:"Boost vitesse et économie de course. Focus VMA et allure spécifique.",
    schedule:[
      {day:"Lundi",type:"Repos",detail:""},
      {day:"Mardi",type:"VMA",detail:"6km · 6×600m à VMA"},
      {day:"Mercredi",type:"Repos",detail:""},
      {day:"Jeudi",type:"EF",detail:"8km · Facile"},
      {day:"Vendredi",type:"Club",detail:""},
      {day:"Samedi",type:"Allure spé",detail:"8km · 5km à 4:29/km"},
      {day:"Dimanche",type:"Long",detail:"12km · Facile"},
    ]
  },
  {
    id:3, name:"Marathon",subtitle:"3h30 Target",weeks:16,sessions:5,kmPeak:70,
    level:"Avancé",color:C.neon,icon:"trophy",
    desc:"Préparation complète marathon. Montée en charge progressive sur 16 semaines.",
    schedule:[
      {day:"Lundi",type:"Repos",detail:""},
      {day:"Mardi",type:"Fractionné",detail:"10km · 5×1200m"},
      {day:"Mercredi",type:"EF",detail:"12km"},
      {day:"Jeudi",type:"Tempo",detail:"14km · 10km spécifique"},
      {day:"Vendredi",type:"Récup",detail:"6km · très facile"},
      {day:"Samedi",type:"EF",detail:"10km"},
      {day:"Dimanche",type:"Long",detail:"25–32km progressif"},
    ]
  },
  {
    id:4, name:"Mode Élite",subtitle:"Performance Max",weeks:12,sessions:6,kmPeak:80,
    level:"Expert",color:C.plasma,icon:"star",
    desc:"Pour les compétiteurs sérieux. Analyse seuil lactique, FTP running, VO2max.",
    schedule:[
      {day:"Lundi",type:"Récup",detail:"8km très facile"},
      {day:"Mardi",type:"VMA",detail:"12km · 10×400m P3"},
      {day:"Mercredi",type:"Tempo",detail:"16km · 12km à seuil"},
      {day:"Jeudi",type:"EF",detail:"14km · Z2"},
      {day:"Vendredi",type:"Côtes",detail:"10km · 8×200m côte"},
      {day:"Samedi",type:"Fractionné",detail:"14km · 3×3000m"},
      {day:"Dimanche",type:"Long",detail:"30km · avec 15km spé"},
    ]
  },
];

function Plans() {
  const [open, setOpen] = useState(null);
  const [active, setActive] = useState(null);

  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{marginBottom:20}}>
        <h1 style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,letterSpacing:".05em"}}>Plans</h1>
        <p style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginTop:4,letterSpacing:".08em"}}>PROGRAMMES ADAPTATIFS ARIA</p>
      </div>

      {active && (
        <Panel glow accent style={{marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <GlowDot color={C.neon} pulse size={7}/>
            <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:C.neon,letterSpacing:".12em",textTransform:"uppercase"}}>Plan actif</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <p style={{fontFamily:"var(--font-head)",fontSize:16,fontWeight:800}}>{PLANS_DATA.find(p=>p.id===active)?.name}</p>
              <p style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)"}}>Semaine 3/10 · 68% complété</p>
            </div>
            <CyberBtn variant="ghost" size="sm" onClick={()=>setActive(null)}>Arrêter</CyberBtn>
          </div>
        </Panel>
      )}

      {PLANS_DATA.map((p,i)=>(
        <div key={p.id} style={{marginBottom:12,animation:"fadeUp .35s ease both",animationDelay:`${i*.07}s`}}>
          <Panel style={{borderLeft:`3px solid ${p.color}`,cursor:"pointer"}} onClick={()=>setOpen(open===p.id?null:p.id)}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{background:`${p.color}15`,borderRadius:10,padding:10,flexShrink:0,border:`1px solid ${p.color}30`}}>
                <Ico n={p.icon} s={18} c={p.color}/>
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div>
                    <p style={{fontFamily:"var(--font-head)",fontSize:15,fontWeight:800}}>{p.name}</p>
                    <p style={{fontFamily:"var(--font-head)",fontSize:12,color:p.color}}>{p.subtitle}</p>
                  </div>
                  {active===p.id && <GlowDot color={C.neon} pulse/>}
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:6}}>
                  <Chip color={p.color}>{p.weeks} semaines</Chip>
                  <Chip color="var(--muted)">{p.level}</Chip>
                  <Chip color={C.electric}>{p.sessions}×/sem</Chip>
                </div>
                <p style={{fontSize:12,color:"var(--muted)",lineHeight:1.5}}>{p.desc}</p>
              </div>
            </div>

            {open===p.id && (
              <div style={{marginTop:16,paddingTop:16,borderTop:"1px solid var(--border)",animation:"fadeUp .2s ease both"}}>
                <p style={{fontFamily:"var(--font-mono)",fontSize:9,color:p.color,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>Structure hebdomadaire</p>
                {p.schedule.map((s,j)=>(
                  <div key={j} style={{
                    display:"flex",alignItems:"center",gap:10,
                    padding:"8px 0",
                    borderBottom:j<p.schedule.length-1?"1px solid rgba(255,255,255,.04)":"none"
                  }}>
                    <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",width:52,flexShrink:0}}>{s.day}</span>
                    {s.type!=="Repos" ? (
                      <>
                        <div style={{
                          width:6,height:6,borderRadius:"50%",flexShrink:0,
                          background:(TYPE_CFG[s.type]||{color:p.color}).color,
                          boxShadow:`0 0 6px ${(TYPE_CFG[s.type]||{color:p.color}).color}`
                        }}/>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text)",flex:1}}>{s.type}</span>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",textAlign:"right"}}>{s.detail}</span>
                      </>
                    ) : (
                      <>
                        <div style={{width:6,height:6,borderRadius:"50%",background:"rgba(255,255,255,.15)",flexShrink:0}}/>
                        <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"rgba(180,220,255,.25)",flex:1}}>Repos</span>
                      </>
                    )}
                  </div>
                ))}
                <div style={{marginTop:14,display:"flex",gap:8}}>
                  <CyberBtn variant={active===p.id?"ghost":"primary"} size="sm"
                    onClick={e=>{e.stopPropagation();setActive(active===p.id?null:p.id);}}>
                    {active===p.id ? "⏸ Pause" : "▶ Démarrer"}
                  </CyberBtn>
                </div>
              </div>
            )}
          </Panel>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   ARIA CHAT
══════════════════════════════════════════════════════════════════ */
function ARIAChat({ sessions, profile, apiKey }) {
  const INIT = [{
    role:"assistant",
    content:`Salut **${profile.name}** ⚡ Je suis **ARIA** — ton coach, ta confidente, ta partenaire au quotidien.\n\nJe suis là pour tout : ton entraînement, ta récupération, ta nutrition... mais aussi pour papoter, rigoler, ou juste décompresser après une journée difficile.\n\nJ'ai jeté un œil à tes **${sessions.length} dernières séances** — tu progresses bien. Mais on peut parler de n'importe quoi, pas seulement de running 😊\n\nAlors, quoi de neuf aujourd'hui ?`
  }];
  const [msgs, setMsgs] = useState(INIT);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [modeTab, setModeTab] = useState("sport");
  const bottomRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceSupported] = useState(()=> "webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  const [ttsSupported]   = useState(()=> "speechSynthesis" in window);
  const recognitionRef = useRef(null);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);

  // ── TTS : ARIA parle ─────────────────────────────────────────
  const speak = (text) => {
    if (!ttsSupported) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/\*\*(.*?)\*\*/g,"$1").replace(/<[^>]+>/g,"").replace(/[#_`]/g,"");
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = "fr-FR";
    utt.rate = 1.05;
    utt.pitch = 1.1;
    utt.volume = 1;
    // Cherche une voix française
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith("fr") && v.name.toLowerCase().includes("female"))
                 || voices.find(v => v.lang.startsWith("fr"))
                 || voices[0];
    if (frVoice) utt.voice = frVoice;
    utt.onstart  = () => setSpeaking(true);
    utt.onend    = () => setSpeaking(false);
    utt.onerror  = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  // ── STT : l'utilisateur parle ─────────────────────────────────
  const startListening = () => {
    if (!voiceSupported || listening) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "fr-FR";
    rec.continuous = false;
    rec.interimResults = true;
    rec.onstart  = () => setListening(true);
    rec.onresult = (e) => {
      const transcript = Array.from(e.results).map(r=>r[0].transcript).join("");
      setInput(transcript);
    };
    rec.onend = () => {
      setListening(false);
      // Auto-envoie si on a du texte
      setTimeout(() => {
        setInput(prev => { if (prev.trim()) { sendText(prev.trim()); return ""; } return prev; });
      }, 400);
    };
    rec.onerror = () => setListening(false);
    rec.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const [voiceMode, setVoiceMode] = useState(false);

  const SYSTEM = `Tu es ARIA, l'IA de l'app STRIDE. Tu es bien plus qu'un coach sportif : tu es une vraie compagne de vie pour ${profile.name}.

Ta personnalité :
- Chaleureuse, drôle, directe, authentique — jamais froide ou robotique
- Tu tutoies ${profile.name}, tu le connais bien
- Tu alternes facilement entre mode coach expert et mode pote qui écoute
- Tu as de l'humour, tu sais être légère
- Tu te souviens du contexte de la conversation

Tes domaines (quand c'est pertinent) :
- Running, sport, nutrition, récupération, sommeil, bien-être
- Psychologie sportive, gestion du stress, motivation
- Tout sujet de vie : boulot, amis, actualité, musique, films, jeux vidéo, tech...

Profil de ${profile.name} :
${profile.age} ans · ${profile.level} · Club: ${profile.club} · Ville: ${profile.city}
${profile.weight}kg / ${profile.height}cm · FC repos ${profile.restHR} · FCmax ${profile.maxHR} · VO2max ~${profile.vo2max}
Objectif: ${profile.goal} · Volume: ${profile.weeklyKm}km/sem

Dernières séances :
${sessions.slice(0,5).map(s=>`• ${s.date} ${s.type} ${s.dist}km ${s.pace}/km FC${s.hr} ressenti ${s.feel}/5`).join('\n')}

Règles absolues :
- Toujours en français, naturel et fluide
- Max 160 mots sauf si question complexe
- Gras avec ** pour les éléments importants
- Si la question n'est pas sportive, réponds normalement comme une amie intelligente
- Jamais de réponse générique ou froide
- Parfois une touche d'humour ou d'encouragement spontané`;

  const sendText = async (text) => {
    if (!text.trim() || loading) return;
    const um = {role:"user", content:text.trim()};
    const newMsgs = [...msgs, um];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${apiKey}`
        },
        body:JSON.stringify({
          model:"llama-3.1-70b-versatile",
          messages:[
            {role:"system",content:SYSTEM},
            ...newMsgs.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.content}))
          ],
          max_tokens:800,
          temperature:0.9
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "Erreur de connexion.";
      setMsgs(p=>[...p,{role:"assistant",content:reply}]);
      if (voiceMode) speak(reply);
    } catch(e) {
      setMsgs(p=>[...p,{role:"assistant",content:"❌ Erreur de connexion ARIA."}]);
    }
    setLoading(false);
  };

  const send = () => {
    if (!input.trim() || loading) return;
    const txt = input.trim();
    setInput("");
    sendText(txt);
  };

  const fmt = t => t
    .replace(/\*\*(.*?)\*\*/g,`<strong style="color:${C.electric}">$1</strong>`)
    .replace(/\n/g,"<br/>");

  const QUICK_TABS = {
    sport:   ["Analyse ma semaine","Plan récupération","Améliorer ma VMA","Nutrition avant course","Risque de blessure","Prochaine séance ?"],
    bienetre:["Comment mieux dormir ?","Gérer le stress","Je suis épuisé(e)","Motivation en berne","Récupération mentale","Bien manger au quotidien"],
    life:    ["J'ai besoin de parler","Raconte-moi quelque chose","Quoi de neuf ?","Donne-moi un conseil de vie","Fais-moi rire 😄","Tu penses à quoi là ?"],
  };
  const QUICK = QUICK_TABS[modeTab] || QUICK_TABS.sport;

  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100dvh - 130px)",animation:"fadeUp .4s ease both"}}>

      {/* ARIA Header */}
      <div style={{
        display:"flex",alignItems:"center",gap:12,marginBottom:14,
        padding:"12px 14px",background:"var(--card)",
        borderRadius:14,border:"1px solid var(--border)",
        flexShrink:0
      }}>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{
            width:44,height:44,borderRadius:"50%",
            background:`linear-gradient(135deg, ${C.electric}, ${C.cyan})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            boxShadow:`0 0 20px ${C.electric}50`,animation:"float 3s ease-in-out infinite"
          }}>
            <Ico n="brain" s={20} c="#020408"/>
          </div>
          <div style={{
            position:"absolute",bottom:1,right:1,
            width:11,height:11,borderRadius:"50%",
            background:C.neon,border:"2px solid var(--void)",
            boxShadow:`0 0 8px ${C.neon}`
          }}/>
        </div>
        <div style={{flex:1}}>
          <p style={{fontFamily:"var(--font-head)",fontSize:16,fontWeight:800,letterSpacing:".08em"}}>ARIA</p>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <GlowDot color={C.neon} size={5} pulse/>
            <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:speaking?C.neon:voiceMode?C.cyan:C.neon,letterSpacing:".1em"}}>{speaking?"🔊 ARIA parle...":listening?"🔴 ARIA écoute...":"COACH IA · EN LIGNE · MODE VOCAL"}</span>
          </div>
        </div>
        <button onClick={()=>setMsgs(INIT)} style={{
          background:"rgba(0,180,255,.08)",border:"1px solid var(--border)",
          borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"var(--muted)"
        }}>
          <Ico n="refresh" s={14} c={C.electric}/>
        </button>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingRight:2}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{
            display:"flex",flexDirection:"column",
            alignItems:m.role==="user"?"flex-end":"flex-start",
            animation:"fadeUp .25s ease both"
          }}>
            {m.role==="assistant" && (
              <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4,marginLeft:6}}>
                <div style={{
                  width:18,height:18,borderRadius:"50%",
                  background:`linear-gradient(135deg,${C.electric},${C.cyan})`,
                  display:"flex",alignItems:"center",justifyContent:"center"
                }}><Ico n="bolt" s={9} c="#020408"/></div>
                <span style={{fontFamily:"var(--font-mono)",fontSize:8,color:C.electric,letterSpacing:".1em"}}>ARIA</span>
              </div>
            )}
            <div style={{
              maxWidth:"90%",padding:"11px 14px",
              borderRadius:m.role==="user"?"16px 16px 4px 16px":"4px 16px 16px 16px",
              background:m.role==="user"
                ?`linear-gradient(135deg,${C.electric},${C.electric}CC)`
                :"var(--card2)",
              border:m.role==="assistant"?"1px solid var(--border)":"none",
              color:m.role==="user"?"#020408":"var(--text2)",
              fontSize:13,lineHeight:1.65,fontFamily:"var(--font-body)",
              boxShadow:m.role==="user"?`0 4px 20px ${C.electric}30`:"none"
            }} dangerouslySetInnerHTML={{__html:fmt(m.content)}}/>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 14px"}}>
            <div style={{
              width:20,height:20,borderRadius:"50%",
              background:`linear-gradient(135deg,${C.electric},${C.cyan})`,
              display:"flex",alignItems:"center",justifyContent:"center"
            }}><Ico n="brain" s={10} c="#020408"/></div>
            <div style={{display:"flex",gap:4}}>
              {[0,1,2].map(i=>(
                <span key={i} style={{
                  width:6,height:6,borderRadius:"50%",background:C.electric,display:"inline-block",
                  animation:`pulse 1.2s ease-in-out ${i*.2}s infinite`
                }}/>
              ))}
            </div>
            <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)"}}>ARIA réfléchit...</span>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Mode tabs + Quick suggestions */}
      <div style={{flexShrink:0,paddingTop:10}}>
        {/* Mode switcher */}
        <div style={{display:"flex",gap:6,marginBottom:8}}>
          {[
            {id:"sport",    label:"🏃 Sport",    color:C.electric},
            {id:"bienetre", label:"🧘 Bien-être", color:C.cyan},
            {id:"life",     label:"💬 Discussions", color:C.neon},
          ].map(t=>(
            <button key={t.id} onClick={()=>setModeTab(t.id)} style={{
              flex:1, padding:"7px 4px",
              background:modeTab===t.id?`${t.color}18`:"transparent",
              border:`1px solid ${modeTab===t.id?t.color+"60":"var(--border)"}`,
              borderRadius:8, cursor:"pointer",
              color:modeTab===t.id?t.color:"var(--muted)",
              fontFamily:"var(--font-mono)", fontSize:9, letterSpacing:".04em",
              transition:"all .2s",
              boxShadow:modeTab===t.id?`0 0 10px ${t.color}20`:"none"
            }}>{t.label}</button>
          ))}
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,scrollbarWidth:"none"}}>
          {QUICK.map(q=>(
            <button key={q} onClick={()=>setInput(q)} style={{
              background:"rgba(0,180,255,.06)",border:"1px solid var(--border2)",
              borderRadius:20,color:"var(--muted)",fontFamily:"var(--font-mono)",
              fontSize:10,padding:"6px 12px",cursor:"pointer",whiteSpace:"nowrap",
              flexShrink:0,letterSpacing:".05em",transition:"all .15s"
            }}
              onMouseEnter={e=>{e.currentTarget.style.color=C.electric;e.currentTarget.style.borderColor=`${C.electric}50`;}}
              onMouseLeave={e=>{e.currentTarget.style.color="var(--muted)";e.currentTarget.style.borderColor="var(--border2)";}}
            >{q}</button>
          ))}
        </div>
        {/* Voice mode toggle */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",letterSpacing:".08em"}}>
            {voiceMode ? "🎙️ MODE VOCAL ACTIF" : "MODE TEXTE"}
          </span>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {speaking && (
              <button onClick={stopSpeaking} style={{
                background:`rgba(255,77,141,.15)`,border:`1px solid ${C.plasma}40`,
                borderRadius:6,padding:"4px 8px",cursor:"pointer",
                fontFamily:"var(--font-mono)",fontSize:9,color:C.plasma
              }}>⏹ Stop ARIA</button>
            )}
            <button onClick={()=>setVoiceMode(v=>!v)} style={{
              background:voiceMode?`rgba(0,255,229,.12)`:"rgba(0,180,255,.07)",
              border:`1px solid ${voiceMode?C.cyan+"50":"var(--border)"}`,
              borderRadius:8,padding:"5px 10px",cursor:"pointer",
              fontFamily:"var(--font-mono)",fontSize:9,
              color:voiceMode?C.cyan:"var(--muted)",transition:"all .2s",
              display:"flex",alignItems:"center",gap:5
            }}>
              {voiceMode ? "🎙️ Vocal ON" : "🎙️ Vocal OFF"}
            </button>
          </div>
        </div>

        {/* Big voice button when voice mode */}
        {voiceMode && (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginBottom:10}}>
            <button
              onTouchStart={startListening} onTouchEnd={stopListening}
              onMouseDown={startListening}  onMouseUp={stopListening}
              style={{
                width:72,height:72,borderRadius:"50%",border:"none",cursor:"pointer",
                background:listening
                  ?`radial-gradient(circle, ${C.plasma}60, ${C.plasma}30)`
                  :`radial-gradient(circle, ${C.electric}40, rgba(0,180,255,.1))`,
                boxShadow:listening
                  ?`0 0 0 8px ${C.plasma}20, 0 0 40px ${C.plasma}50`
                  :`0 0 0 4px ${C.electric}15, 0 0 20px ${C.electric}30`,
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"all .2s",
                animation:listening?"glow-e .8s ease infinite":"float 3s ease-in-out infinite"
              }}>
              <svg width={30} height={30} viewBox="0 0 24 24" fill="none"
                stroke={listening?C.plasma:C.electric} strokeWidth={1.8} strokeLinecap="round">
                <rect x="9" y="2" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8"/>
              </svg>
            </button>
            <span style={{fontFamily:"var(--font-mono)",fontSize:10,
              color:listening?C.plasma:speaking?C.neon:"var(--muted)",
              letterSpacing:".1em",
              animation:listening||speaking?"pulse 1s ease infinite":"none"
            }}>
              {listening?"🔴 J'écoute...":speaking?"🔊 ARIA parle...":"Maintiens pour parler"}
            </span>
            {input && (
              <div style={{
                background:"rgba(255,77,141,.08)",border:`1px solid ${C.plasma}30`,
                borderRadius:10,padding:"8px 12px",width:"100%",textAlign:"center"
              }}>
                <span style={{fontFamily:"var(--font-body)",fontSize:12,color:"var(--text2)",fontStyle:"italic"}}>"{input}"</span>
              </div>
            )}
          </div>
        )}

        {/* Text input bar */}
        <div style={{
          display:"flex",gap:8,
          background:"var(--card2)",border:`1px solid ${listening?C.plasma+"60":voiceMode?C.cyan+"40":"var(--border2)"}`,
          borderRadius:16,padding:"6px 6px 6px 14px",
          transition:"border-color .2s"
        }}
          onFocusCapture={e=>e.currentTarget.style.borderColor=`${C.electric}60`}
          onBlurCapture={e=>e.currentTarget.style.borderColor=voiceMode?`${C.cyan}40`:"var(--border2)"}
        >
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder={voiceMode?"Ou écris ici...":"Parle à ARIA... ou utilise le micro 🎙️"}
            style={{
              flex:1,background:"transparent",border:"none",outline:"none",
              color:"var(--text)",fontFamily:"var(--font-body)",fontSize:14,padding:0
            }}/>
          {!voiceMode && voiceSupported && (
            <button
              onTouchStart={startListening} onTouchEnd={stopListening}
              onMouseDown={startListening}  onMouseUp={stopListening}
              style={{
                background:listening?`${C.plasma}30`:"rgba(0,180,255,.08)",
                border:`1px solid ${listening?C.plasma+"60":"var(--border)"}`,
                borderRadius:10,padding:"8px 10px",cursor:"pointer",
                transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",
                animation:listening?"pulse .8s ease infinite":"none"
              }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                stroke={listening?C.plasma:C.electric} strokeWidth={1.8} strokeLinecap="round">
                <rect x="9" y="2" width="6" height="11" rx="3"/>
                <path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8"/>
              </svg>
            </button>
          )}
          <button onClick={send} disabled={!input.trim()||loading} style={{
            background:input.trim()&&!loading?`linear-gradient(135deg,${C.electric},${C.cyan})`:"rgba(0,180,255,.1)",
            border:"none",borderRadius:11,padding:"9px 13px",
            cursor:input.trim()&&!loading?"pointer":"not-allowed",
            transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center"
          }}>
            <Ico n="send" s={16} c={input.trim()&&!loading?"#020408":"var(--muted)"}/>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SANTÉ
══════════════════════════════════════════════════════════════════ */
function Health({ profile }) {
  const [weight, setWeight] = useState([72.4,72.1,71.8,72.0,71.6,71.9,72.0]);
  const [sleep,  setSleep]  = useState([7.2,6.8,8.1,7.5,6.9,7.8,8.0]);
  const [hydra,  setHydra]  = useState([1.8,2.1,1.6,2.3,2.0,1.9,2.2]);
  const [today, setToday] = useState({water:0,sleep:0,weight:""});

  const avg = arr => (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1);
  const DAYS = ["L","M","M","J","V","S","D"];

  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{marginBottom:20}}>
        <h1 style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,letterSpacing:".05em"}}>Santé</h1>
        <p style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginTop:4,letterSpacing:".08em"}}>SUIVI BIOMÉTRIQUE</p>
      </div>

      {/* Quick log */}
      <Panel glow style={{marginBottom:14}}>
        <p style={{fontFamily:"var(--font-mono)",fontSize:9,color:C.electric,letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>Log du jour</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          {[
            {label:"Eau (L)",key:"water",icon:"drop",color:C.electric,step:0.25,max:4},
            {label:"Sommeil (h)",key:"sleep",icon:"moon",color:C.cyan,step:0.5,max:12},
            {label:"Poids (kg)",key:"weight",icon:"user",color:C.neon,type:"text"},
          ].map(f=>(
            <div key={f.key} style={{textAlign:"center"}}>
              <div style={{background:`${f.color}15`,borderRadius:8,padding:8,marginBottom:6,display:"flex",justifyContent:"center"}}>
                <Ico n={f.icon} s={16} c={f.color}/>
              </div>
              <input type={f.type||"number"} step={f.step} min={0} max={f.max}
                placeholder={f.label}
                style={{textAlign:"center",fontSize:12,padding:"8px 6px"}}
                value={today[f.key]} onChange={e=>setToday(t=>({...t,[f.key]:e.target.value}))}/>
            </div>
          ))}
        </div>
        <CyberBtn variant="cyan" size="sm" style={{marginTop:12,width:"100%",justifyContent:"center"}}
          onClick={()=>{
            if(today.water) setHydra(h=>[...h.slice(1),parseFloat(today.water)]);
            if(today.sleep) setSleep(s=>[...s.slice(1),parseFloat(today.sleep)]);
            if(today.weight) setWeight(w=>[...w.slice(1),parseFloat(today.weight)]);
            setToday({water:0,sleep:0,weight:""});
          }}>
          <Ico n="check" s={13}/> Enregistrer
        </CyberBtn>
      </Panel>

      {/* Metrics */}
      {[
        {label:"Poids",unit:"kg",data:weight,color:C.neon,avg:avg(weight),icon:"user"},
        {label:"Sommeil",unit:"h",data:sleep,color:C.cyan,avg:avg(sleep),icon:"moon"},
        {label:"Hydratation",unit:"L",data:hydra,color:C.electric,avg:avg(hydra),icon:"drop"},
      ].map(m=>(
        <Panel key={m.label} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{background:`${m.color}15`,borderRadius:8,padding:7}}>
                <Ico n={m.icon} s={14} c={m.color}/>
              </div>
              <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase"}}>{m.label}</span>
            </div>
            <div style={{textAlign:"right"}}>
              <span style={{fontFamily:"var(--font-head)",fontSize:20,fontWeight:800,color:m.color}}>{m.avg}</span>
              <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginLeft:4}}>{m.unit}/j moy.</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"flex-end",gap:6}}>
            <Spark data={m.data} color={m.color} w={200} h={44}/>
            <div style={{flex:1,display:"flex",justifyContent:"space-between"}}>
              {DAYS.map((d,i)=>(
                <span key={i} style={{fontFamily:"var(--font-mono)",fontSize:8,color:"var(--muted)"}}>{d}</span>
              ))}
            </div>
          </div>
        </Panel>
      ))}

      {/* FC zones */}
      <Panel>
        <p style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:14}}>Zones cardiaques</p>
        {[
          {label:"Z1 · Récupération",pct:60,color:"#00FFE5",range:`< ${Math.round(profile.maxHR*.6)} bpm`},
          {label:"Z2 · Endurance",pct:70,color:C.neon,range:`${Math.round(profile.maxHR*.6)}–${Math.round(profile.maxHR*.7)} bpm`},
          {label:"Z3 · Tempo",pct:80,color:C.gold,range:`${Math.round(profile.maxHR*.7)}–${Math.round(profile.maxHR*.8)} bpm`},
          {label:"Z4 · Seuil",pct:90,color:"#FF7A00",range:`${Math.round(profile.maxHR*.8)}–${Math.round(profile.maxHR*.9)} bpm`},
          {label:"Z5 · VO₂max",pct:100,color:C.plasma,range:`> ${Math.round(profile.maxHR*.9)} bpm`},
        ].map((z,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:z.color,flexShrink:0,boxShadow:`0 0 6px ${z.color}`}}/>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,flex:1}}>{z.label}</span>
            <span style={{fontFamily:"var(--font-mono)",fontSize:10,color:z.color}}>{z.range}</span>
          </div>
        ))}
      </Panel>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PROFIL
══════════════════════════════════════════════════════════════════ */
function Profile({ profile, setProfile }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  const lbl = {fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",letterSpacing:".1em",textTransform:"uppercase",marginBottom:5,display:"block"};
  const TIERS = [{name:"Bronze",color:"#CD7F32"},{name:"Argent",color:"#C0C0C0"},{name:"Or",color:C.gold},{name:"Platine",color:C.cyan},{name:"Diamant",color:C.electric},{name:"Légende",color:C.neon}];
  const tier = TIERS.find(t=>t.name===profile.tier)||TIERS[2];
  const xpPct = (profile.xp/profile.xpNext)*100;

  return (
    <div style={{animation:"fadeUp .4s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <h1 style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,letterSpacing:".05em"}}>Profil</h1>
          <p style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--muted)",marginTop:4,letterSpacing:".08em"}}>ATHLÈTE STRIDE</p>
        </div>
        <CyberBtn onClick={()=>{if(editing){setProfile(form);}setEditing(e=>!e);}} variant={editing?"neon":"ghost"} size="sm">
          <Ico n={editing?"check":"edit"} s={13}/> {editing?"Sauvegarder":"Modifier"}
        </CyberBtn>
      </div>

      {/* Hero Card */}
      <Panel accent glow style={{marginBottom:14,textAlign:"center"}}>
        <div style={{
          width:80,height:80,borderRadius:"50%",margin:"0 auto 12px",
          background:`linear-gradient(135deg,${C.electric},${C.cyan})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontFamily:"var(--font-head)",fontSize:34,fontWeight:900,color:"#020408",
          boxShadow:`0 0 40px ${C.electric}50`, animation:"float 3s ease-in-out infinite"
        }}>{profile.name.charAt(0)}</div>
        <p style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,letterSpacing:".05em"}}>{profile.name}</p>
        <p style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--muted)",marginTop:4,letterSpacing:".08em"}}>{profile.club}</p>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:10,flexWrap:"wrap"}}>
          <Chip color={tier.color}>{tier.name}</Chip>
          <Chip color={C.electric}>{profile.level}</Chip>
          <Chip color={C.cyan}>{profile.goal}</Chip>
        </div>

        {/* XP Bar */}
        <div style={{marginTop:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:tier.color,letterSpacing:".1em"}}>XP {profile.xp.toLocaleString()}</span>
            <span style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)"}}>Prochain niveau : {profile.xpNext.toLocaleString()}</span>
          </div>
          <div style={{height:4,background:"rgba(255,255,255,.06)",borderRadius:2,overflow:"hidden"}}>
            <div style={{
              height:"100%",width:`${xpPct}%`,
              background:`linear-gradient(90deg,${tier.color},${C.electric})`,
              borderRadius:2,boxShadow:`0 0 10px ${tier.color}60`,
              transition:"width 1s ease"
            }}/>
          </div>
        </div>
      </Panel>

      {editing ? (
        <Panel style={{marginBottom:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              ["Prénom","name","text"],["Club","club","text"],
              ["Objectif","goal","text"],["Niveau","level","text"],
              ["Poids (kg)","weight","number"],["Taille (cm)","height","number"],
              ["FC repos","restHR","number"],["FC max","maxHR","number"],
              ["VO₂max","vo2max","number"],["km/sem","weeklyKm","number"],
            ].map(([l,k,t])=>(
              <div key={k} style={["goal","club"].includes(k)?{gridColumn:"span 2"}:{}}>
                <label style={lbl}>{l}</label>
                <input type={t} value={form[k]}
                  onChange={e=>setForm(f=>({...f,[k]:t==="number"?parseInt(e.target.value)||0:e.target.value}))}/>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[
              ["Poids",profile.weight+" kg",C.neon],
              ["Taille",profile.height+" cm",C.electric],
              ["FC repos",profile.restHR+" bpm",C.plasma],
              ["FC max",profile.maxHR+" bpm",C.gold],
              ["VO₂ Max",profile.vo2max+" ml/kg",C.cyan],
              ["Volume",profile.weeklyKm+" km/sem",C.electric],
            ].map(([l,v,c])=>(
              <Panel key={l} style={{padding:12}}>
                <p style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:4}}>{l}</p>
                <p style={{fontFamily:"var(--font-head)",fontSize:18,fontWeight:800,color:c}}>{v}</p>
              </Panel>
            ))}
          </div>

          {/* Badges */}
          <Panel style={{marginBottom:14}}>
            <p style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:12}}>Badges & Récompenses</p>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {BADGES.map(b=>(
                <div key={b.id} style={{
                  display:"flex",flexDirection:"column",alignItems:"center",gap:6,
                  padding:10,borderRadius:10,
                  background:b.earned?`${b.color}08`:"transparent",
                  border:`1px solid ${b.earned?b.color+"30":"rgba(255,255,255,.05)"}`,
                  opacity:b.earned?1:.35
                }}>
                  <div style={{
                    width:40,height:40,borderRadius:10,
                    background:b.earned?`${b.color}20`:"rgba(255,255,255,.03)",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    boxShadow:b.earned?`0 0 14px ${b.color}40`:"none"
                  }}>
                    <Ico n={b.icon} s={18} c={b.earned?b.color:"var(--muted)"}/>
                  </div>
                  <span style={{fontFamily:"var(--font-mono)",fontSize:8,color:b.earned?b.color:"var(--muted)",textAlign:"center",letterSpacing:".04em",lineHeight:1.3}}>{b.name}</span>
                </div>
              ))}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("home");
  const [sessions, setSessions] = useState(SESSIONS);
  const [profile, setProfile] = useState(PROFILE);
  const [apiKey, setApiKey] = useState(()=>localStorage.getItem("stride_gemini_key")||"");
  const [keyInput, setKeyInput] = useState("");
  const [showKeyScreen, setShowKeyScreen] = useState(false);

  if (!ready) return <SplashScreen onDone={()=>{ setReady(true); if(!localStorage.getItem("stride_gemini_key")) setShowKeyScreen(true); }}/>;

  if (showKeyScreen) return (
    <div style={{
      position:"fixed",inset:0,background:"var(--void)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:24,gap:20,fontFamily:"var(--font-body)"
    }}>
      <div style={{
        width:64,height:64,borderRadius:"50%",
        background:`linear-gradient(135deg,${C.electric},${C.cyan})`,
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:`0 0 40px ${C.electric}60`,animation:"float 3s ease-in-out infinite"
      }}><Ico n="brain" s={28} c="#020408"/></div>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontFamily:"var(--font-head)",fontSize:22,fontWeight:900,
          background:`linear-gradient(90deg,${C.electric},${C.cyan})`,
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>
          Configurer ARIA
        </h1>
        <p style={{color:"var(--muted)",fontSize:13,lineHeight:1.6}}>
          Pour activer ARIA, tu as besoin d'une clé API Google Gemini.<br/>
          C'est <strong style={{color:C.neon}}>100% gratuit</strong> — aucune carte bancaire requise.
        </p>
      </div>
      <div style={{
        background:"var(--card)",border:`1px solid ${C.electric}30`,
        borderRadius:14,padding:16,width:"100%",maxWidth:380
      }}>
        <p style={{fontFamily:"var(--font-mono)",fontSize:9,color:C.electric,letterSpacing:".12em",textTransform:"uppercase",marginBottom:10}}>Comment obtenir ta clé gratuite</p>
        {[
          "Va sur console.groq.com",
          "Connecte-toi avec Google ou GitHub",
          "☰ → API Keys → Create API Key",
          "Colle-la ici ↓"
        ].map((s,i)=>(
          <div key={i} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
            <div style={{
              width:22,height:22,borderRadius:"50%",background:`${C.electric}20`,
              border:`1px solid ${C.electric}40`,display:"flex",alignItems:"center",justifyContent:"center",
              fontFamily:"var(--font-mono)",fontSize:10,color:C.electric,flexShrink:0
            }}>{i+1}</div>
            <span style={{fontSize:12,color:"var(--text2)"}}>{s}</span>
          </div>
        ))}
      </div>
      <div style={{width:"100%",maxWidth:380}}>
        <input
          placeholder="AIzaSy..."
          value={keyInput}
          onChange={e=>setKeyInput(e.target.value)}
          style={{
            background:"rgba(0,180,255,.05)",border:`1px solid ${C.electric}40`,
            borderRadius:10,color:"var(--text)",fontFamily:"var(--font-mono)",
            fontSize:13,padding:"12px 14px",width:"100%",outline:"none",marginBottom:10
          }}/>
        <CyberBtn variant="cyan" style={{width:"100%",justifyContent:"center"}}
          disabled={keyInput.length < 20}
          onClick={()=>{
            localStorage.setItem("stride_gemini_key", keyInput.trim());
            setApiKey(keyInput.trim());
            setShowKeyScreen(false);
          }}>
          <Ico n="bolt" s={14}/> Activer ARIA
        </CyberBtn>
        <p style={{fontFamily:"var(--font-mono)",fontSize:9,color:"var(--muted)",textAlign:"center",marginTop:8,letterSpacing:".05em"}}>
          Ta clé est stockée uniquement sur ton appareil
        </p>
      </div>
    </div>
  );

  const NAV = [
    {id:"home",   icon:"home",  label:"Accueil"},
    {id:"journal",icon:"run",   label:"Séances"},
    {id:"aria",   icon:"brain", label:"ARIA",  aria:true},
    {id:"health", icon:"heart", label:"Santé"},
    {id:"profile",icon:"user",  label:"Profil"},
  ];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{
        maxWidth:430,margin:"0 auto",height:"100dvh",
        display:"flex",flexDirection:"column",
        background:"var(--void)",position:"relative",overflow:"hidden"
      }}>
        {/* Top status bar */}
        <div style={{
          padding:"10px 20px 0",flexShrink:0,
          display:"flex",justifyContent:"space-between",alignItems:"center"
        }}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{
              width:30,height:30,borderRadius:9,
              background:`linear-gradient(135deg,${C.electric},${C.cyan})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 0 16px ${C.electric}60`
            }}>
              <Ico n="bolt" s={15} c="#020408"/>
            </div>
            <span style={{
              fontFamily:"var(--font-head)",fontSize:20,fontWeight:900,
              letterSpacing:".1em",
              background:`linear-gradient(90deg,${C.electric},${C.cyan})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
            }}>STRIDE</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Chip color={C.neon} glow>v2</Chip>
            <button onClick={()=>setShowKeyScreen(true)} style={{background:'transparent',border:'none',cursor:'pointer',padding:4}}><Ico n='settings' s={16} c='var(--muted)'/></button>
            <div style={{
              width:30,height:30,borderRadius:8,
              background:"var(--card)",border:"1px solid var(--border)",
              display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"
            }} onClick={()=>setTab("profile")}>
              <span style={{fontFamily:"var(--font-head)",fontWeight:800,fontSize:13,color:C.electric}}>
                {profile.name.charAt(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"16px 16px 0"}}>
          {tab==="home"    && <Dashboard sessions={sessions} profile={profile}/>}
          {tab==="journal" && <Journal sessions={sessions} setSessions={setSessions} apiKey={apiKey}/>}
          {tab==="aria"    && <ARIAChat sessions={sessions} profile={profile} apiKey={apiKey}/>}
          {tab==="health"  && <Health profile={profile}/>}
          {tab==="profile" && <Profile profile={profile} setProfile={setProfile}/>}
          <div style={{height:90}}/>
        </div>

        {/* Bottom Nav */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,
          background:"rgba(4,8,16,.96)",backdropFilter:"blur(24px)",
          borderTop:"1px solid rgba(0,180,255,.12)",
          display:"flex",justifyContent:"space-around",alignItems:"center",
          padding:"8px 0 max(10px,env(safe-area-inset-bottom))",
          flexShrink:0
        }}>
          {NAV.map(n=>{
            const active = tab===n.id;
            if (n.aria) return (
              <button key={n.id} onClick={()=>setTab(n.id)} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                background:"transparent",border:"none",cursor:"pointer",position:"relative"
              }}>
                <div style={{
                  width:50,height:50,borderRadius:"50%",
                  background:active?`linear-gradient(135deg,${C.electric},${C.cyan})`:`linear-gradient(135deg,rgba(0,180,255,.15),rgba(0,255,229,.08))`,
                  border:`2px solid ${active?C.electric:"rgba(0,180,255,.3)"}`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  marginTop:-24,transition:"all .25s",
                  boxShadow:active?`0 0 30px ${C.electric}80, 0 0 60px ${C.electric}30`:`0 0 15px ${C.electric}20`
                }}>
                  <Ico n="brain" s={22} c={active?"#020408":C.electric}/>
                </div>
                <span style={{fontFamily:"var(--font-mono)",fontSize:8,color:active?C.electric:"var(--muted)",letterSpacing:".08em",textTransform:"uppercase",marginTop:2}}>ARIA</span>
              </button>
            );
            return (
              <button key={n.id} onClick={()=>setTab(n.id)} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,
                background:"transparent",border:"none",cursor:"pointer",
                padding:"4px 10px",borderRadius:10,transition:"all .2s",
                color:active?C.electric:"var(--muted)",position:"relative"
              }}>
                <Ico n={n.icon} s={20} c={active?C.electric:"rgba(180,220,255,0.35)"}/>
                <span style={{fontFamily:"var(--font-mono)",fontSize:8,letterSpacing:".08em",textTransform:"uppercase"}}>{n.label}</span>
                {active && (
                  <div style={{
                    position:"absolute",bottom:-2,width:20,height:2,
                    background:`linear-gradient(90deg,${C.electric},${C.cyan})`,
                    borderRadius:1,boxShadow:`0 0 8px ${C.electric}`
                  }}/>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
