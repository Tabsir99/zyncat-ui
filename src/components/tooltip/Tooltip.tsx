'use client';

/* Tooltip — a transient, non-interactive hint on hover/focus (one shared bubble). */
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

const OPEN_DELAY = 350;
const CLOSE_GRACE = 140;
const WARM_WINDOW = 300;

const TIP_GAP =
  typeof document !== 'undefined'
    ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-2')) || 8
    : 8;

/* Store — what's showing, where; triggers write, the host renders. */
const store = {
  active: null as ActivePayload | null,
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

/* Target box from the trigger rect + the measured content size; flips + clamps. */
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

/* Host — the one bubble + its hidden measuring twin. */
function TooltipHost() {
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
            {/* one node keyed by trigger: old cuts, new fades in while the box travels (fixed width keeps wrapping stable) */}
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

/* Trigger — reports to the store; default wraps the child in a display:contents anchor (any element, no ref), asChild clones instead. */
export interface TooltipProps {
  /** The hint — a string or small node; never interactive content. */
  content: ReactNode;
  /** Optional keyboard hint, rendered as mono metadata ("⌘↩", "S"). */
  shortcut?: string | null;
  /** Preferred side; flips automatically when out of viewport room. */
  placement?: Placement;
  /** Suppress the tooltip entirely (trigger renders untouched). */
  disabled?: boolean;
  /** ms before a cold hover shows; warm hovers + focus are instant. Default 350. */
  openDelay?: number;
  /** ms the bubble lingers after leaving (bridges moving to a neighbour). Default 140. */
  closeDelay?: number;
  /** Skip the wrapper — clone the child and merge handlers + ref onto it (child must take a ref). Default false. */
  asChild?: boolean;
  id?: string;
  /** Exactly one element; any element works by default, asChild requires one that accepts a ref. */
  children: ReactElement;
}

function Tooltip({
  content,
  shortcut = null,
  placement = 'top',
  disabled = false,
  openDelay = OPEN_DELAY,
  closeDelay = CLOSE_GRACE,
  asChild = false,
  id,
  children,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const myId = id || 'tip-' + useId();

  // The element we anchor to + set aria-describedby on (clone, or the wrapper's child).
  const anchorEl = (): HTMLElement | null =>
    asChild ? triggerRef.current : ((wrapRef.current?.firstElementChild as HTMLElement) ?? null);

  useEffect(
    () => () => {
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

  // Default: a display:contents wrapper carries the listeners + rect; the child needs no ref.
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

  // asChild: clone the child, merging our handlers + ref (a press dismisses: activating ≠ hinting).
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
