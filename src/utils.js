import { LEVELS } from "./constants.js";

export function getLevel(tp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (tp >= LEVELS[i].min) return LEVELS[i];
  return LEVELS[0];
}

export function getLvProgress(tp) {
  const cur = getLevel(tp);
  const idx = LEVELS.findIndex(l => l.lv === cur.lv);
  const next = LEVELS[idx + 1];
  if (!next) return { cur, next: null, pct: 100 };
  return { cur, next, pct: Math.floor(((tp - cur.min) / (next.min - cur.min)) * 100) };
}

// ─── 상대 시간 ──────────────────────────────────────────────
export const relTime = ts => {
  const d = Date.now() - ts;
  if (d < 60000) return "방금 전";
  if (d < 3600000) return `${Math.floor(d / 60000)}분 전`;
  if (d < 86400000) return `${Math.floor(d / 3600000)}시간 전`;
  if (d < 604800000) return `${Math.floor(d / 86400000)}일 전`;
  return new Date(ts).toLocaleDateString("ko-KR");
};
