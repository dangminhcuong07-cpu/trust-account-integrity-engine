// The three objects on the desk, drawn as SVG so they stay sharp, weigh little
// and need no image licence: the law library behind (Shelves), the green
// banker's lamp that lights the report (Lamp), and the fountain pen that signs
// it (Pen, and Nib as a small icon). All are decoration: aria-hidden.
// To use a real library photo instead, replace <Shelves /> with an <img alt="">
// and keep the .shelves mask in index.css.

/** Deterministic random numbers, so the shelves are the same on every load. */
function seeded(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Dark leathers: oxblood, bottle green, navy, tan, black.
const LEATHER = ['#2a1715', '#152119', '#151b26', '#271d13', '#171616', '#211416'];
const W = 1600, SHELF = 300, ROWS = 3, PLANK = 16;

interface Spine { x: number; y: number; w: number; h: number; fill: string; bands: number[] }
const SPINES: Spine[] = (() => {
  const r = seeded(110);
  const out: Spine[] = [];
  for (let row = 0; row < ROWS; row++) {
    const floor = (row + 1) * SHELF - PLANK;
    let x = 0;
    while (x < W) {
      if (r() < 0.04) { x += 30 + r() * 60; continue; } // a gap on the shelf
      const w = 16 + Math.floor(r() * 22);
      const h = 170 + Math.floor(r() * 90);
      const top = floor - h;
      const bands = r() < 0.8 ? [top + 18 + r() * 6, top + 28 + r() * 6, floor - 22] : [];
      out.push({ x, y: top, w, h, fill: LEATHER[Math.floor(r() * LEATHER.length)], bands });
      x += w + 1;
    }
  }
  return out;
})();

export function Shelves() {
  return (
    <svg className="shelves" viewBox={`0 0 ${W} ${SHELF * ROWS}`} preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false">
      {SPINES.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={s.y} width={s.w} height={s.h} fill={s.fill} />
          {s.bands.map((b, j) => <rect key={j} x={s.x + 2} y={b} width={s.w - 4} height={1.5} fill="#4a3c25" />)}
        </g>
      ))}
      {Array.from({ length: ROWS }, (_, row) => (
        <rect key={row} x={0} y={(row + 1) * SHELF - PLANK} width={W} height={PLANK} fill="#1d1712" />
      ))}
    </svg>
  );
}

/** A green banker's lamp: glass shade, brass stem and base, pull chain. */
export function Lamp({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 200" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lamp-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f8a5f" />
          <stop offset="0.55" stopColor="#1f5a3c" />
          <stop offset="1" stopColor="#123a27" />
        </linearGradient>
        <linearGradient id="lamp-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e5426" />
          <stop offset="0.45" stopColor="#d9b46a" />
          <stop offset="1" stopColor="#7a5c2a" />
        </linearGradient>
      </defs>
      <rect x="114" y="80" width="12" height="96" fill="url(#lamp-brass)" />
      <path d="M86 192 Q86 172 120 172 Q154 172 154 192 Z" fill="url(#lamp-brass)" />
      <rect x="70" y="190" width="100" height="6" rx="3" fill="url(#lamp-brass)" />
      <line x1="168" y1="80" x2="168" y2="122" stroke="#b8975a" strokeWidth="1.5" strokeDasharray="2 2" />
      <circle cx="168" cy="125" r="3.5" fill="#d9b46a" />
      <ellipse className="lamp-bulb" cx="120" cy="80" rx="84" ry="7" fill="#ffd9a0" />
      <path d="M28 80 Q28 28 120 26 Q212 28 212 80 Z" fill="url(#lamp-glass)" />
      <path d="M48 66 Q56 40 112 36" fill="none" stroke="#8fd1a8" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
      <rect x="24" y="77" width="192" height="6" rx="3" fill="url(#lamp-brass)" />
    </svg>
  );
}

/** A fountain pen lying flat, nib to the left. */
export function Pen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 40" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pen-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a3e" />
          <stop offset="0.35" stopColor="#151517" />
          <stop offset="1" stopColor="#0a0a0b" />
        </linearGradient>
        <linearGradient id="pen-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0d396" />
          <stop offset="1" stopColor="#9c7634" />
        </linearGradient>
      </defs>
      <path d="M2 20 L34 13 L34 27 Z" fill="url(#pen-gold)" />
      <line x1="6" y1="20" x2="26" y2="20" stroke="#5a4320" strokeWidth="1" />
      <circle cx="27" cy="20" r="1.6" fill="#5a4320" />
      <path d="M34 12 L66 9 L66 31 L34 28 Z" fill="#111113" />
      <rect x="66" y="8" width="246" height="24" rx="12" fill="url(#pen-body)" />
      <rect x="196" y="8" width="5" height="24" fill="url(#pen-gold)" />
      <rect x="205" y="8" width="2" height="24" fill="url(#pen-gold)" />
      <path d="M226 6 H300 Q306 6 306 10 V12 H226 Z" fill="url(#pen-gold)" />
    </svg>
  );
}

/** A small nib, for inline use beside "Before you sign". */
export function Nib({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="M8 2.5h8l2 7.5-6 11.5L6 10z" />
      <path d="M12 12v9.5" />
      <circle cx="12" cy="10" r="1.6" />
    </svg>
  );
}
