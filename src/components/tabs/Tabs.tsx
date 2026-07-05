'use client';

// Tabs.tsx - Tabs: line tabs for view switching.
// Sits on a hairline baseline; a single accent ink marks the active view.
// `TabPanel` is the matching content wrapper (aria wiring + directional
// entrance). All styling lives in tabs.css; this file composes class names
// and drives the ink.
//
// TWO MOTIONS, BOTH IMPLICIT - consumers configure neither.
//
// 1 - "the ink reaches, then releases" (selection).
// One persistent ink node. On selection, the edge facing the destination
// travels FIRST (the ink stretches across the gap, ease-standard), then the
// trailing edge releases and settles (ease-entrance). Implemented as Motion
// keyframes on x (transform) + width (measured px - measured px - the
// surfaced section C morph exception, Tooltip precedent: the destination width is
// unknowable to transforms, and scaleX would distort the radius). Interrupts
// are honest: a new travel starts from the ink's LIVE rect, not the last
// target. Reduced motion: tokens collapse durations, and placement falls
// back to an instant set.
//
// 2 - the gliding hover. ONE shared pill instead of per-tab hover
// backgrounds: it fades in under the first tab the pointer touches, GLIDES -
// morphing position and width - as the pointer moves along the row, and
// fades out when it leaves. Declarative: a `layoutId` node conditionally
// rendered inside the hovered tab - Motion's FLIP owns the travel. Tab-to-tab
// is an ATOMIC remount: old pill out + new pill in within one commit, so
// exactly one node carries the layoutId per frame. (AnimatePresence is
// deliberately NOT used here: it holds the exiting pill for a tick, two
// same-layoutId nodes overlap, and the handoff can hide both for a frame -
// an intermittent white flicker.) True leave keeps the pill MOUNTED in the
// last tab and fades it via `animate`; the engine's completion callback
// unmounts it - no hand-rolled exit timer. Hover state is per-tab
// pointerenter (disabled buttons don't fire it, so the pill holds - same for
// the gaps); only pointerleave of the LIST starts the fade-out.
//
// Keyboard (WAI-ARIA tabs, automatic activation): roving tabindex; left/right arrows cycle
// (wrapping, skipping disabled), Home/End jump; selection follows focus.
// Overflow is honest: the row scrolls, clipped edges fade (data-fade set from
// scroll geometry), and the selected tab is kept in view.

import './tabs.css';
import * as React from 'react';
import { motion as tabsMotion, animate as tabsAnimate } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { IconSlot } from '../icon/IconSlot';

const TabsSM = UIMotion;

/** One tab in the row. */
export interface TabItem {
  /** Stable identity - also used in the tab/panel id pair. */
  value: string;
  /** Visible tab text. */
  label: React.ReactNode;
  /** Leading icon - your own node. */
  icon?: React.ReactNode;
  /** Rendered mono + tabular. Pass a number or a preformatted string. */
  count?: number | string;
  /** Dims the tab, blocks selection, and skips it during arrow-key travel. */
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
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
  const autoId = React.useId();
  const base = name || autoId;

  const listRef = React.useRef<HTMLDivElement>(null);
  const inkRef = React.useRef<HTMLSpanElement>(null);
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const animRef = React.useRef<ReturnType<typeof tabsAnimate> | null>(null);
  const placedRef = React.useRef(false);
  const valueRef = React.useRef(value);
  valueRef.current = value;

  /* The gliding hover - the only state here. `hovered` is STICKY (the last
     tab the pointer touched; it outlives the pointer so the leave-fade plays
     in place), `inList` is whether the pointer is currently in the row.
     wasInRef (one render behind) picks the entrance: fresh entry = fade in
     where it lands (layout snap, no glide from a stale spot); tab-to-tab =
     opaque glide. */
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [inList, setInList] = React.useState(false);
  const wasInRef = React.useRef(false);
  React.useEffect(() => {
    wasInRef.current = inList;
  });

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

    if (!animated || !placedRef.current || TabsSM.reduced) {
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
        animRef.current = tabsAnimate(ink, kf, {
          duration: TabsSM.dur.slow,
          times: [0, 0.55, 1],
          ease: [TabsSM.ease.standard, TabsSM.ease.entrance],
        });
      }
    }
    placedRef.current = true;
  };

  /* Edge fades: pure scroll geometry - data-fade="start end" on the list. */
  const updateEdges = () => {
    const l = listRef.current;
    if (!l) return;
    const max = l.scrollWidth - l.clientWidth;
    l.dataset.fade = (
      (l.scrollLeft > 1 ? 'start ' : '') + (l.scrollLeft < max - 1 ? 'end' : '')
    ).trim();
  };

  /* Selection drives the travel + keeps the active tab clear of a faded edge. */
  React.useLayoutEffect(() => {
    place(true);
    const l = listRef.current,
      el = value != null ? tabRefs.current[value] : null;
    if (l && el && l.scrollWidth > l.clientWidth) {
      const behavior: ScrollBehavior = TabsSM.reduced ? 'auto' : 'smooth';
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
  React.useLayoutEffect(() => {
    const ro = new ResizeObserver(() => {
      place(false);
      updateEdges();
    });
    if (listRef.current) ro.observe(listRef.current);
    Object.values(tabRefs.current).forEach((el) => el && ro.observe(el));
    updateEdges();
    return () => ro.disconnect();
  }, [items.length]);

  const select = (v: string) => {
    if (v === value || !onChange) return;
    const idx = (x: string | null | undefined) => items.findIndex((i) => i.value === x);
    onChange(v, idx(v) >= idx(value) ? 1 : -1);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
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
      {/* layoutScroll: the pill FLIPs correctly even while this row is being
          scrolled. NOTE: framer-motion@12.40.0's UMD dev build prints a
          spurious React key warning when any motion component mounts -
          pre-existing and system-wide (stable Toggle prints the same one at
          load), harmless, dev-only. Not caused by, or fixable in, this code. */}
      <tabsMotion.div
        className="tabs__list"
        role="tablist"
        aria-label={label}
        ref={listRef}
        layoutScroll
        onScroll={updateEdges}
        onKeyDown={onKeyDown}
        onPointerLeave={() => setInList(false)}
      >
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
                  : () => {
                      setHovered(it.value);
                      setInList(true);
                    }
              }
            >
              <span className="tab__pad">
                {hovered === it.value && (
                  <tabsMotion.span
                    key="pill"
                    className="tab__hover"
                    layoutId={base + '-hover'}
                    aria-hidden="true"
                    initial={wasInRef.current ? false : { opacity: 0 }}
                    animate={{ opacity: inList ? 1 : 0 }}
                    transition={{
                      /* glide: slow travel, soft-start (ease.standard) - for
                         continuous hover sweeps the early gentle pickup reads
                         better than the fuller in-out (--ease-glide). Fresh
                         entry snaps in place instead of gliding from a stale
                         position. */
                      layout: wasInRef.current
                        ? { duration: TabsSM.dur.slow, ease: TabsSM.ease.standard }
                        : { duration: 0 },
                      opacity: inList
                        ? { duration: TabsSM.dur.fast, ease: TabsSM.ease.standard }
                        : { duration: TabsSM.dur.fast, ease: TabsSM.ease.exit },
                    }}
                    onAnimationComplete={() => {
                      if (!inList) setHovered(null);
                    }}
                  ></tabsMotion.span>
                )}
                {it.icon && <IconSlot size="sm">{it.icon}</IconSlot>}
                <span className="tab__label">{it.label}</span>
                {it.count != null && <span className="tab__count">{it.count}</span>}
              </span>
            </button>
          );
        })}
        <span className="tabs__ink" key="ink" ref={inkRef} aria-hidden="true"></span>
      </tabsMotion.div>
    </div>
  );
}

export interface TabPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'dir'> {
  /** The active tab's value - changing it cuts to the new content. */
  tab: string;
  /** Same `name` as the paired Tabs - wires role/id/aria-labelledby. */
  name?: string;
  /** Direction of travel from Tabs' onChange; 0 = plain fade. */
  dir?: -1 | 0 | 1;
  /** Panel content - only this inner node animates in on `tab` change; the root chrome stays static. */
  children?: React.ReactNode;
}

// TabPanel - the content side of a Tabs pair. The ROOT is static chrome:
// whatever border/padding/background the consumer styles it with never
// moves. Switching `tab` cuts to the new content, then ONLY the inner
// content node enters from the direction of travel (pass Tabs' onChange dir
// through) via an imperative Motion tween on one persistent node - same
// resolved pattern as Tooltip's content: cut + entrance, no exit
// choreography, and no remount, so first paint is naturally static.
export function TabPanel({ tab, name, dir = 0, className = '', children, ...rest }: TabPanelProps) {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const firstRef = React.useRef(true);
  React.useLayoutEffect(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    if (TabsSM.reduced) return;
    const anim = tabsAnimate(
      innerRef.current,
      { opacity: [0, 1], x: [dir * TABS_ENTER_X, 0] },
      TabsSM.t.enter,
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
