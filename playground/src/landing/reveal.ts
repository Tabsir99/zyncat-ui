import { useEffect } from 'react';

// Progressive scroll reveal: elements are only hidden AFTER mount (never in the
// SSG HTML), and only the ones still below the fold — so no-JS visitors and
// crawlers always see a fully painted page.
//
// CRITICAL: both classes are REMOVED once the reveal finishes. A leftover
// `translate` (even `0 0`) makes the element a containing block, which hijacks
// any `position: fixed` descendant (Select menus) and skews Motion layoutId
// measurements (radio markers). Revealed elements must return to pristine.
// Containers that host overlays opt out of the translate with
// data-reveal="fade" (opacity only).
const REVEAL_MS = 700;

export function useReveals() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const below = els.filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.88);
    if (below.length === 0) return;

    const timers = new Set<number>();
    const finish = (el: HTMLElement) => {
      const t = window.setTimeout(() => {
        el.classList.remove('ld-pre', 'ld-in');
        timers.delete(t);
      }, REVEAL_MS);
      timers.add(t);
    };

    below.forEach((el) => el.classList.add('ld-pre'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('ld-in');
            finish(el);
            io.unobserve(el);
          }
        }
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' },
    );
    below.forEach((el) => io.observe(el));
    // Failsafe: nothing stays hidden even if an observation is missed.
    const failSafe = window.setTimeout(() => {
      below.forEach((el) => {
        el.classList.add('ld-in');
        finish(el);
      });
      io.disconnect();
    }, 4000);
    return () => {
      window.clearTimeout(failSafe);
      timers.forEach((t) => window.clearTimeout(t));
      io.disconnect();
    };
  }, []);
}
