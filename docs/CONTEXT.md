# TVING Playground — Claude Code 브리핑 문서

## 프로젝트 개요
TVING(티빙) OTT 플랫폼을 모티브로 한 모바일 큐레이션 놀이터 서비스 프로토타입.
실제 한국 콘텐츠 7개를 기반으로, VOD 브라우징/쇼츠/클립/미니게임/포인트/구독 시스템을 구현.

## 현재 상태
- **단일 React 컴포넌트** (`src/App.jsx`, 413줄)
- Claude.ai Artifact 환경에서 개발되어, Vite 프로젝트로 전환 필요
- **이미지 문제 미해결**: 현재 Anthropic API + web_search로 런타임 이미지 검색 시도 중이나, 안정적인 이미지 소싱 전략 필요

## 핵심 기능 (구현 완료)
1. **VOD 브라우징**: 7개 콘텐츠 카드 가로 스크롤
2. **쇼츠 탭**: 9:16 세로형 숏폼 그리드
3. **클립 탭**: 16:9 가로형 하이라이트 리스트
4. **미니게임**: 캐릭터 퀴즈 (4문제), 추천 룰렛 (작동), 명장면 매칭/끝말잇기 (미구현)
5. **포인트 시스템**: 게임 보상 → 포인트 적립 → 유료 콘텐츠 구매
6. **로그인/구독**: 모달 기반 로그인, 3단계 구독권 (광고형/스탠다드/프리미엄)
7. **공개 일정**: 요일별 편성표 (오늘 하이라이트)
8. **히어로 배너**: 3개 콘텐츠 자동 회전 (4초 간격)
9. **상세 모달**: 콘텐츠 정보 + 클립/쇼츠 리스트

## 콘텐츠 DB (7개)
| ID | 제목 | 장르 | 태그 | 무료 | 가격 |
|----|------|------|------|------|------|
| ex4 | 환승연애4 | 예능·리얼리티 | HOT | ✅ | - |
| dx | 친애하는X | 드라마·스릴러 | NEW | ❌ | 3000P |
| jg | 판사 이한영 | 드라마·법정 | TOP | ✅ | - |
| uq | 유퀴즈온더블럭 | 예능·토크 | FREE | ✅ | - |
| ge | 대탈출 더스토리 | 예능·추리 | HOT | ❌ | 2500P |
| sm | 쇼미더머니12 | 예능·힙합 | LIVE | ✅ | - |
| uv | 우주를 줄게 | 드라마·로맨스 | NEW | ✅ | - |

## 🔴 최우선 해결 과제: 이미지
현재 이미지가 제대로 표시되지 않음. 시도했던 방법들:

1. **YouTube 썸네일** (`img.youtube.com/vi/{ID}/hqdefault.jpg`) — 가짜 영상 ID로 실패
2. **SVG 프로시저럴 생성** — 작동하지만 퀄리티 낮음 (사용자 거부)
3. **Anthropic API + web_search 런타임 검색** — 현재 코드에 구현됨, 테스트 필요

### 추천 해결 방향
- TMDB API로 한국 콘텐츠 포스터 이미지 가져오기 (무료, 안정적)
- 또는 각 콘텐츠의 실제 YouTube 클립 영상 ID를 수동으로 찾아서 썸네일 사용
- 또는 뉴스 기사의 og:image 메타태그에서 포스터 이미지 URL 수집
- 최종적으로는 자체 이미지 에셋으로 `/public/images/` 에 저장

## 디자인 시스템
- **다크 테마**: 배경 #000, 카드 #1C1C1E
- **메인 컬러**: #FF2D55 (TVING 레드)
- **포인트 컬러**: #FFD60A (골드)
- **태그 컬러**: HOT=#FF2D55, NEW=#5856D6, TOP=#FF9500, FREE=#34C759, LIVE=#F5A623
- **폰트**: Noto Sans KR (또는 시스템 폰트)
- **모바일 퍼스트**: max-width 430px

## 기술 스택 (전환 목표)
```
Vite + React 18
TailwindCSS (현재 인라인 스타일 → 전환)
React Router (탭 네비게이션 → 라우팅 전환)
```

## 파일 구조 (목표)
```
tving-playground/
├── src/
│   ├── App.jsx            ← 메인 앱 (현재 전체 코드)
│   ├── components/        ← 분리할 컴포넌트들
│   │   ├── Header.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── VODCard.jsx
│   │   ├── ShortsGrid.jsx
│   │   ├── ClipList.jsx
│   │   ├── MiniGame/
│   │   │   ├── Quiz.jsx
│   │   │   └── Roulette.jsx
│   │   ├── Schedule.jsx
│   │   ├── MyPage.jsx
│   │   └── Modal.jsx
│   ├── data/
│   │   ├── shows.js       ← 콘텐츠 DB
│   │   ├── games.js       ← 미니게임 데이터
│   │   └── schedule.js    ← 편성표
│   ├── hooks/
│   │   └── useImageCache.js
│   └── assets/
│       └── icons.jsx       ← SVG 아이콘 컴포넌트
├── public/
│   └── images/             ← 콘텐츠 포스터 이미지
├── docs/
│   └── CONTEXT.md          ← 이 문서
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 향후 개발 방향
1. Vite 프로젝트 세팅 + TailwindCSS 적용
2. 이미지 문제 해결 (TMDB API 또는 수동 수집)
3. 컴포넌트 분리 (현재 단일 파일 → 모듈화)
4. 미구현 게임 완성 (명장면 매칭, 끝말잇기)
5. YouTube 영상 임베드 (iframe 또는 react-player)
6. 애니메이션 고도화 (framer-motion)
7. PWA 지원 (모바일 앱 경험)
