'use client';

import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { animate } from '../../../engine';
import { Presence } from '../../../motion/presence';
import { useMotion, type MotionSpecs } from '../../../motion/use-motion';
import { UIMotion } from '../../../tokens/motion-tokens';
import { tokenPx } from '../../internal/utils/token-px';
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

function targetBox(size: Size, t: DOMRect, want: Placement): TargetBox {
  const vw = window.innerWidth,
    vh = window.innerHeight,
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

function TipSurface({ a, box, animate: animateSpec, exit }: { a: ActivePayload; box: RenderedBox } & MotionSpecs) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLSpanElement>(null);
  const settled = useRef(false);
  useMotion(ref, { animate: animateSpec, exit });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!settled.current) {
      settled.current = true;
      return;
    }
    animate(el, { x: [box.x], y: [box.y], width: [box.w], height: [box.h], timing: SM.t.layout });
  }, [box.x, box.y, box.w, box.h]);

  useLayoutEffect(() => {
    if (bodyRef.current) animate(bodyRef.current, { opacity: [0, 1], timing: SM.t.enter });
  }, [a.id]);

  return (
    <div ref={ref} className="tooltip" id="pds-tooltip" role="tooltip" data-placement={box.placement}>
      <span ref={bodyRef}>
        <Body a={a} width={box.bodyW} />
      </span>
    </div>
  );
}

export function TooltipHost() {
  const active = useSyncExternalStore(store.subscribe, store.get);
  const measureRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<RenderedBox | null>(null);

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

  const shown = useRef<{ box: RenderedBox; off: { x: number; y: number } } | null>(null);
  if (box) shown.current = { box, off: fromEdge(box.placement) };

  return createPortal(
    <Fragment>
      {active && (
        <div className="tooltip tooltip--measure" ref={measureRef} aria-hidden="true">
          <Body a={active} />
        </div>
      )}
      <Presence>
        {active && box && (
          <TipSurface
            key="tip"
            a={active}
            box={box}
            animate={(el) => {
              const at = shown.current;
              if (!at) return null;
              return animate(
                el,
                { width: [at.box.w], height: [at.box.h], timing: { duration: 0 } },
                { x: [at.box.x + at.off.x, at.box.x], y: [at.box.y + at.off.y, at.box.y], timing: SM.t.layout },
                { opacity: [0, 1], scale: [0.96, 1], timing: SM.t.enter },
              );
            }}
            exit={(el) => {
              const at = shown.current;
              if (!at) return null;
              return animate(el, {
                x: [at.box.x + at.off.x],
                y: [at.box.y + at.off.y],
                opacity: [0],
                scale: [0.96],
                timing: { duration: SM.dur.fast, ease: SM.ease.exit },
              });
            }}
          />
        )}
      </Presence>
    </Fragment>,
    document.body,
  );
}
