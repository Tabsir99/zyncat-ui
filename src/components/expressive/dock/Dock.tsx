'use client';

import './dock.css';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from 'react';

import type { DataAttributes } from '../../../dom-props';
import { loop, type Playback } from '../../../engine';
import type { DockStyle } from '../../../tokens/component-styles.generated';
import { UIMotion } from '../../../tokens/motion-tokens';
import { cx } from '../../internal/utils/cx';

export type DockOrientation = 'horizontal' | 'vertical';
export type DockAlign = 'start' | 'center' | 'end';

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const SPRING_MASS = 0.1;
const SPRING_STIFFNESS = 150;
const SPRING_DAMPING = 12;
const MS_PER_SECOND = 1000;
const MAX_SUBSTEP_MS = 8;
const SETTLE_SIZE = 0.05;
const SETTLE_VELOCITY = 0.5;
const PAINT_PRECISION = 100;
const AWAY = Infinity;
const SIZE_PROPERTY = '--dock-item-size';

interface DockUnit {
  el: HTMLElement;
  centre: number;
  size: number;
  velocity: number;
  painted: number;
}

interface DockPointerField {
  pointer: number;
  vertical: boolean;
  rest: number;
  peak: number;
  reach: number;
}

interface DockRegistry {
  register: (el: HTMLElement) => () => void;
}

const DockContext = createContext<DockRegistry | null>(null);

function magnifiedSize(field: DockPointerField, centre: number): number {
  const offset = Math.abs(field.pointer - centre);
  if (offset >= field.reach) return field.rest;
  return field.peak + (field.rest - field.peak) * (offset / field.reach);
}

function integrate(unit: DockUnit, target: number, dt: number): void {
  const steps = Math.max(1, Math.ceil(dt / MAX_SUBSTEP_MS));
  const h = dt / MS_PER_SECOND / steps;
  for (let i = 0; i < steps; i++) {
    const accel = (SPRING_STIFFNESS * (target - unit.size) - SPRING_DAMPING * unit.velocity) / SPRING_MASS;
    unit.velocity += accel * h;
    unit.size += unit.velocity * h;
  }
}

function paint(unit: DockUnit, rest: number): void {
  const size = Math.round(unit.size * PAINT_PRECISION) / PAINT_PRECISION;
  if (size === unit.painted) return;
  unit.painted = size;
  if (size === rest) unit.el.style.removeProperty(SIZE_PROPERTY);
  else unit.el.style.setProperty(SIZE_PROPERTY, `${size}px`);
}

export interface DockOwnProps {
  /** `DockItem` children. Anything else renders untouched and never magnifies. */
  children?: ReactNode;
  /** Axis the rail runs along, and the pointer axis the magnification reads. @default 'horizontal' */
  orientation?: DockOrientation;
  /** Cross-axis alignment of the items inside the rail. @default 'center' */
  align?: DockAlign;
  /** Resting box of one item, in pixels. @default 40 */
  size?: number;
  /** Box of the item directly under the pointer, in pixels. @default 60 */
  magnification?: number;
  /** How far along the axis the swell reaches, in pixels. Nothing past it moves. @default 140 */
  distance?: number;
  /** Holds every item at `size`, keeping the rail and its hover states without the swell. @default false */
  disableMagnification?: boolean;
  /** Extra class(es) merged onto the root. */
  className?: string;
  /** Inline styles merged onto the root. */
  style?: DockStyle;
}

export interface DockProps extends DockOwnProps {
  /** Standard <div> attributes (role, aria-*, data-*, onKeyDown, ...) forwarded to the root. */
  htmlProps?: Omit<HTMLAttributes<HTMLDivElement>, keyof DockOwnProps> & DataAttributes;
}

export function Dock({
  children,
  orientation = 'horizontal',
  align = 'center',
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  disableMagnification = false,
  className = '',
  style,
  htmlProps,
}: DockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const unitsRef = useRef<DockUnit[]>([]);
  const playbackRef = useRef<Playback>(null);
  const fieldRef = useRef<DockPointerField>({
    pointer: AWAY,
    vertical: orientation === 'vertical',
    rest: size,
    peak: magnification,
    reach: distance,
  });

  const field = fieldRef.current;
  field.vertical = orientation === 'vertical';
  field.rest = size;
  field.peak = disableMagnification ? size : magnification;
  field.reach = distance;

  const registry = useMemo<DockRegistry>(
    () => ({
      register(el) {
        const unit: DockUnit = { el, centre: 0, size: fieldRef.current.rest, velocity: 0, painted: NaN };
        unitsRef.current.push(unit);
        return () => {
          const units = unitsRef.current;
          const at = units.indexOf(unit);
          if (at >= 0) units.splice(at, 1);
          el.style.removeProperty(SIZE_PROPERTY);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || UIMotion.reduced) return undefined;

    const settle = () => {
      for (const unit of unitsRef.current) {
        unit.size = fieldRef.current.rest;
        unit.velocity = 0;
        unit.painted = NaN;
        paint(unit, fieldRef.current.rest);
      }
    };

    const park = () => {
      const playback = playbackRef.current;
      if (!playback) return;
      playbackRef.current = null;
      playback.stop();
    };

    const frame = (_k: number, dt: number) => {
      const live = fieldRef.current;
      const units = unitsRef.current;
      for (const unit of units) {
        const box = unit.el.getBoundingClientRect();
        unit.centre = live.vertical ? box.top + box.height / 2 : box.left + box.width / 2;
      }
      let rested = true;
      for (const unit of units) {
        const target = magnifiedSize(live, unit.centre);
        integrate(unit, target, dt);
        if (Math.abs(target - unit.size) > SETTLE_SIZE || Math.abs(unit.velocity) > SETTLE_VELOCITY) rested = false;
        else {
          unit.size = target;
          unit.velocity = 0;
        }
        paint(unit, live.rest);
      }
      if (rested && live.pointer === AWAY) park();
    };

    const run = () => {
      if (playbackRef.current) return;
      playbackRef.current = loop(frame, { el: root, snap: settle });
    };

    const controller = new AbortController();
    const { signal } = controller;
    root.addEventListener(
      'pointermove',
      (event) => {
        const live = fieldRef.current;
        live.pointer = live.vertical ? event.clientY : event.clientX;
        run();
      },
      { signal },
    );
    const withdraw = () => {
      fieldRef.current.pointer = AWAY;
      run();
    };
    root.addEventListener('pointerleave', withdraw, { signal });
    root.addEventListener('pointercancel', withdraw, { signal });

    return () => {
      controller.abort();
      park();
    };
  }, []);

  const rail = { ...style, '--dock-size': `${size}px` } as CSSProperties;

  return (
    <DockContext.Provider value={registry}>
      <div
        ref={rootRef}
        className={cx(
          'dock',
          orientation === 'vertical' && 'dock--vertical',
          align !== 'center' && `dock--${align}`,
          className,
        )}
        style={rail}
        {...htmlProps}
      >
        {children}
      </div>
    </DockContext.Provider>
  );
}

export interface DockItemOwnProps {
  /** The tile's content - an icon, a link, a button. Centred inside the magnified box. */
  children?: ReactNode;
  /** Extra class(es) merged onto the item. */
  className?: string;
  /** Inline styles merged onto the item. */
  style?: DockStyle;
}

export interface DockItemProps extends DockItemOwnProps {
  /** Standard <div> attributes (aria-*, data-*, onPointerEnter, ...) forwarded to the item. */
  htmlProps?: Omit<HTMLAttributes<HTMLDivElement>, keyof DockItemOwnProps> & DataAttributes;
}

export function DockItem({ children, className = '', style, htmlProps }: DockItemProps) {
  const itemRef: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement>(null);
  const registry = useContext(DockContext);

  useEffect(() => {
    const el = itemRef.current;
    if (!el || !registry) return undefined;
    return registry.register(el);
  }, [registry]);

  return (
    <div ref={itemRef} className={cx('dock__item', className)} style={style} {...htmlProps}>
      <span className="dock__glyph" role="presentation">
        {children}
      </span>
    </div>
  );
}
