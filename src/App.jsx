import { useState, useEffect } from "react";
import { SHOWS as SHOWS_RAW } from "./data/index.js";

// shows.js 스키마 → App 내부 포맷 변환
const SHOWS = SHOWS_RAW.map(s => ({
  ...s,
  tc: s.tagColor,
  desc: s.description,
  rat: s.rating,
  sched: s.schedule,
  ep: s.episodes.length,
  tvingUrl: s.clips[0]?.clipUrl || s.episodes[0]?.vodUrl || null,
  tvingEpUrl: s.episodes[0]?.vodUrl || s.clips[0]?.clipUrl || null,
  clips: s.clips.map(c => ({ t: c.title, e: c.episode, thumb: c.clipThumbnail, url: c.clipUrl })),
  shorts: s.shorts.map(sh => ({ t: sh.title, thumb: sh.shortsThumbnail })),
}));

// ─── FALLBACK POSTER (high quality SVG) ─────────────────────────
function FallbackPoster({ title, genre, color, style }) {
  const s = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const h = s % 360;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: `linear-gradient(135deg, hsl(${h},50%,18%), hsl(${(h+40)%360},35%,6%))`, ...style }}>
      <svg viewBox="0 0 300 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`fg${s}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${h},55%,18%)`} />
            <stop offset="100%" stopColor={`hsl(${(h+40)%360},40%,6%)`} />
          </linearGradient>
          <radialGradient id={`rg${s}`} cx="0.3" cy="0.25" r="0.8">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="300" height="400" fill={`url(#fg${s})`} />
        <rect width="300" height="400" fill={`url(#rg${s})`} />
        <circle cx={60+(s*3)%180} cy={80+(s*7)%120} r={40+s%30} fill={color} opacity="0.08" />
        <circle cx={200+(s*11)%80} cy={200+(s*5)%100} r={30+(s*2)%40} fill={color} opacity="0.06" />
        <rect y="260" width="300" height="140" fill="url(#btmg)" />
        <defs><linearGradient id="btmg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="transparent"/><stop offset="100%" stopColor="#000" stopOpacity="0.85"/></linearGradient></defs>
        <text x="24" y="340" fill="white" fontSize="26" fontWeight="800" fontFamily="sans-serif">{title.length>8?title.slice(0,8):title}</text>
        {title.length>8&&<text x="24" y="370" fill="white" fontSize="26" fontWeight="800" fontFamily="sans-serif">{title.slice(8)}</text>}
        <text x="24" y={title.length>8?392:368} fill={color} fontSize="12" fontFamily="sans-serif" opacity="0.7">{genre}</text>
      </svg>
    </div>
  );
}

// ─── SMART IMAGE COMPONENT ──────────────────────────────────────
function ShowImage({ src, title, genre, color, style, children }) {
  const [err, setErr] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || err) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
        <FallbackPoster title={title} genre={genre || ""} color={color} />
        {children}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#111", ...style }}>
      {!loaded && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 24, border: "2px solid #333", borderTopColor: color, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>}
      <img
        src={src}
        alt={title}
        onError={() => setErr(true)}
        onLoad={() => setLoaded(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        loading="lazy"
      />
      {children}
    </div>
  );
}


const GAMES = [
  { id:"quiz", name:"캐릭터 퀴즈", desc:"환승연애4 퀴즈", icon:"🧩", pts:50, c:"#FF2D55" },
  { id:"roulette", name:"추천 룰렛", desc:"랜덤 콘텐츠 추천", icon:"🎰", pts:30, c:"#FF9500" },
  { id:"memory", name:"명장면 매칭", desc:"카드 뒤집기 게임", icon:"🃏", pts:80, c:"#5856D6" },
  { id:"wordchain", name:"끝말잇기", desc:"드라마 제목 잇기", icon:"💬", pts:40, c:"#34C759" },
];

const SCHED = [
  { day:"월", shows:[{t:"환승연애4 스페셜",time:"20:00",tag:"종영"}] },
  { day:"화", shows:[{t:"친애하는X",time:"18:00",tag:"완결"}] },
  { day:"수", shows:[{t:"유퀴즈온더블럭",time:"20:45",tag:"LIVE"},{t:"우주를 줄게",time:"20:40",tag:"NEW"}] },
  { day:"목", shows:[{t:"우주를 줄게",time:"20:40",tag:"NEW"}] },
  { day:"금", shows:[{t:"판사 이한영",time:"20:00",tag:"HOT"},{t:"쇼미더머니12",time:"22:00",tag:"LIVE"}] },
  { day:"토", shows:[] },
  { day:"일", shows:[{t:"대탈출 더스토리",time:"21:00",tag:"HOT"}] },
];

const SUBS = [
  { name:"광고형 스탠다드", price:5500, ft:["광고 포함","FHD","동시 2대"], c:"#8E8E93" },
  { name:"스탠다드", price:9500, ft:["광고 없음","FHD","동시 2대"], c:"#34C759" },
  { name:"프리미엄", price:13900, ft:["광고 없음","4K+돌비","동시 4대"], c:"#FF9500" },
];

// ─── ICONS ──────────────────────────────────────────────────────
const Ic={
  Home:()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-8 9 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="2"/></svg>,
  Shorts:()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M10 10l5 2.5-5 2.5V10z" fill="currentColor"/></svg>,
  Clip:()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9.5 10l5 2-5 2v-4z" fill="currentColor"/></svg>,
  Game:()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2"/><circle cx="8" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="10" r="1" fill="currentColor"/><circle cx="18" cy="12" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/></svg>,
  Cal:()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  User:()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Play:()=><svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6V4z"/></svg>,
  Lock:()=><svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><rect x="4" y="9" width="12" height="8" rx="2"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>,
  Coin:()=><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:16,height:16,borderRadius:"50%",background:"#FFD60A",fontSize:9,fontWeight:900,color:"#8B6914",lineHeight:1}}>P</span>,
  Arr:()=><svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  X:()=><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Bk:()=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Chk:()=><svg width="14" height="14" fill="none" viewBox="0 0 20 20"><path d="M4 10l4 4 8-8" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round"/></svg>,
};

// ─── QUIZ ───────────────────────────────────────────────────────
function Quiz({ onDone, onRew }) {
  const qs=[{q:"환승연애4 최종 재회 커플이 아닌 조합은?",o:["우진&지연","원규&지현","백현&윤녕","유식&현지"],a:2},{q:"친애하는X 주연 배우는?",o:["한소희","김유정","수지","아이유"],a:1},{q:"유퀴즈온더블럭 MC는?",o:["이경규&강호동","유재석&조세호","신동엽&이수근","전현무&이시언"],a:1},{q:"쇼미더머니의 장르는?",o:["트로트","록","힙합","발라드"],a:2}];
  const [i,sI]=useState(0);const [sc,sSc]=useState(0);const [sel,sSel]=useState(null);const [dn,sDn]=useState(false);
  const pick=k=>{if(sel!==null)return;sSel(k);const ok=k===qs[i].a;if(ok)sSc(s=>s+1);setTimeout(()=>{if(i<qs.length-1){sI(i+1);sSel(null);}else{sDn(true);onRew(sc*15+(ok?15:0));}},700);};
  if(dn)return<div style={{padding:24,textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>🎉</div><div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:8}}>퀴즈 완료!</div><div style={{fontSize:16,color:"#aaa",marginBottom:16}}>{qs.length}문제 중 {sc}문제 정답</div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:24}}><Ic.Coin /><span style={{fontSize:20,fontWeight:700,color:"#FFD60A"}}>+{sc*15}P</span></div><button onClick={onDone} style={{padding:"12px 32px",background:"#FF2D55",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:600,cursor:"pointer"}}>돌아가기</button></div>;
  return<div style={{padding:20}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{color:"#aaa",fontSize:14}}>{i+1}/{qs.length}</span><div style={{display:"flex",alignItems:"center",gap:4}}><Ic.Coin /><span style={{color:"#FFD60A",fontWeight:600}}>{sc*15}P</span></div></div><div style={{width:"100%",height:4,background:"#333",borderRadius:2,marginBottom:24}}><div style={{width:`${((i+1)/qs.length)*100}%`,height:"100%",background:"#FF2D55",borderRadius:2,transition:"width .3s"}}/></div><div style={{fontSize:18,fontWeight:600,color:"#fff",marginBottom:24,lineHeight:1.5}}>{qs[i].q}</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{qs[i].o.map((op,k)=>{let bg="#1C1C1E",bd="1px solid #333";if(sel!==null){if(k===qs[i].a){bg="rgba(52,199,89,.15)";bd="1px solid #34C759";}else if(k===sel){bg="rgba(255,45,85,.15)";bd="1px solid #FF2D55";}}return<button key={k} onClick={()=>pick(k)} style={{padding:"14px 16px",background:bg,border:bd,borderRadius:12,color:"#fff",fontSize:15,textAlign:"left",cursor:"pointer"}}><span style={{fontWeight:600,marginRight:10,color:"#888"}}>{String.fromCharCode(65+k)}</span>{op}</button>;})}</div></div>;
}

function Roulette({ onDone, onRew }) {
  const [sp,sSp]=useState(false);const [res,sRes]=useState(null);
  const go=()=>{if(sp)return;sSp(true);setTimeout(()=>{sRes(SHOWS[Math.floor(Math.random()*SHOWS.length)]);sSp(false);onRew(30);},2000);};
  return<div style={{padding:24,textAlign:"center"}}><div style={{width:200,height:200,margin:"0 auto 24px",borderRadius:"50%",border:"4px solid #FF9500",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:sp?"conic-gradient(#FF2D55,#FF9500,#FFD60A,#34C759,#5856D6,#FF2D55)":"#1C1C1E",animation:sp?"rl .5s linear infinite":"none"}}><style>{`@keyframes rl{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>{res&&!sp?<div style={{background:"#1C1C1E",borderRadius:"50%",width:160,height:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:14,color:"#aaa"}}>오늘의 추천</div><div style={{fontSize:18,fontWeight:700,color:"#fff",marginTop:4}}>{res.title}</div></div>:!sp?<div style={{background:"#1C1C1E",borderRadius:"50%",width:160,height:160,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:40}}>🎰</span></div>:null}</div>{res&&!sp&&<div style={{marginBottom:16}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:12}}><Ic.Coin /><span style={{color:"#FFD60A",fontWeight:700}}>+30P</span></div></div>}<button onClick={res?onDone:go} style={{marginTop:12,padding:"12px 32px",background:res?"#333":"#FF9500",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:600,cursor:"pointer"}}>{sp?"돌리는 중...":res?"돌아가기":"룰렛 돌리기!"}</button></div>;
}

// ─── SHARED UI ──────────────────────────────────────────────────
const SH=({t,s,onMore})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 16px 10px"}}><div><div style={{fontSize:17,fontWeight:700,color:"#fff"}}>{t}</div>{s&&<div style={{fontSize:12,color:"#888",marginTop:1}}>{s}</div>}</div>{onMore&&<button onClick={onMore} style={{background:"none",border:"none",color:"#888",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:2}}>더보기<Ic.Arr /></button>}</div>;
const PlayBtn=({size=32})=><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:size,height:size,background:"rgba(0,0,0,0.5)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",border:"1px solid rgba(255,255,255,0.2)"}}><Ic.Play /></div>;
const Modal=({children,onClose:c})=><div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={c}><div style={{width:"100%",maxWidth:430,maxHeight:"90vh",background:"#1C1C1E",borderRadius:"20px 20px 0 0",overflow:"auto"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"flex-end",padding:"12px 16px 0"}}><button onClick={c} style={{background:"#333",border:"none",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Ic.X /></button></div>{children}</div></div>;

// ─── LOADING INDICATOR ──────────────────────────────────────────
function ImageLoadingBanner({ loading, count, total }) {
  if (!loading) return null;
  return (
    <div style={{margin:"0 16px 12px",padding:"10px 14px",background:"rgba(255,45,85,0.08)",border:"1px solid rgba(255,45,85,0.2)",borderRadius:12,display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:20,height:20,border:"2px solid #333",borderTopColor:"#FF2D55",borderRadius:"50%",animation:"spin 0.8s linear infinite",flexShrink:0}} />
      <span style={{fontSize:12,color:"#FF8899"}}>포스터 이미지 로딩 중... ({count}/{total})</span>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
export default function App() {
  const [tab,sTab]=useState("home");
  const [lg,sLg]=useState(false);
  const [pt,sPt]=useState(120);
  const [det,sDet]=useState(null);
  const [lgM,sLgM]=useState(false);
  const [gm,sGm]=useState(null);
  const [subM,sSubM]=useState(false);
  const [own,sOwn]=useState([]);
  const [tst,sTst]=useState(null);
  const [allM,sAllM]=useState(false);
  const [hi,sHi]=useState(0);

  const tt=m=>{sTst(m);setTimeout(()=>sTst(null),2500);};
  const buy=s=>{if(!lg){sLgM(true);return;}if(pt>=s.price){sPt(p=>p-s.price);sOwn(o=>[...o,s.id]);tt(`${s.title} 구매 완료! 🎬`);}else tt("포인트 부족 😢");};
  const rew=r=>{if(!lg){tt("로그인하면 포인트 적립!");return;}sPt(p=>p+r);};
  useEffect(()=>{const t=setInterval(()=>sHi(h=>(h+1)%3),4000);return()=>clearInterval(t);},[]);
  const hs=[SHOWS[0],SHOWS[1],SHOWS[5]];const h=hs[hi];

  return(
    <div style={{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:"#000",color:"#fff",fontFamily:"'Noto Sans KR',-apple-system,BlinkMacSystemFont,sans-serif",position:"relative"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fi{from{opacity:0;transform:translateX(-50%) translateY(-10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}} *::-webkit-scrollbar{display:none}`}</style>

      {/* HEADER */}
      <div style={{position:"sticky",top:0,zIndex:100,background:"linear-gradient(180deg,#000 80%,transparent)",padding:"12px 16px 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:22,fontWeight:800,letterSpacing:-1,background:"linear-gradient(135deg,#FF2D55,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>TVING</span>
            <span style={{fontSize:11,color:"#aaa",background:"#1C1C1E",padding:"2px 8px",borderRadius:10}}>놀이터</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {lg&&<div style={{display:"flex",alignItems:"center",gap:4,background:"#1C1C1E",padding:"5px 10px",borderRadius:16}}><Ic.Coin /><span style={{fontSize:13,fontWeight:700,color:"#FFD60A"}}>{pt.toLocaleString()}P</span></div>}
            <button onClick={()=>lg?sLg(false):sLgM(true)} style={{background:lg?"#333":"#FF2D55",border:"none",padding:"6px 14px",borderRadius:16,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>{lg?"로그아웃":"로그인"}</button>
          </div>
        </div>
      </div>

      {/* ═══ HOME ═══ */}
      {tab==="home"&&<div style={{paddingBottom:80}}>
        {/* Hero Banner */}
        <div style={{position:"relative",height:300,marginBottom:8,overflow:"hidden"}}>
          <ShowImage src={h.bannerImage} title={h.title} genre={h.genre} color={h.tc} style={{position:"absolute",inset:0}}>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(0,0,0,0.3) 0%,rgba(0,0,0,0.1) 40%,rgba(0,0,0,0.8) 100%)"}} />
          </ShowImage>
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:24,zIndex:2}}>
            <div style={{display:"inline-block",padding:"4px 12px",background:`${h.tc}33`,border:`1px solid ${h.tc}66`,borderRadius:20,fontSize:11,color:h.tc,fontWeight:600,marginBottom:10}}>🔥 지금 가장 핫한</div>
            <div style={{fontSize:28,fontWeight:800,color:"#fff",marginBottom:6,textShadow:"0 2px 8px rgba(0,0,0,0.8)"}}>{h.title}</div>
            <div style={{fontSize:13,color:"#ddd",marginBottom:16,textShadow:"0 1px 4px rgba(0,0,0,0.8)"}}>{h.desc}</div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <a href={h.tvingUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 22px",background:"#FF2D55",borderRadius:24,color:"#fff",textDecoration:"none",fontWeight:600,fontSize:14}}><Ic.Play /> 클립 보러가기</a>
              <div style={{display:"flex",gap:4}}>{hs.map((_,i)=><div key={i} style={{width:i===hi?16:6,height:6,borderRadius:3,background:i===hi?"#FF2D55":"#555",transition:"all .3s"}}/>)}</div>
            </div>
          </div>
        </div>

        {/* Quick Menu */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,padding:"8px 16px 20px"}}>
          {[{i:"🆓",l:"무료 VOD",a:()=>sAllM(true)},{i:"📱",l:"쇼츠",a:()=>sTab("shorts")},{i:"🎮",l:"미니게임",a:()=>sTab("game")},{i:"📅",l:"공개일정",a:()=>sTab("sched")}].map((m,k)=><button key={k} onClick={m.a} style={{background:"#1C1C1E",border:"1px solid #222",borderRadius:14,padding:"14px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}><span style={{fontSize:24}}>{m.i}</span><span style={{fontSize:11,color:"#ccc"}}>{m.l}</span></button>)}
        </div>


        {/* 3Pack Banner */}
        <a href="https://www.tving.com/list/theme/3pack" target="_blank" rel="noopener noreferrer" style={{display:"block",margin:"0 16px 20px",borderRadius:14,overflow:"hidden",aspectRatio:"640/120",background:"linear-gradient(135deg,#141833,#1a1e3a,#0f1228)",position:"relative",textDecoration:"none"}}>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",gap:0}}>
            {/* Disney+ */}
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg viewBox="0 0 120 40" style={{width:"70%",maxWidth:110}}>
                <text x="10" y="30" fill="#fff" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="700" letterSpacing="-0.5">
                  <tspan>D</tspan><tspan fontSize="13">isney</tspan><tspan fontSize="18" dy="-6">+</tspan>
                </text>
                <path d="M10 34 Q60 38 110 32" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5"/>
              </svg>
            </div>
            {/* Divider */}
            <div style={{width:1,height:"40%",background:"rgba(255,255,255,0.2)"}}/>
            {/* TVING */}
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:22,fontWeight:900,color:"#FF0A2B",letterSpacing:1,fontFamily:"sans-serif"}}>TVING</span>
            </div>
            {/* Divider */}
            <div style={{width:1,height:"40%",background:"rgba(255,255,255,0.2)"}}/>
            {/* Wavve */}
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:20,fontWeight:800,color:"#1B6BFF",letterSpacing:0.5,fontFamily:"sans-serif"}}>Wavve</span>
            </div>
          </div>
        </a>

        {/* VOD */}
        <SH t="인기 VOD" s="지금 핫한 콘텐츠" onMore={()=>sAllM(true)} />
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 16px 20px"}}>
          {SHOWS.map(s=><div key={s.id} onClick={()=>sDet(s)} style={{minWidth:130,cursor:"pointer",flexShrink:0}}>
            <div style={{position:"relative",width:130,height:184,borderRadius:10,overflow:"hidden"}}>
              <ShowImage src={s.posterImage} title={s.title} genre={s.genre} color={s.tc}>
                <div style={{position:"absolute",top:6,left:6,padding:"2px 8px",background:s.tc,borderRadius:6,fontSize:10,fontWeight:700,color:"#fff",zIndex:2}}>{s.tag}</div>
                {!s.free&&!own.includes(s.id)&&<div style={{position:"absolute",top:6,right:6,color:"#FFD60A",zIndex:2}}><Ic.Lock /></div>}
                <div style={{position:"absolute",bottom:0,left:0,right:0,height:60,background:"linear-gradient(transparent,rgba(0,0,0,0.8))",zIndex:1}} />
              </ShowImage>
            </div>
            <div style={{marginTop:6}}><div style={{fontSize:13,fontWeight:600,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",width:130}}>{s.title}</div><div style={{fontSize:11,color:"#888",marginTop:2}}>{s.genre} · {s.ep}화</div></div>
          </div>)}
        </div>

        {/* Shorts */}
        <SH t="🔥 쇼츠" s="짧고 강렬한 클립" onMore={()=>sTab("shorts")} />
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 16px 20px"}}>
          {SHOWS.flatMap(s=>s.shorts.map((sh,i)=>({...sh,show:s,key:`${s.id}s${i}`}))).slice(0,8).map(it=><div key={it.key} style={{minWidth:110,flexShrink:0,cursor:"pointer"}} onClick={()=>it.show.tvingUrl?window.open(it.show.tvingUrl,'_blank','noopener,noreferrer'):sDet(it.show)}>
            <div style={{width:110,height:160,borderRadius:10,overflow:"hidden",position:"relative"}}>
              <ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 40%,rgba(0,0,0,0.8))"}} />
                <PlayBtn />
                <div style={{position:"absolute",bottom:6,left:6,right:6,zIndex:2}}><div style={{fontSize:10,color:"#fff",fontWeight:500,lineHeight:1.3,textShadow:"0 1px 3px #000"}}>{it.t}</div><div style={{fontSize:9,color:"#bbb",marginTop:2}}>{it.show.title}</div></div>
              </ShowImage>
            </div>
          </div>)}
        </div>

        {/* Clips */}
        <SH t="🎬 클립" s="놓치면 아쉬운 명장면" onMore={()=>sTab("clip")} />
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 16px 20px"}}>
          {SHOWS.flatMap(s=>s.clips.map((c,i)=>({...c,show:s,key:`${s.id}c${i}`}))).slice(0,8).map(it=><div key={it.key} style={{minWidth:220,flexShrink:0,cursor:"pointer"}} onClick={()=>it.url?window.open(it.url,'_blank','noopener,noreferrer'):sDet(it.show)}>
            <div style={{width:220,height:124,borderRadius:10,overflow:"hidden",position:"relative"}}>
              <ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,0.8))"}} />
                <PlayBtn size={36} />
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"16px 10px 8px",zIndex:2}}><div style={{fontSize:12,color:"#fff",fontWeight:500,textShadow:"0 1px 3px #000"}}>{it.t}</div><div style={{fontSize:10,color:"#bbb"}}>{it.show.title} · {it.e}</div></div>
              </ShowImage>
            </div>
          </div>)}
        </div>

        {/* Games */}
        <SH t="🎮 미니게임" s="게임하고 포인트!" onMore={()=>sTab("game")} />
        <div style={{display:"flex",gap:10,overflowX:"auto",padding:"0 16px 20px"}}>
          {GAMES.slice(0,3).map(g=><button key={g.id} onClick={()=>{if(g.id==="quiz"||g.id==="roulette"){sGm(g.id);sTab("game");}else tt("곧 오픈! 🎮");}} style={{minWidth:150,background:`linear-gradient(135deg,${g.c}22,#1C1C1E)`,border:`1px solid ${g.c}33`,borderRadius:14,padding:14,textAlign:"left",cursor:"pointer",flexShrink:0}}>
            <span style={{fontSize:28}}>{g.icon}</span><div style={{fontSize:13,fontWeight:600,color:"#fff",marginTop:8}}>{g.name}</div><div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}><Ic.Coin /><span style={{fontSize:11,color:"#FFD60A"}}>최대 {g.pts}P</span></div>
          </button>)}
        </div>

        <div style={{margin:"0 16px 20px",padding:20,background:"linear-gradient(135deg,#1a1025,#0a1520)",borderRadius:16,border:"1px solid #333"}}><div style={{fontSize:16,fontWeight:700,marginBottom:6}}>구독으로 더 즐기기</div><div style={{fontSize:12,color:"#999",marginBottom:14}}>유료 VOD 무제한 감상</div><button onClick={()=>sSubM(true)} style={{padding:"10px 20px",background:"linear-gradient(135deg,#FF2D55,#FF6B35)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>구독권 보기</button></div>
      </div>}

      {/* ═══ SHORTS ═══ */}
      {tab==="shorts"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 12px"}}><div style={{fontSize:20,fontWeight:700}}>쇼츠</div><div style={{fontSize:13,color:"#888",marginTop:2}}>세로형 숏폼</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 16px"}}>{SHOWS.flatMap(s=>s.shorts.map((sh,i)=>({...sh,show:s,key:`${s.id}s${i}`}))).map(it=><div key={it.key} style={{cursor:"pointer"}} onClick={()=>it.show.tvingUrl?window.open(it.show.tvingUrl,'_blank','noopener,noreferrer'):sDet(it.show)}><div style={{width:"100%",aspectRatio:"9/16",borderRadius:12,overflow:"hidden",position:"relative"}}><ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}><div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,0.8))"}}/><PlayBtn size={40}/><div style={{position:"absolute",bottom:8,left:8,right:8,zIndex:2}}><div style={{fontSize:12,fontWeight:600,color:"#fff",textShadow:"0 1px 4px #000"}}>{it.t}</div><div style={{fontSize:10,color:"#bbb",marginTop:2}}>{it.show.title}</div></div></ShowImage></div></div>)}</div>
      </div>}

      {/* ═══ CLIP ═══ */}
      {tab==="clip"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 12px"}}><div style={{fontSize:20,fontWeight:700}}>클립</div><div style={{fontSize:13,color:"#888",marginTop:2}}>가로형 하이라이트</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:12,padding:"0 16px"}}>{SHOWS.flatMap(s=>s.clips.map((c,i)=>({...c,show:s,key:`${s.id}c${i}`}))).map(it=><div key={it.key} style={{cursor:"pointer"}} onClick={()=>it.url?window.open(it.url,'_blank','noopener,noreferrer'):sDet(it.show)}><div style={{width:"100%",aspectRatio:"16/9",borderRadius:12,overflow:"hidden",position:"relative"}}><ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}><div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,0.8))"}}/><PlayBtn size={48}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 12px 10px",zIndex:2}}><div style={{fontSize:14,fontWeight:600,color:"#fff",textShadow:"0 1px 4px #000"}}>{it.t}</div><div style={{fontSize:12,color:"#bbb",marginTop:2}}>{it.show.title} · {it.e}</div></div></ShowImage></div></div>)}</div>
      </div>}

      {/* ═══ GAME ═══ */}
      {tab==="game"&&<div style={{paddingBottom:80}}>
        {gm==="quiz"?<div><div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px 12px"}}><button onClick={()=>sGm(null)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}><Ic.Bk/></button><div style={{fontSize:18,fontWeight:700}}>캐릭터 퀴즈</div></div><Quiz onDone={()=>sGm(null)} onRew={rew}/></div>
        :gm==="roulette"?<div><div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px 12px"}}><button onClick={()=>sGm(null)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}><Ic.Bk/></button><div style={{fontSize:18,fontWeight:700}}>추천 룰렛</div></div><Roulette onDone={()=>sGm(null)} onRew={rew}/></div>
        :<div><div style={{padding:"0 16px 12px"}}><div style={{fontSize:20,fontWeight:700}}>미니게임</div><div style={{fontSize:13,color:"#888",marginTop:2}}>게임하고 포인트!</div></div>{!lg&&<div style={{margin:"0 16px 16px",padding:"12px 16px",background:"rgba(255,45,85,.1)",border:"1px solid rgba(255,45,85,.3)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:13,color:"#FF8899"}}>로그인하면 포인트 적립!</span><button onClick={()=>sLgM(true)} style={{background:"#FF2D55",border:"none",borderRadius:8,color:"#fff",padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>로그인</button></div>}<div style={{display:"flex",flexDirection:"column",gap:12,padding:"0 16px"}}>{GAMES.map(g=><button key={g.id} onClick={()=>{if(g.id==="quiz"||g.id==="roulette")sGm(g.id);else tt("곧 오픈!");}} style={{display:"flex",alignItems:"center",gap:14,padding:16,background:"#1C1C1E",border:`1px solid ${g.c}33`,borderRadius:14,cursor:"pointer",textAlign:"left"}}><div style={{width:52,height:52,borderRadius:14,background:`${g.c}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.icon}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:"#fff"}}>{g.name}</div><div style={{fontSize:12,color:"#888",marginTop:2}}>{g.desc}</div></div><div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}><Ic.Coin/><span style={{fontSize:13,fontWeight:600,color:"#FFD60A"}}>{g.pts}P</span></div></button>)}</div></div>}
      </div>}

      {/* ═══ SCHEDULE ═══ */}
      {tab==="sched"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 16px"}}><div style={{fontSize:20,fontWeight:700}}>공개 일정</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 16px"}}>{SCHED.map((d,di)=>{const td=new Date().getDay();const mp=[6,0,1,2,3,4,5];const ti=mp[td];return<div key={d.day} style={{background:di===ti?"#1a1025":"#1C1C1E",border:di===ti?"1px solid #5856D6":"1px solid #222",borderRadius:14,padding:14,position:"relative"}}>{di===ti&&<div style={{position:"absolute",top:-8,right:12,background:"#5856D6",padding:"2px 10px",borderRadius:8,fontSize:10,fontWeight:700}}>오늘</div>}<div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:10,background:di===ti?"#5856D6":"#333",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,flexShrink:0}}>{d.day}</div><div style={{flex:1}}>{d.shows.length===0?<div style={{fontSize:13,color:"#555"}}>편성 없음</div>:d.shows.map((s,si)=><div key={si} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0"}}><div><span style={{fontSize:14,fontWeight:500}}>{s.t}</span><span style={{fontSize:12,color:"#888",marginLeft:8}}>{s.time}</span></div><span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:s.tag==="LIVE"?"#FF2D5533":s.tag==="NEW"?"#5856D633":"#FF950033",color:s.tag==="LIVE"?"#FF2D55":s.tag==="NEW"?"#5856D6":"#FF9500",fontWeight:600}}>{s.tag}</span></div>)}</div></div></div>;})}</div>
      </div>}

      {/* ═══ MY ═══ */}
      {tab==="my"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 20px"}}><div style={{fontSize:20,fontWeight:700}}>마이페이지</div></div>
        {!lg?<div style={{textAlign:"center",padding:"40px 16px"}}><div style={{width:80,height:80,borderRadius:"50%",background:"#1C1C1E",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",color:"#555"}}><Ic.User/></div><div style={{fontSize:16,fontWeight:600,marginBottom:4}}>로그인이 필요합니다</div><div style={{fontSize:13,color:"#888",marginBottom:20}}>티빙 계정으로 로그인</div><button onClick={()=>sLgM(true)} style={{padding:"12px 32px",background:"#FF2D55",border:"none",borderRadius:12,color:"#fff",fontWeight:600,fontSize:15,cursor:"pointer"}}>로그인</button></div>
        :<div style={{padding:"0 16px"}}><div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}><div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#FF2D55,#FF6B35)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff"}}><Ic.User/></div><div><div style={{fontSize:17,fontWeight:600}}>놀이터 사용자</div><div style={{fontSize:13,color:"#888"}}>tving_user@example.com</div></div></div>
          <div style={{background:"linear-gradient(135deg,#1a1a00,#1C1C1E)",border:"1px solid #333",borderRadius:14,padding:18,marginBottom:16}}><div style={{fontSize:13,color:"#888",marginBottom:6}}>보유 포인트</div><div style={{display:"flex",alignItems:"center",gap:8}}><Ic.Coin/><span style={{fontSize:28,fontWeight:800,color:"#FFD60A"}}>{pt.toLocaleString()}P</span></div></div>
          <div style={{background:"#1C1C1E",border:"1px solid #333",borderRadius:14,padding:18,marginBottom:16}}><div style={{fontSize:13,color:"#888",marginBottom:10}}>구매 콘텐츠</div>{own.length===0?<div style={{fontSize:14,color:"#555"}}>없음</div>:own.map(id=>{const s=SHOWS.find(x=>x.id===id);return s?<div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #222"}}><span style={{fontSize:14}}>{s.title}</span><Ic.Chk/></div>:null;})}</div>
          <button onClick={()=>sSubM(true)} style={{width:"100%",padding:16,background:"linear-gradient(135deg,#FF2D55,#FF6B35)",border:"none",borderRadius:14,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer"}}>🎁 구독권 보기</button></div>}
      </div>}

      {/* TAB BAR */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"#111",borderTop:"1px solid #222",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0)"}}>
        {[{k:"home",i:Ic.Home,l:"홈"},{k:"shorts",i:Ic.Shorts,l:"쇼츠"},{k:"clip",i:Ic.Clip,l:"클립"},{k:"game",i:Ic.Game,l:"게임"},{k:"sched",i:Ic.Cal,l:"일정"},{k:"my",i:Ic.User,l:"MY"}].map(t=><button key={t.k} onClick={()=>{sTab(t.k);sGm(null);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"10px 0 8px",background:"none",border:"none",color:tab===t.k?"#FF2D55":"#666",cursor:"pointer"}}><t.i/><span style={{fontSize:10,fontWeight:500}}>{t.l}</span></button>)}
      </div>

      {/* ═══ MODALS ═══ */}
      {det&&<Modal onClose={()=>sDet(null)}><div style={{padding:"0 20px 32px"}}>
        <div style={{width:"100%",height:200,borderRadius:12,overflow:"hidden",marginBottom:16}}><ShowImage src={det.bannerImage} title={det.title} genre={det.genre} color={det.tc} /></div>
        <div style={{fontSize:24,fontWeight:800,marginBottom:6}}>{det.title}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><span style={{padding:"3px 10px",background:det.tc,borderRadius:8,fontSize:11,fontWeight:700}}>{det.tag}</span><span style={{fontSize:12,color:"#888"}}>{det.rat} · {det.genre} · {det.ep}화</span></div>
        <div style={{fontSize:14,color:"#999",marginBottom:16,lineHeight:1.5}}>{det.desc}</div>
        <div style={{display:"flex",gap:8,marginBottom:20}}>
          <a href={det.tvingEpUrl} target="_blank" rel="noopener noreferrer" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,background:"#FF2D55",borderRadius:12,color:"#fff",textDecoration:"none",fontWeight:600,fontSize:14}}><Ic.Play/> TVING 보기</a>
          {!det.free&&!own.includes(det.id)&&<button onClick={()=>buy(det)} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,background:"#333",border:"none",borderRadius:12,color:"#FFD60A",fontWeight:600,fontSize:14,cursor:"pointer"}}><Ic.Coin/>{det.price?.toLocaleString()}P</button>}
          {!det.free&&own.includes(det.id)&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:12,background:"#1a2a1a",borderRadius:12,color:"#34C759",fontWeight:600,fontSize:14}}><Ic.Chk/>구매완료</div>}
        </div>
        <div style={{fontSize:15,fontWeight:700,marginBottom:10}}>클립</div>
        {det.clips.map((c,i)=><div key={i} onClick={()=>c.url&&window.open(c.url,'_blank','noopener,noreferrer')} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid #222",cursor:"pointer"}}>
          <div style={{width:100,height:56,borderRadius:8,overflow:"hidden",flexShrink:0,position:"relative"}}><ShowImage src={c.thumb || det.posterImage} title={c.t} color={det.tc}><div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.3)"}}/><PlayBtn size={24}/></ShowImage></div>
          <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.t}</div><div style={{fontSize:11,color:"#888"}}>{c.e}</div></div>
        </div>)}
        <div style={{fontSize:15,fontWeight:700,margin:"16px 0 10px"}}>쇼츠</div>
        <div style={{display:"flex",gap:8,overflowX:"auto"}}>{det.shorts.map((sh,i)=><div key={i} onClick={()=>det.tvingUrl&&window.open(det.tvingUrl,'_blank','noopener,noreferrer')} style={{minWidth:100,flexShrink:0,cursor:"pointer"}}><div style={{width:100,height:140,borderRadius:10,overflow:"hidden",position:"relative"}}><ShowImage src={sh.thumb || det.posterImage} title={sh.t} color={det.tc}><div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,0.8))"}}/><PlayBtn/><div style={{position:"absolute",bottom:6,left:6,right:6,fontSize:10,color:"#fff",textShadow:"0 1px 3px #000",zIndex:2}}>{sh.t}</div></ShowImage></div></div>)}</div>
      </div></Modal>}

      {lgM&&<Modal onClose={()=>sLgM(false)}><div style={{padding:"8px 20px 32px",textAlign:"center"}}><div style={{fontSize:28,fontWeight:800,background:"linear-gradient(135deg,#FF2D55,#FF6B35)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:8}}>TVING</div><div style={{fontSize:16,fontWeight:600,marginBottom:4}}>놀이터에 오신 걸 환영해요!</div><div style={{fontSize:13,color:"#888",marginBottom:24}}>로그인하면 포인트 적립, 구매 등 가능</div><button onClick={()=>{sLg(true);sLgM(false);tt("로그인 완료! 🎉");}} style={{width:"100%",padding:14,background:"#FF2D55",border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",marginBottom:10}}>티빙 ID로 로그인</button><button onClick={()=>sLgM(false)} style={{width:"100%",padding:14,background:"#333",border:"none",borderRadius:12,color:"#999",fontWeight:600,fontSize:14,cursor:"pointer"}}>나중에</button></div></Modal>}

      {subM&&<Modal onClose={()=>sSubM(false)}><div style={{padding:"8px 20px 32px"}}><div style={{fontSize:20,fontWeight:700,marginBottom:20}}>구독권</div>{SUBS.map((s,i)=><div key={i} style={{background:"#111",border:`1px solid ${s.c}44`,borderRadius:14,padding:18,marginBottom:10,position:"relative"}}>{i===2&&<div style={{position:"absolute",top:0,right:0,background:s.c,padding:"4px 12px",borderRadius:"0 0 0 10px",fontSize:10,fontWeight:700}}>추천</div>}<div style={{fontSize:16,fontWeight:700,color:s.c}}>{s.name}</div><div style={{fontSize:22,fontWeight:800,marginBottom:10}}>₩{s.price.toLocaleString()}<span style={{fontSize:13,color:"#888",fontWeight:400}}>/월</span></div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{s.ft.map((f,fi)=><span key={fi} style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:"#aaa"}}><Ic.Chk/>{f}</span>)}</div><button onClick={()=>{tt(`${s.name} 구독!`);sSubM(false);}} style={{width:"100%",marginTop:12,padding:10,background:`${s.c}22`,border:`1px solid ${s.c}44`,borderRadius:10,color:s.c,fontWeight:600,fontSize:14,cursor:"pointer"}}>구독하기</button></div>)}</div></Modal>}

      {allM&&<Modal onClose={()=>sAllM(false)}><div style={{padding:"8px 20px 32px"}}><div style={{fontSize:20,fontWeight:700,marginBottom:16}}>전체 VOD</div>{SHOWS.map(s=><div key={s.id} onClick={()=>{sAllM(false);sDet(s);}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:"1px solid #222",cursor:"pointer"}}><div style={{width:56,height:56,borderRadius:10,overflow:"hidden",flexShrink:0}}><ShowImage src={s.posterImage} title={s.title} color={s.tc}/></div><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14,fontWeight:600}}>{s.title}</span><span style={{padding:"1px 6px",background:s.tc,borderRadius:4,fontSize:9,fontWeight:700}}>{s.tag}</span></div><div style={{fontSize:12,color:"#888",marginTop:2}}>{s.genre} · {s.ep}화</div></div><div style={{flexShrink:0}}>{s.free?<span style={{fontSize:12,color:"#34C759",fontWeight:600}}>무료</span>:own.includes(s.id)?<Ic.Chk/>:<span style={{fontSize:12,color:"#FFD60A",fontWeight:600}}>{s.price?.toLocaleString()}P</span>}</div></div>)}</div></Modal>}

      {tst&&<div style={{position:"fixed",top:60,left:"50%",transform:"translateX(-50%)",background:"#333",color:"#fff",padding:"10px 20px",borderRadius:12,fontSize:14,fontWeight:500,zIndex:300,boxShadow:"0 4px 20px #0008",animation:"fi .3s"}}>{tst}</div>}
    </div>
  );
}
