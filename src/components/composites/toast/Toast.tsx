'use client';

import './toast.css';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, animate, useMotionValue, type PanInfo } from 'motion/react';
import { UIMotion } from '../../../tokens/motion-tokens';
import { fireGlint } from '../../internal/glass/glint';
import { tokenPx } from '../../internal/utils/token-px';
import { Icon, type IconName } from '../../internal/icon/Icon';
import { Button } from '../../primitives/button/Button';
import { UIToast, DEFAULT_TOASTER_CONFIG, type ToastRecord, type ToastTone, type ToasterConfig } from './toast-store';
import type { DataAttributes } from '../../../dom-props';

const SM = UIMotion;
const store = UIToast;

const COLLAPSE_GRACE = 140;
const SWIPE_X = 64;
const SWIPE_V = 480;

let GAP = 0;
function stackGap() {
  if (!GAP) GAP = tokenPx('--space-3') || 12;
  return GAP;
}

const TONE_ICON: Record<string, IconName> = {
  success: 'check-circle',
  error: 'warning-circle',
  warning: 'warning',
  info: 'info',
};

function useToneGesture(tone: ToastTone, ref: RefObject<HTMLElement>, x: ReturnType<typeof useMotionValue<number>>) {
  const prevTone = useRef<ToastTone | null>(null);
  useEffect(() => {
    const prev = prevTone.current;
    prevTone.current = tone;
    if (tone === prev) return;
    if (tone === 'success') return fireGlint(ref.current);
    if (tone === 'error') {
      const fall = animate(x, [0, -7, 5, -2, 0], { duration: SM.dur.slow, ease: SM.ease.standard, delay: SM.dur.base });
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
  isTop,
  onHeight,
}: {
  t: ToastRecord;
  depth: number;
  offset: number;
  hidden: boolean;
  behind: boolean;
  frameHeight: number | null;
  isTop: boolean;
  onHeight: (id: string, h: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const x = useMotionValue(0);
  useToneGesture(t.tone, ref, x);

  useLayoutEffect(() => {
    if (ref.current && ref.current.firstElementChild)
      onHeight(t.id, (ref.current.firstElementChild as HTMLElement).offsetHeight);
  });

  const swipe = (_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    if (info.offset.x > SWIPE_X || info.velocity.x > SWIPE_V) {
      animate(x, 420, { duration: SM.dur.fast, ease: SM.ease.exit }).then(() => store.dismiss(t.id));
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
      initial={{ opacity: 0, y: isTop ? -24 : 24, scale: 0.97 }}
      animate={{
        opacity: hidden ? 0 : 1,
        y: isTop ? offset : -offset,
        scale: 1 - depth * 0.05,
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
      {t.node ? <div className="toast__custom">{t.node as ReactNode}</div> : <ToastBody t={t} />}
    </motion.li>
  );
}

function ToastBody({ t }: { t: ToastRecord }) {
  return (
    <div className="toast__inner">
      {(t.tone !== 'default' || isFinite(t.duration)) && (
        <span className="toast__icon">
          {t.tone !== 'default' && (
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
            <svg key={'ring-' + t.timerKey} className="toast__ring" viewBox="0 0 36 36" aria-hidden="true">
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
        key={String(t.message) + '-' + String(t.description)}
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
        <Button
          variant="secondary"
          size="sm"
          className="toast__action"
          onClick={() => {
            if (t.action.onClick) t.action.onClick();
            store.dismiss(t.id);
          }}
        >
          {t.action.label}
        </Button>
      )}
      {t.dismissible && (
        <button type="button" className="toast__close" aria-label="Dismiss" onClick={() => store.dismiss(t.id)}>
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  );
}

function ToastHost({ config, htmlProps }: { config: ToasterConfig; htmlProps?: HTMLAttributes<HTMLOListElement> }) {
  const { toasts, paused, expanded: hoverExpanded } = useSyncExternalStore(store.subscribe, store.get, store.get);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const [ready, setReady] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const hovering = useRef(false);

  useEffect(() => setReady(true), []);

  const onHeight = (id: string, h: number) => setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }));

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

  useEffect(() => {
    const onVis = () => {
      if (document.hidden) store.pause();
      else if (!hovering.current) store.resume();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) {
      hovering.current = false;
      clearTimeout(collapseTimer.current);
      store.setExpanded(false);
      store.resume();
    }
  }, [toasts.length]);

  if (!ready) return null;

  const isTop = config.position.startsWith('top');
  const visible = config.visibleToasts;
  const rendered = visible * 2;
  const gap = config.gap || stackGap();
  const expanded = config.expand || hoverExpanded;

  const slice = toasts.slice(-rendered);
  const n = slice.length;
  const frontH = n ? heights[slice[n - 1].id] || 0 : 0;

  return createPortal(
    <ol
      {...htmlProps}
      className={
        'toast-viewport' + (paused ? ' is-paused' : '') + (htmlProps?.className ? ' ' + htmlProps.className : '')
      }
      data-position={config.position}
      style={
        config.offset
          ? ({ ...htmlProps?.style, '--toast-offset': `${config.offset}px` } as CSSProperties)
          : htmlProps?.style
      }
      aria-label="Notifications"
      onPointerOver={(e) => {
        if (e.pointerType !== 'touch') onHold();
      }}
      onPointerOut={(e) => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) onRelease(true);
      }}
      onFocus={onHold}
      onBlur={(e) => {
        if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) onRelease(false);
      }}
    >
      <AnimatePresence>
        {slice.map((t, i) => {
          const depth = n - 1 - i;
          let offset = depth * gap;
          if (expanded) {
            offset = 0;
            for (let j = i + 1; j < n; j++) offset += (heights[slice[j].id] || 0) + gap;
          }
          return (
            <ToastItem
              key={t.id}
              t={t}
              depth={expanded ? 0 : depth}
              offset={offset}
              hidden={!expanded && depth >= visible}
              behind={!expanded && depth > 0}
              frameHeight={!expanded && depth > 0 && frontH ? frontH : null}
              isTop={isTop}
              onHeight={onHeight}
            />
          );
        })}
      </AnimatePresence>
    </ol>,
    document.body,
  );
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  const out: Partial<T> = {};
  (Object.keys(o) as (keyof T)[]).forEach((k) => {
    if (o[k] !== undefined) out[k] = o[k];
  });
  return out;
}

export interface ToasterProps extends Partial<ToasterConfig> {
  /** Standard <ol> attributes (className, style, data-*, ...) forwarded to the toast viewport. */
  htmlProps?: HTMLAttributes<HTMLOListElement> & DataAttributes;
}

export function Toaster({ htmlProps, ...props }: ToasterProps): ReactElement {
  const config: ToasterConfig = { ...DEFAULT_TOASTER_CONFIG, ...stripUndefined(props) };

  useEffect(() => {
    store.config = config;
    store.mounted = true;
    if (config.expand) store.setExpanded(true);
    return () => {
      store.mounted = false;
    };
  }, [config.position, config.duration, config.visibleToasts, config.gap, config.offset, config.expand]);

  return <ToastHost config={config} htmlProps={htmlProps} />;
}

export { toast } from './toast-store';
