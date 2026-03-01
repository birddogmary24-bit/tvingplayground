import { useState } from "react";
import Ic from "../Icons.jsx";

export function FallbackPoster({ title, genre, color, style }) {
  const s = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const h = s % 360;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: `linear-gradient(135deg, hsl(${h},50%,18%), hsl(${(h+40)%360},35%,6%))`, ...style }}>
      <svg viewBox="0 0 300 400" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`fg${s}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${h},55%,18%)`} />
            <stop offset="100%" stopColor={`hsl(${(h+40)%360},40%,6%)`} />
          </linearGradient>
          <radialGradient id={`rg${s}`} cx="0.3" cy="0.25" r="0.8">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="300" height="400" fill={`url(#fg${s})`} />
        <rect width="300" height="400" fill={`url(#rg${s})`} />
        <circle cx={60+(s*3)%180} cy={80+(s*7)%120} r={40+s%30} fill={color} opacity="0.08" />
        <circle cx={200+(s*11)%80} cy={200+(s*5)%100} r={30+(s*2)%40} fill={color} opacity="0.06" />
        <rect y="260" width="300" height="140" fill="url(#btmg)" />
        <defs><linearGradient id="btmg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="transparent"/><stop offset="100%" stopColor="#000" stopOpacity="0.85"/></linearGradient></defs>
        <text x="24" y="340" fill="white" fontSize="26" fontWeight="800" fontFamily="sans-serif">{title.length>8?title.slice(0,8):title}</text>
        {title.length>8&&<text x="24" y="370" fill="white" fontSize="26" fontWeight="800" fontFamily="sans-serif">{title.slice(8)}</text>}
        <text x="24" y={title.length>8?392:368} fill={color} fontSize="12" fontFamily="sans-serif" opacity="0.7">{genre}</text>
      </svg>
    </div>
  );
}

export default function ShowImage({ src, title, genre, color, style, children }) {
  const [err, setErr] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || err) {
    return (
      <div style={{ position: "relative", width: "100%", height: "100%", ...style }}>
        <FallbackPoster title={title} genre={genre || ""} color={color} />
        {children}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#111", ...style }}>
      {!loaded && <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 24, height: 24, border: "2px solid #333", borderTopColor: color, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>}
      <img
        src={src}
        alt={title}
        onError={() => setErr(true)}
        onLoad={() => setLoaded(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
        loading="lazy"
      />
      {children}
    </div>
  );
}
