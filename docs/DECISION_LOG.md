# DECISION LOG — TVING Playground

---

### [2026-02-28] Vite + React 단일 파일 구조 유지
**상태**: 확정
**결정 내용**: Claude Artifact에서 개발된 단일 App.jsx를 컴포넌트 분리 없이 Vite 프로젝트로 그대로 이전
**배경**: Artifact에서 전체 UI가 App.jsx 하나에 구현되어 있었음. 즉시 배포가 우선이었기 때문에 리팩토링보다 빠른 전환을 선택.
**검토한 대안들**:
- 대안 A: 컴포넌트 분리 후 이전 — 시간 소요가 크고 당장 기능 변경 없음
- 대안 B: Next.js로 전환 — SSR 불필요, 오버엔지니어링
**최종 선택 이유**: 빠른 배포 우선. 컴포넌트 분리는 이후 리팩토링 단계에서 진행
**영향 범위**: 프로젝트 전체 구조

---

### [2026-02-28] 콘텐츠 데이터를 shows.js로 분리
**상태**: 확정
**결정 내용**: 7개 콘텐츠 메타데이터를 `src/data/shows.js`로 분리하고, App.jsx에서는 import하여 내부 포맷으로 변환
**배경**: App.jsx에 하드코딩된 콘텐츠 데이터가 있었고, 실제 TVING 크롤링 데이터로 교체 필요
**검토한 대안들**:
- 대안 A: API 서버에서 동적 로딩 — 정적 사이트에 불필요한 복잡도
- 대안 B: JSON 파일 — import가 덜 편리
**최종 선택 이유**: JS 모듈로 export하면 타입 힌트와 import가 간편하고, 빌드 시 트리셰이킹도 가능
**영향 범위**: src/data/shows.js, src/data/index.js, src/App.jsx

---

### [2026-03-01] YouTube 링크 → TVING 실제 URL로 전면 교체
**상태**: 확정
**결정 내용**: 모든 클립/쇼츠/VOD 클릭 시 YouTube 검색 결과가 아닌 TVING 실제 콘텐츠 페이지로 이동
**배경**: 초기에는 TVING URL을 알 수 없어 YouTube 검색 쿼리(`youtube.com/results?search_query=...`)로 우회했었음. shows.js에 실제 TVING E-코드(VOD)/L-코드(클립) URL이 수집된 후 교체 가능해짐.
**검토한 대안들**:
- 대안 A: YouTube 임베드 유지 — 실제 서비스와 괴리가 큼
- 대안 B: TVING 딥링크(앱 스킴) 사용 — 웹에서는 작동하지 않음
**최종 선택 이유**: 웹 브라우저에서 TVING 콘텐츠 페이지로 직접 이동이 가장 자연스러운 UX
**영향 범위**: src/App.jsx 전체 (Hero Banner, 클립 카드, 쇼츠 카드, 상세 모달)

---

### [2026-03-01] 3Pack 배너를 CSS/SVG로 구현
**상태**: 확정
**결정 내용**: Disney+/TVING/Wavve 3Pack 배너를 외부 이미지 파일 대신 CSS 그라데이션 + SVG 텍스트 + 인라인 스타일로 구현
**배경**: 사용자가 제공한 배너 이미지(채팅에 업로드)를 파일시스템에 직접 저장할 수 없었음
**검토한 대안들**:
- 대안 A: 이미지 파일을 public/에 저장 — 채팅 업로드 이미지를 CLI에서 직접 저장 불가
- 대안 B: 외부 CDN URL 사용 — 안정적인 공개 URL을 알 수 없음
- 대안 C: Base64 인코딩 — 파일 크기 증가, 유지보수 어려움
**최종 선택 이유**: CSS/SVG 기반 구현이 가장 경량이고 수정 용이. 배너 비율(640x120)과 레이아웃을 코드로 정밀 제어 가능.
**영향 범위**: src/App.jsx (3Pack Banner 섹션)

---

### [2026-03-01] 3Pack 배너 비율 640x200 → 640x120 변경
**상태**: 확정
**결정 내용**: 초기 640x200 비율에서 640x120으로 변경하여 배너 높이를 줄임
**배경**: 사용자 피드백 — "배너가 너무 두껍다. 위아래 빈 공간 삭제"
**검토한 대안들**: 없음 (사용자 직접 요청)
**최종 선택 이유**: 사용자 요청. 모바일 화면에서 배너가 과도한 영역을 차지하지 않도록 컴팩트하게 변경.
**영향 범위**: src/App.jsx (3Pack Banner aspectRatio 속성)

---

### [2026-03-01] PWA 아이콘을 PNG 대신 SVG로 생성
**상태**: 확정
**결정 내용**: PWA 앱 아이콘(192x192, 512x512, apple-touch-icon)을 PNG 대신 SVG 포맷으로 생성
**배경**: CLI 환경에서 `sharp`, `canvas`, `Jimp` 등 이미지 처리 라이브러리 설치가 불안정하고 빌드 의존성이 증가함. 브라우저와 Vercel 빌드 환경에서 네이티브 이미지 변환이 불가능했음.
**검토한 대안들**:
- 대안 A: `sharp` 라이브러리로 PNG 생성 — 네이티브 바이너리 의존, 빌드 환경마다 설치 불안정
- 대안 B: Figma/외부 도구로 사전 제작 후 커밋 — 수작업 필요, 자동화 불가
- 대안 C: SVG 아이콘 생성 — 의존성 없음, Node 기본 `fs`만 사용, 벡터라 모든 해상도에서 선명
**최종 선택 이유**: SVG는 모던 브라우저에서 PWA manifest 아이콘으로 완전 지원. Node.js 표준 `fs`만으로 생성 가능해 CI/빌드 환경 의존성 제로. 벡터 특성상 아이콘 품질 이슈 없음.
**영향 범위**: `scripts/generate-icons.js`, `public/pwa-*.svg`, `vite.config.js` manifest icons 배열

---

### [2026-03-01] 끝말잇기 단어 DB 전략 — 막힌 단어 방지 브릿지 설계
**상태**: 확정
**결정 내용**: WC_WORDS 단어 DB에서 AI 스타터 풀을 "마지막 글자에 후속 단어가 있는 단어"만으로 제한하고, 데드엔드 글자용 브릿지 단어 ~30개를 추가
**배경**: "친애하는"(끝 글자 "는")처럼 DB에 "는"으로 시작하는 단어가 없는 경우 AI가 첫 단어 선택 직후 플레이어가 즉시 막히는 문제 발생
**검토한 대안들**:
- 대안 A: 단어 DB를 대폭 확장(500개+) — 유지보수 부담, 게임 난이도 불균형
- 대안 B: 막힌 경우 AI가 패배 처리 — 게임 시작 즉시 종료되어 UX 불량
- 대안 C: AI 스타터 필터링 + 브릿지 단어 추가 — 적은 변경으로 근본 원인 해결
**최종 선택 이유**: `starters` 배열 필터링(`WC_IDX[e.w.at(-1)]?.length > 0`)으로 데드엔드 단어를 시작점에서 원천 제거. 자주 등장하는 마지막 글자("애", "출", "생", "원" 등)에 대응하는 브릿지 명사 추가로 게임 흐름 보장.
**영향 범위**: `src/App.jsx` — WC_WORDS 배열, WC_IDX 해시맵, startGame 함수 내 starters 필터

---

### [2026-03-01] 끝말잇기 AI 턴 — useRef 가드로 race condition 해결
**상태**: 확정
**결정 내용**: AI 턴 useEffect에서 `aiThinking` state를 dependency array에서 제거하고 `aiRef = useRef(false)` 가드로 교체
**배경**: 초기 구현에서 `useEffect(..., [myTurn, phase, aiThinking])`으로 설계. `setAiThinking(true)` 호출 시 useEffect가 재실행되고 cleanup이 pending setTimeout을 취소해 AI 턴이 영구 차단("생각 중..." 무한 표시)
**검토한 대안들**:
- 대안 A: `aiThinking`을 deps에 유지하고 cleanup 제거 — setTimeout이 중복 실행될 수 있음
- 대안 B: `useCallback`으로 AI 로직 메모이제이션 — 복잡도 증가
- 대안 C: `useRef` 가드 — cleanup의 setTimeout 취소와 무관하게 동기적으로 "이미 실행 중" 여부 추적 가능
**최종 선택 이유**: `useRef`는 렌더링과 무관하게 동기적으로 읽고 쓸 수 있어 race condition 방지에 적합. deps에서 `aiThinking` 제거로 불필요한 effect 재실행 차단. setTimeout cleanup은 컴포넌트 언마운트 안전성을 위해 유지.
**영향 범위**: `src/App.jsx` — WordChain 컴포넌트 내 AI 턴 useEffect, aiRef 선언
