'use client';

// Tabs.tsx - line tabs for view switching on a hairline baseline; a single accent ink
// marks the active view. `TabPanel` is the matching content wrapper (aria wiring +
// directional entrance). Styling lives in tabs.css; this file composes classes and
// drives two implicit motions - consumers configure neither:
//
// 1 - "the ink reaches, then releases" (selection). One persistent ink node: the edge
//     facing the destination travels first (ease-standard), then the trailing edge
//     releases and settles (ease-entrance). Motion keyframes on x + measured width -
//     the destination width is unknowable to transforms, and scaleX would distort the
//     radius. Interrupts restart from the ink's LIVE rect, never the last target.
//     Reduced motion collapses to an instant set.
// 2 - the gliding hover: one persistent pill (../motion/glide) that fades in under the
//     first tab the pointer touches, springs between tab pads as it moves (disabled
//     tabs and gaps hold it), and fades out where it rests when the pointer leaves.
//
// Keyboard (WAI-ARIA tabs, automatic activation): roving tabindex; left/right arrows
// cycle (wrapping, skipping disabled), Home/End jump; selection follows focus.
// Overflow is honest: the row scrolls, clipped edges fade (data-fade from scroll
// geometry), and the selected tab is kept in view.

import './tabs.css';
import {
  useId,
  useLayoutEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { animate } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { IconSlot } from '../icon/IconSlot';
import { GlidePill, useGlide } from '../motion/glide';
import { useScrollEdges } from '../use-scroll-edges';

const SM = UIMotion;

/** One tab in the row. */
export interface TabItem {
  /** Stable identity - also used in the tab/panel id pair. */
  value: string;
  /** Visible tab text. */
  label: ReactNode;
  /** Leading icon - your own node. */
  icon?: ReactNode;
  /** Rendered mono + tabular. Pass a number or a preformatted string. */
  count?: number | string;
  /** Dims the tab, blocks selection, and skips it during arrow-key travel. */
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The tab row, in order. @default [] */
  items: TabItem[];
  /** Controlled - the value of the active tab (null/undefined hides the ink). */
  value: string | null | undefined;
  /**
   * Fires on click and on arrow-key travel (automatic activation).
   * `dir` is the direction of travel (+1 right / -1 left) - hand it to
   * TabPanel so content enters from the side the user moved toward.
   */
  onChange?: (value: string, dir: 1 | -1) => void;
  /**
   * Shared id prefix wiring tab and panel aria. Give Tabs and its TabPanel the
   * same `name`; omit it when the tabs have no managed panel.
   */
  name?: string;
  /** aria-label for the tablist (e.g. "Section views"). */
  label?: string;
}

/* Scroll-geometry constants (px) - measurement math, not styling.
   EDGE_PAD ~ --space-6: breathing room kept between the selected tab and a
   faded edge. ENTER_X: TabPanel's entrance travel (bespoke motion geometry,
   like Tooltip's offsets - there is no spatial motion token). */
const TABS_EDGE_PAD = 24;
const TABS_ENTER_X = 10;

export function Tabs({
  items = [],
  value,
  onChange,
  name,
  label,
  className = '',
  ...rest
}: TabsProps) {
  const autoId = useId();
  const base = name || autoId;

  const listRef = useRef<HTMLDivElement>(null);
  const inkRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const placedRef = useRef(false);
  const valueRef = useRef(value);
  valueRef.current = value;

  /* The gliding hover - one persistent pill; fresh entry fades in place,
     leaving the list fades it out where it rests (glide.tsx owns both). */
  const glide = useGlide(listRef);

  /* Place the ink under the active tab - instantly (mount, resize, reduced
     motion) or as the reach-then-release travel. Coordinates are offsetLeft
     space (layout, scroll-independent) since the ink lives in the scroller. */
  const place = (animated: boolean) => {
    const list = listRef.current,
      ink = inkRef.current;
    const el = valueRef.current != null ? tabRefs.current[valueRef.current] : null;
    if (!list || !ink) return;
    if (animRef.current) animRef.current.stop();
    if (!el) {
      ink.style.opacity = '0';
      placedRef.current = false;
      return;
    }
    const next = { x: el.offsetLeft, w: el.offsetWidth };
    ink.style.opacity = '1';

    if (!animated || !placedRef.current || SM.reduced) {
      ink.style.transform = 'translateX(' + next.x + 'px)';
      ink.style.width = next.w + 'px';
    } else {
      /* start from the LIVE rect so an interrupted travel never jumps back */
      const lr = list.getBoundingClientRect();
      const ir = ink.getBoundingClientRect();
      const cur = { x: ir.left - lr.left + list.scrollLeft, w: ir.width };
      if (Math.abs(cur.x - next.x) > 0.5 || Math.abs(cur.w - next.w) > 0.5) {
        const dir = next.x + next.w / 2 >= cur.x + cur.w / 2 ? 1 : -1;
        const span = dir === 1 ? next.x + next.w - cur.x : cur.x + cur.w - next.x;
        const kf =
          dir === 1
            ? {
                x: [cur.x, cur.x, next.x],
                width: [cur.w, span, next.w],
              } /* right edge reaches, left releases */
            : {
                x: [cur.x, next.x, next.x],
                width: [cur.w, span, next.w],
              }; /* left edge reaches, right releases */
        animRef.current = animate(ink, kf, {
          duration: SM.dur.slow,
          times: [0, 0.55, 1],
          ease: [SM.ease.standard, SM.ease.entrance],
        });
      }
    }
    placedRef.current = true;
  };

  /* Edge fades: data-fade="start end" on the list, from scroll geometry. */
  const syncEdges = useScrollEdges(listRef, (edges, el) => {
    el.dataset.fade = ((edges.left ? 'start ' : '') + (edges.right ? 'end' : '')).trim();
  });

  /* Selection drives the travel + keeps the active tab clear of a faded edge. */
  useLayoutEffect(() => {
    place(true);
    const l = listRef.current,
      el = value != null ? tabRefs.current[value] : null;
    if (l && el && l.scrollWidth > l.clientWidth) {
      const behavior: ScrollBehavior = SM.reduced ? 'auto' : 'smooth';
      if (el.offsetLeft < l.scrollLeft + TABS_EDGE_PAD) {
        l.scrollTo({ left: el.offsetLeft - TABS_EDGE_PAD, behavior });
      } else if (el.offsetLeft + el.offsetWidth > l.scrollLeft + l.clientWidth - TABS_EDGE_PAD) {
        l.scrollTo({
          left: el.offsetLeft + el.offsetWidth - l.clientWidth + TABS_EDGE_PAD,
          behavior,
        });
      }
    }
  }, [value]);

  /* Any size change (fonts arriving, container resize, label edits) re-seats
     the ink instantly and re-derives the edge fades. */
  useLayoutEffect(() => {
    const ro = new ResizeObserver(() => {
      place(false);
      syncEdges();
    });
    if (listRef.current) ro.observe(listRef.current);
    Object.values(tabRefs.current).forEach((el) => el && ro.observe(el));
    syncEdges();
    return () => ro.disconnect();
  }, [items.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const select = (v: string) => {
    if (v === value || !onChange) return;
    const idx = (x: string | null | undefined) => items.findIndex((i) => i.value === x);
    onChange(v, idx(v) >= idx(value) ? 1 : -1);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const enabled = items.filter((i) => !i.disabled);
    if (!enabled.length) return;
    let next: TabItem | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const step = e.key === 'ArrowRight' ? 1 : -1;
      const i = enabled.findIndex((it) => it.value === value);
      next = enabled[(i + step + enabled.length) % enabled.length];
    } else if (e.key === 'Home') {
      next = enabled[0];
    } else if (e.key === 'End') {
      next = enabled[enabled.length - 1];
    }
    if (!next) return;
    e.preventDefault();
    select(next.value);
    const el = tabRefs.current[next.value];
    if (el) el.focus();
  };

  /* Roving tabindex - the selected tab is the stop; if nothing is selected
     yet, the first enabled tab takes it so the list stays reachable. */
  const focusValue = items.some((i) => i.value === value && !i.disabled)
    ? value
    : (items.find((i) => !i.disabled) || ({} as Partial<TabItem>)).value;

  return (
    <div className={('tabs ' + className).trim()} {...rest}>
      <div
        className="tabs__list"
        role="tablist"
        aria-label={label}
        ref={listRef}
        onKeyDown={onKeyDown}
        onPointerLeave={glide.leave}
      >
        <GlidePill className="tab__hover" rect={glide.rect} active={glide.active} />
        {items.map((it) => {
          const selected = it.value === value;
          return (
            <button
              key={it.value}
              type="button"
              role="tab"
              id={base + '-tab-' + it.value}
              aria-selected={selected}
              aria-controls={name ? name + '-panel-' + it.value : undefined}
              tabIndex={it.value === focusValue ? 0 : -1}
              disabled={it.disabled}
              className={'tab' + (selected ? ' is-selected' : '')}
              ref={(el) => {
                tabRefs.current[it.value] = el;
              }}
              onClick={() => select(it.value)}
              onPointerEnter={
                it.disabled
                  ? undefined
                  : /* the pill covers the pad (the visual pill), not the taller hit target */
                    (e) => glide.enter(e.currentTarget.firstElementChild as HTMLElement)
              }
            >
              <span className="tab__pad">
                {it.icon && <IconSlot size="sm">{it.icon}</IconSlot>}
                <span className="tab__label">{it.label}</span>
                {it.count != null && <span className="tab__count">{it.count}</span>}
              </span>
            </button>
          );
        })}
        <span className="tabs__ink" key="ink" ref={inkRef} aria-hidden="true"></span>
      </div>
    </div>
  );
}

export interface TabPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'dir'> {
  /** The active tab's value - changing it cuts to the new content. */
  tab: string;
  /** Same `name` as the paired Tabs - wires role/id/aria-labelledby. */
  name?: string;
  /** Direction of travel from Tabs' onChange; 0 = plain fade. */
  dir?: -1 | 0 | 1;
  /** Panel content - only this inner node animates in on `tab` change; the root chrome stays static. */
  children?: ReactNode;
}

// TabPanel - the content side of a Tabs pair. The ROOT is static chrome (consumer
// borders/padding never move); switching `tab` cuts, then only the inner node enters
// from the direction of travel (pass Tabs' onChange dir through) via one imperative
// tween on a persistent node - cut + entrance, no exit choreography, no remount.
export function TabPanel({ tab, name, dir = 0, className = '', children, ...rest }: TabPanelProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef(true);
  useLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    if (SM.reduced) return;
    const anim = animate(
      innerRef.current,
      { opacity: [0, 1], x: [dir * TABS_ENTER_X, 0] },
      SM.t.enter,
    );
    return () => anim.stop();
  }, [tab]);
  return (
    <div
      role="tabpanel"
      tabIndex={0}
      id={name ? name + '-panel-' + tab : undefined}
      aria-labelledby={name ? name + '-tab-' + tab : undefined}
      className={('tab-panel ' + className).trim()}
      {...rest}
    >
      <div className="tab-panel__inner" ref={innerRef}>
        {children}
      </div>
    </div>
  );
}
