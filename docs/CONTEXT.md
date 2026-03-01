# TVING Playground — 프로젝트 브리핑 문서

## 프로젝트 개요
TVING(티빙) OTT 플랫폼을 모티브로 한 모바일 큐레이션 놀이터 서비스 프로토타입.
실제 한국 콘텐츠 7개를 기반으로, VOD 브라우징/쇼츠/클립/미니게임/포인트/구독 시스템을 구현.

## 현재 상태
- **프레임워크**: Vite + React 18 (단일 컴포넌트 `src/App.jsx`)
- **배포**: Vercel 프로덕션 배포 완료 (토큰 재인증 필요할 수 있음)
- **이미지**: 실제 TVING 크롤링 데이터 기반 포스터/배너/썸네일 URL 사용 + SVG 폴백
- **링크**: 모든 클립/쇼츠/VOD가 실제 TVING URL로 연결됨 (YouTube 우회 제거 완료)
- **브랜치**: `feature/dev`에서 개발, `main`으로 PR 머지

## 핵심 기능 (구현 완료)
1. **VOD 브라우징**: 7개 콘텐츠 카드 가로 스크롤 + 전체 VOD 모달
2. **쇼츠 탭**: 9:16 세로형 숏폼 그리드 → 클릭 시 TVING 이동
3. **클립 탭**: 16:9 가로형 하이라이트 리스트 → 클릭 시 TVING 클립 페이지 이동
4. **미니게임**: 캐릭터 퀴즈, 추천 룰렛, 명장면 매칭, 야옹이 키우기 (끝말잇기는 스텁)
5. **포인트 시스템**: 이중 트래킹 (사용 가능 pt / 누적 totalPt)
6. **회원 시스템**: localStorage 기반 자동 가입, 랜덤 닉네임/아바타 생성
7. **레벨 시스템**: 6단계 (뉴비→루키→챌린저→마스터→레전드→티빙킹)
8. **랭킹 보드**: 가짜 유저 15명 + 실제 유저, TOP3 포디움
9. **게임 히스토리**: 최근 50건 기록, 상대 시간 표시
10. **로그인/구독**: 모달 기반 로그인, 3단계 구독권 (광고형/스탠다드/프리미엄)
11. **공개 일정**: 요일별 편성표 (오늘 하이라이트)
12. **히어로 배너**: 3개 콘텐츠 자동 회전 (4초 간격) + "클립 보러가기" → TVING 직접 이동
13. **상세 모달**: 콘텐츠 정보 + 클립/쇼츠 리스트 + "TVING 보기" 버튼
14. **3Pack 배너**: Disney+/TVING/Wavve 번들 프로모션 배너 (640x120 비율) → tving.com/list/theme/3pack 이동

## 콘텐츠 DB (7개)
| ID | 제목 | 장르 | 태그 | 무료 | 가격 |
|----|------|------|------|------|------|
| ex4 | 환승연애4 | 예능·리얼리티 | HOT | O | - |
| dx | 친애하는X | 드라마·스릴러 | NEW | X | 3000P |
| jg | 판사 이한영 | 드라마·법정 | TOP | O | - |
| uq | 유퀴즈온더블럭 | 예능·토크 | FREE | O | - |
| ge | 대탈출 더스토리 | 예능·추리 | HOT | X | 2500P |
| sm | 쇼미더머니12 | 예능·힙합 | LIVE | O | - |
| uv | 우주를 줄게 | 드라마·로맨스 | NEW | O | - |

## 데이터 구조
`src/data/shows.js`에 각 콘텐츠별 다음 정보 저장:
- 기본 메타: id, title, genre, tag, tagColor, rating, description, schedule
- 이미지: posterImage, bannerImage
- 에피소드: episodes[] (title, vodUrl)
- 클립: clips[] (title, episode, clipUrl, clipThumbnail)
- 쇼츠: shorts[] (title, shortsThumbnail)
- 가격/무료: free, price

## 디자인 시스템
- **다크 테마**: 배경 #000, 카드 #1C1C1E
- **메인 컬러**: #FF2D55 (TVING 레드)
- **포인트 컬러**: #FFD60A (골드)
- **태그 컬러**: HOT=#FF2D55, NEW=#5856D6, TOP=#FF9500, FREE=#34C759, LIVE=#F5A623
- **폰트**: Noto Sans KR (또는 시스템 폰트)
- **모바일 퍼스트**: max-width 430px

## 기술 스택
```
Vite + React 18
인라인 스타일 (CSS-in-JS)
Vercel 배포
```

## 파일 구조 (현재)
```
tvingplayground/
├── src/
│   ├── App.jsx            ← 메인 앱 (전체 UI + 로직)
│   ├── main.jsx           ← React 엔트리포인트
│   └── data/
│       ├── index.js       ← 데이터 re-export
│       └── shows.js       ← 콘텐츠 DB (7개 프로그램)
├── public/
│   └── tving-logo.svg     ← 헤더 로고 이미지
├── docs/
│   ├── CONTEXT.md           ← 이 문서 (프로젝트 브리핑)
│   ├── PRD.md               ← 제품 요구사항 문서
│   ├── ARCHITECTURE.md      ← 구현 설계서
│   ├── FEATURE_LIST.md      ← 기능 명세서
│   ├── MEMBERSHIP_POLICY.md ← 회원/포인트/레벨/랭킹 정책
│   ├── SESSION_LOG.md       ← 작업 기록
│   └── DECISION_LOG.md      ← 주요 결정 기록
├── scripts/               ← 유틸리티 스크립트
├── package.json
├── vite.config.js
├── vercel.json
└── .gitignore
```

## 문서 안내
| 문서 | 내용 |
|------|------|
| [PRD.md](./PRD.md) | 제품 비전, 기능 범위, 콘텐츠/디자인/게임 정책, KPI |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | 기술 스택, 컴포넌트 구조, 상태 관리, 데이터 스키마, 스타일링 |
| [FEATURE_LIST.md](./FEATURE_LIST.md) | 전체 기능 상세 명세 (14개 기능) |
| [MEMBERSHIP_POLICY.md](./MEMBERSHIP_POLICY.md) | 회원가입, 포인트, 레벨, 랭킹, 히스토리 정책 |
| [SESSION_LOG.md](./SESSION_LOG.md) | 커밋별 작업 기록 |
| [DECISION_LOG.md](./DECISION_LOG.md) | 주요 기술/UX 결정 기록 |

## 향후 개발 방향
1. 컴포넌트 분리 (현재 단일 App.jsx → 모듈화)
2. TailwindCSS 도입 (인라인 스타일 → 유틸리티 클래스)
3. React Router 도입 (탭 상태 → URL 라우팅)
4. 미구현 게임 완성 (끝말잇기)
5. 애니메이션 고도화 (framer-motion)
6. PWA 지원 (모바일 앱 경험)
