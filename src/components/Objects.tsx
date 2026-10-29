import { useId } from 'react';

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

// Soft 3D, after Polygon Runway's lathe-modelled objects: chunky rounded forms,
// thick bevels, shading that wraps round each turned shape, one specular
// highlight, and a soft contact shadow. Motion lives in index.css (.lamp, .pen,
// .nib): a springy pop-in with overshoot, then stillness.

/** A green banker's lamp: glass shade, brass stem and base, pull chain. */
export function Lamp({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 240 224" aria-hidden="true" focusable="false">
      <defs>
        {/* Across a turned surface: dark rim, light core, a little back-light on the far edge. */}
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0f3a25" />
          <stop offset="0.22" stopColor="#2f8a5a" />
          <stop offset="0.4" stopColor="#5fc790" />
          <stop offset="0.7" stopColor="#1f6b44" />
          <stop offset="0.93" stopColor="#103d27" />
          <stop offset="1" stopColor="#2a6f4a" />
        </linearGradient>
        <linearGradient id={`${id}gv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b431c" />
          <stop offset="0.3" stopColor="#c99d52" />
          <stop offset="0.45" stopColor="#fbe3a8" />
          <stop offset="0.7" stopColor="#a87e3c" />
          <stop offset="1" stopColor="#4e3916" />
        </linearGradient>
        <linearGradient id={`${id}bv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe3a8" />
          <stop offset="0.5" stopColor="#c99d52" />
          <stop offset="1" stopColor="#5b431c" />
        </linearGradient>
        <radialGradient id={`${id}l`} cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#fff3d6" />
          <stop offset="1" stopColor="#ffc978" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}s`} x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="5" /></filter>
        <filter id={`${id}h`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5" /></filter>
      </defs>
      <ellipse cx="120" cy="214" rx="66" ry="7" fill="#000" opacity="0.55" filter={`url(#${id}s)`} />
      {/* base: a squat turned dome */}
      <path d="M70 210 Q70 180 120 178 Q170 180 170 210 Q170 216 160 216 H80 Q70 216 70 210 Z" fill={`url(#${id}b)`} />
      <ellipse cx="120" cy="180" rx="22" ry="5" fill="#fbe3a8" opacity="0.7" />
      {/* stem with a knuckle */}
      <rect x="112" y="88" width="16" height="94" rx="8" fill={`url(#${id}b)`} />
      <circle cx="120" cy="132" r="11" fill={`url(#${id}b)`} />
      {/* pull chain */}
      <path d="M170 92 V128" stroke="#c99d52" strokeWidth="2" strokeDasharray="0.1 5" strokeLinecap="round" />
      <circle cx="170" cy="133" r="6" fill={`url(#${id}bv)`} />
      {/* light spilling from under the shade */}
      <path className="lamp-cone" d="M40 92 L4 224 H236 L200 92 Z" fill={`url(#${id}l)`} />
      <ellipse className="lamp-bulb" cx="120" cy="92" rx="86" ry="9" fill="#fff0cc" />
      {/* shade: a fat half-cylinder with a rolled brass rim */}
      <path d="M22 92 Q20 30 120 26 Q220 30 218 92 Z" fill={`url(#${id}g)`} />
      <path d="M22 92 Q20 30 120 26 Q220 30 218 92 Z" fill={`url(#${id}gv)`} />
      <ellipse cx="86" cy="48" rx="34" ry="9" transform="rotate(-14 86 48)" fill="#d8ffe9" opacity="0.55" filter={`url(#${id}h)`} />
      <rect x="16" y="86" width="208" height="14" rx="7" fill={`url(#${id}bv)`} />
      <rect x="30" y="88" width="120" height="3" rx="1.5" fill="#fff6dc" opacity="0.7" />
      <circle cx="120" cy="24" r="7" fill={`url(#${id}bv)`} />
    </svg>
  );
}

/** A fountain pen lying flat, nib to the left. */
export function Pen({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 330 56" aria-hidden="true" focusable="false">
      <defs>
        {/* Lying on its side, so the wrap runs top to bottom. */}
        <linearGradient id={`${id}k`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a30" />
          <stop offset="0.2" stopColor="#6d6d78" />
          <stop offset="0.32" stopColor="#24242a" />
          <stop offset="0.75" stopColor="#0c0c0e" />
          <stop offset="1" stopColor="#24242a" />
        </linearGradient>
        <linearGradient id={`${id}o`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a6428" />
          <stop offset="0.25" stopColor="#fff0c4" />
          <stop offset="0.5" stopColor="#d4a957" />
          <stop offset="1" stopColor="#6b4c1c" />
        </linearGradient>
        <filter id={`${id}h`} x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="1.5" /></filter>
      </defs>
      {/* nib */}
      <path d="M4 28 Q20 18 44 16 L44 40 Q20 38 4 28 Z" fill={`url(#${id}o)`} />
      <path d="M8 28 H32" stroke="#5a3f15" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="33" cy="28" r="2.2" fill="#5a3f15" />
      {/* section, tapering into the barrel */}
      <path d="M42 15 Q60 11 78 11 V45 Q60 45 42 41 Z" fill={`url(#${id}k)`} />
      {/* barrel and cap: one capsule with rounded ends */}
      <rect x="76" y="9" width="248" height="38" rx="19" fill={`url(#${id}k)`} />
      <rect x="88" y="15" width="226" height="4" rx="2" fill="#fff" opacity="0.35" filter={`url(#${id}h)`} />
      {/* gold bands and clip */}
      <rect x="200" y="9" width="8" height="38" fill={`url(#${id}o)`} />
      <rect x="213" y="9" width="3" height="38" fill={`url(#${id}o)`} />
      <path d="M234 4 H300 Q310 4 310 12 Q310 16 304 16 H234 Z" fill={`url(#${id}o)`} />
      <circle cx="306" cy="12" r="5" fill={`url(#${id}o)`} />
    </svg>
  );
}

/** A small nib, for inline use beside "Before you sign". */
export function Nib({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}o`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a5720" />
          <stop offset="0.35" stopColor="#fff0c4" />
          <stop offset="0.55" stopColor="#d4a957" />
          <stop offset="1" stopColor="#6b4c1c" />
        </linearGradient>
      </defs>
      <path d="M7.5 2.5 Q12 1.5 16.5 2.5 L18.5 10 Q15 16 12 22 Q9 16 5.5 10 Z" fill={`url(#${id}o)`} />
      <path d="M12 12 V20" stroke="#4a3310" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="10.5" r="1.7" fill="#4a3310" />
      <path d="M9 4.5 Q10 9 9.5 12" stroke="#fff8e6" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.8" />
    </svg>
  );
}
