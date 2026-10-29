// The desk objects, all Blender renders (Cycles; scene scripts and the export
// step are in tools/blender/): the law library behind the hero (Shelves), the
// green banker's lamp that lights the report (Lamp), and the fountain pen that
// signs it (Pen, and Nib as a small icon). All are decoration: alt="" and
// aria-hidden.

/** Shelves of leather-bound law reports, softly lit; the hero's background. */
export function Shelves() {
  return (
    <img
      className="shelves"
      src="/img/library-1920.webp"
      srcSet="/img/library-1080.webp 1080w, /img/library-1920.webp 1920w"
      sizes="100vw"
      width={1920}
      height={1080}
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority="high"
    />
  );
}

// The lamp and pen are modelled the way the "5 Models in 7 Minutes" tutorial
// works: lathe profiles spun with a Screw modifier, then Solidify and
// Subdivision. The lamp is rendered twice, off and on, and the page flickers
// between them; the pen's contact shadow is part of its render.

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
