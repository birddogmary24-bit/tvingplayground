import { useState, useEffect, useRef } from "react";
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

// ─── localStorage 헬퍼 ──────────────────────────────────────
const LS_KEY = "tving_user";
const loadUser = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch { return null; } };
const saveUser = u => localStorage.setItem(LS_KEY, JSON.stringify(u));

// ─── 닉네임 풀 & 프로필 생성 ─────────────────────────────────
const NICK_ADJ = ["행복한","용감한","빠른","귀여운","멋진","신비한","당당한","재밌는","따뜻한","반짝이는","배고픈","졸린","활발한","현명한","유쾌한"];
const NICK_NOUN = ["곰","사자","토끼","펭귄","고양이","강아지","여우","올빼미","코알라","판다","호랑이","돌고래","다람쥐","수달","너구리"];
const AVATARS = ["🐻","🦁","🐰","🐧","🐱","🐶","🦊","🦉","🐨","🐼","🐯","🐬","🐿️","🦦","🦝"];
function generateUser() {
  const ai = Math.floor(Math.random() * NICK_ADJ.length);
  const ni = Math.floor(Math.random() * NICK_NOUN.length);
  return { id:"usr_"+Math.random().toString(16).slice(2,8), nickname:NICK_ADJ[ai]+NICK_NOUN[ni], avatar:AVATARS[ni], totalPt:120, gamesPlayed:0, history:[] };
}

// ─── 레벨 시스템 ─────────────────────────────────────────────
const LEVELS = [
  { lv:1, min:0,    name:"뉴비",   badge:"🌱", c:"#8E8E93" },
  { lv:2, min:100,  name:"루키",   badge:"⭐", c:"#34C759" },
  { lv:3, min:300,  name:"챌린저", badge:"🔥", c:"#FF9500" },
  { lv:4, min:600,  name:"마스터", badge:"💎", c:"#5856D6" },
  { lv:5, min:1000, name:"레전드", badge:"👑", c:"#FFD60A" },
  { lv:6, min:2000, name:"티빙킹", badge:"🏆", c:"#FF2D55" },
];
function getLevel(tp) { for(let i=LEVELS.length-1;i>=0;i--) if(tp>=LEVELS[i].min) return LEVELS[i]; return LEVELS[0]; }
function getLvProgress(tp) {
  const cur=getLevel(tp); const idx=LEVELS.findIndex(l=>l.lv===cur.lv); const next=LEVELS[idx+1];
  if(!next) return {cur,next:null,pct:100};
  return {cur,next,pct:Math.floor(((tp-cur.min)/(next.min-cur.min))*100)};
}

// ─── 가짜 유저 (랭킹용) ──────────────────────────────────────
const FAKE_USERS = [
  { id:"bot_01", nickname:"빠른사자",      avatar:"🦁", totalPt:1850 },
  { id:"bot_02", nickname:"용감한독수리",  avatar:"🦅", totalPt:1420 },
  { id:"bot_03", nickname:"귀여운판다",    avatar:"🐼", totalPt:1100 },
  { id:"bot_04", nickname:"신비한올빼미",  avatar:"🦉", totalPt:980  },
  { id:"bot_05", nickname:"멋진호랑이",    avatar:"🐯", totalPt:850  },
  { id:"bot_06", nickname:"재밌는돌고래",  avatar:"🐬", totalPt:720  },
  { id:"bot_07", nickname:"당당한여우",    avatar:"🦊", totalPt:650  },
  { id:"bot_08", nickname:"활발한토끼",    avatar:"🐰", totalPt:500  },
  { id:"bot_09", nickname:"따뜻한코알라",  avatar:"🐨", totalPt:430  },
  { id:"bot_10", nickname:"반짝이는고양이",avatar:"🐱", totalPt:350  },
  { id:"bot_11", nickname:"현명한수달",    avatar:"🦦", totalPt:280  },
  { id:"bot_12", nickname:"유쾌한너구리",  avatar:"🦝", totalPt:200  },
  { id:"bot_13", nickname:"배고픈강아지",  avatar:"🐶", totalPt:120  },
  { id:"bot_14", nickname:"졸린펭귄",      avatar:"🐧", totalPt:60   },
  { id:"bot_15", nickname:"행복한다람쥐",  avatar:"🐿️", totalPt:30   },
];

// ─── 상대 시간 ──────────────────────────────────────────────
const relTime = ts => {
  const d=Date.now()-ts;
  if(d<60000) return "방금 전"; if(d<3600000) return `${Math.floor(d/60000)}분 전`;
  if(d<86400000) return `${Math.floor(d/3600000)}시간 전`; if(d<604800000) return `${Math.floor(d/86400000)}일 전`;
  return new Date(ts).toLocaleDateString("ko-KR");
};
const GAME_ICONS = { quiz:"🧩", roulette:"🎰", famousscene:"🎬", wordchain:"💬" };
const GAME_NAMES = { quiz:"캐릭터 퀴즈", roulette:"추천 룰렛", famousscene:"명장면 모드", wordchain:"끝말잇기" };

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
  { id:"catgame", name:"야옹이 키우기", desc:"고양이를 키워보세요!", icon:"🐱", pts:0, c:"#FF69B4" },
  { id:"quiz", name:"캐릭터 퀴즈", desc:"환승연애4 퀴즈", icon:"🧩", pts:50, c:"#FF2D55" },
  { id:"roulette", name:"추천 룰렛", desc:"랜덤 콘텐츠 추천", icon:"🎰", pts:30, c:"#FF9500" },
  { id:"memory", name:"명장면 모드", desc:"장면 보고 맞추기", icon:"🎬", pts:80, c:"#5856D6" },
  { id:"wordchain", name:"끝말잇기", desc:"드라마 제목 잇기", icon:"💬", pts:40, c:"#34C759" },
];

// ─── CAT GAME DATA ──────────────────────────────────────────────
const CAT_PROFILES = [
  { id:"gs", name:"정기석", emoji:"😎" },
  { id:"yj", name:"이용진", emoji:"🤗" },
  { id:"yw", name:"김예원", emoji:"😊" },
  { id:"yr", name:"유라", emoji:"💫" },
  { id:"mk", name:"곽민경", emoji:"🌸" },
  { id:"wj", name:"김우진", emoji:"🔥" },
];

const CAT_TYPES = [
  { id:"cheese", name:"치즈냥", bodyColor:"#F5A623", stripeColor:"#E8912D", desc:"따뜻한 주황빛 치즈태비" },
  { id:"black", name:"까만냥", bodyColor:"#2C2C2E", stripeColor:"#1C1C1E", desc:"신비로운 검은 고양이" },
  { id:"white", name:"하양냥", bodyColor:"#F5F5F7", stripeColor:"#E8E8EA", desc:"순백의 하얀 고양이" },
  { id:"calico", name:"삼색냥", bodyColor:"#F5F5F7", stripeColor:"#F5A623", patchColor:"#2C2C2E", desc:"세 가지 색 삼색이" },
  { id:"russian", name:"러시안블루", bodyColor:"#8E8E93", stripeColor:"#6E6E73", desc:"우아한 회색빛 블루" },
  { id:"siamese", name:"샴냥", bodyColor:"#F5E6D3", stripeColor:"#8B6914", desc:"크림빛 샴 포인트" },
  { id:"tuxedo", name:"턱시도냥", bodyColor:"#2C2C2E", stripeColor:"#F5F5F7", desc:"젠틀한 턱시도 무늬" },
  { id:"scottish", name:"스코티쉬냥", bodyColor:"#D4A574", stripeColor:"#B8956A", desc:"접힌 귀가 매력적" },
];

// 레벨업 필요 약 수 계산
const getLevelReq = (lv) => {
  const tier = Math.floor((lv - 1) / 10); // 0~9
  const redMul = [2, 3, 5, 8, 12, 18, 25, 35, 50, 70];
  const bluMul = [1, 2, 3, 5, 8, 12, 16, 22, 30, 45];
  return {
    red: lv * (redMul[tier] || 70),
    blue: lv * (bluMul[tier] || 45),
  };
};

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
  const pick=k=>{if(sel!==null)return;sSel(k);const ok=k===qs[i].a;if(ok)sSc(s=>s+1);setTimeout(()=>{if(i<qs.length-1){sI(i+1);sSel(null);}else{sDn(true);onRew(sc*15+(ok?15:0),"quiz",{correct:sc+(ok?1:0),total:qs.length});}},700);};
  if(dn)return<div style={{padding:24,textAlign:"center"}}><div style={{fontSize:48,marginBottom:16}}>🎉</div><div style={{fontSize:22,fontWeight:700,color:"#fff",marginBottom:8}}>퀴즈 완료!</div><div style={{fontSize:16,color:"#aaa",marginBottom:16}}>{qs.length}문제 중 {sc}문제 정답</div><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:24}}><Ic.Coin /><span style={{fontSize:20,fontWeight:700,color:"#FFD60A"}}>+{sc*15}P</span></div><button onClick={onDone} style={{padding:"12px 32px",background:"#FF2D55",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:600,cursor:"pointer"}}>돌아가기</button></div>;
  return<div style={{padding:20}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><span style={{color:"#aaa",fontSize:14}}>{i+1}/{qs.length}</span><div style={{display:"flex",alignItems:"center",gap:4}}><Ic.Coin /><span style={{color:"#FFD60A",fontWeight:600}}>{sc*15}P</span></div></div><div style={{width:"100%",height:4,background:"#333",borderRadius:2,marginBottom:24}}><div style={{width:`${((i+1)/qs.length)*100}%`,height:"100%",background:"#FF2D55",borderRadius:2,transition:"width .3s"}}/></div><div style={{fontSize:18,fontWeight:600,color:"#fff",marginBottom:24,lineHeight:1.5}}>{qs[i].q}</div><div style={{display:"flex",flexDirection:"column",gap:10}}>{qs[i].o.map((op,k)=>{let bg="#1C1C1E",bd="1px solid #333";if(sel!==null){if(k===qs[i].a){bg="rgba(52,199,89,.15)";bd="1px solid #34C759";}else if(k===sel){bg="rgba(255,45,85,.15)";bd="1px solid #FF2D55";}}return<button key={k} onClick={()=>pick(k)} style={{padding:"14px 16px",background:bg,border:bd,borderRadius:12,color:"#fff",fontSize:15,textAlign:"left",cursor:"pointer"}}><span style={{fontWeight:600,marginRight:10,color:"#888"}}>{String.fromCharCode(65+k)}</span>{op}</button>;})}</div></div>;
}

function Roulette({ onDone, onRew }) {
  const [sp,sSp]=useState(false);const [res,sRes]=useState(null);
  const go=()=>{if(sp)return;sSp(true);setTimeout(()=>{sRes(SHOWS[Math.floor(Math.random()*SHOWS.length)]);sSp(false);onRew(30,"roulette");},2000);};
  return<div style={{padding:24,textAlign:"center"}}><div style={{width:200,height:200,margin:"0 auto 24px",borderRadius:"50%",border:"4px solid #FF9500",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",background:sp?"conic-gradient(#FF2D55,#FF9500,#FFD60A,#34C759,#5856D6,#FF2D55)":"#1C1C1E",animation:sp?"rl .5s linear infinite":"none"}}><style>{`@keyframes rl{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>{res&&!sp?<div style={{background:"#1C1C1E",borderRadius:"50%",width:160,height:160,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:14,color:"#aaa"}}>오늘의 추천</div><div style={{fontSize:18,fontWeight:700,color:"#fff",marginTop:4}}>{res.title}</div></div>:!sp?<div style={{background:"#1C1C1E",borderRadius:"50%",width:160,height:160,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:40}}>🎰</span></div>:null}</div>{res&&!sp&&<div style={{marginBottom:16}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:12}}><Ic.Coin /><span style={{color:"#FFD60A",fontWeight:700}}>+30P</span></div></div>}<button onClick={res?onDone:go} style={{marginTop:12,padding:"12px 32px",background:res?"#333":"#FF9500",color:"#fff",border:"none",borderRadius:12,fontSize:16,fontWeight:600,cursor:"pointer"}}>{sp?"돌리는 중...":res?"돌아가기":"룰렛 돌리기!"}</button></div>;
}

function FamousScene({ onDone, onRew }) {
  const allQ = [
    // show 타입: 이 장면은 어떤 프로그램?
    { img:"https://image.tving.com/ntgs/news/clip/20260129123142/thumbnail/L00000276855.png",
      q:"이 장면은 어떤 프로그램인가요?", o:["환승연애4","친애하는X","우주를 줄게","대탈출 더스토리"], a:0 },
    { img:"https://image.tving.com/ntgs/news/clip/20250802131121/thumbnail/L00000026436.png",
      q:"이 장면은 어떤 프로그램인가요?", o:["유퀴즈온더블럭","쇼미더머니12","대탈출 더스토리","환승연애4"], a:2 },
    { img:"https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20251021/1250/P001776344.jpg",
      q:"이 장면은 어떤 드라마인가요?", o:["판사 이한영","우주를 줄게","친애하는X","환승연애4"], a:2 },
    { img:"https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20251205/0815/P001780004.jpg",
      q:"이 장면은 어떤 드라마인가요?", o:["친애하는X","우주를 줄게","쇼미더머니12","판사 이한영"], a:3 },
    { img:"https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20260128/0816/P001782227.jpg",
      q:"이 장면은 어떤 드라마인가요?", o:["환승연애4","우주를 줄게","친애하는X","판사 이한영"], a:1 },
    // cast 타입: 출연진 맞추기
    { img:"https://image.tving.com/ntgs/news/clip/20260227005650/thumbnail/L00000292254.png",
      q:"유퀴즈온더블럭의 MC 조합은?", o:["유재석&조세호","강호동&이수근","신동엽&전현무","이경규&유세윤"], a:0 },
    { img:"https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20251021/1250/P001776344.jpg",
      q:"친애하는X의 주연 배우는?", o:["한소희","수지","김유정","아이유"], a:2 },
    { img:"https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20251205/0815/P001780004.jpg",
      q:"판사 이한영 역을 맡은 배우는?", o:["이종석","지성","남궁민","조승우"], a:1 },
    { img:"https://image.tving.com/ntgs/news/clip/20250802130921/thumbnail/L00000026432.png",
      q:"대탈출에서 '에이스 듀오'로 불리는 조합은?", o:["강호동&김동현","유병재&여진구","백현&고경표","김동현&유병재"], a:2 },
    { img:"https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20260128/0816/P001782227.jpg",
      q:"우주를 줄게의 남자 주인공은?", o:["박서함","배인혁","김영대","김도훈"], a:1 },
    // desc 타입: 상황 맞추기
    { img:"https://image.tving.com/ntgs/news/clip/20260129120933/thumbnail/L00000276847.png",
      q:"환승연애4에서 이 장면의 상황은?", o:["최종 선택의 순간","7살 차이 친구의 대화","첫 만남 입주 날","진실 게임 타임"], a:1 },
    { img:"https://image.tving.com/ntgs/news/clip/20250726154206/thumbnail/L00000022236.png",
      q:"대탈출에서 이 장면의 상황은?", o:["먹방 타임","후일담 버스 토크","첫 화 맹활약 추리","무당집 탈출"], a:2 },
    { img:"https://image.tving.com/ntgs/news/clip/20260214014749/thumbnail/L00000285830.png",
      q:"쇼미더머니12에서 이 장면은?", o:["60초 랩 미션","4:4 팀 미션","송캠프 듀엣","프로듀서 선택"], a:1 },
    { img:"https://image.tving.com/ntgs/news/clip/20260122154905/thumbnail/L00000273076.png",
      q:"환승연애4 이 장면의 분위기는?", o:["즐거운 파티","아쉬운 이별","힘들었던 감정 토로","설레는 첫 만남"], a:2 },
    { img:"https://image.tving.com/ntgs/news/clip/20250816193508/thumbnail/L00000033831.jpg",
      q:"대탈출 더스토리 이 장면은?", o:["탈출 성공 순간","무서운 함정","후일담 버스 토크","조선시대 미션"], a:2 },
  ];

  const [qs] = useState(() => [...allQ].sort(() => Math.random() - 0.5).slice(0, 6));
  const [i, sI] = useState(0);
  const [sc, sSc] = useState(0);
  const [sel, sSel] = useState(null);
  const [dn, sDn] = useState(false);

  const pick = k => {
    if (sel !== null) return;
    sSel(k);
    const ok = k === qs[i].a;
    if (ok) sSc(s => s + 1);
    setTimeout(() => {
      if (i < qs.length - 1) { sI(i + 1); sSel(null); }
      else { sDn(true); onRew(sc * 13 + (ok ? 13 : 0), "famousscene", { correct: sc + (ok ? 1 : 0), total: qs.length }); }
    }, 700);
  };

  if (dn) return (
    <div style={{ padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", marginBottom: 8 }}>명장면 모드 완료!</div>
      <div style={{ fontSize: 16, color: "#aaa", marginBottom: 16 }}>{qs.length}문제 중 {sc}문제 정답</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24 }}>
        <Ic.Coin /><span style={{ fontSize: 20, fontWeight: 700, color: "#FFD60A" }}>+{sc * 13}P</span>
      </div>
      <button onClick={onDone} style={{ padding: "12px 32px", background: "#FF2D55", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>돌아가기</button>
    </div>
  );

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ color: "#aaa", fontSize: 14 }}>{i + 1}/{qs.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Ic.Coin /><span style={{ color: "#FFD60A", fontWeight: 600 }}>{sc * 13}P</span></div>
      </div>
      <div style={{ width: "100%", height: 4, background: "#333", borderRadius: 2, marginBottom: 16 }}>
        <div style={{ width: `${((i + 1) / qs.length) * 100}%`, height: "100%", background: "#5856D6", borderRadius: 2, transition: "width .3s" }} />
      </div>
      <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <ShowImage src={qs[i].img} title="명장면" genre="" color="#5856D6" />
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#fff", marginBottom: 16, lineHeight: 1.5 }}>{qs[i].q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {qs[i].o.map((op, k) => {
          let bg = "#1C1C1E", bd = "1px solid #333";
          if (sel !== null) {
            if (k === qs[i].a) { bg = "rgba(52,199,89,.15)"; bd = "1px solid #34C759"; }
            else if (k === sel) { bg = "rgba(255,45,85,.15)"; bd = "1px solid #FF2D55"; }
          }
          return <button key={k} onClick={() => pick(k)} style={{ padding: "14px 16px", background: bg, border: bd, borderRadius: 12, color: "#fff", fontSize: 15, textAlign: "left", cursor: "pointer" }}>
            <span style={{ fontWeight: 600, marginRight: 10, color: "#888" }}>{String.fromCharCode(65 + k)}</span>{op}
          </button>;
        })}
      </div>
    </div>
  );
}

function CatSVG({ cat, size = 200, blink }) {
  const b = cat.bodyColor;
  const s = cat.stripeColor;
  const isScottish = cat.id === "scottish";
  const isCalico = cat.id === "calico";
  const eyeH = blink ? 1 : 18;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {/* 꼬리 */}
      <path d="M 155 150 Q 185 120 175 90 Q 170 75 160 80" stroke={s} strokeWidth="8" fill="none" strokeLinecap="round" style={{animation:"catTail 2s ease-in-out infinite"}} />
      {/* 몸통 */}
      <ellipse cx="100" cy="155" rx="50" ry="35" fill={b} />
      {/* 삼색 패치 */}
      {isCalico && <><circle cx="85" cy="145" r="12" fill={cat.patchColor} opacity="0.7" /><circle cx="115" cy="160" r="10" fill={cat.stripeColor} opacity="0.8" /></>}
      {/* 머리 */}
      <circle cx="100" cy="100" r="42" fill={b} />
      {/* 귀 */}
      {isScottish ? <>
        <path d="M 65 68 L 58 48 L 78 62 Z" fill={b} />
        <path d="M 135 68 L 142 48 L 122 62 Z" fill={b} />
        <path d="M 68 65 Q 65 58 75 63" fill={s} strokeWidth="0" />
        <path d="M 132 65 Q 135 58 125 63" fill={s} strokeWidth="0" />
      </> : <>
        <path d="M 65 72 L 55 40 L 82 62 Z" fill={b} />
        <path d="M 135 72 L 145 40 L 118 62 Z" fill={b} />
        <path d="M 67 68 L 60 48 L 78 63 Z" fill="#FFB6C1" opacity="0.5" />
        <path d="M 133 68 L 140 48 L 122 63 Z" fill="#FFB6C1" opacity="0.5" />
      </>}
      {/* 눈 - 큰 눈 + 글썽거리는 효과 */}
      <ellipse cx="82" cy="96" rx="12" ry={eyeH/2+3} fill="white" />
      <ellipse cx="118" cy="96" rx="12" ry={eyeH/2+3} fill="white" />
      <ellipse cx="84" cy="97" rx="7" ry={Math.min(eyeH/2+1, 8)} fill="#2C2C2E" />
      <ellipse cx="120" cy="97" rx="7" ry={Math.min(eyeH/2+1, 8)} fill="#2C2C2E" />
      {/* 눈 하이라이트 (글썽거림) */}
      {!blink && <>
        <circle cx="87" cy="93" r="3" fill="white" opacity="0.9" />
        <circle cx="123" cy="93" r="3" fill="white" opacity="0.9" />
        <circle cx="82" cy="99" r="1.5" fill="white" opacity="0.5" />
        <circle cx="118" cy="99" r="1.5" fill="white" opacity="0.5" />
        {/* 눈물방울 반짝임 */}
        <circle cx="93" cy="102" r="2" fill="#87CEEB" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="107" cy="102" r="2" fill="#87CEEB" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
      </>}
      {/* 코 */}
      <path d="M 97 108 L 100 112 L 103 108 Z" fill="#FFB6C1" />
      {/* 입 */}
      <path d="M 100 112 Q 93 118 88 114" stroke={s === "#1C1C1E" ? "#555" : "#333"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 100 112 Q 107 118 112 114" stroke={s === "#1C1C1E" ? "#555" : "#333"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 수염 */}
      <line x1="60" y1="104" x2="80" y2="107" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      <line x1="58" y1="112" x2="79" y2="112" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      <line x1="120" y1="107" x2="140" y2="104" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      <line x1="121" y1="112" x2="142" y2="112" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      {/* 앞발 */}
      <ellipse cx="80" cy="180" rx="14" ry="8" fill={b} />
      <ellipse cx="120" cy="180" rx="14" ry="8" fill={b} />
    </svg>
  );
}

// ─── CAT GAME ───────────────────────────────────────────────────
function CatGame({ onDone, onGoShorts, onGoClip }) {
  // localStorage에서 저장된 데이터 로드
  const loadSave = () => {
    try {
      const d = localStorage.getItem("catgame_save");
      return d ? JSON.parse(d) : null;
    } catch { return null; }
  };
  const saved = loadSave();

  const [phase, setPhase] = useState(saved ? "main" : "profile"); // profile → cat → main
  const [profile, setProfile] = useState(saved?.profile || null);
  const [cat, setCat] = useState(saved?.cat || null);
  const [level, setLevel] = useState(saved?.level || 1);
  const [redPills, setRedPills] = useState(saved?.redPills || 0);
  const [bluePills, setBluePills] = useState(saved?.bluePills || 0);
  const [lastCheck, setLastCheck] = useState(saved?.lastCheck || null);
  const [blink, setBlink] = useState(false);
  const [lvUpAnim, setLvUpAnim] = useState(false);
  const [pillAnim, setPillAnim] = useState(null); // "red" | "blue" | null
  const [showReset, setShowReset] = useState(false);

  // 저장
  const save = (data) => {
    localStorage.setItem("catgame_save", JSON.stringify(data));
  };

  // 눈 깜빡임
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // 오늘 출석 했는지
  const today = new Date().toISOString().split("T")[0];
  const checkedToday = lastCheck === today;

  // 레벨업 요구사항
  const req = getLevelReq(level);
  const canLevelUp = level < 99 && redPills >= req.red && bluePills >= req.blue;
  const redProgress = Math.min(redPills / req.red, 1);
  const blueProgress = Math.min(bluePills / req.blue, 1);

  // 프로필 선택
  const pickProfile = (p) => {
    setProfile(p);
    setPhase("cat");
  };

  // 고양이 선택
  const pickCat = (c) => {
    setCat(c);
    setPhase("main");
    const data = { profile, cat: c, level: 1, redPills: 0, bluePills: 0, lastCheck: null };
    save(data);
  };

  // 출석체크
  const doCheck = () => {
    if (checkedToday) return;
    const newBlue = bluePills + 1;
    setBluePills(newBlue);
    setLastCheck(today);
    setPillAnim("blue");
    setTimeout(() => setPillAnim(null), 1200);
    save({ profile, cat, level, redPills, bluePills: newBlue, lastCheck: today });
  };

  // 레벨업
  const doLevelUp = () => {
    if (!canLevelUp) return;
    const newRed = redPills - req.red;
    const newBlue = bluePills - req.blue;
    const newLv = level + 1;
    setRedPills(newRed);
    setBluePills(newBlue);
    setLevel(newLv);
    setLvUpAnim(true);
    setTimeout(() => setLvUpAnim(false), 2000);
    save({ profile, cat, level: newLv, redPills: newRed, bluePills: newBlue, lastCheck });
  };

  // 리셋
  const doReset = () => {
    localStorage.removeItem("catgame_save");
    setPhase("profile");
    setProfile(null);
    setCat(null);
    setLevel(1);
    setRedPills(0);
    setBluePills(0);
    setLastCheck(null);
    setShowReset(false);
  };

  // ─ 프로필 선택 화면 ─
  if (phase === "profile") return (
    <div style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:32,marginBottom:8}}>🐱</div>
        <div style={{fontSize:20,fontWeight:700,color:"#fff",marginBottom:4}}>야옹이 키우기</div>
        <div style={{fontSize:13,color:"#888"}}>환승연애4 주인공으로 시작하기</div>
      </div>
      <div style={{fontSize:14,fontWeight:600,color:"#aaa",marginBottom:12}}>프로필 선택</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {CAT_PROFILES.map(p => (
          <button key={p.id} onClick={() => pickProfile(p)} style={{
            padding:"16px 8px",background:"#1C1C1E",border:"1px solid #333",borderRadius:14,
            cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6
          }}>
            <span style={{fontSize:32}}>{p.emoji}</span>
            <span style={{fontSize:13,fontWeight:600,color:"#fff"}}>{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ─ 고양이 선택 화면 ─
  if (phase === "cat") return (
    <div style={{padding:20}}>
      <div style={{textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:14,color:"#FF69B4",fontWeight:600,marginBottom:4}}>{profile.name}님의</div>
        <div style={{fontSize:18,fontWeight:700,color:"#fff",marginBottom:4}}>고양이를 선택하세요</div>
        <div style={{fontSize:12,color:"#888"}}>함께할 고양이 한 마리를 골라주세요</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {CAT_TYPES.map(c => (
          <button key={c.id} onClick={() => pickCat(c)} style={{
            padding:12,background:"#1C1C1E",border:"1px solid #333",borderRadius:14,
            cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4
          }}>
            <CatSVG cat={c} size={80} blink={false} />
            <span style={{fontSize:13,fontWeight:600,color:"#fff"}}>{c.name}</span>
            <span style={{fontSize:11,color:"#888"}}>{c.desc}</span>
          </button>
        ))}
      </div>
      <button onClick={() => setPhase("profile")} style={{
        width:"100%",marginTop:12,padding:12,background:"#333",border:"none",
        borderRadius:12,color:"#888",fontSize:14,cursor:"pointer"
      }}>뒤로</button>
    </div>
  );

  // ─ 메인 화면 ─
  const catData = cat ? CAT_TYPES.find(c => c.id === cat.id) || cat : CAT_TYPES[0];

  return (
    <div style={{padding:20}}>
      <style>{`
        @keyframes catTail { 0%,100% { d: path("M 155 150 Q 185 120 175 90 Q 170 75 160 80"); } 50% { d: path("M 155 150 Q 190 130 180 95 Q 175 80 165 85"); } }
        @keyframes lvUp { 0% { transform: scale(1); } 25% { transform: scale(1.15); } 50% { transform: scale(1); } 75% { transform: scale(1.1); } 100% { transform: scale(1); } }
        @keyframes pillPop { 0% { opacity:1; transform: translateY(0); } 100% { opacity:0; transform: translateY(-40px); } }
        @keyframes sparkle { 0%,100% { opacity:0; transform: scale(0.5) rotate(0deg); } 50% { opacity:1; transform: scale(1.2) rotate(180deg); } }
      `}</style>

      {/* 프로필 + 레벨 */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:22}}>{profile?.emoji}</span>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#fff"}}>{profile?.name}</div>
            <div style={{fontSize:11,color:"#888"}}>집사</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{
            padding:"4px 12px",background:"linear-gradient(135deg,#FFD60A22,#FF950022)",
            border:"1px solid #FFD60A44",borderRadius:20,fontSize:13,fontWeight:700,color:"#FFD60A"
          }}>Lv.{level}</div>
          <button onClick={() => setShowReset(!showReset)} style={{
            background:"none",border:"none",color:"#555",fontSize:16,cursor:"pointer",padding:4
          }}>...</button>
        </div>
      </div>

      {showReset && <div style={{marginBottom:12,padding:12,background:"#1C1C1E",borderRadius:10,
        display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:"#888"}}>처음부터 다시 시작</span>
        <button onClick={doReset} style={{padding:"6px 14px",background:"#FF2D55",border:"none",
          borderRadius:8,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer"}}>리셋</button>
      </div>}

      {/* 고양이 */}
      <div style={{
        textAlign:"center",margin:"0 auto 16px",position:"relative",
        animation: lvUpAnim ? "lvUp 0.8s ease" : "none"
      }}>
        {lvUpAnim && <>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{
              position:"absolute",
              left: `${20 + (i*12)}%`, top: `${10 + (i%3)*20}%`,
              fontSize: 16, animation: `sparkle 1s ease ${i*0.15}s`,
              opacity: 0
            }}>✨</div>
          ))}
          <div style={{
            position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",
            fontSize:20,fontWeight:800,color:"#FFD60A",
            animation:"pillPop 1.5s ease forwards"
          }}>LEVEL UP!</div>
        </>}
        <CatSVG cat={catData} size={180} blink={blink} />
        <div style={{fontSize:16,fontWeight:700,color:"#fff",marginTop:4}}>{catData.name}</div>
      </div>

      {/* 약 획득 애니메이션 */}
      {pillAnim && (
        <div style={{
          position:"fixed",top:"40%",left:"50%",transform:"translateX(-50%)",zIndex:300,
          fontSize:24,fontWeight:800,color:pillAnim==="red"?"#FF2D55":"#5856D6",
          animation:"pillPop 1.2s ease forwards"
        }}>+1 {pillAnim==="red"?"💊":"💙"}</div>
      )}

      {/* 빨간약/파란약 보유 */}
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        <div style={{flex:1,background:"#1C1C1E",borderRadius:12,padding:12,border:"1px solid #FF2D5533"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <span style={{fontSize:16}}>💊</span>
            <span style={{fontSize:12,color:"#FF8899"}}>빨간약</span>
            <span style={{fontSize:14,fontWeight:700,color:"#FF2D55",marginLeft:"auto"}}>{redPills}</span>
          </div>
          <div style={{width:"100%",height:4,background:"#333",borderRadius:2}}>
            <div style={{width:`${redProgress*100}%`,height:"100%",background:"#FF2D55",borderRadius:2,transition:"width .3s"}} />
          </div>
          <div style={{fontSize:10,color:"#666",marginTop:4}}>{redPills}/{req.red} 필요</div>
        </div>
        <div style={{flex:1,background:"#1C1C1E",borderRadius:12,padding:12,border:"1px solid #5856D633"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <span style={{fontSize:16}}>💙</span>
            <span style={{fontSize:12,color:"#8888FF"}}>파란약</span>
            <span style={{fontSize:14,fontWeight:700,color:"#5856D6",marginLeft:"auto"}}>{bluePills}</span>
          </div>
          <div style={{width:"100%",height:4,background:"#333",borderRadius:2}}>
            <div style={{width:`${blueProgress*100}%`,height:"100%",background:"#5856D6",borderRadius:2,transition:"width .3s"}} />
          </div>
          <div style={{fontSize:10,color:"#666",marginTop:4}}>{bluePills}/{req.blue} 필요</div>
        </div>
      </div>

      {/* 레벨업 버튼 */}
      {level < 99 ? (
        <button onClick={doLevelUp} disabled={!canLevelUp} style={{
          width:"100%",padding:14,marginBottom:10,
          background:canLevelUp?"linear-gradient(135deg,#FFD60A,#FF9500)":"#333",
          border:"none",borderRadius:12,color:canLevelUp?"#000":"#666",
          fontSize:15,fontWeight:700,cursor:canLevelUp?"pointer":"not-allowed"
        }}>{canLevelUp ? `Lv.${level+1}로 레벨업!` : `레벨업까지 — 💊${Math.max(0,req.red-redPills)} 💙${Math.max(0,req.blue-bluePills)} 더 필요`}</button>
      ) : (
        <div style={{width:"100%",padding:14,marginBottom:10,background:"linear-gradient(135deg,#FFD60A,#FF9500)",
          borderRadius:12,textAlign:"center",fontSize:15,fontWeight:800,color:"#000"
        }}>MAX LEVEL 달성! 🏆</div>
      )}

      {/* 출석체크 */}
      <button onClick={doCheck} disabled={checkedToday} style={{
        width:"100%",padding:14,marginBottom:10,
        background:checkedToday?"#1C1C1E":"linear-gradient(135deg,#5856D6,#8B5CF6)",
        border:checkedToday?"1px solid #333":"none",borderRadius:12,
        color:checkedToday?"#666":"#fff",fontSize:14,fontWeight:600,
        cursor:checkedToday?"not-allowed":"pointer"
      }}>{checkedToday ? "오늘 출석 완료 ✅" : "출석체크 💙 파란약 받기"}</button>

      {/* 콘텐츠 시청 */}
      <div style={{display:"flex",gap:8}}>
        <button onClick={onGoShorts} style={{
          flex:1,padding:12,background:"#1C1C1E",border:"1px solid #FF2D5533",
          borderRadius:12,color:"#FF8899",fontSize:13,fontWeight:600,cursor:"pointer"
        }}>📱 쇼츠 보기</button>
        <button onClick={onGoClip} style={{
          flex:1,padding:12,background:"#1C1C1E",border:"1px solid #FF2D5533",
          borderRadius:12,color:"#FF8899",fontSize:13,fontWeight:600,cursor:"pointer"
        }}>🎬 클립 보기</button>
      </div>

      <div style={{textAlign:"center",marginTop:16,fontSize:11,color:"#555"}}>
        쇼츠/클립/VOD를 시청하면 💊 빨간약을 받아요
      </div>
    </div>
  );
}

// ─── WORD CHAIN (끝말잇기) ──────────────────────────────────────
const WC_WORDS = [
  // TVING 제목 (시작 단어 후보)
  {w:"환승연애",c:"tving"},{w:"대탈출",c:"tving"},{w:"유퀴즈",c:"tving"},
  // 드라마/예능 제목
  {w:"도깨비",c:"drama"},{w:"미생",c:"drama"},{w:"시그널",c:"drama"},{w:"빈센조",c:"drama"},
  {w:"마이네임",c:"drama"},{w:"재벌집",c:"drama"},{w:"우영우",c:"drama"},
  {w:"낭만닥터",c:"drama"},{w:"소년심판",c:"drama"},
  {w:"나라",c:"drama"},{w:"겨울연가",c:"drama"},{w:"편의점",c:"drama"},
  {w:"동네변호사",c:"drama"},{w:"기사도",c:"drama"},{w:"사냥꾼",c:"drama"},
  {w:"경찰서",c:"drama"},{w:"변호사",c:"drama"},{w:"의사요한",c:"drama"},
  {w:"배우학교",c:"drama"},{w:"대장금",c:"drama"},{w:"소원",c:"drama"},
  {w:"가을동화",c:"drama"},{w:"응답하라",c:"drama"},{w:"선재업고",c:"drama"},
  {w:"구미호",c:"drama"},{w:"호텔",c:"drama"},{w:"택시운전사",c:"drama"},
  {w:"운전면허",c:"drama"},{w:"면허시험",c:"drama"},
  // 일반 명사 (체이닝 브릿지 포함)
  {w:"사과",c:"noun"},{w:"과일",c:"noun"},{w:"일요일",c:"noun"},{w:"일기",c:"noun"},
  {w:"기차",c:"noun"},{w:"차량",c:"noun"},{w:"양말",c:"noun"},{w:"말벌",c:"noun"},
  {w:"벌꿀",c:"noun"},{w:"꿀벌",c:"noun"},{w:"고양이",c:"noun"},{w:"이불",c:"noun"},
  {w:"불꽃",c:"noun"},{w:"꽃잎",c:"noun"},{w:"잎사귀",c:"noun"},{w:"귀걸이",c:"noun"},
  {w:"이어폰",c:"noun"},{w:"폰케이스",c:"noun"},{w:"스마트",c:"noun"},{w:"트럭",c:"noun"},
  {w:"나무",c:"noun"},{w:"무지개",c:"noun"},{w:"개미",c:"noun"},{w:"미소",c:"noun"},
  {w:"소나무",c:"noun"},{w:"나비",c:"noun"},{w:"비행기",c:"noun"},{w:"기린",c:"noun"},
  {w:"사자",c:"noun"},{w:"자전거",c:"noun"},{w:"거울",c:"noun"},{w:"울타리",c:"noun"},
  {w:"리본",c:"noun"},{w:"본체",c:"noun"},{w:"체리",c:"noun"},{w:"리모컨",c:"noun"},
  {w:"컨트롤",c:"noun"},{w:"롤케이크",c:"noun"},{w:"크레파스",c:"noun"},{w:"스케이트",c:"noun"},
  {w:"트램펄린",c:"noun"},{w:"린넨",c:"noun"},{w:"도시",c:"noun"},
  {w:"시계",c:"noun"},{w:"계단",c:"noun"},{w:"단풍",c:"noun"},{w:"풍선",c:"noun"},
  {w:"선물",c:"noun"},{w:"물고기",c:"noun"},{w:"기둥",c:"noun"},{w:"둥지",c:"noun"},
  {w:"지하철",c:"noun"},{w:"철새",c:"noun"},{w:"새벽",c:"noun"},{w:"벽돌",c:"noun"},
  {w:"돌고래",c:"noun"},{w:"래퍼",c:"noun"},{w:"퍼즐",c:"noun"},{w:"즐거움",c:"noun"},
  {w:"움직임",c:"noun"},{w:"임금",c:"noun"},{w:"금메달",c:"noun"},{w:"달팽이",c:"noun"},
  {w:"이야기",c:"noun"},{w:"기타",c:"noun"},{w:"타조",c:"noun"},{w:"조개",c:"noun"},
  {w:"개나리",c:"noun"},{w:"리듬",c:"noun"},
  {w:"바나나",c:"noun"},{w:"나침반",c:"noun"},{w:"반지",c:"noun"},{w:"지구",c:"noun"},
  {w:"구름",c:"noun"},{w:"치즈",c:"noun"},
  {w:"목걸이",c:"noun"},{w:"이름표",c:"noun"},{w:"표지판",c:"noun"},{w:"판다",c:"noun"},
  {w:"다람쥐",c:"noun"},{w:"한복",c:"noun"},{w:"복숭아",c:"noun"},{w:"아이스",c:"noun"},
  {w:"스티커",c:"noun"},{w:"커피",c:"noun"},{w:"피아노",c:"noun"},{w:"노트북",c:"noun"},
  {w:"북극곰",c:"noun"},{w:"곰인형",c:"noun"},{w:"형제",c:"noun"},{w:"제비",c:"noun"},
  {w:"비누",c:"noun"},{w:"누리",c:"noun"},{w:"리어카",c:"noun"},{w:"카메라",c:"noun"},
  {w:"라면",c:"noun"},{w:"면도기",c:"noun"},{w:"기와집",c:"noun"},{w:"집게",c:"noun"},
  {w:"게시판",c:"noun"},{w:"판소리",c:"noun"},{w:"리코더",c:"noun"},{w:"더미",c:"noun"},
  {w:"미역",c:"noun"},{w:"역사",c:"noun"},{w:"사진",c:"noun"},{w:"진주",c:"noun"},
  {w:"주먹",c:"noun"},{w:"하모니카",c:"noun"},{w:"카드",c:"noun"},
  {w:"드라마",c:"noun"},{w:"마이크",c:"noun"},{w:"크리스마스",c:"noun"},
  {w:"호수",c:"noun"},{w:"수박",c:"noun"},{w:"박물관",c:"noun"},{w:"관객",c:"noun"},
  {w:"객실",c:"noun"},{w:"실타래",c:"noun"},{w:"빗자루",c:"noun"},
  {w:"루비",c:"noun"},{w:"비타민",c:"noun"},{w:"민들레",c:"noun"},{w:"레몬",c:"noun"},
  {w:"몬스터",c:"noun"},{w:"터널",c:"noun"},{w:"널빤지",c:"noun"},{w:"지렁이",c:"noun"},
  {w:"보물",c:"noun"},{w:"물감",c:"noun"},{w:"감자",c:"noun"},{w:"자석",c:"noun"},
  {w:"석류",c:"noun"},{w:"류산",c:"noun"},{w:"산호",c:"noun"},{w:"호랑이",c:"noun"},
  {w:"전화기",c:"noun"},{w:"예감",c:"noun"},{w:"감옥",c:"noun"},{w:"옥수수",c:"noun"},
  {w:"수영장",c:"noun"},{w:"장난감",c:"noun"},{w:"감사",c:"noun"},
  // 브릿지 단어 (데드엔드 방지)
  {w:"애벌레",c:"noun"},{w:"애호박",c:"noun"},{w:"애교",c:"noun"},
  {w:"출발",c:"noun"},{w:"출구",c:"noun"},
  {w:"생선",c:"noun"},{w:"생일",c:"noun"},
  {w:"원숭이",c:"noun"},{w:"원피스",c:"noun"},
  {w:"우산",c:"noun"},{w:"우체통",c:"noun"},
  {w:"교실",c:"noun"},{w:"교과서",c:"noun"},
  {w:"국수",c:"noun"},{w:"국화",c:"noun"},
  {w:"가방",c:"noun"},{w:"가위",c:"noun"},
  {w:"날씨",c:"noun"},{w:"날개",c:"noun"},
  {w:"점심",c:"noun"},{w:"점수",c:"noun"},
  {w:"신발",c:"noun"},{w:"신호등",c:"noun"},
  {w:"서리",c:"noun"},{w:"서랍",c:"noun"},
  {w:"화분",c:"noun"},{w:"화살",c:"noun"},
  {w:"봉투",c:"noun"},{w:"봉사",c:"noun"},
  {w:"럭비",c:"noun"},{w:"럭셔리",c:"noun"},
  {w:"한라산",c:"noun"},{w:"한강",c:"noun"},
  {w:"발자국",c:"noun"},{w:"발레",c:"noun"},
  {w:"통나무",c:"noun"},{w:"통조림",c:"noun"},
  {w:"등산",c:"noun"},{w:"등대",c:"noun"},
  {w:"강아지",c:"noun"},{w:"강물",c:"noun"},
  {w:"심장",c:"noun"},{w:"심사",c:"noun"},
  {w:"견학",c:"noun"},{w:"견과류",c:"noun"},
  {w:"록밴드",c:"noun"},
  {w:"텔레비전",c:"noun"},
  {w:"전구",c:"noun"},{w:"전봇대",c:"noun"},
  {w:"대나무",c:"noun"},{w:"대리석",c:"noun"},
  {w:"허수아비",c:"noun"},
  {w:"왕관",c:"noun"},{w:"왕자",c:"noun"},
  {w:"님프",c:"noun"},
  {w:"사다리",c:"noun"},{w:"사탕",c:"noun"},
  {w:"탕수육",c:"noun"},
  {w:"육지",c:"noun"},
  {w:"프라이팬",c:"noun"},
  {w:"팬케이크",c:"noun"},
  {w:"쿤달",c:"noun"},
  {w:"달리기",c:"noun"},
];
const WC_IDX={};
WC_WORDS.forEach((e,i)=>{const k=e.w[0];if(!WC_IDX[k])WC_IDX[k]=[];WC_IDX[k].push(i);});

function WordChain({ onDone, onRew }) {
  const [phase, setPhase] = useState("ready");
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [target, setTarget] = useState("");
  const [used, setUsed] = useState(new Set());
  const [round, setRound] = useState(0);
  const [timer, setTimer] = useState(15);
  const [myTurn, setMyTurn] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const aiRef = useRef(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, aiThinking]);

  // 타이머
  useEffect(() => {
    if (phase !== "playing" || !myTurn) return;
    if (timer <= 0) { endGame("timeout"); return; }
    const t = setTimeout(() => setTimer(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timer, myTurn, phase]);

  // AI 턴
  useEffect(() => {
    if (phase !== "playing" || myTurn) return;
    if (aiRef.current) return;
    aiRef.current = true;
    setAiThinking(true);
    const delay = 800 + Math.random() * 700;
    const t = setTimeout(() => {
      const pick = aiPick(target, used, round);
      if (!pick) { aiRef.current = false; setAiThinking(false); endGame("win"); return; }
      const newUsed = new Set(used); newUsed.add(pick.w);
      const last = pick.w[pick.w.length - 1];
      setUsed(newUsed);
      setMsgs(m => [...m, { type: "ai", word: pick.w, cat: pick.c, last }]);
      setTarget(last);
      setMyTurn(true);
      setTimer(15);
      aiRef.current = false;
      setAiThinking(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }, delay);
    return () => clearTimeout(t);
  }, [myTurn, phase]);

  const aiPick = (char, usedSet, rnd) => {
    const cands = (WC_IDX[char] || []).map(i => WC_WORDS[i]).filter(e => !usedSet.has(e.w));
    if (cands.length === 0) return null;
    if (rnd <= 3) return cands[Math.floor(Math.random() * cands.length)];
    if (rnd <= 6) {
      const themed = cands.filter(c => c.c !== "noun");
      if (themed.length > 0) return themed[Math.floor(Math.random() * themed.length)];
      return cands[Math.floor(Math.random() * cands.length)];
    }
    const scored = cands.map(c => {
      const l = c.w[c.w.length - 1];
      const next = (WC_IDX[l] || []).filter(i => !usedSet.has(WC_WORDS[i].w) && WC_WORDS[i].w !== c.w);
      return { ...c, n: next.length };
    });
    scored.sort((a, b) => a.n - b.n);
    return scored[0];
  };

  const startGame = () => {
    // 끝글자가 이을 수 있는 단어만 시작 후보로 선택
    const starters = WC_WORDS.filter(e => (e.c === "tving" || e.c === "drama") && WC_IDX[e.w[e.w.length - 1]]?.length > 0);
    const first = starters[Math.floor(Math.random() * starters.length)];
    const last = first.w[first.w.length - 1];
    setPhase("playing");
    setUsed(new Set([first.w]));
    setMsgs([{ type: "system", text: "게임 시작!" }, { type: "ai", word: first.w, cat: first.c, last }]);
    setTarget(last);
    setMyTurn(true);
    setTimer(15);
    setRound(0);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const submit = () => {
    const w = input.trim();
    setErr("");
    if (w.length < 2) { setErr("2글자 이상 입력해주세요!"); return; }
    if (w[0] !== target) { setErr(`"${target}"(으)로 시작해야 해요!`); return; }
    if (used.has(w)) { setErr("이미 사용한 단어예요!"); return; }
    const found = WC_WORDS.find(e => e.w === w);
    if (!found) { setErr("단어장에 없는 단어예요!"); return; }
    const newUsed = new Set(used); newUsed.add(w);
    const last = w[w.length - 1];
    const newRound = round + 1;
    setUsed(newUsed);
    setMsgs(m => [...m, { type: "player", word: w, cat: found.c, last }]);
    setRound(newRound);
    setInput("");
    setTarget(last);
    setMyTurn(false);
  };

  const endGame = (res) => {
    setResult(res);
    setPhase("done");
    const pts = Math.min(10 + round * 5, 40);
    onRew(pts, "wordchain", { correct: round, total: round });
  };

  const catLabel = (c) => c === "tving" ? "TVING" : c === "drama" ? "드라마" : "";

  // ─── Ready 화면 ───
  if (phase === "ready") return (
    <div style={{padding:"20px 16px",textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:12}}>💬</div>
      <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>끝말잇기</div>
      <div style={{fontSize:14,color:"#999",marginBottom:24}}>드라마 제목으로 끝말잇기!</div>
      <div style={{background:"#1C1C1E",borderRadius:16,padding:20,textAlign:"left",marginBottom:24}}>
        <div style={{fontSize:14,fontWeight:700,marginBottom:12,color:"#34C759"}}>규칙</div>
        <div style={{fontSize:13,color:"#ccc",lineHeight:1.8}}>
          • AI가 먼저 단어를 말해요<br/>
          • 마지막 글자로 시작하는 단어를 이어가세요<br/>
          • 같은 단어는 한 번만 사용 가능<br/>
          • 제한 시간: 턴당 15초<br/>
          • 많이 이을수록 높은 점수!
        </div>
      </div>
      <button onClick={startGame} style={{width:"100%",padding:"16px",background:"linear-gradient(135deg,#34C759,#30B350)",border:"none",borderRadius:14,color:"#fff",fontSize:17,fontWeight:700,cursor:"pointer"}}>
        시작하기!
      </button>
    </div>
  );

  // ─── Done 화면 ───
  if (phase === "done") {
    const pts = Math.min(10 + round * 5, 40);
    return (
      <div style={{padding:"40px 16px",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:12}}>{result === "win" ? "🎉" : result === "timeout" ? "⏰" : "😅"}</div>
        <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>
          {result === "win" ? "승리!" : result === "timeout" ? "시간 초과!" : "아쉽네요!"}
        </div>
        <div style={{fontSize:15,color:"#999",marginBottom:20}}>{round}라운드 생존!</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#1C1C1E",borderRadius:14,padding:"12px 24px",marginBottom:30}}>
          <span style={{fontSize:24}}>💰</span>
          <span style={{fontSize:20,fontWeight:800,color:"#FFD60A"}}>+{pts}P</span>
        </div>
        <br/>
        <button onClick={onDone} style={{width:"100%",padding:"16px",background:"#333",border:"none",borderRadius:14,color:"#fff",fontSize:16,fontWeight:600,cursor:"pointer"}}>
          돌아가기
        </button>
      </div>
    );
  }

  // ─── Playing 화면 ───
  const timerColor = timer <= 5 ? "#FF2D55" : timer <= 10 ? "#FF9500" : "#34C759";
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"}}>
      {/* 채팅 영역 */}
      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"8px 16px",display:"flex",flexDirection:"column",gap:8}}>
        {msgs.map((m, i) => {
          if (m.type === "system") return (
            <div key={i} style={{textAlign:"center",fontSize:12,color:"#666",padding:"4px 0"}}>{m.text}</div>
          );
          const isAi = m.type === "ai";
          return (
            <div key={i} style={{display:"flex",justifyContent:isAi?"flex-start":"flex-end"}}>
              <div style={{
                maxWidth:"75%",
                background:isAi?"#1C1C1E":"rgba(255,45,85,0.12)",
                border:isAi?"1px solid rgba(52,199,89,0.2)":"1px solid rgba(255,45,85,0.2)",
                borderRadius:14,padding:"10px 14px"
              }}>
                <div style={{fontSize:11,color:isAi?"#34C759":"#FF2D55",fontWeight:600,marginBottom:4}}>
                  {isAi?"🤖 AI":"나 🙋"}
                  {m.cat && catLabel(m.cat) ? <span style={{marginLeft:6,fontSize:10,padding:"1px 6px",borderRadius:6,background:m.cat==="tving"?"rgba(255,45,85,0.2)":"rgba(88,86,214,0.2)",color:m.cat==="tving"?"#FF2D55":"#5856D6"}}>{catLabel(m.cat)}</span> : null}
                </div>
                <div style={{fontSize:18,fontWeight:700,color:"#fff"}}>{m.word}</div>
                <div style={{fontSize:11,color:"#888",marginTop:4}}>다음 글자: <span style={{color:"#FFD60A",fontWeight:700}}>{m.last}</span></div>
              </div>
            </div>
          );
        })}
        {aiThinking && (
          <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{background:"#1C1C1E",border:"1px solid rgba(52,199,89,0.2)",borderRadius:14,padding:"10px 14px"}}>
              <div style={{fontSize:11,color:"#34C759",fontWeight:600,marginBottom:4}}>🤖 AI</div>
              <div style={{fontSize:16,color:"#666",animation:"pulse 1s infinite"}}>생각 중...</div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 입력 영역 */}
      <div style={{borderTop:"1px solid #222",padding:"10px 16px",background:"#0a0a0a"}}>
        {/* 타겟 글자 + 타이머 */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,color:"#888"}}>다음 글자</span>
            <span style={{background:"rgba(52,199,89,0.15)",border:"1px solid #34C759",borderRadius:20,padding:"4px 14px",color:"#34C759",fontWeight:800,fontSize:18}}>{target}</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:20}}>⏱️</span>
            <span style={{fontSize:16,fontWeight:700,color:timerColor}}>{timer}초</span>
          </div>
        </div>
        {/* 타이머 바 */}
        <div style={{height:3,background:"#222",borderRadius:2,marginBottom:10,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${(timer/15)*100}%`,background:timerColor,borderRadius:2,transition:"width 1s linear"}}/>
        </div>
        {/* 에러 메시지 */}
        {err && <div style={{fontSize:12,color:"#FF2D55",marginBottom:6}}>{err}</div>}
        {/* 입력 + 전송 */}
        <div style={{display:"flex",gap:8}}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => { setInput(e.target.value); setErr(""); }}
            onKeyDown={e => { if(e.key==="Enter"&&myTurn) submit(); }}
            placeholder={myTurn ? `"${target}"(으)로 시작하는 단어` : "AI 차례..."}
            disabled={!myTurn}
            style={{flex:1,background:"#1C1C1E",border:"1px solid #333",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:15,outline:"none"}}
          />
          <button
            onClick={submit}
            disabled={!myTurn}
            style={{background:myTurn?"#34C759":"#333",border:"none",borderRadius:12,padding:"12px 20px",color:"#fff",fontWeight:700,fontSize:15,cursor:myTurn?"pointer":"default",opacity:myTurn?1:0.5}}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED UI ──────────────────────────────────────────────────
const SH=({t,s,onMore})=><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 16px 10px"}}><div><div style={{fontSize:17,fontWeight:700,color:"#fff"}}>{t}</div>{s&&<div style={{fontSize:12,color:"#888",marginTop:1}}>{s}</div>}</div>{onMore&&<button onClick={onMore} style={{background:"none",border:"none",color:"#888",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:2}}>더보기<Ic.Arr /></button>}</div>;
const PlayBtn=({size=32})=><div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:size,height:size,background:"rgba(0,0,0,0.5)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)",border:"1px solid rgba(255,255,255,0.2)"}}><Ic.Play /></div>;
const Modal=({children,onClose:c})=><div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.85)",display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={c}><div style={{width:"100%",maxWidth:430,maxHeight:"90vh",background:"#1C1C1E",borderRadius:"20px 20px 0 0",overflow:"auto"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"flex-end",padding:"12px 16px 0"}}><button onClick={c} style={{background:"#333",border:"none",width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#fff"}}><Ic.X /></button></div>{children}</div></div>;

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
  const [usr,sUsr]=useState(null);

  // 유저 초기화
  useEffect(()=>{
    let u=loadUser();
    if(!u){ u=generateUser(); saveUser(u); }
    sUsr(u); sLg(true); sPt(u.totalPt);
  },[]);

  const tt=m=>{sTst(m);setTimeout(()=>sTst(null),2500);};
  const buy=s=>{if(!lg){sLgM(true);return;}if(pt>=s.price){sPt(p=>p-s.price);sOwn(o=>[...o,s.id]);tt(`${s.title} 구매 완료! 🎬`);}else tt("포인트 부족 😢");};

  // 보상 함수 (히스토리 기록 포함)
  const rew=(r,gameType,extra={})=>{
    if(!lg){tt("로그인하면 포인트 적립!");return;}
    sPt(p=>p+r);
    const u=loadUser();
    if(u){
      u.totalPt+=r; u.gamesPlayed+=1;
      u.history.unshift({game:gameType||"unknown",pts:r,correct:extra.correct||0,total:extra.total||0,ts:Date.now()});
      if(u.history.length>50) u.history=u.history.slice(0,50);
      saveUser(u); sUsr({...u});
    }
  };

  // 빨간약 추가 (콘텐츠 시청 시 호출)
  const addRedPill=()=>{try{const d=localStorage.getItem("catgame_save");if(d){const s=JSON.parse(d);s.redPills=(s.redPills||0)+1;localStorage.setItem("catgame_save",JSON.stringify(s));}}catch{}};
  useEffect(()=>{const t=setInterval(()=>sHi(h=>(h+1)%3),4000);return()=>clearInterval(t);},[]);
  const hs=[SHOWS[0],SHOWS[1],SHOWS[5]];const h=hs[hi];

  const lvInfo = usr ? getLvProgress(usr.totalPt) : null;

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
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {lg&&usr&&<div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:4,background:"#1C1C1E",padding:"4px 10px",borderRadius:16}}>
                <span style={{fontSize:14}}>{usr.avatar}</span>
                <span style={{fontSize:11,fontWeight:600,color:"#fff"}}>{usr.nickname}</span>
                <span style={{fontSize:10,color:lvInfo?.cur.c}}>{lvInfo?.cur.badge}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4,background:"#1C1C1E",padding:"5px 10px",borderRadius:16}}><Ic.Coin /><span style={{fontSize:13,fontWeight:700,color:"#FFD60A"}}>{pt.toLocaleString()}P</span></div>
            </div>}
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
          {SHOWS.flatMap(s=>s.shorts.map((sh,i)=>({...sh,show:s,key:`${s.id}s${i}`}))).slice(0,8).map(it=><div key={it.key} style={{minWidth:110,flexShrink:0,cursor:"pointer"}} onClick={()=>{addRedPill();it.show.tvingUrl?window.open(it.show.tvingUrl,'_blank','noopener,noreferrer'):sDet(it.show);}}>

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
          {SHOWS.flatMap(s=>s.clips.map((c,i)=>({...c,show:s,key:`${s.id}c${i}`}))).slice(0,8).map(it=><div key={it.key} style={{minWidth:220,flexShrink:0,cursor:"pointer"}} onClick={()=>{addRedPill();it.url?window.open(it.url,'_blank','noopener,noreferrer'):sDet(it.show);}}>

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
          {GAMES.slice(0,3).map(g=><button key={g.id} onClick={()=>{if(g.id==="quiz"||g.id==="roulette"||g.id==="memory"||g.id==="catgame"){sGm(g.id);sTab("game");}else tt("곧 오픈! 🎮");}} style={{minWidth:150,background:`linear-gradient(135deg,${g.c}22,#1C1C1E)`,border:`1px solid ${g.c}33`,borderRadius:14,padding:14,textAlign:"left",cursor:"pointer",flexShrink:0}}>
            <span style={{fontSize:28}}>{g.icon}</span><div style={{fontSize:13,fontWeight:600,color:"#fff",marginTop:8}}>{g.name}</div><div style={{display:"flex",alignItems:"center",gap:4,marginTop:4}}><Ic.Coin /><span style={{fontSize:11,color:"#FFD60A"}}>최대 {g.pts}P</span></div>
          </button>)}
        </div>

        <div style={{margin:"0 16px 20px",padding:20,background:"linear-gradient(135deg,#1a1025,#0a1520)",borderRadius:16,border:"1px solid #333"}}><div style={{fontSize:16,fontWeight:700,marginBottom:6}}>구독으로 더 즐기기</div><div style={{fontSize:12,color:"#999",marginBottom:14}}>유료 VOD 무제한 감상</div><button onClick={()=>sSubM(true)} style={{padding:"10px 20px",background:"linear-gradient(135deg,#FF2D55,#FF6B35)",border:"none",borderRadius:12,color:"#fff",fontSize:14,fontWeight:600,cursor:"pointer"}}>구독권 보기</button></div>
      </div>}

      {/* ═══ SHORTS ═══ */}
      {tab==="shorts"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 12px"}}><div style={{fontSize:20,fontWeight:700}}>쇼츠</div><div style={{fontSize:13,color:"#888",marginTop:2}}>세로형 숏폼</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:"0 16px"}}>{SHOWS.flatMap(s=>s.shorts.map((sh,i)=>({...sh,show:s,key:`${s.id}s${i}`}))).map(it=><div key={it.key} style={{cursor:"pointer"}} onClick={()=>{addRedPill();tt("💊 빨간약 +1!");it.show.tvingUrl?window.open(it.show.tvingUrl,'_blank','noopener,noreferrer'):sDet(it.show);}}><div style={{width:"100%",aspectRatio:"9/16",borderRadius:12,overflow:"hidden",position:"relative"}}><ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}><div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 50%,rgba(0,0,0,0.8))"}}/><PlayBtn size={40}/><div style={{position:"absolute",bottom:8,left:8,right:8,zIndex:2}}><div style={{fontSize:12,fontWeight:600,color:"#fff",textShadow:"0 1px 4px #000"}}>{it.t}</div><div style={{fontSize:10,color:"#bbb",marginTop:2}}>{it.show.title}</div></div></ShowImage></div></div>)}</div>

      </div>}

      {/* ═══ CLIP ═══ */}
      {tab==="clip"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 12px"}}><div style={{fontSize:20,fontWeight:700}}>클립</div><div style={{fontSize:13,color:"#888",marginTop:2}}>가로형 하이라이트</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:12,padding:"0 16px"}}>{SHOWS.flatMap(s=>s.clips.map((c,i)=>({...c,show:s,key:`${s.id}c${i}`}))).map(it=><div key={it.key} style={{cursor:"pointer"}} onClick={()=>{addRedPill();tt("💊 빨간약 +1!");it.url?window.open(it.url,'_blank','noopener,noreferrer'):sDet(it.show);}}><div style={{width:"100%",aspectRatio:"16/9",borderRadius:12,overflow:"hidden",position:"relative"}}><ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}><div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,0.8))"}}/><PlayBtn size={48}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"24px 12px 10px",zIndex:2}}><div style={{fontSize:14,fontWeight:600,color:"#fff",textShadow:"0 1px 4px #000"}}>{it.t}</div><div style={{fontSize:12,color:"#bbb",marginTop:2}}>{it.show.title} · {it.e}</div></div></ShowImage></div></div>)}</div>

      </div>}

      {/* ═══ GAME ═══ */}
      {tab==="game"&&<div style={{paddingBottom:80}}>
        {gm==="quiz"?<div><div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px 12px"}}><button onClick={()=>sGm(null)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}><Ic.Bk/></button><div style={{fontSize:18,fontWeight:700}}>캐릭터 퀴즈</div></div><Quiz onDone={()=>sGm(null)} onRew={rew}/></div>
        :gm==="roulette"?<div><div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px 12px"}}><button onClick={()=>sGm(null)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}><Ic.Bk/></button><div style={{fontSize:18,fontWeight:700}}>추천 룰렛</div></div><Roulette onDone={()=>sGm(null)} onRew={rew}/></div>
        :gm==="memory"?<div><div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px 12px"}}><button onClick={()=>sGm(null)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}><Ic.Bk/></button><div style={{fontSize:18,fontWeight:700}}>명장면 모드</div></div><FamousScene onDone={()=>sGm(null)} onRew={rew}/></div>
        :gm==="catgame"?<div><div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px 12px"}}><button onClick={()=>sGm(null)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}><Ic.Bk/></button><div style={{fontSize:18,fontWeight:700}}>야옹이 키우기</div></div><CatGame onDone={()=>sGm(null)} onGoShorts={()=>{sTab("shorts");sGm(null);}} onGoClip={()=>{sTab("clip");sGm(null);}}/></div>
        :gm==="wordchain"?<div><div style={{display:"flex",alignItems:"center",gap:12,padding:"0 16px 12px"}}><button onClick={()=>sGm(null)} style={{background:"none",border:"none",color:"#fff",cursor:"pointer",padding:0}}><Ic.Bk/></button><div style={{fontSize:18,fontWeight:700}}>끝말잇기</div></div><WordChain onDone={()=>sGm(null)} onRew={rew}/></div>
        :<div><div style={{padding:"0 16px 12px"}}><div style={{fontSize:20,fontWeight:700}}>미니게임</div><div style={{fontSize:13,color:"#888",marginTop:2}}>게임하고 포인트!</div></div>{!lg&&<div style={{margin:"0 16px 16px",padding:"12px 16px",background:"rgba(255,45,85,.1)",border:"1px solid rgba(255,45,85,.3)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:13,color:"#FF8899"}}>로그인하면 포인트 적립!</span><button onClick={()=>sLgM(true)} style={{background:"#FF2D55",border:"none",borderRadius:8,color:"#fff",padding:"6px 12px",fontSize:12,fontWeight:600,cursor:"pointer"}}>로그인</button></div>}<div style={{display:"flex",flexDirection:"column",gap:12,padding:"0 16px"}}>{GAMES.map(g=><button key={g.id} onClick={()=>{if(g.id==="quiz"||g.id==="roulette"||g.id==="memory"||g.id==="catgame"||g.id==="wordchain")sGm(g.id);else tt("곧 오픈!");}} style={{display:"flex",alignItems:"center",gap:14,padding:16,background:"#1C1C1E",border:`1px solid ${g.c}33`,borderRadius:14,cursor:"pointer",textAlign:"left"}}><div style={{width:52,height:52,borderRadius:14,background:`${g.c}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{g.icon}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:600,color:"#fff"}}>{g.name}</div><div style={{fontSize:12,color:"#888",marginTop:2}}>{g.desc}</div></div>{g.pts>0&&<div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}><Ic.Coin/><span style={{fontSize:13,fontWeight:600,color:"#FFD60A"}}>{g.pts}P</span></div>}</button>)}</div></div>}
      </div>}

      {/* ═══ SCHEDULE ═══ */}
      {tab==="sched"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 16px"}}><div style={{fontSize:20,fontWeight:700}}>공개 일정</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:8,padding:"0 16px"}}>{SCHED.map((d,di)=>{const td=new Date().getDay();const mp=[6,0,1,2,3,4,5];const ti=mp[td];return<div key={d.day} style={{background:di===ti?"#1a1025":"#1C1C1E",border:di===ti?"1px solid #5856D6":"1px solid #222",borderRadius:14,padding:14,position:"relative"}}>{di===ti&&<div style={{position:"absolute",top:-8,right:12,background:"#5856D6",padding:"2px 10px",borderRadius:8,fontSize:10,fontWeight:700}}>오늘</div>}<div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:36,height:36,borderRadius:10,background:di===ti?"#5856D6":"#333",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:15,flexShrink:0}}>{d.day}</div><div style={{flex:1}}>{d.shows.length===0?<div style={{fontSize:13,color:"#555"}}>편성 없음</div>:d.shows.map((s,si)=><div key={si} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 0"}}><div><span style={{fontSize:14,fontWeight:500}}>{s.t}</span><span style={{fontSize:12,color:"#888",marginLeft:8}}>{s.time}</span></div><span style={{fontSize:10,padding:"2px 8px",borderRadius:6,background:s.tag==="LIVE"?"#FF2D5533":s.tag==="NEW"?"#5856D633":"#FF950033",color:s.tag==="LIVE"?"#FF2D55":s.tag==="NEW"?"#5856D6":"#FF9500",fontWeight:600}}>{s.tag}</span></div>)}</div></div></div>;})}</div>
      </div>}

      {/* ═══ MY ═══ */}
      {tab==="my"&&<div style={{paddingBottom:80}}><div style={{padding:"0 16px 20px"}}><div style={{fontSize:20,fontWeight:700}}>마이페이지</div></div>
        {!lg?<div style={{textAlign:"center",padding:"40px 16px"}}><div style={{width:80,height:80,borderRadius:"50%",background:"#1C1C1E",margin:"0 auto 16px",display:"flex",alignItems:"center",justifyContent:"center",color:"#555"}}><Ic.User/></div><div style={{fontSize:16,fontWeight:600,marginBottom:4}}>로그인이 필요합니다</div><div style={{fontSize:13,color:"#888",marginBottom:20}}>티빙 계정으로 로그인</div><button onClick={()=>sLgM(true)} style={{padding:"12px 32px",background:"#FF2D55",border:"none",borderRadius:12,color:"#fff",fontWeight:600,fontSize:15,cursor:"pointer"}}>로그인</button></div>
        :<div style={{padding:"0 16px"}}>
          {/* 프로필 카드 */}
          {usr&&<div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#FF2D55,#FF6B35)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{usr.avatar}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:17,fontWeight:600}}>{usr.nickname}</span>
                <span style={{fontSize:12,padding:"2px 8px",borderRadius:8,background:`${lvInfo?.cur.c}22`,color:lvInfo?.cur.c,fontWeight:600}}>{lvInfo?.cur.badge} Lv.{lvInfo?.cur.lv} {lvInfo?.cur.name}</span>
              </div>
              <div style={{fontSize:12,color:"#888",marginTop:2}}>게임 {usr.gamesPlayed}회 플레이</div>
            </div>
          </div>}

          {/* 레벨 프로그레스 */}
          {lvInfo&&<div style={{background:"#1C1C1E",border:"1px solid #333",borderRadius:14,padding:16,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:13,color:"#aaa"}}>{lvInfo.cur.badge} {lvInfo.cur.name}</span>
              {lvInfo.next&&<span style={{fontSize:12,color:"#666"}}>다음: {lvInfo.next.badge} {lvInfo.next.name} ({lvInfo.next.min}P)</span>}
            </div>
            <div style={{width:"100%",height:6,background:"#333",borderRadius:3}}>
              <div style={{width:`${lvInfo.pct}%`,height:"100%",background:`linear-gradient(90deg,${lvInfo.cur.c},${lvInfo.next?.c||lvInfo.cur.c})`,borderRadius:3,transition:"width .3s"}}/>
            </div>
            <div style={{fontSize:11,color:"#666",marginTop:6,textAlign:"right"}}>{usr?.totalPt}P / {lvInfo.next?.min||"MAX"}P</div>
          </div>}

          {/* 포인트 */}
          <div style={{background:"linear-gradient(135deg,#1a1a00,#1C1C1E)",border:"1px solid #333",borderRadius:14,padding:18,marginBottom:16}}><div style={{fontSize:13,color:"#888",marginBottom:6}}>보유 포인트</div><div style={{display:"flex",alignItems:"center",gap:8}}><Ic.Coin/><span style={{fontSize:28,fontWeight:800,color:"#FFD60A"}}>{pt.toLocaleString()}P</span></div></div>

          {/* 랭킹 보드 */}
          {usr&&<div style={{background:"#1C1C1E",border:"1px solid #333",borderRadius:14,padding:18,marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>🏆 랭킹 보드</div>
            {(()=>{
              const all=[...FAKE_USERS,{...usr,isMe:true}].map(u=>({...u,level:getLevel(u.totalPt)})).sort((a,b)=>b.totalPt-a.totalPt);
              const top3=all.slice(0,3);
              const rest=all.slice(3);
              const medals=["🥇","🥈","🥉"];
              return <>
                {/* TOP 3 포디움 */}
                <div style={{display:"flex",justifyContent:"center",alignItems:"flex-end",gap:8,marginBottom:16,padding:"0 8px"}}>
                  {[1,0,2].map(pi=>{const u=top3[pi]; if(!u)return null;
                    const h=pi===0?100:pi===1?80:70;
                    return <div key={u.id} style={{flex:1,textAlign:"center"}}>
                      <div style={{fontSize:pi===0?28:22,marginBottom:4}}>{medals[pi]}</div>
                      <div style={{fontSize:pi===0?28:22,marginBottom:2}}>{u.avatar}</div>
                      <div style={{fontSize:11,fontWeight:600,color:u.isMe?"#FF2D55":"#fff",marginBottom:2}}>{u.nickname}{u.isMe?" (나)":""}</div>
                      <div style={{fontSize:10,color:u.level.c}}>{u.level.badge}Lv.{u.level.lv}</div>
                      <div style={{height:h,background:pi===0?"linear-gradient(180deg,#FFD60A33,#FFD60A11)":pi===1?"linear-gradient(180deg,#C0C0C033,#C0C0C011)":"linear-gradient(180deg,#CD7F3233,#CD7F3211)",borderRadius:"8px 8px 0 0",marginTop:6,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{fontSize:12,fontWeight:700,color:"#FFD60A"}}>{u.totalPt.toLocaleString()}P</span>
                      </div>
                    </div>;
                  })}
                </div>
                {/* 4위 이하 */}
                {rest.map((u,ri)=><div key={u.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 4px",borderTop:"1px solid #333",background:u.isMe?"rgba(255,45,85,.08)":"transparent",borderRadius:u.isMe?8:0}}>
                  <span style={{width:20,fontSize:13,fontWeight:600,color:"#666",textAlign:"center"}}>{ri+4}</span>
                  <span style={{fontSize:18}}>{u.avatar}</span>
                  <div style={{flex:1}}>
                    <span style={{fontSize:13,fontWeight:u.isMe?700:500,color:u.isMe?"#FF2D55":"#fff"}}>{u.nickname}{u.isMe?" (나)":""}</span>
                    <span style={{fontSize:10,color:u.level.c,marginLeft:6}}>{u.level.badge}Lv.{u.level.lv}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:600,color:"#FFD60A"}}>{u.totalPt.toLocaleString()}P</span>
                </div>)}
              </>;
            })()}
          </div>}

          {/* 게임 히스토리 */}
          {usr&&usr.history.length>0&&<div style={{background:"#1C1C1E",border:"1px solid #333",borderRadius:14,padding:18,marginBottom:16}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:12}}>📋 게임 기록</div>
            {usr.history.slice(0,10).map((h,hi)=><div key={hi} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:hi<Math.min(usr.history.length,10)-1?"1px solid #222":"none"}}>
              <span style={{fontSize:20}}>{GAME_ICONS[h.game]||"🎮"}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:500}}>{GAME_NAMES[h.game]||h.game}</div>
                <div style={{fontSize:11,color:"#666"}}>{relTime(h.ts)}{h.total>0?` · ${h.correct}/${h.total}`:""}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4}}><Ic.Coin/><span style={{fontSize:13,fontWeight:600,color:"#FFD60A"}}>+{h.pts}P</span></div>
            </div>)}
          </div>}

          {/* 구매 콘텐츠 */}
          <div style={{background:"#1C1C1E",border:"1px solid #333",borderRadius:14,padding:18,marginBottom:16}}><div style={{fontSize:13,color:"#888",marginBottom:10}}>구매 콘텐츠</div>{own.length===0?<div style={{fontSize:14,color:"#555"}}>없음</div>:own.map(id=>{const s=SHOWS.find(x=>x.id===id);return s?<div key={id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #222"}}><span style={{fontSize:14}}>{s.title}</span><Ic.Chk/></div>:null;})}</div>

          <button onClick={()=>sSubM(true)} style={{width:"100%",padding:16,background:"linear-gradient(135deg,#FF2D55,#FF6B35)",border:"none",borderRadius:14,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer",marginBottom:16}}>🎁 구독권 보기</button>
        </div>}
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
