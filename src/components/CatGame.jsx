import { useState, useEffect } from "react";
import Ic from "../Icons.jsx";
import { CAT_PROFILES, CAT_TYPES, getLevelReq } from "../constants.js";
import CatSVG from "./CatSVG.jsx";

export default function CatGame({ onDone, onGoShorts, onGoClip }) {
  const loadSave = () => {
    try {
      const d = localStorage.getItem("catgame_save");
      return d ? JSON.parse(d) : null;
    } catch { return null; }
  };
  const saved = loadSave();

  const [phase, setPhase] = useState(saved ? "main" : "profile");
  const [profile, setProfile] = useState(saved?.profile || null);
  const [cat, setCat] = useState(saved?.cat || null);
  const [level, setLevel] = useState(saved?.level || 1);
  const [redPills, setRedPills] = useState(saved?.redPills || 0);
  const [bluePills, setBluePills] = useState(saved?.bluePills || 0);
  const [lastCheck, setLastCheck] = useState(saved?.lastCheck || null);
  const [blink, setBlink] = useState(false);
  const [lvUpAnim, setLvUpAnim] = useState(false);
  const [pillAnim, setPillAnim] = useState(null);
  const [showReset, setShowReset] = useState(false);

  const save = (data) => {
    localStorage.setItem("catgame_save", JSON.stringify(data));
  };

  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const checkedToday = lastCheck === today;

  const req = getLevelReq(level);
  const needsBlue = req.blue > 0; // 레벨 11 이상부터 파란약 필요
  const canLevelUp = level < 99 && redPills >= req.red && (!needsBlue || bluePills >= req.blue);
  const redProgress = Math.min(redPills / req.red, 1);
  const blueProgress = needsBlue ? Math.min(bluePills / req.blue, 1) : 1;

  const pickProfile = (p) => {
    setProfile(p);
    setPhase("cat");
  };

  const pickCat = (c) => {
    setCat(c);
    setPhase("main");
    const data = { profile, cat: c, level: 1, redPills: 0, bluePills: 0, lastCheck: null };
    save(data);
  };

  // 출석체크 (레벨 10 이하: 빨간약, 레벨 11 이상: 파란약)
  const doCheck = () => {
    if (checkedToday) return;
    let newRed = redPills, newBlue = bluePills;
    if (level <= 10) {
      newRed = redPills + 1;
      setRedPills(newRed);
      setPillAnim("red");
    } else {
      newBlue = bluePills + 1;
      setBluePills(newBlue);
      setPillAnim("blue");
    }
    setLastCheck(today);
    setTimeout(() => setPillAnim(null), 1200);
    save({ profile, cat, level, redPills: newRed, bluePills: newBlue, lastCheck: today });
  };

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
        {needsBlue && <div style={{flex:1,background:"#1C1C1E",borderRadius:12,padding:12,border:"1px solid #5856D633"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
            <span style={{fontSize:16}}>💙</span>
            <span style={{fontSize:12,color:"#8888FF"}}>파란약</span>
            <span style={{fontSize:14,fontWeight:700,color:"#5856D6",marginLeft:"auto"}}>{bluePills}</span>
          </div>
          <div style={{width:"100%",height:4,background:"#333",borderRadius:2}}>
            <div style={{width:`${blueProgress*100}%`,height:"100%",background:"#5856D6",borderRadius:2,transition:"width .3s"}} />
          </div>
          <div style={{fontSize:10,color:"#666",marginTop:4}}>{bluePills}/{req.blue} 필요</div>
        </div>}
      </div>

      {/* 레벨업 버튼 */}
      {level < 99 ? (
        <button onClick={doLevelUp} disabled={!canLevelUp} style={{
          width:"100%",padding:14,marginBottom:10,
          background:canLevelUp?"linear-gradient(135deg,#FFD60A,#FF9500)":"#333",
          border:"none",borderRadius:12,color:canLevelUp?"#000":"#666",
          fontSize:15,fontWeight:700,cursor:canLevelUp?"pointer":"not-allowed"
        }}>{canLevelUp ? `Lv.${level+1}로 레벨업!` : `레벨업까지 — 💊${Math.max(0,req.red-redPills)}${needsBlue ? ` 💙${Math.max(0,req.blue-bluePills)}` : ""} 더 필요`}</button>
      ) : (
        <div style={{width:"100%",padding:14,marginBottom:10,background:"linear-gradient(135deg,#FFD60A,#FF9500)",
          borderRadius:12,textAlign:"center",fontSize:15,fontWeight:800,color:"#000"
        }}>MAX LEVEL 달성! 🏆</div>
      )}

      {/* 출석체크 */}
      <button onClick={doCheck} disabled={checkedToday} style={{
        width:"100%",padding:14,marginBottom:10,
        background:checkedToday?"#1C1C1E":level<=10?"linear-gradient(135deg,#FF2D55,#FF6B35)":"linear-gradient(135deg,#5856D6,#8B5CF6)",
        border:checkedToday?"1px solid #333":"none",borderRadius:12,
        color:checkedToday?"#666":"#fff",fontSize:14,fontWeight:600,
        cursor:checkedToday?"not-allowed":"pointer"
      }}>{checkedToday ? "오늘 출석 완료 ✅" : level <= 10 ? "출석체크 💊 빨간약 받기" : "출석체크 💙 파란약 받기"}</button>

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
