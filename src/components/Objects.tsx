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

// The lamp, pen and nib are Blender renders (Cycles), modelled the way the
// "5 Models in 7 Minutes" tutorial works: lathe profiles spun with a Screw
// modifier, then Solidify and Subdivision. Scene scripts and the export step
// are in tools/blender/. The lamp is rendered twice, off and on, and the page
// flickers between them; the pen's contact shadow is part of its render.

// Pixel sizes of the 2x WebP files in public/img (tools/blender/export.py prints them).
const LAMP_H = 629, PEN_H = 295;

/** A green banker's lamp, switched off underneath and switched on above. */
export function Lamp({ className }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <img className="lamp-off" src="/img/lamp-off.webp" width={520} height={LAMP_H} alt="" decoding="async" fetchPriority="high" />
      <img className="lamp-on lamp-bulb" src="/img/lamp-on.webp" width={520} height={LAMP_H} alt="" decoding="async" />
      <span className="lamp-cone" />
    </span>
  );
}

/** A fountain pen lying on the report at its on-page angle, with its shadow. */
export function Pen({ className }: { className?: string }) {
  return <img className={className} src="/img/pen.webp" width={640} height={PEN_H} alt="" aria-hidden="true" decoding="async" />;
}

/** A small nib, for inline use beside "Before you sign". */
export function Nib({ className }: { className?: string }) {
  return <img className={className} src="/img/nib.webp" width={11} height={22} alt="" aria-hidden="true" decoding="async" />;
}
