import { useEffect, useState } from 'react';

// Scroll motion without a library and without taking over the scroll:
// - [data-progress] elements get --p, 0 when their top enters the bottom of the
//   viewport and 1 when they have moved one viewport height (CSS does the rest);
// - [data-reveal] elements get .in once they are on screen, and keep it;
// - with reduced motion, every --p is 1 and everything is revealed at once.
export function useScrollMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tracked = [...document.querySelectorAll<HTMLElement>('[data-progress]')];
    const revealed = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];

    if (reduce || !('IntersectionObserver' in window)) {
      tracked.forEach(el => el.style.setProperty('--p', '1'));
      revealed.forEach(el => el.classList.add('in'));
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      for (const el of tracked) {
        const top = el.getBoundingClientRect().top;
        const p = Math.min(1, Math.max(0, (vh - top) / vh));
        el.style.setProperty('--p', p.toFixed(3));
      }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    revealed.forEach(el => io.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);
}

/** The id of the section whose top most recently passed the upper third of the viewport. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const els = ids.map(id => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(entries => {
      const hit = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: '-30% 0px -60% 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/** Ticks once a second; pauses while the tab is hidden. */
export function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => { if (!document.hidden) setNow(new Date()); }, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}
