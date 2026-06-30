'use client';

/* Toast — the React render layer (queue + clocks live in toast-store.ts). */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, animate, useMotionValue, type PanInfo } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { Icon, type IconName } from '../icon/Icon';
import { UIToast, type ToastRecord, type ToastTone } from './toast-store';

const SM = UIMotion;
const store = UIToast;
const { useRef, useEffect, useLayoutEffect, useState, useSyncExternalStore } = React;

const VISIBLE = 3;
const RENDERED = 6;
const COLLAPSE_GRACE = 140;
const SWIPE_X = 64;
const SWIPE_V = 480;

// expanded gap AND collapsed peek — read lazily (post-stylesheet), once
let GAP = 0;
function stackGap() {
  if (GAP) return GAP;
  const cs = getComputedStyle(document.documentElement);
  const raw = cs.getPropertyValue('--space-3').trim();
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

/* useToneGesture — success glint, error headshake; the glint class is toggled with a reflow (remove → offsetWidth → add) to restart the one-shot. */
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
        delay: SM.dur.base,
      });
      return () => fall.stop();
    }
  }, [tone]);
}

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

  // report the CONTENT height (firstChild — the li's own height is animated, so it'd read mid-tween)
  useLayoutEffect(() => {
    if (ref.current && ref.current.firstElementChild)
      onHeight(t.id, (ref.current.firstElementChild as HTMLElement).offsetHeight);
  });

  const swipe = (_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_X || info.velocity.x > SWIPE_V) {
      // fling out the right edge, THEN remove — the exit fade plays where it landed, no snap-back
      animate(x, 420, { duration: SM.dur.fast, ease: SM.ease.exit }).then(() =>
        store.dismiss(t.id),
      );
    }
  };

  return (
    <motion.li
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
        /* behind-cards adopt the front card's frame height (content faded) so a short card never drowns behind a tall one */
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
    </motion.li>
  );
}

function ToastBody({ t }: { t: ToastRecord }) {
  return (
    <div className="toast__inner">
      {(t.tone !== 'default' || isFinite(t.duration)) && (
        <span className="toast__icon">
          {t.tone !== 'default' && (
            /* keyed remount (not nested AnimatePresence): old glyph cuts, new springs in */
            <motion.span
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
            </motion.span>
          )}
          {isFinite(t.duration) && (
            /* the ring — keyed to the timer so a restart re-fills it; pathLength=1 makes dashoffset a fraction */
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
      <motion.div
        key={String(t.message) + '·' + String(t.description)}
        className="toast__text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SM.t.enter}
      >
        <p className="toast__message">{t.message}</p>
        {t.description != null && <p className="toast__desc">{t.description}</p>}
      </motion.div>
      {t.count > 1 && (
        <motion.span
          key={t.count}
          className="toast__count"
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={SM.t.settle}
        >
          ×{t.count}
        </motion.span>
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

  // tab hidden → freeze clocks, visible → resume (visibility, not window focus: an embedded preview blurs on outside clicks).
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) store.pause();
      else if (!hovering.current) store.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // safety net: last card removed under the cursor fires no pointerout, so release here
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
      {/* initial stays true — the host mounts with the first toast, so initial={false} would skip its entrance */}
      <AnimatePresence>
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

/* Toaster — mount once near the app root so this module loads client-side and the lazy host is registered (toast() also auto-mounts). */
export function Toaster(): null {
  useEffect(() => {
    ensureToastHost();
  }, []);
  return null;
}
