# TVING Playground — Claude Code 브리핑 문서

> 최종 업데이트: 2026-03-01

## 프로젝트 개요
TVING(티빙) OTT 플랫폼을 모티브로 한 모바일 큐레이션 놀이터 서비스 프로토타입.
실제 한국 콘텐츠 7개를 기반으로, VOD 브라우징/쇼츠/클립/미니게임/포인트/회원/랭킹 시스템을 구현.

## 현재 상태
- **단일 React 컴포넌트** (`src/App.jsx`, ~690줄)
- Vite 6 + React 18 기반, 인라인 스타일 사용
- **이미지 문제 해결 완료**: TVING CDN URL + ShowImage 컴포넌트 SVG 폴백
- **회원 시스템 구현 완료**: localStorage 기반 MVP (자동 가입, 레벨, 랭킹)
- **Vercel 배포 설정 완료**

## 핵심 기능 (구현 완료)
1. **VOD 브라우징**: 7개 콘텐츠 카드 가로 스크롤
2. **쇼츠 탭**: 9:16 세로형 숏폼 그리드
3. **클립 탭**: 16:9 가로형 하이라이트 리스트
4. **미니게임**: 캐릭터 퀴즈 (4문제), 추천 룰렛, **명장면 모드 (15문제풀 4지선다)**, 끝말잇기 (미구현)
5. **포인트 시스템**: 이중 트래킹 (사용 가능 pt / 누적 totalPt)
6. **회원 시스템**: localStorage 자동 가입, 랜덤 닉네임+아바타, 6단계 레벨
7. **랭킹 보드**: TOP3 포디움 + 가짜유저 15명 혼합
8. **게임 히스토리**: 타입별 기록 + 상대시간 표시
9. **공개 일정**: 요일별 편성표 (오늘 하이라이트)
10. **히어로 배너**: 3개 콘텐츠 자동 회전 (4초 간격)
11. **상세 모달**: 콘텐츠 정보 + 클립/쇼츠 리스트
12. **3Pack 배너**: Disney+/TVING/Wavve

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

## 디자인 시스템
- **다크 테마**: 배경 #000, 카드 #1C1C1E
- **메인 컬러**: #FF2D55 (TVING 레드)
- **포인트 컬러**: #FFD60A (골드)
- **태그 컬러**: HOT=#FF2D55, NEW=#5856D6, TOP=#FF9500, FREE=#34C759, LIVE=#F5A623
- **레벨 뱃지 컬러**: 🌱#8E8E93, ⭐#34C759, 🔥#FF9500, 💎#5856D6, 👑#FFD60A, 🏆#FF2D55
- **모바일 퍼스트**: max-width 430px

## 기술 스택
```
Vite 6 + React 18
인라인 스타일 (CSS 파일 없음)
탭 기반 네비게이션 (라우터 없음)
localStorage (백엔드 없음)
```

## 파일 구조
```
tving-playground/
├── src/
│   ├── App.jsx            ← 전체 앱 코드 (단일 파일, ~690줄)
│   └── data/
│       ├── index.js       ← SHOWS export
│       └── shows.js       ← 콘텐츠 DB (TVING CDN URL 포함)
├── docs/
│   ├── CONTEXT.md         ← 이 문서
│   ├── SESSION_LOG.md     ← 커밋별 작업 기록
│   ├── DECISION_LOG.md    ← 주요 의사결정 기록
│   ├── FEATURE_LIST.md    ← 기능 목록
│   └── MEMBERSHIP_POLICY.md ← 회원 정책 상세
├── public/
├── .claude/launch.json    ← dev 서버 설정
├── package.json
├── vite.config.js
└── vercel.json
```

## 관련 문서
- [MEMBERSHIP_POLICY.md](./MEMBERSHIP_POLICY.md) — 회원/레벨/랭킹/포인트 정책 상세
- [FEATURE_LIST.md](./FEATURE_LIST.md) — 전체 기능 목록
- [DECISION_LOG.md](./DECISION_LOG.md) — 주요 의사결정 기록
- [SESSION_LOG.md](./SESSION_LOG.md) — 커밋별 작업 기록

## 향후 개발 방향
1. 끝말잇기 게임 완성
2. 컴포넌트 분리 (현재 단일 파일 → 모듈화)
3. 서버 기반 회원 시스템 (OAuth + DB)
4. 크로스 디바이스 동기화
5. TailwindCSS 전환
6. PWA 지원
