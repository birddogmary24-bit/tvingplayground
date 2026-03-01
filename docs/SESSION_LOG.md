
---

### [2026-02-28] feat: fix dev server config and add Vercel deployment
**작업 내용**: feat: fix dev server config and add Vercel deployment
**의도/목적**: (직접 보완해주세요)
**영향도**:
- src/App.jsx
- vercel.json
**관련 커밋**: c47e4a0

---

### [2026-03-01] feat: add 3Pack banner and link clips/shorts to TVING URLs
**작업 내용**: Hero Banner "클립 보러가기" / 상세 모달 "TVING 보기" 버튼을 YouTube 검색 URL에서 실제 TVING URL로 교체. 클립 카드·쇼츠 카드 클릭 시 TVING으로 직접 이동. 인기 VOD 위에 Disney+/TVING/Wavve 3Pack 배너 추가.
**의도/목적**: shows.js에 이미 수집된 TVING E-코드(VOD)/L-코드(클립) URL을 실제 링크로 활용. YouTube 검색 우회 제거.
**영향도**:
- 직접 영향: src/App.jsx (SHOWS 매핑, Hero Banner, 클립/쇼츠 카드, 모달 버튼)
- 연관 영향: 클릭 UX — 클립/쇼츠 카드가 내부 모달 대신 TVING 새 탭으로 이동
**관련 커밋**: d43a30b

---

### [2026-03-01] feat: 명장면 모드 미니게임 + 회원/랭킹 시스템 추가
**작업 내용**:
- **회원 시스템**: localStorage 기반 MVP 회원 시스템 구현. 첫 방문 시 랜덤 닉네임(형용사+동물 조합, 15x15=225가지) + 동물 이모지 아바타 자동 생성. 웰컴 포인트 120P 자동 지급. 웹/앱 데이터가 지워지기 전까지 유지.
- **레벨 시스템**: 6단계 레벨 (🌱뉴비 → ⭐루키 → 🔥챌린저 → 💎마스터 → 👑레전드 → 🏆티빙킹). 누적 포인트(totalPt) 기반, 감소 없음.
- **명장면 모드 게임**: 객관식 4지선다 퀴즈. TVING CDN 실제 이미지 15문제풀에서 랜덤 6문제 추출. 3가지 유형 (프로그램 맞추기 / 출연진 맞추기 / 상황 맞추기). 정답당 13P, 최대 78P.
- **랭킹 보드**: TOP 3 포디움 + 15명 가짜유저와 실제유저 혼합 정렬. 실제 유저 "(나)" 노란색 하이라이트.
- **게임 히스토리**: 게임 타입 아이콘 + 점수 + 정답률 + 상대시간 표시.
- **MY 탭 리빌드**: 프로필 카드, 레벨 프로그레스바, 랭킹 보드, 게임 기록, 구매 콘텐츠.
- **헤더 업데이트**: 아바타 + 닉네임 + 레벨뱃지 + 포인트 표시.
- **rew 함수 확장**: `rew(pts, gameType, extra)` 시그니처로 변경, Quiz/Roulette도 업데이트.

**의도/목적**: 사용자 참여도를 높이기 위한 회원/랭킹 시스템과 새로운 미니게임 추가. 백엔드 없이 localStorage MVP로 빠르게 검증.

**영향도**:
- 직접 영향: `src/App.jsx` (+278줄, -22줄), `.claude/launch.json` (autoPort 설정)
- 연관 영향:
  - 기존 Quiz 컴포넌트: `onRew` 호출 시 `("quiz", {correct, total})` 파라미터 추가
  - 기존 Roulette 컴포넌트: `onRew` 호출 시 `("roulette")` 파라미터 추가
  - 기존 로그인/로그아웃: localStorage 기반으로 전환, 기존 모달 로그인 제거
  - MY 탭: 전체 리빌드 (기존 구매 콘텐츠 + 구독권 UI 유지)
  - 헤더: 로그인 버튼 → 프로필 표시로 변경
  - GAMES 배열: "명장면 매칭" → "명장면 모드"로 이름/아이콘/설명 변경

**관련 커밋**: 1827f00

---

### [2026-03-01] fix: merge conflict 해결 (3Pack Banner 유지)
**작업 내용**: main 브랜치와 merge 시 발생한 충돌 해결. main에 추가된 3Pack Banner (Disney+/TVING/Wavve) 코드를 유지.
**의도/목적**: PR 머지를 위한 충돌 해결. main의 3Pack Banner 기능 보존.
**영향도**:
- 직접 영향: `src/App.jsx` (충돌 구간: Quick Menu와 인기 VOD 사이)
- 연관 영향: 없음 (기능 변경 없이 코드 병합만 수행)
**관련 커밋**: 60bc0b2
