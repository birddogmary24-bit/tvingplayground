/**
 * TVING Playground — 콘텐츠 임시 DB
 * (TVING 페이지 크롤링 기준: 2026-02)
 *
 * 필드 안내:
 *   episodes[]      : 에피소드 목록, 각 VOD URL은 E-코드
 *   clips[]         : 가로형 클립 (16:9 썸네일), clipUrl은 L-코드
 *   shorts[]        : 세로형 쇼츠 (9:16 썸네일)
 *   posterImage     : 세로 포스터 (CAIP0200, 2:3)
 *   bannerImage     : 가로 배너 (CAIP0900, 16:9)
 */

// placehold.co 더미 이미지 헬퍼
const ph = (w, h, color, text) => {
  const hex = color.replace("#", "");
  return `https://placehold.co/${w}x${h}/${hex}/ffffff?text=${encodeURIComponent(text)}`;
};

// E-코드 에피소드 배열 생성 (유퀴즈 등 장기 프로그램용)
const makeEps = (count, baseCode, titles = []) =>
  Array.from({ length: count }, (_, i) => ({
    ep: i + 1,
    title: titles[i] ?? `${i + 1}화`,
    vodUrl: `https://www.tving.com/contents/E${String(baseCode + i).padStart(9, "0")}`,
  }));

// 실제 E-코드 목록으로 에피소드 배열 생성
const makeEpsReal = (codes) =>
  codes.map((code, i) => ({
    ep: i + 1,
    title: `${i + 1}화`,
    vodUrl: `https://www.tving.com/contents/${code}`,
  }));

export const SHOWS = [
  /* ══════════════════════════════════════════════
   * 1. 환승연애4  (P001776433)
   * ══════════════════════════════════════════════ */
  {
    id: "ex4",
    title: "환승연애4",
    genre: "예능·리얼리티",
    year: 2025,
    cast: ["정기석", "이용진", "김예원", "유라", "곽민경", "김우진"],
    description:
      "다양한 이유로 이별한 커플들이 한 집에 모여 지나간 연애를 되짚고 새로운 인연을 마주하며 자신만의 사랑을 찾아가는 연애 리얼리티 프로그램",
    tag: "HOT",
    tagColor: "#FF2D55",
    posterImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20251126/1122/P001776433.jpg",
    bannerImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20251126/1154/P001776433.jpg",
    free: true,
    rating: "15세",
    schedule: "종영",

    // ─ 에피소드 (20화) ──────────────────────────
    episodes: makeEpsReal([
      "E004438927", "E004438987", "E004442578", "E004442577", "E004444620",
      "E004449430", "E004450064", "E004453672", "E004456564", "E004460738",
      "E004465331", "E004470012", "E004472771", "E004472770", "E004478543",
      "E004481588", "E004485655", "E004489286", "E004492507", "E004495936",
    ]),

    // ─ 클립 (20개) ──────────────────────────────
    clips: [
      { id: "ex4-c1",  title: "라끼남은 라면 말고도 다른 음식도 잘해요~",           episode: "22화", clipUrl: "https://www.tving.com/contents/L00000276855", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260129123142/thumbnail/L00000276855.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c2",  title: "눈 크고 차분한데 남자면 어떡해요?",                 episode: "22화", clipUrl: "https://www.tving.com/contents/L00000276850", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260129122123/thumbnail/L00000276850.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c3",  title: "7살 차이지만 친구가 된 두 사람",                     episode: "22화", clipUrl: "https://www.tving.com/contents/L00000276847", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260129120933/thumbnail/L00000276847.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c4",  title: "번지수를 잘못 찾았지만 괜찮은 번지수였다",           episode: "22화", clipUrl: "https://www.tving.com/contents/L00000276836", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260129115945/thumbnail/L00000276836.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c5",  title: "서로 잘 몰랐던 입주 첫 날 (feat.첫인상)",           episode: "22화", clipUrl: "https://www.tving.com/contents/L00000276831", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260129114930/thumbnail/L00000276831.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c6",  title: "그래서 더 힘들었던 것 같아",                         episode: "21화", clipUrl: "https://www.tving.com/contents/L00000273076", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260122154905/thumbnail/L00000273076.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c7",  title: "이제 긴 여정을 마무리할 시간",                       episode: "21화", clipUrl: "https://www.tving.com/contents/L00000273075", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260122154815/thumbnail/L00000273075.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c8",  title: "마지막이라고 생각하니 몰려오는 아쉬움",               episode: "21화", clipUrl: "https://www.tving.com/contents/L00000273074", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260122154210/thumbnail/L00000273074.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c9",  title: "말로 설명하기 어려운 기분이었어요",                   episode: "21화", clipUrl: "https://www.tving.com/contents/L00000273070", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260122153738/thumbnail/L00000273070.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c10", title: "약간 좀 두렵기도 했던 것 같아요",                     episode: "21화", clipUrl: "https://www.tving.com/contents/L00000273068", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260122153454/thumbnail/L00000273068.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c11", title: "최종 선택을 앞두고 엉켜가는 감정들",                  episode: "20화", clipUrl: "https://www.tving.com/contents/L00000268528", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260114163400/thumbnail/L00000268528.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c12", title: "헤어졌던 사이인데 다시 만나면 행복할까?",             episode: "20화", clipUrl: "https://www.tving.com/contents/L00000268527", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260114163314/thumbnail/L00000268527.png", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c13", title: "마지막 편지에 눈물이 났다",                           episode: "20화", clipUrl: "https://www.tving.com/contents/L00000268526", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c14", title: "X의 마음을 안 순간부터 마음이 이상하다",               episode: "20화", clipUrl: "https://www.tving.com/contents/L00000268525", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c15", title: "오랜만에 마주 보고 데이트를 했다",                     episode: "20화", clipUrl: "https://www.tving.com/contents/L00000268524", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c16", title: "마지막 X 데이트에서 전한 진심",                       episode: "20화", clipUrl: "https://www.tving.com/contents/L00000268523", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c17", title: "멈춘 줄 알았던 시간이 다시 흐르기 시작했다",           episode: "19화", clipUrl: "https://www.tving.com/contents/L00000265376", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c18", title: "누군가에게는 혼란스러운 진실 게임 타임",               episode: "19화", clipUrl: "https://www.tving.com/contents/L00000265370", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c19", title: "오늘 밤 모두의 진실이 밝혀진다",                       episode: "19화", clipUrl: "https://www.tving.com/contents/L00000265364", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-c20", title: "자연스러운 스킨십은 덤! 설레는 바다 데이트",           episode: "19화", clipUrl: "https://www.tving.com/contents/L00000265360", clipThumbnail: ph(640, 360, "#FF2D55", "환승4"), shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
    ],

    // ─ 쇼츠 (6개) ───────────────────────────────
    shorts: [
      { id: "ex4-s1", title: "최종 선택 직전 두근거리는 3초", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-s2", title: "재회의 순간, 멈추는 시간", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-s3", title: "진솔한 고백 후 흘러내린 눈물", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-s4", title: "설레는 바다 데이트 명장면", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-s5", title: "과몰입 유발 장면 TOP3", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
      { id: "ex4-s6", title: "진심 게임 타임 하이라이트", shortsThumbnail: ph(360, 640, "#FF2D55", "환승4") },
    ],
  },

  /* ══════════════════════════════════════════════
   * 2. 친애하는X  (P001776344)
   * ══════════════════════════════════════════════ */
  {
    id: "dx",
    title: "친애하는X",
    genre: "드라마·스릴러",
    year: 2025,
    cast: ["김유정", "김영대", "김도훈", "이열음"],
    description:
      "지옥에서 벗어나 가장 높은 곳으로 올라가기 위해 가면을 쓴 여자 '백아진', 그리고 그녀에게 잔혹하게 짓밟힌 X들의 이야기",
    tag: "NEW",
    tagColor: "#5856D6",
    posterImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20251021/1250/P001776344.jpg",
    bannerImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20251021/1250/P001776344.jpg",
    free: false,
    price: 3000,
    rating: "19세",
    schedule: "완결",

    // ─ 에피소드 (12화) ──────────────────────────
    episodes: makeEpsReal([
      "E004454417", "E004445099", "E004445098", "E004445140",
      "E004458283", "E004458282", "E004458281", "E004458280",
      "E004466291", "E004466301", "E004466297", "E004466294",
    ]),

    // ─ 클립 (7개) ───────────────────────────────
    clips: [
      { id: "dx-c1", title: "백아진, 가면을 벗다",         episode: "12화", clipUrl: "https://www.tving.com/contents/L00000289101", clipThumbnail: ph(640, 360, "#5856D6", "친애하는X"), shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-c2", title: "복수의 시작, 첫 번째 표적",   episode: "2화",  clipUrl: "https://www.tving.com/contents/L00000289102", clipThumbnail: ph(640, 360, "#5856D6", "친애하는X"), shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-c3", title: "믿었던 사람의 배신",           episode: "7화",  clipUrl: "https://www.tving.com/contents/L00000289103", clipThumbnail: ph(640, 360, "#5856D6", "친애하는X"), shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-c4", title: "균열의 시작, 흔들리는 가면",  episode: "3화",  clipUrl: "https://www.tving.com/contents/L00000289104", clipThumbnail: ph(640, 360, "#5856D6", "친애하는X"), shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-c5", title: "함정 속의 함정, 반전 연속",   episode: "9화",  clipUrl: "https://www.tving.com/contents/L00000289105", clipThumbnail: ph(640, 360, "#5856D6", "친애하는X"), shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-c6", title: "눈물 없이 볼 수 없는 대치 씬", episode: "11화", clipUrl: "https://www.tving.com/contents/L00000289106", clipThumbnail: ph(640, 360, "#5856D6", "친애하는X"), shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-c7", title: "최종화 충격 반전 엔딩",        episode: "12화", clipUrl: "https://www.tving.com/contents/L00000289107", clipThumbnail: ph(640, 360, "#5856D6", "친애하는X"), shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
    ],

    // ─ 쇼츠 (5개) ───────────────────────────────
    shorts: [
      { id: "dx-s1", title: "백아진 냉혹한 눈빛 모음", shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-s2", title: "반전 엔딩 직전 긴장감",    shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-s3", title: "김유정 명연기 씬 모음",    shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-s4", title: "소름 돋는 복선 모음.zip",  shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
      { id: "dx-s5", title: "\"넌 내가 누군지 모르잖아\" 명대사", shortsThumbnail: ph(360, 640, "#5856D6", "친애하는X") },
    ],
  },

  /* ══════════════════════════════════════════════
   * 3. 판사 이한영  (P001780004)
   * ══════════════════════════════════════════════ */
  {
    id: "jg",
    title: "판사 이한영",
    genre: "드라마·법정",
    year: 2025,
    cast: ["지성", "박희순", "원진아"],
    description:
      "거대 로펌의 머슴으로 살다가 10년 전으로 회귀한 적폐 판사 이한영이 새로운 선택으로 거대 악을 응징하는 정의 구현 회귀 드라마",
    tag: "TOP",
    tagColor: "#FF9500",
    posterImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20251205/0815/P001780004.jpg",
    bannerImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20251205/0815/P001780004.jpg",
    free: true,
    rating: "15세",
    schedule: "완결",

    // ─ 에피소드 (14화) ──────────────────────────
    episodes: makeEpsReal([
      "E004490480", "E004490937", "E004493519", "E004494319",
      "E004497165", "E004497414", "E004500460", "E004501075",
      "E004504091", "E004504703", "E004507745", "E004508037",
      "E004510936", "E004511415",
    ]),

    // ─ 클립 (8개) ───────────────────────────────
    clips: [
      { id: "jg-c1", title: "법정에서 터진 이한영의 폭로",      episode: "14화", clipUrl: "https://www.tving.com/contents/L00000289201", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-c2", title: "무죄 판결, 방청객 환호",            episode: "11화", clipUrl: "https://www.tving.com/contents/L00000289202", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-c3", title: "판사 vs 검사 날선 공방",            episode: "7화",  clipUrl: "https://www.tving.com/contents/L00000289203", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-c4", title: "권력에 굴복하지 않는 이한영",       episode: "5화",  clipUrl: "https://www.tving.com/contents/L00000289204", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-c5", title: "충격 증인 등장 – 재판 뒤집힌다",   episode: "10화", clipUrl: "https://www.tving.com/contents/L00000289205", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-c6", title: "사법 비리 전모 드러나는 장면",      episode: "13화", clipUrl: "https://www.tving.com/contents/L00000289206", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-c7", title: "회귀한 이한영의 첫 선택",           episode: "1화",  clipUrl: "https://www.tving.com/contents/L00000289207", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-c8", title: "최후의 법정, 판결문 낭독",          episode: "14화", clipUrl: "https://www.tving.com/contents/L00000289208", clipThumbnail: ph(640, 360, "#FF9500", "판사이한영"), shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
    ],

    // ─ 쇼츠 (6개) ───────────────────────────────
    shorts: [
      { id: "jg-s1", title: "이한영 명대사 모음",         shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-s2", title: "판결문 낭독 명장면",         shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-s3", title: "지성 눈빛 변화 씬 모음",     shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-s4", title: "방청객 울게 만든 무죄 선고", shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-s5", title: "법정 최강 명장면 TOP5",      shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
      { id: "jg-s6", title: "\"정의는 반드시 이긴다\" 명대사", shortsThumbnail: ph(360, 640, "#FF9500", "판사이한영") },
    ],
  },

  /* ══════════════════════════════════════════════
   * 4. 유퀴즈온더블럭  (P000643144)
   * ══════════════════════════════════════════════ */
  {
    id: "uq",
    title: "유퀴즈온더블럭",
    genre: "예능·토크",
    year: 2018,
    cast: ["유재석", "조세호"],
    description:
      "길거리에서 만난 평범한 사람들의 특별한 삶 이야기를 담는 퀴즈 토크쇼. 332회가 넘도록 꾸준히 사랑받는 tvN 대표 예능.",
    tag: "FREE",
    tagColor: "#34C759",
    posterImage: ph(300, 450, "#34C759", "유퀴즈"),
    bannerImage: ph(900, 506, "#34C759", "유퀴즈온더블럭"),
    free: true,
    rating: "전체",
    schedule: "매주 수 20:45",

    // ─ 에피소드 (최근 10화 노출) ─────────────────
    episodes: makeEps(10, 4501001),

    // ─ 클립 (8개) ───────────────────────────────
    clips: [
      { id: "uq-c1", title: "역대급 사연자 울컥 엔딩",         episode: "330화", clipUrl: "https://www.tving.com/contents/L00000289301", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-c2", title: "유재석&조세호 브로맨스 명장면",   episode: "325화", clipUrl: "https://www.tving.com/contents/L00000289302", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-c3", title: "100만원 정답 순간 터진 환호",     episode: "328화", clipUrl: "https://www.tving.com/contents/L00000289303", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-c4", title: "소방관 사연자 눈물 터진 명장면",  episode: "310화", clipUrl: "https://www.tving.com/contents/L00000289304", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-c5", title: "유재석도 울어버린 그 사연",       episode: "300화", clipUrl: "https://www.tving.com/contents/L00000289305", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-c6", title: "역대 최고 난이도 퀴즈 도전",      episode: "322화", clipUrl: "https://www.tving.com/contents/L00000289306", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-c7", title: "100세 할머니와의 감동 대화",      episode: "290화", clipUrl: "https://www.tving.com/contents/L00000289307", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-c8", title: "조세호 복귀 첫 방송 눈물",        episode: "270화", clipUrl: "https://www.tving.com/contents/L00000289308", clipThumbnail: ph(640, 360, "#34C759", "유퀴즈"), shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
    ],

    // ─ 쇼츠 (6개) ───────────────────────────────
    shorts: [
      { id: "uq-s1", title: "유재석 리액션 레전드 모음",   shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-s2", title: "사연자가 남긴 명언 TOP5",     shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-s3", title: "퀴즈 정답 맞추는 순간 모음", shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-s4", title: "조세호 웃음 참기 실패 모음", shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-s5", title: "눈물 없이 못 보는 사연 BEST", shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
      { id: "uq-s6", title: "일반인 명언 즉석 명예의전당", shortsThumbnail: ph(360, 640, "#34C759", "유퀴즈") },
    ],
  },

  /* ══════════════════════════════════════════════
   * 5. 대탈출 더스토리  (P001772883)
   * ══════════════════════════════════════════════ */
  {
    id: "ge",
    title: "대탈출 더스토리",
    genre: "예능·추리",
    year: 2025,
    cast: ["강호동", "김동현", "유병재", "고경표", "백현", "여진구"],
    description:
      "레전드 탈출 버라이어티의 귀환! 시공간을 초월하는 탈출 미션에 반전을 거듭하는 스토리라인까지 더해진 NEW 서스펜스 어드벤처!",
    tag: "HOT",
    tagColor: "#E8453C",
    posterImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20250618/0406/P001772883.jpg",
    bannerImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20250618/0406/P001772883.jpg",
    free: false,
    price: 2500,
    rating: "15세",
    schedule: "종영",

    // ─ 에피소드 (11화) ──────────────────────────
    episodes: makeEpsReal([
      "E004388799", "E004396852", "E004396851", "E004396849", "E004396847",
      "E004396868", "E004396867", "E004396866", "E004396865", "E004396864",
      "E004396862",
    ]),

    // ─ 클립 (9개) ───────────────────────────────
    clips: [
      { id: "ge-c1", title: "'여기는 새땅' 후일담 버스 토크",                  episode: "11화", clipUrl: "https://www.tving.com/contents/L00000033831", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250816193508/thumbnail/L00000033831.jpg", shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c2", title: "탈출이고 뭐고 배고파요! 먹방 찍는 고경표",        episode: "9화",  clipUrl: "https://www.tving.com/contents/L00000026436", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250802131121/thumbnail/L00000026436.png",  shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c3", title: "둘이서 못 푸는 게 없는 에이스 백현X고경표",       episode: "8화",  clipUrl: "https://www.tving.com/contents/L00000026432", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250802130921/thumbnail/L00000026432.png",  shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c4", title: "함부로 무당집 들어갔다가 자지러진 탈출러들",      episode: "7화",  clipUrl: "https://www.tving.com/contents/L00000026428", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250802130721/thumbnail/L00000026428.png",  shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c5", title: "눈 앞에서 사람 토막내는 조선시대 살인귀",         episode: "6화",  clipUrl: "https://www.tving.com/contents/L00000026423", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250802130451/thumbnail/L00000026423.png",  shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c6", title: "작은 거인의 컴백! 원조 브레인 유병재 활약상",     episode: "5화",  clipUrl: "https://www.tving.com/contents/L00000022238", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250726154403/thumbnail/L00000022238.png",  shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c7", title: "브레인 유망주 백현! 첫 화부터 맹활약",            episode: "1화",  clipUrl: "https://www.tving.com/contents/L00000022236", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250726154206/thumbnail/L00000022236.png",  shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c8", title: "미친 순발력으로 하드캐리한 고경표 활약 모음!",    episode: "3화",  clipUrl: "https://www.tving.com/contents/L00000022234", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20250726153930/thumbnail/L00000022234.png",  shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-c9", title: "진짜로 험한 게 나와버렸다!!",                      episode: "2화",  clipUrl: "https://www.tving.com/contents/L00000022233", clipThumbnail: ph(640, 360, "#E8453C", "대탈출"),                                                   shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
    ],

    // ─ 쇼츠 (5개) ───────────────────────────────
    shorts: [
      { id: "ge-s1", title: "출연진 반응 오버 모음.zip",    shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-s2", title: "고경표 먹방 하이라이트",       shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-s3", title: "소름 돋는 복선 재발견 모음",   shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-s4", title: "백현 두뇌풀가동 순간 모음",    shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
      { id: "ge-s5", title: "유병재 컴백 감동 명장면",      shortsThumbnail: ph(360, 640, "#E8453C", "대탈출") },
    ],
  },

  /* ══════════════════════════════════════════════
   * 6. 쇼미더머니12  (P001781342)
   * ══════════════════════════════════════════════ */
  {
    id: "sm",
    title: "쇼미더머니12",
    genre: "예능·힙합",
    year: 2026,
    cast: ["지코", "크러쉬", "그레이", "로꼬", "박재범"],
    description:
      "날 것의 랩 배틀, 되살아난 배틀의 심장. 힙합 씬의 뉴 아이콘이 탄생한다! HIP HOP NEVER DIE — 쇼미더머니12",
    tag: "LIVE",
    tagColor: "#F5A623",
    posterImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20260108/0411/P001781342.jpg",
    bannerImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20260108/0411/P001781342.jpg",
    free: true,
    rating: "15세",
    schedule: "매주 금 22:00",

    // ─ 에피소드 (7화) ───────────────────────────
    episodes: makeEpsReal([
      "E004497016", "E004500132", "E004503915", "E004507403",
      "E004511095", "E004513631", "E004517027",
    ]),

    // ─ 클립 (20개) ──────────────────────────────
    clips: [
      { id: "sm-c1",  title: "대망의 순위 발표 긴장감 MAX",                     episode: "7화", clipUrl: "https://www.tving.com/contents/L00000289510", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260223103951/thumbnail/L00000289510.jpg", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c2",  title: "김하온 X DKAY, 랩적으로 가장 완벽한 무대",        episode: "6화", clipUrl: "https://www.tving.com/contents/L00000288675", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260220231003/thumbnail/L00000288675.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c3",  title: "MILLI X 정준혁 죽는 날까지 우린 록스타",          episode: "6화", clipUrl: "https://www.tving.com/contents/L00000288665", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260220230719/thumbnail/L00000288665.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c4",  title: "트레이비 X 플리키뱅표 REMIX The Purge",           episode: "6화", clipUrl: "https://www.tving.com/contents/L00000288664", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260220230614/thumbnail/L00000288664.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c5",  title: "지옥의 송캠프 3라운드 듀엣 미션 미리보기",         episode: "6화", clipUrl: "https://www.tving.com/contents/L00000288663", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260220230519/thumbnail/L00000288663.jpg", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c6",  title: "'같이 죽거나 같이 살거나' 듀엣 미션 예고",         episode: "6화", clipUrl: "https://www.tving.com/contents/L00000285986", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260214153051/thumbnail/L00000285986.jpg", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c7",  title: "Team 김하온 UMM 4:4 팀 미션",                     episode: "5화", clipUrl: "https://www.tving.com/contents/L00000285830", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260214014749/thumbnail/L00000285830.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c8",  title: "Team 제네 더 질라 UMM 4:4 팀 미션",               episode: "5화", clipUrl: "https://www.tving.com/contents/L00000285829", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260214013801/thumbnail/L00000285829.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c9",  title: "Team 라프산두 PUBLIC ENEMY 4:4 팀 미션",          episode: "5화", clipUrl: "https://www.tving.com/contents/L00000285828", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260214013059/thumbnail/L00000285828.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c10", title: "Team MILLI 2-5-1 4:4 팀 미션",                    episode: "5화", clipUrl: "https://www.tving.com/contents/L00000285827", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260214011801/thumbnail/L00000285827.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c11", title: "Team 플리키뱅 knot 44 팀 미션",                   episode: "5화", clipUrl: "https://www.tving.com/contents/L00000285826", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260214005133/thumbnail/L00000285826.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c12", title: "Team 정준혁 No you Can't 4:4 팀 미션",            episode: "5화", clipUrl: "https://www.tving.com/contents/L00000285809", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260214003953/thumbnail/L00000285809.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c13", title: "지옥의 송캠프 2라운드 4:4 팀 미션 미리보기",       episode: "5화", clipUrl: "https://www.tving.com/contents/L00000284679", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260212103652/thumbnail/L00000284679.jpg", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c14", title: "오늘은 저 말고 하온씨가 울게 될 거예요",           episode: "4화", clipUrl: "https://www.tving.com/contents/L00000281821", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260206231658/thumbnail/L00000281821.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c15", title: "PoinPan vs 영블레시 vs 트레이비 피 튀기는 대결",  episode: "4화", clipUrl: "https://www.tving.com/contents/L00000281793", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260206231034/thumbnail/L00000281793.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c16", title: "쇼미12의 밀리는 저예요, 밀리맥스 vs MILLI",       episode: "4화", clipUrl: "https://www.tving.com/contents/L00000281792", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260206225627/thumbnail/L00000281792.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c17", title: "바로 다시 보기 하고 싶은 DKAY vs 상대방 대결",    episode: "4화", clipUrl: "https://www.tving.com/contents/L00000281788", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260206224219/thumbnail/L00000281788.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c18", title: "\"집에 가서 비행기 표나 알아보세요\" 찐텐 신경전", episode: "4화", clipUrl: "https://www.tving.com/contents/L00000281785", clipThumbnail: "https://image.tving.com/ntgs/news/clip/20260206223505/thumbnail/L00000281785.png", shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c19", title: "지목으로 시작되는 지옥의 송캠프 미션",             episode: "3화", clipUrl: "https://www.tving.com/contents/L00000278736", clipThumbnail: ph(640, 360, "#F5A623", "쇼미12"), shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-c20", title: "실력으로 프로듀서 모두 설득한 MILLI의 60초 랩",   episode: "1화", clipUrl: "https://www.tving.com/contents/L00000277920", clipThumbnail: ph(640, 360, "#F5A623", "쇼미12"), shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
    ],

    // ─ 쇼츠 (6개) ───────────────────────────────
    shorts: [
      { id: "sm-s1", title: "MILLI 60초 랩 레전드 씬",      shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-s2", title: "심사위원 반응 폭발 모음",       shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-s3", title: "프리스타일 레전드 30초 씬",     shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-s4", title: "탈락 후 인터뷰 눈물 모음",     shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-s5", title: "관객 반응 카메라 컷 모음",     shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
      { id: "sm-s6", title: "팀 미션 하이라이트 풀버전",    shortsThumbnail: ph(360, 640, "#F5A623", "쇼미12") },
    ],
  },

  /* ══════════════════════════════════════════════
   * 7. 우주를 줄게  (P001782227)
   * ══════════════════════════════════════════════ */
  {
    id: "uv",
    title: "우주를 줄게",
    genre: "드라마·로맨스",
    year: 2025,
    cast: ["배인혁", "노정의", "박서함"],
    description:
      "첫 만남부터 꼬인 사돈남녀가 하루아침에 20개월 조카 '우주'를 키우게 되면서 벌어지는 좌충우돌 동거 로맨스",
    tag: "NEW",
    tagColor: "#007AFF",
    posterImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0200/ko/20260128/0816/P001782227.jpg",
    bannerImage: "https://image.tving.com/ntgs/contents/CTC/caip/CAIP0900/ko/20260128/0816/P001782227.jpg",
    free: true,
    rating: "전체",
    schedule: "매주 수목 20:40",

    // ─ 에피소드 (8화, 현재 방영중) ───────────────
    episodes: makeEpsReal([
      "E004504475", "E004507306", "E004507323", "E004510313",
      "E004510687", "E004510688", "E004510689", "E004516699",
    ]),

    // ─ 클립 (7개) ───────────────────────────────
    clips: [
      { id: "uv-c1", title: "사돈남녀 첫 만남부터 꼬인 인연",   episode: "1화", clipUrl: "https://www.tving.com/contents/L00000289601", clipThumbnail: ph(640, 360, "#007AFF", "우주를줄게"), shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-c2", title: "조카 우주와의 첫 동거 좌충우돌",   episode: "2화", clipUrl: "https://www.tving.com/contents/L00000289602", clipThumbnail: ph(640, 360, "#007AFF", "우주를줄게"), shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-c3", title: "어색한 동거, 가까워지는 두 사람", episode: "3화", clipUrl: "https://www.tving.com/contents/L00000289603", clipThumbnail: ph(640, 360, "#007AFF", "우주를줄게"), shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-c4", title: "설레는 순간, 우주가 연결해준 인연", episode: "4화", clipUrl: "https://www.tving.com/contents/L00000289604", clipThumbnail: ph(640, 360, "#007AFF", "우주를줄게"), shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-c5", title: "배인혁 눈빛 변화 명장면",          episode: "5화", clipUrl: "https://www.tving.com/contents/L00000289605", clipThumbnail: ph(640, 360, "#007AFF", "우주를줄게"), shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-c6", title: "엇갈린 감정, 터지는 눈물",        episode: "6화", clipUrl: "https://www.tving.com/contents/L00000289606", clipThumbnail: ph(640, 360, "#007AFF", "우주를줄게"), shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-c7", title: "우주가 이어준 두 사람의 마음",     episode: "7화", clipUrl: "https://www.tving.com/contents/L00000289607", clipThumbnail: ph(640, 360, "#007AFF", "우주를줄게"), shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
    ],

    // ─ 쇼츠 (6개) ───────────────────────────────
    shorts: [
      { id: "uv-s1", title: "배인혁 설레 눈빛 모음.zip",           shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-s2", title: "아기 우주 귀여움 폭발 모음",          shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-s3", title: "노정의 감정씬 하이라이트",            shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-s4", title: "사돈남녀 동거 좌충우돌 명장면",       shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-s5", title: "두 사람 가까워지는 설레는 순간",      shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
      { id: "uv-s6", title: "\"우주를 줄게\" 명장면 예고",         shortsThumbnail: ph(360, 640, "#007AFF", "우주를줄게") },
    ],
  },
];

// 콘텐츠 ID로 빠른 조회
export const SHOWS_MAP = Object.fromEntries(SHOWS.map((s) => [s.id, s]));

// 모든 클립 flat 배열
export const ALL_CLIPS = SHOWS.flatMap((s) =>
  s.clips.map((c) => ({ ...c, showId: s.id, showTitle: s.title, showColor: s.tagColor }))
);

// 모든 쇼츠 flat 배열
export const ALL_SHORTS = SHOWS.flatMap((s) =>
  s.shorts.map((sh) => ({ ...sh, showId: s.id, showTitle: s.title, showColor: s.tagColor }))
);

// 모든 에피소드 flat 배열
export const ALL_EPISODES = SHOWS.flatMap((s) =>
  s.episodes.map((ep) => ({ ...ep, showId: s.id, showTitle: s.title }))
);
