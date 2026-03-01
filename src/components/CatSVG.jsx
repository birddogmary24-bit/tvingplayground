export default function CatSVG({ cat, size = 200, blink }) {
  const b = cat.bodyColor;
  const s = cat.stripeColor;
  const isScottish = cat.id === "scottish";
  const isCalico = cat.id === "calico";
  const eyeH = blink ? 1 : 18;
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      {/* 꼬리 */}
      <path d="M 155 150 Q 185 120 175 90 Q 170 75 160 80" stroke={s} strokeWidth="8" fill="none" strokeLinecap="round" style={{animation:"catTail 2s ease-in-out infinite"}} />
      {/* 몸통 */}
      <ellipse cx="100" cy="155" rx="50" ry="35" fill={b} />
      {/* 삼색 패치 */}
      {isCalico && <><circle cx="85" cy="145" r="12" fill={cat.patchColor} opacity="0.7" /><circle cx="115" cy="160" r="10" fill={cat.stripeColor} opacity="0.8" /></>}
      {/* 머리 */}
      <circle cx="100" cy="100" r="42" fill={b} />
      {/* 귀 */}
      {isScottish ? <>
        <path d="M 65 68 L 58 48 L 78 62 Z" fill={b} />
        <path d="M 135 68 L 142 48 L 122 62 Z" fill={b} />
        <path d="M 68 65 Q 65 58 75 63" fill={s} strokeWidth="0" />
        <path d="M 132 65 Q 135 58 125 63" fill={s} strokeWidth="0" />
      </> : <>
        <path d="M 65 72 L 55 40 L 82 62 Z" fill={b} />
        <path d="M 135 72 L 145 40 L 118 62 Z" fill={b} />
        <path d="M 67 68 L 60 48 L 78 63 Z" fill="#FFB6C1" opacity="0.5" />
        <path d="M 133 68 L 140 48 L 122 63 Z" fill="#FFB6C1" opacity="0.5" />
      </>}
      {/* 눈 */}
      <ellipse cx="82" cy="96" rx="12" ry={eyeH/2+3} fill="white" />
      <ellipse cx="118" cy="96" rx="12" ry={eyeH/2+3} fill="white" />
      <ellipse cx="84" cy="97" rx="7" ry={Math.min(eyeH/2+1, 8)} fill="#2C2C2E" />
      <ellipse cx="120" cy="97" rx="7" ry={Math.min(eyeH/2+1, 8)} fill="#2C2C2E" />
      {/* 눈 하이라이트 */}
      {!blink && <>
        <circle cx="87" cy="93" r="3" fill="white" opacity="0.9" />
        <circle cx="123" cy="93" r="3" fill="white" opacity="0.9" />
        <circle cx="82" cy="99" r="1.5" fill="white" opacity="0.5" />
        <circle cx="118" cy="99" r="1.5" fill="white" opacity="0.5" />
        <circle cx="93" cy="102" r="2" fill="#87CEEB" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="107" cy="102" r="2" fill="#87CEEB" opacity="0.3">
          <animate attributeName="opacity" values="0.1;0.4;0.1" dur="2s" repeatCount="indefinite" begin="0.5s" />
        </circle>
      </>}
      {/* 코 */}
      <path d="M 97 108 L 100 112 L 103 108 Z" fill="#FFB6C1" />
      {/* 입 */}
      <path d="M 100 112 Q 93 118 88 114" stroke={s === "#1C1C1E" ? "#555" : "#333"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 100 112 Q 107 118 112 114" stroke={s === "#1C1C1E" ? "#555" : "#333"} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* 수염 */}
      <line x1="60" y1="104" x2="80" y2="107" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      <line x1="58" y1="112" x2="79" y2="112" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      <line x1="120" y1="107" x2="140" y2="104" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      <line x1="121" y1="112" x2="142" y2="112" stroke={s === "#1C1C1E" ? "#555" : "#888"} strokeWidth="1" />
      {/* 앞발 */}
      <ellipse cx="80" cy="180" rx="14" ry="8" fill={b} />
      <ellipse cx="120" cy="180" rx="14" ry="8" fill={b} />
    </svg>
  );
}
