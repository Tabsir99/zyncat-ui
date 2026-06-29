'use client';

/* Toast.tsx — Toast RENDERING.
   ─────────────────────────────────────────────────────────────────────────
   The machinery (queue, clocks, toast API) lives in toast-store.ts. This file
   is only the React layer:

     useToneGesture  the win/lose choreography (success glint, error headshake)
     ToastItem       one glass card: dial + ring, text, action, swipe, exit
     ToastHost       the viewport: stack math, fan-out, hover/visibility pause

   STACK MODEL (sonner-style, Motion-rendered): every card is absolutely
   anchored to the corner; Motion animates it to its slot with EXPLICIT
   y/scale values — collapsed: depth × peek, receding scale, 3 visible,
   behind-cards sized to the front card's frame; expanded (hover/focus):
   real offsets summed from measured content heights. Explicit-over-layout-
   projection is the house pattern (Tooltip): one spring serves entrance,
   restack, and fan-out — nothing teleports. */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { m, AnimatePresence, animate, useMotionValue, type PanInfo } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon, type IconName } from '../icon/Icon';
import { UIToast, type ToastRecord, type ToastTone } from './toast-store';

const SM = UIMotion;
const store = UIToast;
const { useRef, useEffect, useLayoutEffect, useState, useSyncExternalStore } = React;

const VISIBLE = 3; // collapsed cards shown (rest hide behind)
const RENDERED = 6; // hard render cap (older wait their turn)
const COLLAPSE_GRACE = 140; // ms before the fan folds after leave
const SWIPE_X = 64; // px — or fling past SWIPE_V px/s
const SWIPE_V = 480;

// expanded gap AND collapsed peek — read lazily (post-stylesheet), once
let GAP = 0;
function stackGap() {
  if (GAP) return GAP;
  const cs = getComputedStyle(document.documentElement);
  const raw = cs.getPropertyValue('--space-3').trim(); // "0.75rem" — rem→px
  const n = parseFloat(raw) || 0;
  GAP = (raw.endsWith('rem') ? n * (parseFloat(cs.fontSize) || 16) : n) || 12;
  return GAP;
}

const TONE_ICON: Record<string, IconName> = {
  success: 'check-circle',
  error: 'warning-circle',
  warning: 'warning',
  info: 'info',
};

/* ── useToneGesture · the win/lose split (§C) ──────────────────────────────
   Success (on entrance or morph) fires glass's one-shot GLINT: light sweeps
   the pane as it lands. Error gets the HEADSHAKE: a damped x-settle after
   landing — weight, not jitter. Both ride the motion tokens, so reduced
   motion collapses them for free. The glint class is toggled imperatively
   on our own ref (remove → reflow → add restarts the one-shot animation). */
function useToneGesture(
  tone: ToastTone,
  ref: React.RefObject<HTMLElement>,
  x: ReturnType<typeof useMotionValue<number>>,
) {
  const prevTone = useRef<ToastTone | null>(null);
  useEffect(() => {
    const prev = prevTone.current;
    prevTone.current = tone;
    if (tone === prev) return;
    if (tone === 'success') {
      const el = ref.current;
      el.classList.remove('glass-glint');
      void el.offsetWidth;
      el.classList.add('glass-glint');
      const id = setTimeout(() => el.classList.remove('glass-glint'), SM.dur.slow * 1000 + 80);
      return () => clearTimeout(id);
    }
    if (tone === 'error') {
      const fall = animate(x, [0, -7, 5, -2, 0], {
        duration: SM.dur.slow,
        ease: SM.ease.standard,
        delay: SM.dur.base, // let the card land first
      });
      return () => fall.stop();
    }
  }, [tone]);
}

/* ── ToastItem · one glass card ────────────────────────────────────────────*/
function ToastItem({
  t,
  depth,
  offset,
  hidden,
  behind,
  frameHeight,
  onHeight,
}: {
  t: ToastRecord;
  depth: number;
  offset: number;
  hidden: boolean;
  behind: boolean;
  frameHeight: number | null;
  onHeight: (id: string, h: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const x = useMotionValue(0); // swipe travel — ours, so dismissal can finish it
  useToneGesture(t.tone, ref, x);

  // report the CONTENT height (first child — the li itself animates height
  // for the collapsed stack, so measuring it would record mid-tween values)
  useLayoutEffect(() => {
    if (ref.current && ref.current.firstElementChild)
      onHeight(t.id, (ref.current.firstElementChild as HTMLElement).offsetHeight);
  });

  const swipe = (_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_X || info.velocity.x > SWIPE_V) {
      // finish the gesture out the right edge, THEN remove — the exit fade
      // happens where the card landed, never a snap-back fight
      animate(x, 420, { duration: SM.dur.fast, ease: SM.ease.exit }).then(() =>
        store.dismiss(t.id),
      );
    }
  };

  return (
    <m.li
      ref={ref}
      className="toast glass"
      data-tone={t.tone}
      data-behind={behind ? '' : undefined}
      role={t.tone === 'error' ? 'alert' : 'status'}
      aria-atomic="true"
      style={{ x }}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{
        opacity: hidden ? 0 : 1,
        y: -offset,
        scale: 1 - depth * 0.05,
        /* collapsed behind-cards adopt the FRONT card's frame height (their
           content is faded out) — a short card never drowns behind a tall one */
        height: frameHeight || 'auto',
        pointerEvents: hidden ? 'none' : 'auto',
      }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: SM.dur.fast, ease: SM.ease.exit } }}
      transition={{ y: SM.t.settle, scale: SM.t.settle, height: SM.t.settle, opacity: SM.t.enter }}
      drag={t.dismissible ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.04, right: 0.9 }}
      dragMomentum={false}
      onDragEnd={swipe}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && t.dismissible) store.dismiss(t.id);
      }}
    >
      {t.node ? (
        <div className="toast__custom">{t.node as React.ReactNode}</div>
      ) : (
        <ToastBody t={t} />
      )}
    </m.li>
  );
}

/* ── ToastBody · dial + ring | text | ×n | action | close ─────────────────*/
function ToastBody({ t }: { t: ToastRecord }) {
  return (
    <div className="toast__inner">
      {(t.tone !== 'default' || isFinite(t.duration)) && (
        <span className="toast__icon">
          {t.tone !== 'default' && (
            /* keyed remount, not nested AnimatePresence (Tooltip's lesson):
               old glyph cuts, the new one springs in under the same slot */
            <m.span
              key={t.tone}
              className="toast__icon-glyph"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ scale: SM.t.settle, opacity: SM.t.enter }}
            >
              {t.tone === 'loading' ? (
                <span className="toast__spinner" aria-hidden="true"></span>
              ) : (
                <Icon name={TONE_ICON[t.tone]} weight="fill" />
              )}
            </m.span>
          )}
          {isFinite(t.duration) && (
            /* the ring — the clock, keyed to the timer so a restart re-fills
               it; animation-duration is parametric timing data (see
               toast.css). pathLength=1 → dashoffset is a fraction. */
            <svg
              key={'ring-' + t.timerKey}
              className="toast__ring"
              viewBox="0 0 36 36"
              aria-hidden="true"
            >
              <circle className="toast__ring-track" cx="18" cy="18" r="16.5"></circle>
              <circle
                className="toast__ring-arc"
                cx="18"
                cy="18"
                r="16.5"
                pathLength={1}
                style={{ animationDuration: t.duration + 'ms' }}
              ></circle>
            </svg>
          )}
        </span>
      )}
      <m.div
        key={String(t.message) + '·' + String(t.description)}
        className="toast__text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SM.t.enter}
      >
        <p className="toast__message">{t.message}</p>
        {t.description != null && <p className="toast__desc">{t.description}</p>}
      </m.div>
      {t.count > 1 && (
        <m.span
          key={t.count}
          className="toast__count"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={SM.t.settle}
        >
          ×{t.count}
        </m.span>
      )}
      {t.action && (
        <button
          type="button"
          className="btn btn--secondary btn--sm toast__action"
          onClick={() => {
            if (t.action.onClick) t.action.onClick();
            store.dismiss(t.id);
          }}
        >
          {t.action.label}
        </button>
      )}
      {t.dismissible && (
        <button
          type="button"
          className="toast__close"
          aria-label="Dismiss"
          onClick={() => store.dismiss(t.id)}
        >
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}

/* ── ToastHost · the one viewport ──────────────────────────────────────────*/
function ToastHost() {
  const { toasts, paused, expanded } = useSyncExternalStore(store.subscribe, store.get);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const hovering = useRef(false);

  const onHeight = (id: string, h: number) =>
    setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));

  // hold = fan open + freeze clocks; release = graced fold + resume
  const onHold = () => {
    hovering.current = true;
    clearTimeout(collapseTimer.current);
    store.setExpanded(true);
    store.pause();
  };
  const onRelease = (graced: boolean) => {
    hovering.current = false;
    clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(
      () => {
        store.setExpanded(false);
        store.resume();
      },
      graced ? COLLAPSE_GRACE : 0,
    );
  };

  // tab hidden → clocks freeze; visible again → they resume (unless hovered).
  // Visibility, NOT window focus — in an embedded preview the window blurs on
  // any click outside the page while the toasts stay fully visible.
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) store.pause();
      else if (!hovering.current) store.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // safety net: if the last card leaves while hovered (swipe/dismiss removes
  // the node under the cursor, so no pointerout fires), release everything
  useEffect(() => {
    if (toasts.length === 0) {
      hovering.current = false;
      clearTimeout(collapseTimer.current);
      store.setExpanded(false);
      store.resume();
    }
  }, [toasts.length]);

  const slice = toasts.slice(-RENDERED);
  const n = slice.length;
  const frontH = n ? heights[slice[n - 1].id] || 0 : 0;
  const gap = stackGap();

  return createPortal(
    <ol
      className={'toast-viewport' + (paused ? ' is-paused' : '')}
      aria-label="Notifications"
      onPointerOver={(e) => {
        if (e.pointerType !== 'touch') onHold();
      }}
      onPointerOut={(e) => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) onRelease(true);
      }}
      onFocus={onHold}
      onBlur={(e) => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node))
          onRelease(false);
      }}
    >
      <AnimatePresence initial={false}>
        {slice.map((t, i) => {
          const depth = n - 1 - i; // newest = 0, at the front
          let offset = depth * gap; // collapsed: peek per depth
          if (expanded) {
            // expanded: real heights
            offset = 0;
            for (let j = i + 1; j < n; j++) offset += (heights[slice[j].id] || 0) + gap;
          }
          return (
            <ToastItem
              key={t.id}
              t={t}
              depth={expanded ? 0 : depth}
              offset={offset}
              hidden={!expanded && depth >= VISIBLE}
              behind={!expanded && depth > 0}
              frameHeight={!expanded && depth > 0 && frontH ? frontH : null}
              onHeight={onHeight}
            />
          );
        })}
      </AnimatePresence>
    </ol>,
    document.body,
  );
}

/* ── Mount · exactly once, lazily, registered with the store ──────────────*/
let hostMounted = false;
function ensureToastHost() {
  if (hostMounted) return;
  hostMounted = true;
  const el = document.createElement('div');
  el.setAttribute('data-toast-host', '');
  document.body.appendChild(el);
  createRoot(el).render(<ToastHost />);
}
store.host = ensureToastHost;
if (store.toasts.length) ensureToastHost(); // toasts fired before we loaded

/* Toaster — mount once near the app root (bundled apps). The imperative
   `toast()` API mounts the host lazily on first call; rendering <Toaster/>
   guarantees this module is evaluated client-side so the host is registered. */
export function Toaster(): null {
  useEffect(() => {
    ensureToastHost();
  }, []);
  return null;
}
