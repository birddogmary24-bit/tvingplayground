import { SHOWS as SHOWS_RAW } from "./data/index.js";

// shows.js 스키마 → App 내부 포맷 변환
export const SHOWS = SHOWS_RAW.map(s => ({
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
export const LS_KEY = "tving_user";
export const loadUser = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)); } catch { return null; } };
export const saveUser = u => localStorage.setItem(LS_KEY, JSON.stringify(u));

// ─── 닉네임 풀 & 프로필 생성 ─────────────────────────────────
const NICK_ADJ = ["행복한","용감한","빠른","귀여운","멋진","신비한","당당한","재밌는","따뜻한","반짝이는","배고픈","졸린","활발한","현명한","유쾌한"];
const NICK_NOUN = ["곰","사자","토끼","펭귄","고양이","강아지","여우","올빼미","코알라","판다","호랑이","돌고래","다람쥐","수달","너구리"];
const AVATARS = ["🐻","🦁","🐰","🐧","🐱","🐶","🦊","🦉","🐨","🐼","🐯","🐬","🐿️","🦦","🦝"];
export function generateUser() {
  const ai = Math.floor(Math.random() * NICK_ADJ.length);
  const ni = Math.floor(Math.random() * NICK_NOUN.length);
  return { id:"usr_"+Math.random().toString(16).slice(2,8), nickname:NICK_ADJ[ai]+NICK_NOUN[ni], avatar:AVATARS[ni], totalPt:120, gamesPlayed:0, history:[] };
}

// ─── 레벨 시스템 ─────────────────────────────────────────────
export const LEVELS = [
  { lv:1, min:0,    name:"뉴비",   badge:"🌱", c:"#8E8E93" },
  { lv:2, min:100,  name:"루키",   badge:"⭐", c:"#34C759" },
  { lv:3, min:300,  name:"챌린저", badge:"🔥", c:"#FF9500" },
  { lv:4, min:600,  name:"마스터", badge:"💎", c:"#5856D6" },
  { lv:5, min:1000, name:"레전드", badge:"👑", c:"#FFD60A" },
  { lv:6, min:2000, name:"티빙킹", badge:"🏆", c:"#FF2D55" },
];

// ─── 가짜 유저 (랭킹용) ──────────────────────────────────────
export const FAKE_USERS = [
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

// ─── 게임 메타 ─────────────────────────────────────────────
export const GAME_ICONS = { quiz:"🧩", roulette:"🎰", famousscene:"🎬" };
export const GAME_NAMES = { quiz:"캐릭터 퀴즈", roulette:"추천 룰렛", famousscene:"명장면 모드" };

export const GAMES = [
  { id:"catgame", name:"야옹이 키우기", desc:"고양이를 키워보세요!", icon:"🐱", pts:0, c:"#FF69B4" },
  { id:"quiz", name:"캐릭터 퀴즈", desc:"환승연애4 퀴즈", icon:"🧩", pts:50, c:"#FF2D55" },
  { id:"roulette", name:"추천 룰렛", desc:"랜덤 콘텐츠 추천", icon:"🎰", pts:30, c:"#FF9500" },
  { id:"memory", name:"명장면 모드", desc:"장면 보고 맞추기", icon:"🎬", pts:80, c:"#5856D6" },
  { id:"wordchain", name:"끝말잇기", desc:"드라마 제목 잇기", icon:"💬", pts:40, c:"#34C759" },
];

// ─── CAT GAME DATA ──────────────────────────────────────────────
export const CAT_PROFILES = [
  { id:"gs", name:"정기석", emoji:"😎" },
  { id:"yj", name:"이용진", emoji:"🤗" },
  { id:"yw", name:"김예원", emoji:"😊" },
  { id:"yr", name:"유라", emoji:"💫" },
  { id:"mk", name:"곽민경", emoji:"🌸" },
  { id:"wj", name:"김우진", emoji:"🔥" },
];

export const CAT_TYPES = [
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
export const getLevelReq = (lv) => {
  const tier = Math.floor((lv - 1) / 10);
  const redMul = [2, 3, 5, 8, 12, 18, 25, 35, 50, 70];
  const bluMul = [0, 2, 3, 5, 8, 12, 16, 22, 30, 45];
  return {
    red: lv * (redMul[tier] ?? 70),
    blue: lv * (bluMul[tier] ?? 45),
  };
};

export const SCHED = [
  { day:"월", shows:[{t:"환승연애4 스페셜",time:"20:00",tag:"종영"}] },
  { day:"화", shows:[{t:"친애하는X",time:"18:00",tag:"완결"}] },
  { day:"수", shows:[{t:"유퀴즈온더블럭",time:"20:45",tag:"LIVE"},{t:"우주를 줄게",time:"20:40",tag:"NEW"}] },
  { day:"목", shows:[{t:"우주를 줄게",time:"20:40",tag:"NEW"}] },
  { day:"금", shows:[{t:"판사 이한영",time:"20:00",tag:"HOT"},{t:"쇼미더머니12",time:"22:00",tag:"LIVE"}] },
  { day:"토", shows:[] },
  { day:"일", shows:[{t:"대탈출 더스토리",time:"21:00",tag:"HOT"}] },
];

export const SUBS = [
  { name:"광고형 스탠다드", price:5500, ft:["광고 포함","FHD","동시 2대"], c:"#8E8E93" },
  { name:"스탠다드", price:9500, ft:["광고 없음","FHD","동시 2대"], c:"#34C759" },
  { name:"프리미엄", price:13900, ft:["광고 없음","4K+돌비","동시 4대"], c:"#FF9500" },
];
