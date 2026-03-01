/**
 * PWA 아이콘 생성 스크립트
 * SVG → PNG 변환 없이 순수 SVG 아이콘을 생성하고,
 * 브라우저에서 사용할 수 있도록 public/ 폴더에 저장
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '..', 'public');

function generateSVGIcon(size) {
  const fontSize = Math.round(size * 0.28);
  const subFontSize = Math.round(size * 0.13);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#000000" rx="${Math.round(size * 0.15)}"/>
  <text x="50%" y="42%" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="900" font-size="${fontSize}" fill="#FF2D55">TVING</text>
  <text x="50%" y="68%" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="700" font-size="${subFontSize}" fill="#FFFFFF">놀이터</text>
</svg>`;
}

// SVG 아이콘 생성 (PNG 대신 SVG 사용 — 벡터라 모든 해상도에서 선명)
writeFileSync(resolve(publicDir, 'pwa-192x192.svg'), generateSVGIcon(192));
writeFileSync(resolve(publicDir, 'pwa-512x512.svg'), generateSVGIcon(512));
writeFileSync(resolve(publicDir, 'apple-touch-icon.svg'), generateSVGIcon(180));

console.log('✅ SVG 아이콘 생성 완료: pwa-192x192.svg, pwa-512x512.svg, apple-touch-icon.svg');
