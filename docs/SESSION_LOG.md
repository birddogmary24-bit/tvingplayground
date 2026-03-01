
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
