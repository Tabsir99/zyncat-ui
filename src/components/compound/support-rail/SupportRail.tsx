'use client';

import './support-rail.css';

import {
  useId,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import type { DataAttributes } from '../../../dom-props';
import { startDrag, type Layer, type PanInfo } from '../../../engine';
import { Motion } from '../../../motion/element';
import { Presence } from '../../../motion/presence';
import { usePresence } from '../../../motion/presence-context';
import type { SupportRailStyle } from '../../../tokens/component-styles.generated';
import { UIMotion } from '../../../tokens/motion-tokens';
import { useControllable } from '../../internal/hooks/use-controllable';
import { useReturnFocus } from '../../internal/overlay/focus';
import { useOutsidePress, useOverlayEntry } from '../../internal/overlay/layer';
import type { SupportAction } from '../../internal/support/types';
import { cx } from '../../internal/utils/cx';

export type { SupportAction };

const RUBBER_BAND_DIVISOR = 6;
const DISMISS_DISTANCE_PX = 88;
const DISMISS_VELOCITY_PX_PER_S = 500;
const FLICK_DISTANCE_PX = 24;
const CONTENT_FADE_IN_DELAY_RATIO = 0.55;
const NEUTRAL_RATIO = 1;
const STAGGER_STEPS_MAX = 8;

const DRAG_PROPERTY = '--_support-rail-drag';
const COLLAPSE_X_PROPERTY = '--_support-rail-collapse-x';
const COLLAPSE_Y_PROPERTY = '--_support-rail-collapse-y';
const INDEX_PROPERTY = '--_support-rail-index';
const DRAGGING_ATTRIBUTE = 'data-dragging';
const NO_DRAG = '0px';

const CONTENT_FADE_IN: Layer = {
  opacity: [0, 1],
  timing: { duration: UIMotion.dur.slow, ease: 'linear', delay: UIMotion.dur.base * CONTENT_FADE_IN_DELAY_RATIO },
};
const CONTENT_FADE_OUT: Layer = { opacity: [0], timing: { duration: UIMotion.dur.fast, ease: 'linear' } };

type GrabHandler = (event: ReactPointerEvent<HTMLElement>) => void;

function collapseRatio(needleSpan: number, panelSpan: number): number {
  return panelSpan > 0 ? needleSpan / panelSpan : NEUTRAL_RATIO;
}

function railTravel(offsetX: number, dismissSign: number): number {
  const along = offsetX * dismissSign;
  return along < 0 ? along / RUBBER_BAND_DIVISOR : along;
}

function railDismisses(travel: number, velocityAlong: number): boolean {
  if (travel >= DISMISS_DISTANCE_PX) return true;
  return travel >= FLICK_DISTANCE_PX && velocityAlong >= DISMISS_VELOCITY_PX_PER_S;
}

function indexStyle(index: number): CSSProperties {
  return { [INDEX_PROPERTY]: Math.min(index, STAGGER_STEPS_MAX) } as CSSProperties;
}

function SupportRailBody({
  actions,
  title,
  status,
  footer,
  children,
  panelId,
  titleId,
  panelRef,
  needleRef,
  onGrab,
  requestClose,
  onSelect,
}: {
  actions: SupportAction[];
  title: string;
  status?: string;
  footer?: ReactNode;
  children?: ReactNode;
  panelId: string;
  titleId: string;
  panelRef: RefObject<HTMLElement>;
  needleRef: RefObject<HTMLElement>;
  onGrab: GrabHandler;
  requestClose: () => void;
  onSelect?: (id: string, action: SupportAction) => void;
}) {
  const bodyRef = useRef<HTMLElement>(null);
  const { isPresent } = usePresence();
  const entry = useOverlayEntry({ nodeRef: panelRef, dismissible: isPresent, requestClose });

  useOutsidePress({ entry, refs: [panelRef, needleRef], enabled: isPresent, onPress: requestClose });
  useReturnFocus(panelRef);

  useLayoutEffect(() => {
    bodyRef.current?.focus({ preventScroll: true });
  }, []);

  const commit = (action: SupportAction) => {
    action.onSelect?.();
    onSelect?.(action.id, action);
  };

  return (
    <Motion
      as="div"
      ref={bodyRef}
      animate={CONTENT_FADE_IN}
      exit={CONTENT_FADE_OUT}
      className="support-rail__body"
      id={panelId}
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <span className="support-rail__grabber" aria-hidden="true" onPointerDown={onGrab}>
        <span className="support-rail__grabber-pill" />
      </span>

      <div className="support-rail__stack">
        <div className="support-rail__header">
          <div className="support-rail__heading">
            <div className="support-rail__title" id={titleId}>
              {title}
            </div>
            {status && <div className="support-rail__status">{status}</div>}
          </div>
          <button type="button" className="support-rail__close" aria-label="Close" onClick={requestClose}>
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M1 1l7 7M8 1l-7 7" />
            </svg>
          </button>
        </div>

        <ul className="support-rail__list">
          {actions.map((action, index) => (
            <li key={action.id}>
              <button
                type="button"
                className="support-rail__row"
                style={indexStyle(index)}
                onClick={() => commit(action)}
              >
                <span className="support-rail__row-icon" aria-hidden="true">
                  {action.icon}
                </span>
                <span className="support-rail__row-text">
                  <span className="support-rail__row-label">{action.label}</span>
                  {action.description && <span className="support-rail__row-note">{action.description}</span>}
                </span>
                {action.meta && <span className="support-rail__row-meta">{action.meta}</span>}
              </button>
            </li>
          ))}
        </ul>

        <div className="support-rail__extra" style={indexStyle(actions.length)}>
          {children}
        </div>

        {footer && (
          <div className="support-rail__footer" style={indexStyle(actions.length + 1)}>
            {footer}
          </div>
        )}
      </div>
    </Motion>
  );
}

export interface SupportRailOwnProps {
  /** The rows, in order. Each renders a button carrying its label, optional description and optional meta. @default [] */
  actions: SupportAction[];
  /** Panel heading, and the panel's accessible name. @default 'Talk to us' */
  title?: string;
  /** Small uppercase mono line under the heading - opening hours, queue depth, a shift note. */
  status?: string;
  /** Container edge the rail pins to. Flips the needle, the collapse origin, the drag axis and the vertical label. @default 'right' */
  side?: 'right' | 'left';
  /** Controlled open state. Omit to stay uncontrolled. */
  open?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes. Pair with `open` for controlled use. */
  onOpenChange?: (open: boolean) => void;
  /** Fires when a row commits - gets its `id` and the full action. The rail stays open; render what happens next in `children`. */
  onSelect?: (id: string, action: SupportAction) => void;
  /** The vertical mono word on the needle. Doubles as the needle's accessible name. @default 'Support' */
  needleLabel?: string;
  /** Availability dot on the needle, with an ambient halo. @default false */
  live?: boolean;
  /** Arbitrary content below the rows; it takes the leftover height and scrolls. */
  children?: ReactNode;
  /** Pinned bottom strip - on-shift avatars, an SLA line, a link out. */
  footer?: ReactNode;
  /** Extra class(es) merged onto the rail root. */
  className?: string;
  /** Inline styles merged onto the rail root - the place to retune the `--support-rail-*` properties. */
  style?: SupportRailStyle;
}

export interface SupportRailProps extends SupportRailOwnProps {
  /** Standard <div> attributes (aria-*, data-*, id, ...) forwarded to the rail root. */
  htmlProps?: Omit<HTMLAttributes<HTMLDivElement>, keyof SupportRailOwnProps> & DataAttributes;
}

export function SupportRail({
  actions = [],
  title = 'Talk to us',
  status,
  side = 'right',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  needleLabel = 'Support',
  live = false,
  children,
  footer,
  className = '',
  style,
  htmlProps,
}: SupportRailProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const rootRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const detach = useRef<(() => void) | null>(null);
  const autoId = useId();
  const panelId = 'support-rail-' + autoId;
  const titleId = panelId + '-title';
  const dismissSign = side === 'right' ? 1 : -1;
  const requestClose = () => setOpen(false);

  const onGrab: GrabHandler = (event) => {
    const root = rootRef.current;
    if (!root || !open || event.button !== 0 || !event.isPrimary) return;
    detach.current?.();
    root.setAttribute(DRAGGING_ATTRIBUTE, '');
    detach.current = startDrag(event, {
      onMove: (info: PanInfo) =>
        root.style.setProperty(DRAG_PROPERTY, railTravel(info.offset.x, dismissSign) * dismissSign + 'px'),
      onEnd: (info: PanInfo) => {
        detach.current = null;
        root.removeAttribute(DRAGGING_ATTRIBUTE);
        const travel = railTravel(info.offset.x, dismissSign);
        if (railDismisses(travel, info.velocity.x * dismissSign)) requestClose();
        else root.style.setProperty(DRAG_PROPERTY, NO_DRAG);
      },
    });
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    const needle = needleRef.current;
    const panel = panelRef.current;
    if (!root || !needle || !panel) return undefined;
    const remeasure = () => {
      root.style.setProperty(COLLAPSE_X_PROPERTY, String(collapseRatio(needle.offsetWidth, panel.offsetWidth)));
      root.style.setProperty(COLLAPSE_Y_PROPERTY, String(collapseRatio(needle.offsetHeight, panel.offsetHeight)));
    };
    remeasure();
    const sizes = new ResizeObserver(remeasure);
    sizes.observe(panel);
    sizes.observe(needle);
    return () => sizes.disconnect();
  }, [side]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !open) return;
    root.style.setProperty(DRAG_PROPERTY, NO_DRAG);
    root.removeAttribute(DRAGGING_ATTRIBUTE);
  }, [open]);

  useLayoutEffect(
    () => () => {
      detach.current?.();
      detach.current = null;
    },
    [],
  );

  return (
    <div
      ref={rootRef}
      className={cx('support-rail', className)}
      style={style}
      data-side={side}
      data-open={open}
      {...htmlProps}
    >
      <button
        type="button"
        ref={needleRef as RefObject<HTMLButtonElement>}
        className="support-rail__needle"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen(!open)}
      >
        {live && <span className="support-rail__live" aria-hidden="true" />}
        <span className="support-rail__needle-label">{needleLabel}</span>
        <span className="support-rail__needle-rule" aria-hidden="true" />
      </button>

      <div ref={panelRef as RefObject<HTMLDivElement>} className="support-rail__panel">
        <Presence>
          {open && (
            <SupportRailBody
              key="body"
              actions={actions}
              title={title}
              status={status}
              footer={footer}
              panelId={panelId}
              titleId={titleId}
              panelRef={panelRef}
              needleRef={needleRef}
              onGrab={onGrab}
              requestClose={requestClose}
              onSelect={onSelect}
            >
              {children}
            </SupportRailBody>
          )}
        </Presence>
      </div>
    </div>
  );
}
