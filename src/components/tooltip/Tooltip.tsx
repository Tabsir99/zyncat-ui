'use client';

/* Tooltip - a transient, non-interactive hint on hover/focus (one shared bubble). */
import './tooltip.css';
import {
  Children,
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { cloneTrigger } from '../overlay/layer';
import { tokenPx } from '../token-px';

const SM = UIMotion;

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

/* Store - what's showing, where; triggers write, the host renders. */
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

/* Host election - the shared bubble host renders inside exactly ONE living Tooltip's tree
   (first registered wins; when it unmounts the next takes over, and the store re-feeds the
   same active payload). In-tree instead of a module-level createRoot: context crosses, the
   host dies with the app instead of zombieing, and two library copies can't fight a global. */
const hostReg = {
  keys: [] as symbol[],
  listeners: new Set<() => void>(),
  subscribe(l: () => void) {
    hostReg.listeners.add(l);
    return () => hostReg.listeners.delete(l);
  },
  register(k: symbol) {
    hostReg.keys.push(k);
    hostReg.listeners.forEach((l) => l());
    return () => {
      const i = hostReg.keys.indexOf(k);
      if (i >= 0) hostReg.keys.splice(i, 1);
      hostReg.listeners.forEach((l) => l());
    };
  },
};

function useHostElection(): boolean {
  const keyRef = useRef<symbol | null>(null);
  if (!keyRef.current) keyRef.current = Symbol('tip-host');
  useEffect(() => hostReg.register(keyRef.current!), []);
  return useSyncExternalStore(
    hostReg.subscribe,
    () => hostReg.keys[0] === keyRef.current,
    () => false,
  );
}

/* Trigger - reports to the store; default wraps the child in a display:contents anchor (any element, no ref), asChild clones instead. */
export interface TooltipProps {
  /** The hint - a string or small node; never interactive content. */
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
  /** Skip the wrapper - clone the child and merge handlers + ref onto it (child must take a ref). Default false. */
  asChild?: boolean;
  /** Stable id for this trigger's store entry + `aria-describedby`. Auto-generated when omitted. */
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
  const isHost = useHostElection();

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
    clearTimeout(openTimer.current);
    const el = anchorEl();
    if (!el) return;
    el.setAttribute('aria-describedby', 'pds-tooltip');
    const open = () =>
      store.open({ id: myId, content, shortcut, placement, rect: () => anchorEl()!.getBoundingClientRect() });
    if (immediate || store.isWarm()) open();
    else openTimer.current = setTimeout(open, openDelay);
  }
  function hide() {
    clearTimeout(openTimer.current);
    const el = anchorEl();
    if (el) el.removeAttribute('aria-describedby');
    store.close(myId, closeDelay);
  }

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') show(false);
  };
  const onFocusIn = (e: FocusEvent) => {
    if ((e.target as HTMLElement).matches(':focus-visible')) show(true);
  };

  // Default: a display:contents wrapper carries the listeners + rect; the child needs no ref.
  // The elected host mounts as a SIBLING - portal events bubble through the React tree, so
  // nesting it inside the anchor would feed the bubble's own pointer events back into show/hide.
  if (!asChild) {
    return (
      <Fragment>
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
        {isHost && <TooltipHost />}
      </Fragment>
    );
  }

  // asChild: clone the child, merging our handlers + ref (a press dismisses: activating != hinting).
  return (
    <Fragment>
      {cloneTrigger(
        Children.only(children),
        { onPointerEnter: onEnter, onPointerLeave: hide, onPointerDown: hide, onFocus: onFocusIn, onBlur: hide },
        (node) => {
          triggerRef.current = node;
        },
      )}
      {isHost && <TooltipHost />}
    </Fragment>
  );
}

export { Tooltip, TooltipHost };
