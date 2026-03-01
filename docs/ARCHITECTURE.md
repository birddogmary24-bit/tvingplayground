# ARCHITECTURE — TVING Playground 구현 설계서

> 최종 업데이트: 2026-03-01

---

## 1. 기술 스택

| 계층 | 기술 | 버전/설정 |
|------|------|----------|
| 런타임 | React | 18.x |
| 빌드 | Vite | 6.x |
| 스타일 | 인라인 스타일 (CSS-in-JS) | - |
| 배포 | Vercel | 정적 사이트 |
| 저장소 | localStorage | 브라우저 내장 |
| 패키지 매니저 | npm | - |

---

## 2. 파일 구조

```
tvingplayground/
├── src/
│   ├── App.jsx              ← 메인 앱 (전체 UI + 로직, ~1,010줄)
│   ├── main.jsx             ← React 엔트리포인트 (ReactDOM.createRoot)
│   └── data/
│       ├── index.js         ← re-export (SHOWS)
│       └── shows.js         ← 콘텐츠 DB (7개 프로그램, ~500줄)
├── public/
│   └── tving-logo.svg       ← 헤더 로고 이미지
├── docs/
│   ├── CONTEXT.md           ← 프로젝트 브리핑
│   ├── PRD.md               ← 제품 요구사항
│   ├── ARCHITECTURE.md      ← 이 문서
│   ├── FEATURE_LIST.md      ← 기능 명세서
│   ├── MEMBERSHIP_POLICY.md ← 회원/포인트/레벨/랭킹 정책
│   ├── SESSION_LOG.md       ← 작업 기록
│   └── DECISION_LOG.md      ← 주요 결정 기록
├── scripts/                  ← 유틸리티 스크립트
├── package.json
├── vite.config.js            ← Vite 설정 (host: true)
├── vercel.json               ← Vercel SPA 라우팅 설정
├── index.html                ← HTML 템플릿
└── .gitignore
```

---

## 3. 컴포넌트 구조

현재 단일 `App.jsx` 파일에 모든 컴포넌트가 정의되어 있음.

### 3.1 컴포넌트 트리

```
App (default export)
├── Header (인라인)
│   ├── TVING 로고 + "놀이터" 뱃지
│   ├── 유저 프로필 (아바타/닉네임/레벨/포인트)
│   └── 로그인/로그아웃 버튼
│
├── [tab === "home"] 홈 탭
│   ├── Hero Banner (3개 콘텐츠 자동 회전)
│   ├── Quick Menu (4개 바로가기)
│   ├── 3Pack Banner (프로모션 링크)
│   ├── VOD 가로 스크롤 (SH 섹션 헤더)
│   ├── Shorts 가로 스크롤
│   ├── Clips 가로 스크롤
│   ├── Games 가로 스크롤
│   └── 구독 프로모션 카드
│
├── [tab === "shorts"] 쇼츠 탭
│   └── 2열 그리드 (9:16 카드)
│
├── [tab === "clip"] 클립 탭
│   └── 세로 리스트 (16:9 카드)
│
├── [tab === "game"] 게임 탭
│   ├── [gm === null] 게임 목록 (5개)
│   ├── [gm === "quiz"] Quiz 컴포넌트
│   ├── [gm === "roulette"] Roulette 컴포넌트
│   ├── [gm === "memory"] FamousScene 컴포넌트
│   └── [gm === "catgame"] CatGame 컴포넌트
│
├── [tab === "sched"] 일정 탭
│   └── 요일별 편성표 리스트
│
├── [tab === "my"] MY 탭
│   ├── 프로필 카드
│   ├── 레벨 프로그레스바
│   ├── 보유 포인트
│   ├── 랭킹 보드 (TOP3 포디움 + 4위 이하 리스트)
│   ├── 게임 히스토리 (최근 10건)
│   ├── 구매 콘텐츠
│   └── 구독권 보기 버튼
│
├── Tab Bar (하단 고정, 6개 탭)
│
└── Modals (조건부 렌더링)
    ├── [det] 콘텐츠 상세 모달
    ├── [lgM] 로그인 모달
    ├── [subM] 구독권 모달
    └── [allM] 전체 VOD 모달
```

### 3.2 독립 컴포넌트 (함수형)

| 컴포넌트 | 역할 | Props |
|----------|------|-------|
| `FallbackPoster` | 이미지 로드 실패 시 SVG 폴백 | `title, genre, color, style` |
| `ShowImage` | 이미지 + 폴백 + 로딩 스피너 | `src, title, genre, color, style, children` |
| `Quiz` | 캐릭터 퀴즈 게임 | `onDone, onRew` |
| `Roulette` | 추천 룰렛 게임 | `onDone, onRew` |
| `FamousScene` | 명장면 매칭 게임 | `onDone, onRew` |
| `CatSVG` | 고양이 SVG 렌더러 | `cat, size, blink` |
| `CatGame` | 야옹이 키우기 게임 | `onDone, onGoShorts, onGoClip` |
| `SH` | 섹션 헤더 (제목 + 더보기) | `t, s, onMore` |
| `PlayBtn` | 재생 버튼 오버레이 | `size` |
| `Modal` | 하단 시트 모달 래퍼 | `children, onClose` |
| `Ic.*` | SVG 아이콘 모음 (12종) | 없음 |

---

## 4. 상태 관리

### 4.1 React State (App 컴포넌트)

| 변수 | 초기값 | 용도 |
|------|--------|------|
| `tab` | `"home"` | 현재 탭 (home/shorts/clip/game/sched/my) |
| `lg` | `false` | 로그인 상태 |
| `pt` | `120` | 사용 가능 포인트 |
| `det` | `null` | 상세 모달에 표시할 콘텐츠 (Show 객체) |
| `lgM` | `false` | 로그인 모달 표시 |
| `gm` | `null` | 현재 플레이 중인 게임 ID |
| `subM` | `false` | 구독권 모달 표시 |
| `own` | `[]` | 구매한 콘텐츠 ID 배열 |
| `tst` | `null` | 토스트 메시지 (2.5초 자동 소멸) |
| `allM` | `false` | 전체 VOD 모달 표시 |
| `hi` | `0` | 히어로 배너 현재 인덱스 (0–2) |
| `usr` | `null` | 유저 객체 (localStorage와 동기화) |

### 4.2 localStorage 키

| 키 | 데이터 | 관리 주체 |
|----|--------|----------|
| `tving_user` | 유저 프로필 + 포인트 + 히스토리 | App 컴포넌트 |
| `catgame_save` | 야옹이 키우기 세이브 데이터 | CatGame 컴포넌트 |

### 4.3 데이터 흐름

```
shows.js (정적 DB)
    │
    ├─[import]─→ App.jsx
    │              │
    │         SHOWS_RAW.map()
    │              │
    │         SHOWS (변환된 내부 포맷)
    │              │
    │         ┌────┴────┐
    │         │         │
    │    렌더링    게임 컴포넌트
    │    (카드,    (Quiz, Roulette,
    │     모달)    FamousScene)
    │
localStorage
    │
    ├── tving_user ←→ App (loadUser/saveUser)
    │     │
    │     ├── totalPt → 레벨 계산 (getLevel)
    │     ├── totalPt → 랭킹 정렬 (FAKE_USERS + usr)
    │     └── history → 게임 히스토리 표시
    │
    └── catgame_save ←→ CatGame (독립 저장)
```

---

## 5. 데이터 스키마

### 5.1 shows.js 원본 스키마

```javascript
{
  id: string,             // "ex4", "dx", "jg" ...
  title: string,          // "환승연애4"
  genre: string,          // "예능·리얼리티"
  year: number,           // 2025
  cast: string[],         // ["정기석", "이용진", ...]
  description: string,    // 프로그램 설명
  tag: string,            // "HOT" | "NEW" | "TOP" | "FREE" | "LIVE"
  tagColor: string,       // "#FF2D55"
  rating: string,         // "15세" | "19세" | "12세" | "ALL"
  schedule: string,       // "매주 수 20:45"
  free: boolean,          // 무료 여부
  price: number | null,   // 유료 시 포인트 가격
  posterImage: string,    // TVING CDN 세로 포스터 URL
  bannerImage: string,    // TVING CDN 가로 배너 URL
  tvingUrl: string,       // TVING 프로그램 페이지 URL
  episodes: [
    { ep: number, title: string, vodUrl: string }
  ],
  clips: [
    { title: string, episode: string, clipUrl: string, clipThumbnail: string }
  ],
  shorts: [
    { title: string, shortsThumbnail: string }
  ]
}
```

### 5.2 App 내부 변환 (SHOWS_RAW → SHOWS)

```javascript
{
  ...원본필드,
  tc: tagColor,                    // 축약 alias
  desc: description,               // 축약 alias
  rat: rating,                     // 축약 alias
  sched: schedule,                 // 축약 alias
  ep: episodes.length,             // 에피소드 수
  tvingUrl: clips[0]?.clipUrl || episodes[0]?.vodUrl,     // 대표 클립 URL
  tvingEpUrl: episodes[0]?.vodUrl || clips[0]?.clipUrl,   // 대표 VOD URL
  clips: [{ t, e, thumb, url }],   // 축약 매핑
  shorts: [{ t, thumb }]           // 축약 매핑
}
```

### 5.3 유저 데이터 스키마 (localStorage)

```javascript
{
  id: "usr_a7f3b2",       // 랜덤 hex ID
  nickname: "용감한수달",    // 형용사 + 동물
  avatar: "🦦",            // 동물 이모지
  totalPt: 420,            // 누적 포인트 (레벨/랭킹 기준)
  gamesPlayed: 12,         // 총 게임 플레이 횟수
  history: [               // 게임 기록 (최대 50건)
    { game: "famousscene", pts: 52, correct: 4, total: 6, ts: 1709280000000 }
  ]
}
```

---

## 6. 스타일링 아키텍처

### 6.1 방식
- **인라인 스타일**: 모든 컴포넌트에 `style={{...}}` 객체로 스타일 적용
- **`<style>` 태그**: 키프레임 애니메이션, 스크롤바 숨김 등 CSS 전역 스타일
- **SVG**: 아이콘(`Ic.*`), 폴백 포스터(`FallbackPoster`), 고양이(`CatSVG`)

### 6.2 사용 중인 CSS 키프레임

| 이름 | 용도 | 적용 대상 |
|------|------|----------|
| `spin` | 로딩 스피너 회전 | ShowImage 로딩 |
| `rl` | 룰렛 회전 | Roulette |
| `fi` | 토스트 페이드인 | 토스트 메시지 |
| `catTail` | 고양이 꼬리 흔들기 | CatSVG |
| `lvUp` | 레벨업 스케일 애니메이션 | CatGame |
| `pillPop` | 약 획득 팝업 | CatGame |
| `sparkle` | 레벨업 반짝임 | CatGame |

### 6.3 반응형 전략
- `max-width: 430px`로 모바일 뷰포트 제한
- `padding-bottom: env(safe-area-inset-bottom)` 노치 대응
- `overflow-x: auto`로 가로 스크롤 처리
- `aspectRatio` CSS 속성으로 비율 유지

---

## 7. 주요 패턴

### 7.1 이미지 로딩 전략

```
ShowImage 컴포넌트
  ├── src 없음 or 에러 → FallbackPoster (SVG 자동 생성)
  ├── 로딩 중 → 스피너 (border-top 회전)
  └── 로드 완료 → img 태그 (opacity 0→1 전환, lazy loading)
```

- `onError` → 폴백 전환
- `onLoad` → 스피너 제거 + 이미지 페이드인
- `loading="lazy"` → 네이티브 레이지 로딩

### 7.2 게임 → 보상 흐름

```
게임 컴포넌트 (Quiz/FamousScene/Roulette)
  │
  └── onRew(points, gameType, {correct, total})
        │
        App.rew()
          ├── pt += points (useState)
          ├── usr.totalPt += points (localStorage)
          ├── usr.gamesPlayed += 1
          ├── usr.history.unshift({...})
          ├── 히스토리 50건 초과 시 slice
          └── saveUser() → localStorage 저장
```

### 7.3 탭 네비게이션

```
tab (useState)  ←── Tab Bar 클릭
  │                    └── sTab(key) + sGm(null)
  │
  ├── "home"    → 홈 (히어로 + VOD + 쇼츠 + 클립 + 게임)
  ├── "shorts"  → 쇼츠 전체
  ├── "clip"    → 클립 전체
  ├── "game"    → 게임 (gm으로 서브 라우팅)
  ├── "sched"   → 일정
  └── "my"      → 마이페이지
```

### 7.4 모달 관리
- 조건부 렌더링: `{det && <Modal>...}`, `{lgM && <Modal>...}` 등
- 백드롭 클릭 → `onClose` 호출
- 모달 내부 클릭 → `e.stopPropagation()` 전파 차단
- z-index: 200 (모달), 300 (토스트)

### 7.5 콘텐츠 시청 → 빨간약 연동

```
쇼츠/클립 카드 클릭
  ├── addRedPill()  ← catgame_save의 redPills +1
  ├── 토스트 "💊 빨간약 +1!"
  └── window.open(tvingUrl, '_blank')
```

---

## 8. 외부 의존성

### 8.1 CDN 의존성
- **TVING 이미지 CDN**: `image.tving.com/ntgs/...` (포스터/배너/썸네일)
  - CDN 접근 불가 시 FallbackPoster SVG 자동 전환

### 8.2 외부 링크
- **TVING VOD**: `https://www.tving.com/contents/E{코드}`
- **TVING 클립**: `https://www.tving.com/contents/L{코드}`
- **3Pack 테마**: `https://www.tving.com/list/theme/3pack`

### 8.3 npm 의존성
- `react` + `react-dom` (18.x)
- `vite` (빌드 도구)
- 기타 런타임 의존성 없음 (외부 라이브러리 미사용)

---

## 9. 빌드 & 배포

### 9.1 개발 서버
```bash
npm run dev     # Vite dev server (localhost:3000, host: true)
```

### 9.2 빌드
```bash
npm run build   # dist/ 폴더에 정적 파일 생성
```

### 9.3 배포
```bash
npx vercel --prod --yes   # Vercel 프로덕션 배포
```

### 9.4 Vercel 설정 (vercel.json)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 10. 향후 리팩토링 방향

### 10.1 컴포넌트 분리 (1순위)
```
src/
├── components/
│   ├── Header.jsx
│   ├── HeroBanner.jsx
│   ├── TabBar.jsx
│   ├── Modal.jsx
│   ├── ShowImage.jsx
│   ├── games/
│   │   ├── Quiz.jsx
│   │   ├── Roulette.jsx
│   │   ├── FamousScene.jsx
│   │   └── CatGame.jsx
│   └── tabs/
│       ├── HomeTab.jsx
│       ├── ShortsTab.jsx
│       ├── ClipTab.jsx
│       ├── GameTab.jsx
│       ├── ScheduleTab.jsx
│       └── MyTab.jsx
├── hooks/
│   ├── useUser.js
│   └── useToast.js
└── utils/
    ├── levels.js
    └── time.js
```

### 10.2 스타일링 전환 (2순위)
- 인라인 스타일 → TailwindCSS 유틸리티 클래스

### 10.3 라우팅 도입 (3순위)
- useState 탭 전환 → React Router (`/`, `/shorts`, `/clip`, `/game`, `/my`)

### 10.4 상태 관리 고도화 (4순위)
- Context API 또는 Zustand로 전역 상태 분리
- localStorage 동기화 로직을 커스텀 훅으로 추출
