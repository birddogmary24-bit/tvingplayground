import { useState, useEffect } from "react";
import { SHOWS, loadUser, saveUser, generateUser, GAMES, SCHED, SUBS, FAKE_USERS, GAME_ICONS, GAME_NAMES } from "./constants.js";
import { getLevel, getLvProgress, relTime } from "./utils.js";
import Ic from "./Icons.jsx";
import ShowImage from "./components/ShowImage.jsx";
import { SH, PlayBtn, Modal } from "./components/SharedUI.jsx";
import Quiz from "./components/Quiz.jsx";
import Roulette from "./components/Roulette.jsx";
import FamousScene from "./components/FamousScene.jsx";
import CatGame from "./components/CatGame.jsx";
import WordChain from "./components/WordChain.jsx";

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
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg viewBox="0 0 120 40" style={{width:"70%",maxWidth:110}}>
                <text x="10" y="30" fill="#fff" fontSize="15" fontFamily="serif" fontStyle="italic" fontWeight="700" letterSpacing="-0.5">
                  <tspan>D</tspan><tspan fontSize="13">isney</tspan><tspan fontSize="18" dy="-6">+</tspan>
                </text>
                <path d="M10 34 Q60 38 110 32" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <div style={{width:1,height:"40%",background:"rgba(255,255,255,0.2)"}}/>
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:22,fontWeight:900,color:"#FF0A2B",letterSpacing:1,fontFamily:"sans-serif"}}>TVING</span>
            </div>
            <div style={{width:1,height:"40%",background:"rgba(255,255,255,0.2)"}}/>
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
        <div style={{display:"flex",gap:16,overflowX:"auto",padding:"0 16px 20px"}}>
          {SHOWS.flatMap(s=>s.clips.map((c,i)=>({...c,show:s,key:`${s.id}c${i}`}))).slice(0,8).map(it=><div key={it.key} style={{minWidth:220,flexShrink:0,cursor:"pointer"}} onClick={()=>{addRedPill();it.url?window.open(it.url,'_blank','noopener,noreferrer'):sDet(it.show);}}>
            <div style={{width:220,height:124,borderRadius:10,overflow:"hidden",position:"relative"}}>
              <ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}>
                <PlayBtn size={36} />
              </ShowImage>
            </div>
            <div style={{padding:"8px 2px 0"}}><div style={{fontSize:12,color:"#fff",fontWeight:500,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.t}</div><div style={{fontSize:10,color:"#888",marginTop:2}}>{it.show.title} · {it.e}</div></div>
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
        <div style={{display:"flex",flexDirection:"column",gap:20,padding:"0 16px"}}>{SHOWS.flatMap(s=>s.clips.map((c,i)=>({...c,show:s,key:`${s.id}c${i}`}))).map(it=><div key={it.key} style={{cursor:"pointer"}} onClick={()=>{addRedPill();tt("💊 빨간약 +1!");it.url?window.open(it.url,'_blank','noopener,noreferrer'):sDet(it.show);}}><div style={{width:"100%",aspectRatio:"16/9",borderRadius:12,overflow:"hidden",position:"relative"}}><ShowImage src={it.thumb || it.show.posterImage} title={it.t} color={it.show.tc}><PlayBtn size={48}/></ShowImage></div><div style={{padding:"10px 2px 0"}}><div style={{fontSize:14,fontWeight:600,color:"#fff",lineHeight:1.4}}>{it.t}</div><div style={{fontSize:12,color:"#888",marginTop:3}}>{it.show.title} · {it.e}</div></div></div>)}</div>
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
