# SESSION LOG — TVING Playground

---

### [2026-02-28] Initial project setup: TVING Playground (Vite + React)
**작업 내용**: Vite + React 18 프로젝트 초기 세팅. Claude.ai Artifact에서 개발된 단일 App.jsx를 독립 프로젝트로 전환.
**의도/목적**: Claude Artifact 환경에서 벗어나 실제 배포 가능한 Vite 프로젝트로 전환
**영향도**:
- 직접 영향: package.json, vite.config.js, index.html, src/main.jsx, src/App.jsx
- 연관 영향: 프로젝트 전체 구조 수립
**관련 커밋**: 8a10c20

---

### [2026-02-28] feat: add content DB with real TVING data (shows.js)
**작업 내용**: 실제 TVING 콘텐츠 7개(환승연애4, 친애하는X, 판사 이한영, 유퀴즈온더블럭, 대탈출 더스토리, 쇼미더머니12, 우주를 줄게)의 메타데이터를 `src/data/shows.js`에 정리. 포스터/배너 이미지 URL, 클립 URL, 쇼츠 썸네일 등 포함.
**의도/목적**: 하드코딩된 더미 데이터를 실제 TVING 기반 콘텐츠 DB로 교체
**영향도**:
- 직접 영향: src/data/shows.js (신규), src/data/index.js (신규)
- 연관 영향: App.jsx에서 import하여 전체 콘텐츠 렌더링에 사용
**관련 커밋**: e54e37b

---

### [2026-02-28] feat: update 유퀴즈온더블럭 with real TVING crawled data
**작업 내용**: 유퀴즈온더블럭 콘텐츠의 실제 TVING 크롤링 데이터(에피소드, 클립, 쇼츠) 업데이트
**의도/목적**: 크롤링으로 수집한 실제 데이터로 콘텐츠 정보 보강
**영향도**:
- 직접 영향: src/data/shows.js (유퀴즈온더블럭 항목)
**관련 커밋**: 66affd9, 070c897

---

### [2026-02-28] docs: add project documentation system
**작업 내용**: docs/ 폴더에 SESSION_LOG.md, DECISION_LOG.md, PRD.md, FEATURE_LIST.md 문서 체계 생성
**의도/목적**: CLAUDE.md 규칙에 따른 프로젝트 문서화 체계 수립
**영향도**:
- 직접 영향: docs/ 폴더 전체
**관련 커밋**: 6a48565

---

### [2026-02-28] feat: fix dev server config and add Vercel deployment
**작업 내용**: vite.config.js에 host 옵션 추가, vercel.json 배포 설정 파일 생성. Vercel 프로덕션 배포 완료.
**의도/목적**: 로컬 개발 서버와 Vercel 프로덕션 배포 환경 구성
**영향도**:
- 직접 영향: vite.config.js, vercel.json
- 연관 영향: Vercel 배포 파이프라인 구축
**관련 커밋**: c47e4a0, 80ee074, 4d924e2

---

### [2026-03-01] feat: add 3Pack banner and link clips/shorts to TVING URLs
**작업 내용**:
1. **3Pack 배너 추가**: 인기 VOD 섹션 위에 Disney+/TVING/Wavve 3Pack 프로모션 배너 삽입 (640x120 비율, 다크 네이비 배경, CSS/SVG 기반)
2. **TVING URL 연동**: YouTube 검색 URL → 실제 TVING VOD/클립 URL로 전면 교체
   - Hero Banner "클립 보러가기" → `clips[0].clipUrl` 또는 `episodes[0].vodUrl`
   - 상세 모달 "유튜브 보기" → "TVING 보기"로 변경, `episodes[0].vodUrl` 연결
   - 클립 카드 클릭 → 해당 클립의 `clipUrl`로 TVING 새 탭 이동
   - 쇼츠 카드 클릭 → 해당 프로그램의 `tvingUrl`로 TVING 새 탭 이동
   - 모달 내 클립/쇼츠 리스트 클릭 → TVING 직접 이동
3. **배너 클릭**: https://www.tving.com/list/theme/3pack 으로 새 탭 이동
**의도/목적**:
- 3Pack 번들 상품 홍보를 위한 배너 노출
- YouTube 우회 링크를 제거하고 TVING 실제 콘텐츠 페이지로 직접 연결하여 사용자 경험 개선
**영향도**:
- 직접 영향: src/App.jsx (SHOWS 매핑 로직, Hero Banner, 클립/쇼츠 카드, 상세 모달, 3Pack 배너)
- 연관 영향: 클릭 UX 전면 변경 — 클립/쇼츠가 내부 모달 대신 TVING 새 탭으로 이동
**관련 커밋**: d43a30b

---

### [2026-03-01] feat: 명장면 모드 미니게임 + 회원/랭킹 시스템 추가
**작업 내용**: 명장면 매칭 미니게임 구현, 회원/랭킹 시스템 추가
**의도/목적**: 미구현이던 미니게임 기능 확장
**영향도**:
- 직접 영향: src/App.jsx
**관련 커밋**: 1827f00

---

### [2026-03-01] feat: add 야옹이 키우기 cat-raising game
**작업 내용**: 미니게임에 야옹이 키우기(고양이 육성) 게임 추가
**의도/목적**: 미니게임 라인업 확대
**영향도**:
- 직접 영향: src/App.jsx
**관련 커밋**: d63eb6f

---

### [2026-03-01] chore: merge conflicts 해결 및 헤더 로고 개선
**작업 내용**:
1. origin/main과 feature/dev 간 App.jsx 머지 충돌 해결 (3Pack 배너 유지)
2. 헤더의 TVING 텍스트 로고 → `/tving-logo.svg` 이미지 로고로 교체
3. 헤더 로고 클릭 시 홈 탭으로 이동하는 네비게이션 추가
**의도/목적**: 브랜치 간 충돌 정리 및 헤더 UI 개선
**영향도**:
- 직접 영향: src/App.jsx (헤더 영역)
- 연관 영향: public/tving-logo.svg 파일 필요
**관련 커밋**: 60bc0b2, 9e2075c

---

### [2026-03-01] feat: PWA 적용 및 끝말잇기 게임 추가 (PR #10)
**작업 내용**:
1. **PWA(Progressive Web App) 적용**: vite-plugin-pwa 설치, manifest.webmanifest 생성, 서비스워커 등록
2. **끝말잇기(WordChain) 미니게임 구현**: AI 대전 형태의 끝말잇기 게임
   - 150+ 단어 사전 (TVING 제목, 드라마 제목, 일반 명사)
   - AI 난이도 조절 (라운드별 전략 변화)
   - 턴당 30초 타이머, 힌트 기능
   - 채팅 형태 UI (AI/플레이어 말풍선)
3. **PWA 아이콘**: SVG 기반 아이콘 생성 (192x192, 512x512, apple-touch-icon)
**의도/목적**: 모바일 홈화면 설치 가능한 앱 경험 제공, 미니게임 라인업 확대
**영향도**:
- 직접 영향: vite.config.js, package.json, index.html, public/ (PWA 아이콘), src/App.jsx (WordChain 인라인)
- 연관 영향: Vercel 배포 시 서비스워커 자동 생성
**관련 커밋**: 9b35d7c (PR #10 → main merge: c29bbf0)

---

### [2026-03-01] refactor: App.jsx 모놀리식 구조를 모듈로 분리 (PR #9)
**작업 내용**:
1. **App.jsx 1,010줄 → 328줄로 축소** (10개 모듈로 분리)
   - `src/constants.js`: 데이터 상수, localStorage 헬퍼, 닉네임/레벨/게임 데이터
   - `src/utils.js`: getLevel, getLvProgress, relTime 유틸 함수
   - `src/Icons.jsx`: 13개 SVG 아이콘 오브젝트
   - `src/components/ShowImage.jsx`: FallbackPoster + ShowImage
   - `src/components/SharedUI.jsx`: SH, PlayBtn, Modal 공용 컴포넌트
   - `src/components/Quiz.jsx`: 캐릭터 퀴즈 게임
   - `src/components/Roulette.jsx`: 추천 룰렛 게임
   - `src/components/FamousScene.jsx`: 명장면 모드 게임
   - `src/components/CatGame.jsx`: 야옹이 키우기 게임
   - `src/components/WordChain.jsx`: 끝말잇기 게임 (충돌 해결 시 추가)
2. **main 브랜치 충돌 해결**: PR #10에서 추가된 끝말잇기 게임을 리팩터링 구조에 맞게 별도 컴포넌트로 분리
**의도/목적**: 유지보수성 향상, 파일당 500~700줄 이내 규칙 준수
**영향도**:
- 직접 영향: src/App.jsx, src/constants.js, src/utils.js, src/Icons.jsx, src/components/ (8개 파일)
- 연관 영향: 기능 변경 없음 (순수 리팩터링)
**관련 커밋**: 4bf5ebe, ba6ef60 (충돌 해결) (PR #9 → main merge: d4af3c1)
