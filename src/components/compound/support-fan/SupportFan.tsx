'use client';

import './support-fan.css';

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import type { DataAttributes } from '../../../dom-props';
import { loop, type Playback } from '../../../engine';
import type { SupportFanStyle } from '../../../tokens/component-styles.generated';
import { useControllable } from '../../internal/hooks/use-controllable';
import { IconSlot } from '../../internal/icon/IconSlot';
import { useOutsidePress, useOverlayEntry } from '../../internal/overlay/layer';
import type { SupportAction } from '../../internal/support/types';
import { cx } from '../../internal/utils/cx';

export type { SupportAction };

export type SupportFanLayout = 'arc' | 'dock' | 'icon-dock';

const TRIGGER_SIZE_FALLBACK = 56;
const CHIP_HEIGHT_FALLBACK = 28;
const CHIP_WIDTH_FALLBACK = 132;
const TRIGGER_GAP = 12;
const CHIP_GAP = 8;
const ARC_TOP_SINE = 0.83;
const ARC_RADIUS_MIN = 120;
const ARC_PUSH = 22;
const AXIS_PUSH = 20;
const BOW_AMPLITUDE = 12;
const PUSH_SOFTNESS = 1.05;
const MAGNIFY_VARIANCE = 2.1;
const MAGNIFY_GAIN = 0.13;
const SPREAD_MIN = 0.35;
const LIFT_STEPS = 8;
const HIT_PAD = 24;
const CAPTION_LIFT = 20;
const CAPTION_NUDGE = 10;
const CAPTION_SEPARATOR = ' · ';
const FOCUS_TAU_MS = 55;
const STRENGTH_RISE_TAU_MS = 90;
const STRENGTH_FALL_TAU_MS = 130;
const SETTLE_EPSILON = 0.0015;
const NAME_BAND = 0.62;
const FOCUS_OVERREACH = 0.9;
const TRIGGER_GLYPH_PATH = 'M9 3.4v11.2M3.4 9h11.2';
const TRIGGER_GLYPH_STROKE = 1.35;
const TRIGGER_GLYPH_BOX = '0 0 18 18';
const NO_INDEX = -1;

const clamp = (value: number, low: number, high: number) => (value < low ? low : value > high ? high : value);
const neutralFocus = (count: number) => (count - 1) / 2;

interface FanMetrics {
  triggerHalf: number;
  chipHeight: number;
  chipWidth: number;
}

interface FanFrame {
  count: number;
  polar: boolean;
  radius: number;
  swing: number;
  angles: number[];
  rest: number[][];
  fibre: number[];
  vertical: boolean;
  along: number[];
  normal: number[];
  push: number;
  hit: number[];
  caption: number[];
}

interface FanField {
  focus: number;
  focusTarget: number;
  strength: number;
  strengthTarget: number;
}

interface FanTuning {
  glide: number;
  magnify: number;
  bow: number;
  spread: number;
}

const EMPTY_FRAME: FanFrame = {
  count: 0,
  polar: false,
  radius: 0,
  swing: 1,
  angles: [],
  rest: [],
  fibre: [],
  vertical: true,
  along: [0, 0],
  normal: [0, 0],
  push: 0,
  hit: [0, 0, 0, 0],
  caption: [0, 0],
};

function readMetrics(trigger: HTMLElement | null, chips: (HTMLElement | null)[], count: number): FanMetrics {
  let height = 0;
  let width = 0;
  for (let i = 0; i < count; i++) {
    const chip = chips[i];
    if (!chip) continue;
    height = Math.max(height, chip.offsetHeight);
    width = Math.max(width, chip.offsetWidth);
  }
  return {
    triggerHalf: (trigger && trigger.offsetWidth ? trigger.offsetWidth : TRIGGER_SIZE_FALLBACK) / 2,
    chipHeight: height || CHIP_HEIGHT_FALLBACK,
    chipWidth: width || CHIP_WIDTH_FALLBACK,
  };
}

function envelope(rest: number[][], metrics: FanMetrics): FanFrame['hit'] {
  let left = 0;
  let right = 0;
  let top = 0;
  let bottom = 0;
  for (const [x, y] of rest) {
    left = Math.min(left, x - metrics.chipWidth);
    right = Math.max(right, x);
    top = Math.min(top, y - metrics.chipHeight / 2);
    bottom = Math.max(bottom, y + metrics.chipHeight / 2);
  }
  return [left - HIT_PAD, top - HIT_PAD, right - left + HIT_PAD * 2, bottom - top + HIT_PAD * 2];
}

function captionSeat(rest: number[][], metrics: FanMetrics): number[] {
  let right = 0;
  let top = 0;
  for (const [x, y] of rest) {
    right = Math.max(right, x);
    top = Math.min(top, y - metrics.chipHeight / 2);
  }
  return [right + CAPTION_NUDGE, top - CAPTION_LIFT];
}

function buildFrame(layout: SupportFanLayout, count: number, metrics: FanMetrics): FanFrame {
  if (count < 1) return EMPTY_FRAME;
  const reach = metrics.triggerHalf + TRIGGER_GAP;
  const lift = reach + metrics.chipHeight / 2;
  const pitch = metrics.chipHeight + CHIP_GAP;
  const shell = { count };

  if (layout === 'icon-dock') {
    const stride = metrics.chipWidth + CHIP_GAP;
    const rest = Array.from({ length: count }, (_, i) => [-(reach + i * stride), 0]);
    return {
      ...shell,
      polar: false,
      radius: 0,
      swing: 1,
      angles: [],
      rest,
      fibre: rest.map(([x]) => x - metrics.chipWidth / 2),
      vertical: false,
      along: [-1, 0],
      normal: [0, -1],
      push: AXIS_PUSH,
      hit: envelope(rest, metrics),
      caption: captionSeat(rest, metrics),
    };
  }

  if (layout === 'dock') {
    const rest = Array.from({ length: count }, (_, i) => [metrics.triggerHalf, -(lift + i * pitch)]);
    return {
      ...shell,
      polar: false,
      radius: 0,
      swing: 1,
      angles: [],
      rest,
      fibre: rest.map(([, y]) => y),
      vertical: true,
      along: [0, -1],
      normal: [-1, 0],
      push: AXIS_PUSH,
      hit: envelope(rest, metrics),
      caption: captionSeat(rest, metrics),
    };
  }

  const span = lift + pitch * (count - 1);
  const radius = Math.max(ARC_RADIUS_MIN, span / ARC_TOP_SINE);
  const angles = Array.from({ length: count }, (_, i) => {
    const height = lift + i * pitch;
    return Math.atan2(height, -Math.sqrt(radius * radius - height * height));
  });
  const rest = angles.map((angle) => [radius * Math.cos(angle), -radius * Math.sin(angle)]);
  return {
    ...shell,
    polar: true,
    radius,
    swing: angles[count - 1] >= angles[0] ? 1 : -1,
    angles,
    rest,
    fibre: rest.map(([, y]) => y),
    vertical: true,
    along: [0, 0],
    normal: [0, 0],
    push: ARC_PUSH,
    hit: envelope(rest, metrics),
    caption: captionSeat(rest, metrics),
  };
}

function place(frame: FanFrame, index: number, push: number, out: number): number[] {
  if (frame.polar) {
    const angle = frame.angles[index] + (frame.swing * push) / frame.radius;
    const radius = frame.radius + out;
    return [radius * Math.cos(angle), -radius * Math.sin(angle)];
  }
  const [x, y] = frame.rest[index];
  return [x + frame.along[0] * push + frame.normal[0] * out, y + frame.along[1] * push + frame.normal[1] * out];
}

function invIndex(table: number[], value: number): number {
  const last = table.length - 1;
  if (last < 1) return 0;
  const descending = table[last] < table[0];
  const at = (k: number) => (descending ? -table[k] : table[k]);
  const probe = descending ? -value : value;
  if (probe <= at(0)) return (probe - at(0)) / (at(1) - at(0));
  for (let k = 0; k < last; k++) if (probe <= at(k + 1)) return k + (probe - at(k)) / (at(k + 1) - at(k));
  return last + (probe - at(last)) / (at(last) - at(last - 1));
}

function focusFor(frame: FanFrame, x: number, y: number): number {
  const raw = invIndex(frame.fibre, frame.vertical ? y : x);
  return clamp(raw, -FOCUS_OVERREACH, frame.count - 1 + FOCUS_OVERREACH);
}

function paint(frame: FanFrame, field: FanField, tuning: FanTuning, glides: (HTMLElement | null)[]): void {
  const scaleAmp = tuning.magnify * field.strength;
  const glideAmp = tuning.glide * field.strength;
  const bowAmp = tuning.bow * BOW_AMPLITUDE * field.strength;
  const spread = Math.max(SPREAD_MIN, tuning.spread);
  const bowVariance = 2 * spread * spread;
  const stack = Math.min(1, Math.max(scaleAmp, glideAmp));
  for (let i = 0; i < frame.count; i++) {
    const el = glides[i];
    if (!el) continue;
    const offset = i - field.focus;
    const near = Math.exp(-(offset * offset) / MAGNIFY_VARIANCE);
    const bowed = Math.exp(-(offset * offset) / bowVariance);
    const push = glideAmp * frame.push * Math.tanh(offset / PUSH_SOFTNESS);
    const [x, y] = place(frame, i, push, bowAmp * bowed);
    const [restX, restY] = frame.rest[i];
    el.style.translate = `${(x - restX).toFixed(2)}px ${(y - restY).toFixed(2)}px`;
    el.style.scale = (1 + scaleAmp * MAGNIFY_GAIN * near).toFixed(4);
    el.style.zIndex = String(1 + Math.round(LIFT_STEPS * near * stack));
  }
}

function FanDismiss({
  fieldRef,
  triggerRef,
  onEscape,
  onOutside,
}: {
  fieldRef: RefObject<HTMLDivElement>;
  triggerRef: RefObject<HTMLButtonElement>;
  onEscape: () => void;
  onOutside: () => void;
}): ReactNode {
  const entry = useOverlayEntry({ nodeRef: fieldRef, dismissible: true, requestClose: onEscape });
  useOutsidePress({ entry, refs: [fieldRef, triggerRef], enabled: true, onPress: onOutside });
  useEffect(
    () => () => {
      if (fieldRef.current) fieldRef.current.style.zIndex = '';
    },
    [fieldRef],
  );
  return null;
}

export interface SupportFanProps {
  /** The chips the fan deploys, in order from the trigger outwards. */
  actions: SupportAction[];
  /** `arc` fans the chips onto a circle centred on the trigger, `dock` stacks them straight
   *  with their metadata, `icon-dock` runs a row of icon-only chips sideways. @default 'arc' */
  layout?: SupportFanLayout;
  /** Controlled open state. Omit to stay uncontrolled. */
  open?: boolean;
  /** Initial state when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Fires whenever the open state changes. Pair with `open` for controlled use. */
  onOpenChange?: (open: boolean) => void;
  /** Fires when a chip commits - gets its `id` and the full action. Committing closes the fan. */
  onSelect?: (id: string, action: SupportAction) => void;
  /** The resting line above the row. Pointing at or focusing a chip replaces it with the
   *  action's label and its `meta` (or `description`). */
  caption?: string;
  /** How far the row slides away from the pointer, as a multiple of the layout's own step. @default 1 */
  glide?: number;
  /** How much the chip under the pointer swells. Deliberately small - the glide carries it. @default 1 */
  magnify?: number;
  /** How far the focused chip bows off the row, along the row's normal. @default 1 */
  bow?: number;
  /** Width of the bow's gaussian - 0.6 pops one chip out of line, 3 sweeps the whole row. @default 1.45 */
  spread?: number;
  /** Accessible name for the trigger and for the deployed menu. @default 'Support' */
  label?: string;
  /** Glyph inside the trigger; it turns 135 degrees while the fan is open. @default a plus sign */
  triggerIcon?: ReactNode;
  /** Availability dot on the trigger, shown while the fan is closed. @default true */
  live?: boolean;
  /** Extra class(es) merged onto the root. Override `position` here to pin the fan to the viewport. */
  className?: string;
  /** Inline styles merged onto the root - the place to retune the `--support-fan-*` properties. */
  style?: SupportFanStyle;
  /** Standard <div> attributes (aria-*, data-*, title, ...) forwarded to the root. */
  htmlProps?: HTMLAttributes<HTMLDivElement> & DataAttributes;
}

export function SupportFan({
  actions = [],
  layout = 'arc',
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  caption,
  glide = 1,
  magnify = 1,
  bow = 1,
  spread = 1.45,
  label = 'Support',
  triggerIcon,
  live = true,
  className = '',
  style,
  htmlProps,
}: SupportFanProps) {
  const [open, setOpen] = useControllable(controlledOpen, defaultOpen, onOpenChange);
  const [active, setActive] = useState(NO_INDEX);
  const [named, setNamed] = useState(NO_INDEX);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const glideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const frameRef = useRef<FanFrame>(EMPTY_FRAME);
  const fieldStateRef = useRef<FanField>({ focus: 0, focusTarget: 0, strength: 0, strengthTarget: 0 });
  const playbackRef = useRef<Playback>(null);
  const pendingFocusRef = useRef(NO_INDEX);
  const dismissedRef = useRef(false);
  const activeRef = useRef(NO_INDEX);
  const tuningRef = useRef<FanTuning>({ glide, magnify, bow, spread });
  tuningRef.current = { glide, magnify, bow, spread };
  activeRef.current = active;

  const autoId = useId();
  const fieldId = 'support-fan-' + autoId;
  const count = actions.length;
  const showLabel = layout !== 'icon-dock';
  const showMeta = layout === 'dock';
  const iconSize = layout === 'icon-dock' ? 'md' : 'sm';

  const render = () => paint(frameRef.current, fieldStateRef.current, tuningRef.current, glideRefs.current);

  const settle = () => {
    const field = fieldStateRef.current;
    field.focus = neutralFocus(frameRef.current.count);
    field.strength = 0;
    render();
  };

  const ensureRunning = () => {
    if (playbackRef.current) return;
    playbackRef.current = loop(
      (_step, dt) => {
        const field = fieldStateRef.current;
        field.focus += (field.focusTarget - field.focus) * (1 - Math.exp(-dt / FOCUS_TAU_MS));
        const tau = field.strengthTarget > field.strength ? STRENGTH_RISE_TAU_MS : STRENGTH_FALL_TAU_MS;
        field.strength += (field.strengthTarget - field.strength) * (1 - Math.exp(-dt / tau));
        const rested =
          Math.abs(field.focusTarget - field.focus) < SETTLE_EPSILON &&
          Math.abs(field.strengthTarget - field.strength) < SETTLE_EPSILON;
        if (rested) {
          field.focus = field.focusTarget;
          field.strength = field.strengthTarget;
        }
        render();
        if (rested) {
          const playback = playbackRef.current;
          playbackRef.current = null;
          if (playback) playback.stop();
        }
      },
      { el: hitRef.current, claims: ['translate', 'scale'], snap: settle },
    );
  };

  const relayout = () => {
    const frame = buildFrame(layout, count, readMetrics(triggerRef.current, chipRefs.current, count));
    frameRef.current = frame;
    const hit = hitRef.current;
    if (hit) {
      hit.style.setProperty('--support-fan-hit-x', `${frame.hit[0].toFixed(2)}px`);
      hit.style.setProperty('--support-fan-hit-y', `${frame.hit[1].toFixed(2)}px`);
      hit.style.setProperty('--support-fan-hit-w', `${frame.hit[2].toFixed(2)}px`);
      hit.style.setProperty('--support-fan-hit-h', `${frame.hit[3].toFixed(2)}px`);
    }
    for (let i = 0; i < frame.count; i++) {
      const slot = slotRefs.current[i];
      if (!slot) continue;
      slot.style.setProperty('--support-fan-x', `${frame.rest[i][0].toFixed(2)}px`);
      slot.style.setProperty('--support-fan-y', `${frame.rest[i][1].toFixed(2)}px`);
    }
    const seat = captionRef.current;
    if (seat) {
      seat.style.setProperty('--support-fan-x', `${frame.caption[0].toFixed(2)}px`);
      seat.style.setProperty('--support-fan-y', `${frame.caption[1].toFixed(2)}px`);
    }
    render();
  };

  const aim = (index: number) => {
    const field = fieldStateRef.current;
    field.focusTarget = index;
    field.strengthTarget = 1;
    ensureRunning();
  };

  const release = () => {
    const field = fieldStateRef.current;
    field.strengthTarget = 0;
    field.focusTarget = neutralFocus(frameRef.current.count);
    if (field.strength === 0) {
      field.focus = field.focusTarget;
      render();
      return;
    }
    ensureRunning();
  };

  const track = (event: ReactPointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!open || frame.count < 1 || !stage) return;
    const box = stage.getBoundingClientRect();
    const field = fieldStateRef.current;
    const focus = focusFor(frame, event.clientX - box.left, event.clientY - box.top);
    field.focusTarget = focus;
    field.strengthTarget = 1;
    const nearest = Math.round(focus);
    const inBand = nearest >= 0 && nearest < frame.count && Math.abs(focus - nearest) < NAME_BAND;
    setNamed(inBand ? nearest : NO_INDEX);
    ensureRunning();
  };

  const leave = () => {
    if (activeRef.current >= 0) {
      aim(activeRef.current);
      return;
    }
    setNamed(NO_INDEX);
    release();
  };

  const focusChip = (index: number) => {
    const chip = chipRefs.current[index];
    if (chip) chip.focus();
    setActive(index);
    setNamed(index);
    activeRef.current = index;
    aim(index);
  };

  const show = (seed: number) => {
    pendingFocusRef.current = seed;
    setOpen(true);
  };

  const dismiss = (returnFocus: boolean) => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setOpen(false);
    if (returnFocus && triggerRef.current) triggerRef.current.focus();
  };

  const commit = (index: number) => {
    const action = actions[index];
    if (!action) return;
    if (action.onSelect) action.onSelect();
    if (onSelect) onSelect(action.id, action);
    dismiss(true);
  };

  const onTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (open || count < 1 || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
    event.preventDefault();
    show(event.key === 'ArrowDown' ? 0 : count - 1);
  };

  const onFieldKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (count < 1) return;
    const from = activeRef.current;
    let next = NO_INDEX;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = from < 0 ? 0 : (from + 1) % count;
    else if (event.key === 'ArrowDown' || event.key === 'ArrowRight')
      next = from < 0 ? count - 1 : (from - 1 + count) % count;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = count - 1;
    else return;
    event.preventDefault();
    focusChip(next);
  };

  const onStageBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!open) return;
    const next = event.relatedTarget as Node | null;
    if (next && rootRef.current && rootRef.current.contains(next)) return;
    dismiss(false);
  };

  useLayoutEffect(() => {
    dismissedRef.current = false;
  });

  useLayoutEffect(relayout, [layout, count]);

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return undefined;
    const watcher = new ResizeObserver(relayout);
    if (triggerRef.current) watcher.observe(triggerRef.current);
    for (let i = 0; i < count; i++) {
      const chip = chipRefs.current[i];
      if (chip) watcher.observe(chip);
    }
    return () => watcher.disconnect();
  }, [layout, count]);

  useLayoutEffect(() => {
    if (!open) {
      setActive(NO_INDEX);
      setNamed(NO_INDEX);
      activeRef.current = NO_INDEX;
      release();
      return;
    }
    const seed = pendingFocusRef.current;
    pendingFocusRef.current = NO_INDEX;
    if (seed >= 0 && seed < count) focusChip(seed);
  }, [open]);

  useEffect(
    () => () => {
      const playback = playbackRef.current;
      playbackRef.current = null;
      if (playback) playback.stop();
    },
    [],
  );

  const namedAction = named >= 0 ? actions[named] : null;
  const captionText = namedAction
    ? [namedAction.label, namedAction.meta || namedAction.description].filter(Boolean).join(CAPTION_SEPARATOR)
    : caption || '';

  return (
    <div
      ref={rootRef}
      className={cx('support-fan', className)}
      style={style}
      data-open={open ? 'true' : 'false'}
      data-layout={layout}
      {...htmlProps}
    >
      <div
        ref={stageRef}
        className="support-fan__stage"
        inert={!open}
        onPointerEnter={track}
        onPointerMove={track}
        onPointerLeave={leave}
        onBlur={onStageBlur}
      >
        <div ref={hitRef} className="support-fan__hit" aria-hidden="true" />
        <div
          ref={fieldRef}
          id={fieldId}
          className="support-fan__field"
          role="menu"
          aria-label={label}
          aria-orientation={layout === 'icon-dock' ? 'horizontal' : 'vertical'}
          onKeyDown={onFieldKeyDown}
        >
          {actions.map((action, i) => (
            <div
              key={action.id}
              ref={(node) => {
                slotRefs.current[i] = node;
              }}
              className="support-fan__slot"
              role="presentation"
              style={
                { '--support-fan-index': String(i), '--support-fan-index-out': String(count - 1 - i) } as CSSProperties
              }
            >
              <div
                ref={(node) => {
                  glideRefs.current[i] = node;
                }}
                className="support-fan__glide"
                role="presentation"
              >
                <button
                  ref={(node) => {
                    chipRefs.current[i] = node;
                  }}
                  type="button"
                  role="menuitem"
                  className="support-fan__chip"
                  tabIndex={open && (active < 0 ? i === 0 : active === i) ? 0 : -1}
                  aria-label={showLabel ? undefined : action.label}
                  onClick={() => commit(i)}
                  onFocus={() => focusChip(i)}
                >
                  {action.icon ? (
                    <span className="support-fan__icon">
                      <IconSlot size={iconSize}>{action.icon}</IconSlot>
                    </span>
                  ) : null}
                  {showLabel ? <span className="support-fan__label">{action.label}</span> : null}
                  {showMeta && action.meta ? <span className="support-fan__meta">{action.meta}</span> : null}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div
          ref={captionRef}
          className="support-fan__slot support-fan__caption"
          style={{ '--support-fan-index': String(count), '--support-fan-index-out': '0' } as CSSProperties}
        >
          {captionText}
        </div>
      </div>
      <button
        ref={triggerRef}
        type="button"
        className="support-fan__trigger"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? fieldId : undefined}
        onClick={() => (open ? dismiss(false) : show(NO_INDEX))}
        onKeyDown={onTriggerKeyDown}
      >
        <span className="support-fan__ring" aria-hidden="true" />
        {live ? <span className="support-fan__live" aria-hidden="true" /> : null}
        <span className="support-fan__glyph">
          <IconSlot size="sm">
            {triggerIcon || (
              <svg
                viewBox={TRIGGER_GLYPH_BOX}
                fill="none"
                stroke="currentColor"
                strokeWidth={TRIGGER_GLYPH_STROKE}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d={TRIGGER_GLYPH_PATH} />
              </svg>
            )}
          </IconSlot>
        </span>
      </button>
      {open ? (
        <FanDismiss
          fieldRef={fieldRef}
          triggerRef={triggerRef}
          onEscape={() => dismiss(true)}
          onOutside={() => dismiss(false)}
        />
      ) : null}
    </div>
  );
}
