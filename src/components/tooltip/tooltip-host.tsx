'use client';

/* tooltip-host - the one shared bubble (+ its hidden measuring twin) that every Tooltip feeds
   through the store: measure-before-paint, flip/clamp placement, and the travel animation
   between triggers. Mounted by exactly one elected Tooltip (see tooltip-store). */
import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { tokenPx } from '../token-px';
import { store, type ActivePayload, type Placement } from './tooltip-store';

const SM = UIMotion;

interface Size {
  w: number;
  h: number;
}
interface TargetBox extends Size {
  x: number;
  y: number;
  placement: Placement;
}
interface RenderedBox extends TargetBox {
  bodyW: number;
}

/* Target box from the trigger rect + the measured content size; flips + clamps. */
function targetBox(size: Size, t: DOMRect, want: Placement): TargetBox {
  const vw = window.innerWidth,
    vh = window.innerHeight,
    /* read at call time - at import time the stylesheet may not be parsed yet */
    TIP_GAP = tokenPx('--space-2', 8) || 8,
    M = TIP_GAP;
  let p = want;
  if (p === 'top' && t.top - size.h - TIP_GAP < M) p = 'bottom';
  else if (p === 'bottom' && t.bottom + size.h + TIP_GAP > vh - M) p = 'top';
  else if (p === 'left' && t.left - size.w - TIP_GAP < M) p = 'right';
  else if (p === 'right' && t.right + size.w + TIP_GAP > vw - M) p = 'left';
  let x, y;
  if (p === 'top') {
    x = t.left + t.width / 2 - size.w / 2;
    y = t.top - size.h - TIP_GAP;
  } else if (p === 'bottom') {
    x = t.left + t.width / 2 - size.w / 2;
    y = t.bottom + TIP_GAP;
  } else if (p === 'left') {
    x = t.left - size.w - TIP_GAP;
    y = t.top + t.height / 2 - size.h / 2;
  } else {
    x = t.right + TIP_GAP;
    y = t.top + t.height / 2 - size.h / 2;
  }
  return {
    x: Math.round(Math.min(Math.max(x, M), vw - size.w - M)),
    y: Math.round(Math.min(Math.max(y, M), vh - size.h - M)),
    w: size.w,
    h: size.h,
    placement: p,
  };
}

const fromEdge = (p: Placement) => ({
  // enter/exit offset toward the trigger
  x: p === 'left' ? 4 : p === 'right' ? -4 : 0,
  y: p === 'top' ? 4 : p === 'bottom' ? -4 : 0,
});

function Body({ a, width }: { a: ActivePayload; width?: number }) {
  return (
    <span className="tooltip__body" style={width ? { width } : undefined}>
      {a.shortcut ? (
        <span className="tooltip__row">
          <span>{a.content}</span>
          <kbd className="tooltip__shortcut">{a.shortcut}</kbd>
        </span>
      ) : (
        a.content
      )}
    </span>
  );
}

/* Host - the one bubble + its hidden measuring twin. */
export function TooltipHost() {
  const active = useSyncExternalStore(store.subscribe, store.get);
  const measureRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<RenderedBox | null>(null);

  // Measure the clone before paint: box = its border box; bodyW locks the live body's wrapping to the clone's.
  useLayoutEffect(() => {
    if (!active) {
      setBox(null);
      return;
    }
    const r = measureRef.current.getBoundingClientRect();
    const b = (measureRef.current.firstChild as HTMLElement).getBoundingClientRect();
    setBox({
      ...targetBox({ w: Math.ceil(r.width), h: Math.ceil(r.height) }, active.rect(), active.placement),
      bodyW: Math.ceil(b.width),
    });
  }, [active]);

  // Esc or any scroll dismisses - intended divergence from Select/Popover, which re-place
  // on scroll: a hint is transient, and a stale or trailing hint is worse than none.
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') store.closeNow();
    };
    const onScroll = () => store.closeNow();
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [active]);

  const off = box ? fromEdge(box.placement) : { x: 0, y: 0 };

  return createPortal(
    <Fragment>
      {active && (
        <div className="tooltip tooltip--measure" ref={measureRef} aria-hidden="true">
          <Body a={active} />
        </div>
      )}
      <AnimatePresence>
        {active && box && (
          <motion.div
            key="tip"
            className="tooltip"
            id="pds-tooltip"
            role="tooltip"
            data-placement={box.placement}
            initial={{ x: box.x + off.x, y: box.y + off.y, width: box.w, height: box.h, opacity: 0, scale: 0.96 }}
            animate={{ x: box.x, y: box.y, width: box.w, height: box.h, opacity: 1, scale: 1 }}
            exit={{
              x: box.x + off.x,
              y: box.y + off.y,
              opacity: 0,
              scale: 0.96,
              transition: { duration: SM.dur.fast, ease: SM.ease.exit },
            }}
            transition={{
              x: SM.t.layout,
              y: SM.t.layout,
              width: SM.t.layout,
              height: SM.t.layout,
              opacity: SM.t.enter,
              scale: SM.t.enter,
            }}
          >
            {/* one node keyed by trigger: old cuts, new fades in while the box travels (fixed width keeps wrapping stable) */}
            <motion.span key={active.id} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: SM.t.enter }}>
              <Body a={active} width={box.bodyW} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>,
    document.body,
  );
}
