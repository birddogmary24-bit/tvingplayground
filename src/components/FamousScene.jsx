import { useState } from "react";
import Ic from "../Icons.jsx";
import ShowImage from "./ShowImage.jsx";

export default function FamousScene({ onDone, onRew }) {
  const allQ = [
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
