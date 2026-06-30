'use client';

/* Tooltip.tsx — Tooltip.
   ─────────────────────────────────────────────────────────────────────────
   A transient, NON-INTERACTIVE hint on hover/focus. One-liner (+ optional
   mono `shortcut`) or a small multi-line node. Anything clickable belongs to
   Popover — the bubble takes no pointer events, ever.

   ONE bubble, explicit motion, deterministic sizing:
   · A single TooltipHost (mounted once) renders the one active bubble.
     Each <Tooltip> wraps (or, with asChild, clones) its child and reports
     {content, rect} to a store.
   · A hidden CLONE of the next content is measured first, so the target box
     (x, y, w, h) AND the body's exact line wrapping are known BEFORE anything
     animates. The live body gets that measured width inline — live and clone
     can never disagree, so the settled bubble can never clip its own text.
   · Travel = one tween of x/y (transforms) + width/height (measured px→px).
     Width/height is a DELIBERATE, surfaced §C exception: scale-correction is
     exactly what distorts text, and one small fixed element can't jank.
   · Content swap is a SINGLE node keyed by trigger: the old label cuts, the
     new one fades in fast while the box travels. No exit choreography —
     a previous nested-AnimatePresence crossfade left permanent ghost spans
     (broken exit bookkeeping, verified by frame trace) and read as a flash.
     One node = nothing to leak, nothing to mistime.

   Timing: cold hover waits OPEN_DELAY; while open (or shortly after), the
   next trigger is instant and the bubble travels; leaving lingers
   CLOSE_GRACE so neighbour-to-neighbour never blinks out.

   Bundled app: imports motion from 'motion/react' and the ESM <Icon>; React /
   ReactDOM come from the package, the motion tokens from the shared bridge. */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'motion/react';
import type { ReactElement, ReactNode } from 'react';
import { UIMotion } from '../../tokens/motion-tokens';

const SM = UIMotion;
const { useRef, useEffect, useLayoutEffect, useState, useId, useSyncExternalStore } = React;

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface ActivePayload {
  id: string;
  content: ReactNode;
  shortcut?: string | null;
  placement: Placement;
  rect: () => DOMRect;
}

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

/* WHY ANY HOOKS AT ALL, with Motion in the house? Motion owns ANIMATION.
   What's left is not animation: hover-intent timing (module timers), DOM
   measurement before paint (one layout effect), global dismiss listeners
   (one effect), and the measured target box (one state the host renders
   from). The TRIGGERS are fully stateless — one cleanup effect each. */

const OPEN_DELAY = 350; // ms before a COLD hover shows (override per instance: openDelay)
const CLOSE_GRACE = 140; // ms the bubble lingers on leave (override: closeDelay) —
// just enough to bridge a pointer crossing the gap
// between adjacent triggers without reading as lag
const WARM_WINDOW = 300; // ms after a close during which the next hover is instant

const TIP_GAP =
  typeof document !== 'undefined'
    ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-2')) || 8
    : 8;

/* ── Store · what's showing, where. Triggers write, the host renders. ───────*/
const store = {
  active: null as ActivePayload | null, // { id, content, shortcut, placement, rect } | null
  closeTimer: 0 as ReturnType<typeof setTimeout> | 0,
  warmUntil: 0,
  listeners: new Set<() => void>(),
  get: () => store.active,
  subscribe(l: () => void) {
    store.listeners.add(l);
    return () => store.listeners.delete(l);
  },
  emit() {
    store.listeners.forEach((l) => l());
  },
  isWarm: () => store.active !== null || performance.now() < store.warmUntil,
  open(payload: ActivePayload) {
    clearTimeout(store.closeTimer);
    store.active = payload;
    store.emit();
  },
  close(id: string, grace = CLOSE_GRACE) {
    // graced; only the owning trigger can close
    clearTimeout(store.closeTimer);
    store.closeTimer = setTimeout(() => {
      if (store.active && store.active.id === id) store.closeNow();
    }, grace);
  },
  closeNow() {
    clearTimeout(store.closeTimer);
    if (!store.active) return;
    store.warmUntil = performance.now() + WARM_WINDOW;
    store.active = null;
    store.emit();
  },
};

/* Target box from the trigger rect + the MEASURED size of the next content.
   Flips when out of room, clamps to the viewport. */
function targetBox(size: Size, t: DOMRect, want: Placement): TargetBox {
  const vw = window.innerWidth,
    vh = window.innerHeight,
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

/* ── Host · the ONE bubble + its hidden measuring twin ──────────────────────*/
function TooltipHost() {
  const active = useSyncExternalStore(store.subscribe, store.get);
  const measureRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<RenderedBox | null>(null);

  // Measure the clone (already rendered with the NEW content) before paint:
  // box = clone's border box; bodyW = the body's exact width, locked onto the
  // live body so live wrapping ≡ clone wrapping, always.
  useLayoutEffect(() => {
    if (!active) {
      setBox(null);
      return;
    }
    const r = measureRef.current.getBoundingClientRect();
    const b = (measureRef.current.firstChild as HTMLElement).getBoundingClientRect();
    setBox({
      ...targetBox(
        { w: Math.ceil(r.width), h: Math.ceil(r.height) },
        active.rect(),
        active.placement,
      ),
      bodyW: Math.ceil(b.width),
    });
  }, [active]);

  // Esc or any scroll dismisses (a stale hint is worse than none)
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

  return ReactDOM.createPortal(
    <React.Fragment>
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
            id="scheduly-tooltip"
            role="tooltip"
            data-placement={box.placement}
            initial={{
              x: box.x + off.x,
              y: box.y + off.y,
              width: box.w,
              height: box.h,
              opacity: 0,
              scale: 0.96,
            }}
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
            {/* ONE content node, keyed by trigger: old cuts, new fades in fast
                while the box travels. Fixed measured width = stable wrapping
                through the whole morph (the moving box just reveals it). */}
            <motion.span
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: SM.t.enter }}
            >
              <Body a={active} width={box.bodyW} />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>,
    document.body,
  );
}

// Mount the host exactly once, lazily, in its own root.
let hostMounted = false;
function ensureHost() {
  if (hostMounted) return;
  hostMounted = true;
  const el = document.createElement('div');
  el.setAttribute('data-tooltip-host', '');
  document.body.appendChild(el);
  createRoot(el).render(<TooltipHost />);
}

const chain = (theirs: ((e: any) => void) | undefined, mine: (e: any) => void) => (e: any) => {
  if (theirs) theirs(e);
  mine(e);
};

/* ── Trigger · reports to the store, stateless (Motion owns animation; the only
   hooks are an id + a timer-cleanup effect). Default: a display:contents anchor
   wraps the child and owns the listeners + measured rect, so ANY element works
   with no ref. asChild: clone the child instead — zero wrapper, child takes the
   ref. aria-describedby is set imperatively on whichever element we anchor. ──*/
export interface TooltipProps {
  /** The hint: a string one-liner, or a small node (lead line + body) capped
      at --measure-floating. Never interactive content. */
  content: ReactNode;
  /** Optional keyboard hint, rendered as mono metadata ("⌘↩", "S"). */
  shortcut?: string | null;
  /** Preferred side; flips automatically when out of viewport room. */
  placement?: Placement;
  /** Suppress the tooltip entirely (trigger renders untouched). */
  disabled?: boolean;
  /** ms before a COLD hover shows. Warm hovers and keyboard focus are always
      instant. Default 350. */
  openDelay?: number;
  /** ms the bubble lingers after leaving the trigger (bridges moving to a
      neighbour). Default 140. */
  closeDelay?: number;
  /** Skip the wrapper — clone the child and merge the trigger handlers + ref
      onto it instead (zero extra DOM, but the child must be a DOM element or
      forward its ref). Default false. */
  asChild?: boolean;
  id?: string;
  /** Exactly one element. By default any element works (a display:contents
      wrapper carries the trigger, so no ref is needed); with `asChild` the
      child itself must accept a ref. */
  children: ReactElement;
}

function Tooltip({
  content,
  shortcut = null,
  placement = 'top',
  disabled = false,
  openDelay = OPEN_DELAY, // ms before a cold hover shows (focus is always instant)
  closeDelay = CLOSE_GRACE, // ms the bubble lingers after leave
  asChild = false,
  id,
  children,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const myId = id || 'tip-' + useId();

  // The element we anchor the bubble to and set aria-describedby on: the cloned
  // child in asChild mode, else the display:contents wrapper's only child.
  const anchorEl = (): HTMLElement | null =>
    asChild ? triggerRef.current : ((wrapRef.current?.firstElementChild as HTMLElement) ?? null);

  useEffect(
    () => () => {
      // unmount: drop pending timers, release the bubble
      clearTimeout(openTimer.current);
      store.close(myId, 0);
    },
    [],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  function show(immediate: boolean) {
    if (disabled) return;
    ensureHost();
    clearTimeout(openTimer.current);
    const el = anchorEl();
    if (!el) return;
    el.setAttribute('aria-describedby', 'scheduly-tooltip');
    const open = () =>
      store.open({
        id: myId,
        content,
        shortcut,
        placement,
        rect: () => anchorEl()!.getBoundingClientRect(),
      });
    if (immediate || store.isWarm()) open();
    else openTimer.current = setTimeout(open, openDelay);
  }
  function hide() {
    clearTimeout(openTimer.current);
    const el = anchorEl();
    if (el) el.removeAttribute('aria-describedby');
    store.close(myId, closeDelay);
  }

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') show(false);
  };
  const onFocusIn = (e: React.FocusEvent) => {
    if ((e.target as HTMLElement).matches(':focus-visible')) show(true);
  };

  // Default: a display:contents wrapper carries the listeners + the measured
  // rect, so the child stays untouched and needs no ref of its own.
  if (!asChild) {
    return (
      <span
        ref={wrapRef}
        className="tooltip-anchor"
        onPointerEnter={onEnter}
        onPointerLeave={hide}
        onPointerDown={hide}
        onFocus={onFocusIn}
        onBlur={hide}
      >
        {children}
      </span>
    );
  }

  // asChild: no wrapper — clone the child and merge our handlers + ref onto it
  // (a press dismisses: activating ≠ hinting).
  const child = React.Children.only(children) as ReactElement & { ref?: any };
  const childRef = child.ref;
  const childProps = child.props as any;
  return React.cloneElement(child, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') childRef.current = node;
    },
    onPointerEnter: chain(childProps.onPointerEnter, onEnter),
    onPointerLeave: chain(childProps.onPointerLeave, hide),
    onPointerDown: chain(childProps.onPointerDown, hide),
    onFocus: chain(childProps.onFocus, onFocusIn),
    onBlur: chain(childProps.onBlur, hide),
  } as any);
}

export { Tooltip, TooltipHost };
