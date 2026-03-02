import { useState, useEffect, useRef } from "react";

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

export default function WordChain({ onDone, onRew }) {
  const [phase, setPhase] = useState("ready");
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [target, setTarget] = useState("");
  const [used, setUsed] = useState(new Set());
  const [round, setRound] = useState(0);
  const [timer, setTimer] = useState(30);
  const [myTurn, setMyTurn] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [hint, setHint] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [hintCount, setHintCount] = useState(0);
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
      setTimer(30);
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
    const starters = WC_WORDS.filter(e => (e.c === "tving" || e.c === "drama") && WC_IDX[e.w[e.w.length - 1]]?.length > 0);
    const first = starters[Math.floor(Math.random() * starters.length)];
    const last = first.w[first.w.length - 1];
    setPhase("playing");
    setUsed(new Set([first.w]));
    setMsgs([{ type: "system", text: "게임 시작!" }, { type: "ai", word: first.w, cat: first.c, last }]);
    setTarget(last);
    setMyTurn(true);
    setTimer(30);
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
    setHint(null);
    setHintUsed(false);
  };

  // 힌트 보기
  const showHint = () => {
    if (hintUsed) return;
    const cands = (WC_IDX[target] || []).map(i => WC_WORDS[i]).filter(e => !used.has(e.w));
    if (cands.length > 0) {
      const pick = cands[Math.floor(Math.random() * cands.length)];
      setHint(pick.w.slice(0, 2) + "○".repeat(Math.max(pick.w.length - 2, 1)) + "...");
    } else {
      setHint("힌트 없음!");
    }
    setHintUsed(true);
    setHintCount(c => c + 1);
  };

  const endGame = (res) => {
    setResult(res);
    setPhase("done");
    const basePts = Math.min(10 + round * 5, 40);
    const pts = Math.max(basePts - hintCount * 3, 5);
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
          • 제한 시간: 턴당 30초<br/>
          • 막히면 💡힌트 버튼을 눌러보세요<br/>
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
    const basePts = Math.min(10 + round * 5, 40);
    const pts = Math.max(basePts - hintCount * 3, 5);
    return (
      <div style={{padding:"40px 16px",textAlign:"center"}}>
        <div style={{fontSize:56,marginBottom:12}}>{result === "win" ? "🎉" : result === "timeout" ? "⏰" : "😅"}</div>
        <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>
          {result === "win" ? "승리!" : result === "timeout" ? "시간 초과!" : "아쉽네요!"}
        </div>
        <div style={{fontSize:15,color:"#999",marginBottom:20}}>{round}라운드 생존!{hintCount > 0 && ` (힌트 ${hintCount}회)`}</div>
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
          <div style={{height:"100%",width:`${(timer/30)*100}%`,background:timerColor,borderRadius:2,transition:"width 1s linear"}}/>
        </div>
        {/* 힌트 */}
        {myTurn && (
          <div style={{marginBottom:8,textAlign:"center"}}>
            {hint ? (
              <div style={{fontSize:13,color:"#FF9500",background:"rgba(255,149,0,0.1)",border:"1px solid rgba(255,149,0,0.3)",padding:"6px 12px",borderRadius:8,display:"inline-block"}}>💡 {hint}</div>
            ) : (
              <button onClick={showHint} disabled={hintUsed} style={{background:hintUsed?"#333":"rgba(255,149,0,0.15)",border:hintUsed?"1px solid #444":"1px solid rgba(255,149,0,0.4)",borderRadius:8,color:hintUsed?"#666":"#FF9500",padding:"6px 14px",fontSize:12,cursor:hintUsed?"default":"pointer",fontWeight:600}}>
                💡 힌트 보기 {hintUsed ? "(사용함)" : ""}
              </button>
            )}
          </div>
        )}
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
