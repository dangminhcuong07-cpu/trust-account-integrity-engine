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

/** A green banker's lamp: cased glass shade, polished brass, ball-chain pull. */
export function Lamp({ className }: { className?: string }) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  return (
    <svg className={className} viewBox="0 0 260 244" aria-hidden="true" focusable="false">
      <defs>
        {/* Polished brass on a vertical axis: the room reflected as hard bands. */}
        <linearGradient id={`${id}br`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2e1f08" />
          <stop offset="0.1" stopColor="#7d5a20" />
          <stop offset="0.26" stopColor="#e3c27a" />
          <stop offset="0.31" stopColor="#fff6d8" />
          <stop offset="0.37" stopColor="#c99b4b" />
          <stop offset="0.58" stopColor="#5e4317" />
          <stop offset="0.78" stopColor="#a27833" />
          <stop offset="0.9" stopColor="#d8b46c" />
          <stop offset="1" stopColor="#3b2a0c" />
        </linearGradient>
        {/* Brass seen edge-on (rims, collars): lit from the top. */}
        <linearGradient id={`${id}bv`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3cf" />
          <stop offset="0.3" stopColor="#d9b066" />
          <stop offset="0.65" stopColor="#7a5720" />
          <stop offset="1" stopColor="#3a280b" />
        </linearGradient>
        {/* Cased glass, a half-cylinder on its side: the curve runs top to bottom. */}
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d3322" />
          <stop offset="0.12" stopColor="#3f8d63" />
          <stop offset="0.2" stopColor="#7cc79c" />
          <stop offset="0.27" stopColor="#2f7a52" />
          <stop offset="0.55" stopColor="#14533a" />
          <stop offset="0.8" stopColor="#0b3b27" />
          <stop offset="0.93" stopColor="#1d6845" />
          <stop offset="1" stopColor="#2f8a5c" />
        </linearGradient>
        {/* The ends curl away: darker left and right. */}
        <linearGradient id={`${id}ge`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#020c07" stopOpacity="0.85" />
          <stop offset="0.12" stopColor="#020c07" stopOpacity="0.15" />
          <stop offset="0.5" stopColor="#020c07" stopOpacity="0" />
          <stop offset="0.86" stopColor="#020c07" stopOpacity="0.2" />
          <stop offset="1" stopColor="#020c07" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id={`${id}lp`} cx="0.5" cy="0" r="0.9">
          <stop offset="0" stopColor="#fff4da" stopOpacity="0.9" />
          <stop offset="0.5" stopColor="#ffd28a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#ffc56e" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}bt`} cx="0.5" cy="0.2" r="0.6">
          <stop offset="0" stopColor="#fff2cc" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff2cc" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}b1`} x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="0.8" /></filter>
        <filter id={`${id}b3`} x="-30%" y="-100%" width="160%" height="300%"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id={`${id}b6`} x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>

      {/* contact shadow */}
      <ellipse cx="130" cy="236" rx="78" ry="6" fill="#000" opacity="0.7" filter={u('b6')} />

      {/* light falling from under the shade */}
      <path className="lamp-cone" d="M34 104 L0 244 H260 L226 104 Z" fill={u('lp')} />

      {/* base: plinth, then a stepped dome, lit warm from above */}
      <path d="M58 226 Q58 218 70 217 H190 Q202 218 202 226 V230 Q202 236 192 236 H68 Q58 236 58 230 Z" fill={u('br')} />
      <rect x="62" y="217" width="136" height="3" rx="1.5" fill="#fff0c6" opacity="0.55" />
      <path d="M80 218 Q82 196 130 193 Q178 196 180 218 Z" fill={u('br')} />
      <ellipse cx="130" cy="200" rx="40" ry="9" fill={u('bt')} />
      <path d="M100 196 Q104 186 130 185 Q156 186 160 196 Z" fill={u('br')} />

      {/* stem with collars, a swivel knuckle under the shade */}
      <rect x="123" y="104" width="14" height="84" fill={u('br')} />
      <rect x="117" y="182" width="26" height="7" rx="3.5" fill={u('bv')} />
      <rect x="119" y="146" width="22" height="6" rx="3" fill={u('bv')} />
      <ellipse cx="130" cy="186" rx="18" ry="5" fill="#000" opacity="0.35" filter={u('b3')} />
      <rect x="115" y="100" width="30" height="12" rx="6" fill={u('br')} />
      <circle cx="148" cy="106" r="5.5" fill={u('bv')} />

      {/* ball-chain pull */}
      {Array.from({ length: 11 }, (_, i) => <circle key={i} cx="196" cy={110 + i * 4.2} r="1.5" fill={u('bv')} />)}
      <path d="M196 156 Q190 160 191 168 Q193 176 196 177 Q199 176 201 168 Q202 160 196 156 Z" fill={u('br')} />

      {/* shade: emerald outside, opal-white inside, glowing at the lip */}
      <ellipse className="lamp-bulb" cx="130" cy="101" rx="104" ry="7" fill="#fff6e0" filter={u('b3')} />
      <path d="M18 98 L22 58 Q26 32 54 29 H206 Q234 32 238 58 L242 98 Z" fill={u('g')} />
      <path d="M18 98 L22 58 Q26 32 54 29 H206 Q234 32 238 58 L242 98 Z" fill={u('ge')} />
      {/* a window reflected along the top, and a softer second one */}
      <path d="M46 40 Q60 35 120 34.5 L168 35 Q150 38 120 38.5 Q70 39 46 40 Z" fill="#f2fff7" opacity="0.85" filter={u('b1')} />
      <path d="M180 37 Q200 37 216 40 Q206 41 182 40 Z" fill="#f2fff7" opacity="0.5" filter={u('b1')} />
      <rect x="40" y="62" width="180" height="10" rx="5" fill="#9fe0bb" opacity="0.08" filter={u('b3')} />
      {/* the glass glowing where the bulb shines through */}
      <rect className="lamp-bulb" x="30" y="84" width="200" height="12" rx="6" fill="#58c98a" opacity="0.35" filter={u('b3')} />
      <rect x="16" y="95" width="228" height="9" rx="4.5" fill={u('bv')} />
      <rect x="40" y="96" width="140" height="1.6" rx="0.8" fill="#fff8e2" opacity="0.8" />
      {/* finial */}
      <rect x="125" y="22" width="10" height="9" rx="2" fill={u('br')} />
      <circle cx="130" cy="19" r="5" fill={u('bv')} />
    </svg>
  );
}

/** A fountain pen lying flat, nib to the left, cap posted on the end. */
export function Pen({ className }: { className?: string }) {
  const id = useId();
  const u = (k: string) => `url(#${id}${k})`;
  return (
    <svg className={className} viewBox="0 0 360 60" aria-hidden="true" focusable="false">
      <defs>
        {/* Black resin, lying on its side: rim light, a sharp softbox line, deep body, bounce from the paper. */}
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a42" />
          <stop offset="0.07" stopColor="#0c0c0f" />
          <stop offset="0.17" stopColor="#2c2c33" />
          <stop offset="0.24" stopColor="#5d5d68" />
          <stop offset="0.32" stopColor="#141418" />
          <stop offset="0.7" stopColor="#060607" />
          <stop offset="0.88" stopColor="#1a1a1f" />
          <stop offset="0.96" stopColor="#3b3a3f" />
          <stop offset="1" stopColor="#111114" />
        </linearGradient>
        {/* Polished gold, same light. */}
        <linearGradient id={`${id}au`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a3c0f" />
          <stop offset="0.14" stopColor="#c0923f" />
          <stop offset="0.24" stopColor="#fff3cc" />
          <stop offset="0.34" stopColor="#e0b462" />
          <stop offset="0.6" stopColor="#8e6524" />
          <stop offset="0.86" stopColor="#5e4114" />
          <stop offset="0.95" stopColor="#c99c50" />
          <stop offset="1" stopColor="#4a3209" />
        </linearGradient>
        {/* Rhodium inlay on the nib. */}
        <linearGradient id={`${id}rh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d8288" />
          <stop offset="0.3" stopColor="#f4f6f8" />
          <stop offset="0.6" stopColor="#a9aeb4" />
          <stop offset="1" stopColor="#5d6268" />
        </linearGradient>
        <filter id={`${id}s`} x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="0.6" /></filter>
        <filter id={`${id}c`} x="-10%" y="-200%" width="120%" height="500%"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>

      {/* feed, under the nib */}
      <path d="M22 33 Q40 37 62 37 V40 Q40 40 24 35 Z" fill="#0a0a0b" />
      {[30, 36, 42, 48, 54].map(x => <rect key={x} x={x} y="35.5" width="1.2" height="4" fill="#2a2a2e" />)}

      {/* nib: gold body, rhodium inlay, slit, breather hole, iridium tip */}
      <path d="M64 20 C52 20 40 22 30 25.5 L7 29.6 Q5 30 7 30.4 L30 34.5 C40 38 52 40 64 40 Z" fill={u('au')} />
      <path d="M56 23.5 C46 24 38 25.5 31 27.5 L18 29.8 L31 32.5 C38 34.5 46 36 56 36.5 Q50 30 56 23.5 Z" fill={u('rh')} opacity="0.92" />
      <path d="M8.5 30 H36" stroke="#2b1d06" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="38.5" cy="30" r="2" fill="#2b1d06" />
      <path d="M44 27 Q48 30 44 33 M49 26 Q53 30 49 34" stroke="#5c5f63" strokeWidth="0.5" fill="none" opacity="0.7" />
      <circle cx="6.5" cy="30" r="1.3" fill="#c9ccd0" />

      {/* section, slightly waisted, with a gold ring at the barrel */}
      <path d="M62 19.5 Q80 21 98 17.5 V42.5 Q80 39 62 40.5 Z" fill={u('r')} />
      <rect x="96" y="16" width="5" height="28" rx="1" fill={u('au')} />

      {/* barrel and posted cap: one cigar shape */}
      <path d="M100 16.5 C150 13.5 210 12.5 260 12.5 C305 12.5 333 14.5 343 17 Q355 21.5 355 30 Q355 38.5 343 43 C333 45.5 305 47.5 260 47.5 C210 47.5 150 46.5 100 43.5 Z" fill={u('r')} />
      {/* the softbox, reflected along the top */}
      <path d="M108 19.6 C160 17 220 16.2 262 16.2 C300 16.2 326 17.6 338 19.6 C326 19.8 300 18.8 262 18.8 C220 18.8 160 19.4 108 20.6 Z" fill="#fff" opacity="0.8" filter={u('s')} />
      <path d="M120 41 C170 42.5 240 43.3 300 42.6" stroke="#8a8a96" strokeWidth="1.2" fill="none" opacity="0.35" filter={u('c')} />

      {/* cap lip and band: a wide ring between two fine ones */}
      <rect x="214" y="12.6" width="3" height="34.8" fill={u('au')} />
      <rect x="220" y="12.5" width="12" height="35" fill={u('au')} />
      <rect x="235" y="12.5" width="3" height="35" fill={u('au')} />

      {/* clip, with its shadow on the cap */}
      <path d="M262 17.5 H340 Q344 17.5 344 20.5 H262 Z" fill="#000" opacity="0.55" filter={u('c')} />
      <path d="M266 11 H336 Q344 11 345 15 Q345 17.5 341 17.5 H266 Z" fill={u('au')} />
      <circle cx="265" cy="15" r="4.6" fill={u('au')} />
      <circle cx="263.6" cy="13.4" r="1.4" fill="#fff6dc" opacity="0.9" />
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
