'use client';

/* overlay-core.tsx — the headless mechanics under Popover / Dialog / Sheet.
   ─────────────────────────────────────────────────────────────────────────
   Per CLAUDE.md A9 these are SEPARATE sibling components; this core holds only
   variant-blind material — no open state, no content, no surface paint:

     stack      one module-level stack of every open overlay (modal and
                non-modal interleaved). Drives: Esc → topmost dismissible only;
                z-index = --layer-overlay + depth; "is this press/focus inside
                an overlay above me?" checks for nesting.
     hooks      useControllable · useOverlayEntry (join/leave the stack + z)
                useOutsidePress (light dismiss) · useReturnFocus
                useFocusTrap (hard Tab cycle + focus recapture, topmost only)
                useScrollLock (refcounted, scrollbar-gutter compensated)
                useInertOutside (refcounted `inert` on the page behind modals)
                useAnchorPosition (fixed coords, side/align, flip, clamp, arrow)
     chrome     OverlayPortal (a [data-overlay-root] host on <body>) ·
                OverlayScrim · ModalShell (layer > scrim + slot — shared by
                Dialog and Sheet, which differ only in classes + variants)

   Mount-while-open: each skin renders its panel through <AnimatePresence>, and
   the lifecycle hooks live INSIDE the mounted panel — so locks, inert and
   focus restore release only after the exit animation finishes.

   No native <dialog> / [popover]: Motion owns existence end-to-end (the scrim
   is a real motion.div, not a ::backdrop hack), and React can't unmount a
   top-layer node cleanly (verified in select-core). Modality is hand-rolled:
   portal to <body> + scrim + hard focus trap + `inert` + scroll lock.

   useControllable is duplicated from select-core (6 lines) — importing the
   select domain here would entangle domains; propose lifting to a shared
   util at promotion if a third copy ever appears. */
import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion as ovMotion, AnimatePresence as OvAnimatePresence } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';

const ovSM = UIMotion;
const {
  useState: ovUseState,
  useEffect: ovUseEffect,
  useLayoutEffect: ovUseLayoutEffect,
  useRef: ovUseRef,
} = React;

/* ── tiny shared helpers ──────────────────────────────────────────────────*/

function useControllable<T>(
  controlled: T | undefined,
  initial: T,
  onChange?: (next: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = ovUseState(initial);
  const isControlled = controlled !== undefined;
  const value = isControlled ? controlled : internal;
  const setValue = (next: T) => {
    if (!isControlled) setInternal(next);
    if (onChange) onChange(next);
  };
  return [value, setValue];
}

/* Token length → px. parseFloat alone reads "0.5rem" as 0.5px — the bug that
   bit Tooltip and Toast (progress.md 2026-06-10); always convert rem here. */
function ovReadPx(token: string): number {
  const root = document.documentElement;
  const v = getComputedStyle(root).getPropertyValue(token).trim();
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return v.endsWith('rem') ? n * parseFloat(getComputedStyle(root).fontSize) : n;
}

/* children may be a node or ({ close }) => node — headless consumers usually
   need `close` to wire their own actions. */
function ovResolveChildren(
  children: React.ReactNode | ((api: { close: () => void }) => React.ReactNode),
  close: () => void,
): React.ReactNode {
  return typeof children === 'function' ? children({ close }) : children;
}

/* Clone the consumer's trigger element: wire open/close + ARIA, and keep any
   ref the consumer already attached. */
function ovCloneTrigger(
  trigger: React.ReactElement | null,
  {
    open,
    onPress,
    panelId,
    haspopup,
    triggerRef,
  }: {
    open: boolean;
    onPress: () => void;
    panelId: string;
    haspopup: string;
    triggerRef: React.RefObject<HTMLElement>;
  },
): React.ReactElement | null {
  if (!trigger) return null;
  const setRef = (node: HTMLElement | null) => {
    if (triggerRef) triggerRef.current = node;
    const r = (trigger as any).ref;
    if (typeof r === 'function') r(node);
    else if (r) r.current = node;
  };
  return React.cloneElement(trigger as React.ReactElement<any>, {
    ref: setRef,
    onClick: (e: React.MouseEvent) => {
      const oc = (trigger.props as { onClick?: (e: React.MouseEvent) => void }).onClick;
      if (oc) oc(e);
      onPress();
    },
    'aria-haspopup': haspopup,
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
  });
}

/* ── the overlay stack ────────────────────────────────────────────────────
   One array for every open overlay, in opening order. Single document-level
   Esc listener: closes the TOPMOST overlay only, and only if it is
   dismissible — and defers to anything inner that already handled the key
   (e.defaultPrevented: an open Select menu inside a dialog eats its own Esc). */
interface OverlayEntry {
  contains: (t: EventTarget | null) => boolean;
  isDismissible: () => boolean;
  requestClose: () => void;
  _dismissible?: boolean;
  _close?: () => void;
}

const ovStack: OverlayEntry[] = [];

function ovOnDocKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented || ovStack.length === 0) return;
  const top = ovStack[ovStack.length - 1];
  if (!top.isDismissible()) return;
  e.preventDefault();
  top.requestClose();
}

function ovIsTop(entry: OverlayEntry) {
  return ovStack[ovStack.length - 1] === entry;
}

/* true if `target` sits inside an overlay opened AFTER `entry` — i.e. a child
   overlay (popover in a dialog, dialog over a dialog) that owns the event. */
function ovInOverlayAbove(entry: OverlayEntry, target: EventTarget | null) {
  const i = ovStack.indexOf(entry);
  return i >= 0 && ovStack.slice(i + 1).some((e) => e.contains(target));
}

/* Join the stack for this panel's lifetime (mounted = open or exiting).
   Sets z = --layer-overlay + depth on the root node before first paint. */
function useOverlayEntry({
  nodeRef,
  dismissible,
  requestClose,
}: {
  nodeRef: React.RefObject<HTMLElement>;
  dismissible: boolean;
  requestClose: () => void;
}): OverlayEntry {
  const ref = ovUseRef<OverlayEntry>(null);
  if (!ref.current) {
    ref.current = {
      contains: (t) => Boolean(nodeRef.current && nodeRef.current.contains(t as Node)),
      isDismissible: () => ref.current._dismissible,
      requestClose: () => ref.current._close(),
    };
  }
  ref.current._dismissible = dismissible;
  ref.current._close = requestClose;

  ovUseLayoutEffect(() => {
    const entry = ref.current;
    if (ovStack.length === 0) document.addEventListener('keydown', ovOnDocKeyDown);
    ovStack.push(entry);
    if (nodeRef.current)
      nodeRef.current.style.zIndex = 'calc(var(--layer-overlay) + ' + (ovStack.length - 1) + ')';
    return () => {
      const i = ovStack.indexOf(entry);
      if (i >= 0) ovStack.splice(i, 1);
      if (ovStack.length === 0) document.removeEventListener('keydown', ovOnDocKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref.current;
}

/* ── light dismiss (Popover) ──────────────────────────────────────────────
   Close on a press that lands outside the panel, outside the trigger (its own
   click toggles), and outside any overlay stacked above this one. */
function useOutsidePress({
  entry,
  refs,
  enabled,
  onPress,
}: {
  entry: OverlayEntry;
  refs: React.RefObject<HTMLElement>[];
  enabled: boolean;
  onPress: () => void;
}) {
  const latest = ovUseRef<{ enabled: boolean; onPress: () => void }>(null);
  latest.current = { enabled, onPress };
  ovUseEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!latest.current.enabled) return;
      const t = e.target;
      if (refs.some((r) => r.current && r.current.contains(t as Node))) return;
      if (ovInOverlayAbove(entry, t)) return;
      latest.current.onPress();
    };
    document.addEventListener('pointerdown', onDown, true);
    return () => document.removeEventListener('pointerdown', onDown, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/* ── focus ────────────────────────────────────────────────────────────────*/

/* Remember the opener; put focus back when the panel unmounts — but only if
   focus would otherwise be lost (on <body>, gone, or still inside the dying
   panel). A microtask dodges unmount-ordering races with inert release. */
function useReturnFocus(nodeRef: React.RefObject<HTMLElement>) {
  ovUseEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    return () => {
      const a = document.activeElement;
      const orphaned =
        !a || a === document.body || (nodeRef.current && nodeRef.current.contains(a));
      if (orphaned && prev && prev.isConnected && typeof prev.focus === 'function') {
        queueMicrotask(() => {
          if (prev.isConnected) prev.focus({ preventScroll: true });
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

const OV_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Hard trap, showModal()-style: seed focus in, Tab/Shift+Tab cycle inside,
   and recapture focus that lands outside — unless this modal is no longer the
   topmost overlay, or the focus sits in an overlay above it (nested popover). */
function useFocusTrap({
  panelRef,
  entry,
}: {
  panelRef: React.RefObject<HTMLElement>;
  entry: OverlayEntry;
}) {
  ovUseEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(OV_FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const seed =
      panel.querySelector<HTMLElement>('[autofocus], [data-autofocus]') || focusables()[0] || panel;
    seed.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (f.length === 0) {
        e.preventDefault();
        return;
      }
      const cur = document.activeElement;
      if (e.shiftKey) {
        if (cur === f[0] || cur === panel) {
          e.preventDefault();
          f[f.length - 1].focus();
        }
      } else if (cur === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (panel.contains(e.target as Node)) return;
      if (!ovIsTop(entry) || ovInOverlayAbove(entry, e.target)) return;
      (focusables()[0] || panel).focus({ preventScroll: true });
    };

    panel.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      panel.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/* ── modality: scroll lock + inert page ───────────────────────────────────*/

let ovLocks = 0;
let ovSavedOverflow = '';
let ovSavedPad = '';
function useScrollLock() {
  ovUseEffect(() => {
    if (++ovLocks === 1) {
      const body = document.body;
      const gutter = window.innerWidth - document.documentElement.clientWidth;
      ovSavedOverflow = body.style.overflow;
      ovSavedPad = body.style.paddingRight;
      body.style.overflow = 'hidden';
      if (gutter > 0)
        body.style.paddingRight =
          (parseFloat(getComputedStyle(body).paddingRight) || 0) + gutter + 'px';
    }
    return () => {
      if (--ovLocks === 0) {
        document.body.style.overflow = ovSavedOverflow;
        document.body.style.paddingRight = ovSavedPad;
      }
    };
  }, []);
}

/* `inert` on every <body> child that isn't an overlay portal — what the top
   layer gave us for free. Refcounted across stacked modals; restores exactly
   what it set. (Content mounted on <body> WHILE a modal is up is not swept —
   acceptable: the app mounts everything transient through OverlayPortal.) */
let ovInertCount = 0;
const ovInerted = new Set<HTMLElement>();
function useInertOutside() {
  ovUseEffect(() => {
    if (++ovInertCount === 1) {
      for (const el of Array.from(document.body.children) as HTMLElement[]) {
        if (
          el.hasAttribute('data-overlay-root') ||
          el.tagName === 'SCRIPT' ||
          el.tagName === 'STYLE' ||
          el.inert
        )
          continue;
        el.inert = true;
        ovInerted.add(el);
      }
    }
    return () => {
      if (--ovInertCount === 0) {
        ovInerted.forEach((el) => {
          el.inert = false;
        });
        ovInerted.clear();
      }
    };
  }, []);
}

/* ── anchored placement (Popover) ─────────────────────────────────────────
   Fixed coords like select-core: measure, place on the requested side, flip
   to the opposite side when out of room, clamp the cross axis to the
   viewport. Writes data-side/data-align (CSS reads them for transform-origin
   and the arrow) and --overlay-arrow-x/y (arrow tracks the trigger center).
   Runs in a layout effect so the entrance plays at the final position. */
function useAnchorPosition({
  side,
  align,
  arrow,
  triggerRef,
  panelRef,
}: {
  side: 'top' | 'bottom' | 'left' | 'right';
  align: 'start' | 'center' | 'end';
  arrow: boolean;
  triggerRef: React.RefObject<HTMLElement>;
  panelRef: React.RefObject<HTMLElement>;
}) {
  ovUseLayoutEffect(() => {
    const place = () => {
      const t = triggerRef.current;
      const p = panelRef.current;
      if (!t || !p) return;
      const r = t.getBoundingClientRect();
      const pw = p.offsetWidth,
        ph = p.offsetHeight;
      const edge = ovReadPx('--space-2');
      const gap = edge + (arrow ? 3 : 0);
      const vw = window.innerWidth,
        vh = window.innerHeight;

      const room: Record<string, number> = {
        top: r.top,
        bottom: vh - r.bottom,
        left: r.left,
        right: vw - r.right,
      };
      const opposite: Record<string, 'top' | 'bottom' | 'left' | 'right'> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      };
      const vertical = side === 'top' || side === 'bottom';
      let s = side;
      if (room[s] < (vertical ? ph : pw) + gap && room[opposite[s]] > room[s]) s = opposite[s];

      let x, y;
      if (vertical) {
        y = s === 'top' ? r.top - ph - gap : r.bottom + gap;
        x =
          align === 'start' ? r.left : align === 'end' ? r.right - pw : r.left + (r.width - pw) / 2;
        x = Math.min(Math.max(x, edge), vw - pw - edge);
        y = Math.max(Math.min(y, vh - ph - edge), edge); /* clamp the MAIN axis too: a tall
             popover flipped up in a short viewport must keep its leading edge (header/nav)
             on-screen — max() last, so it may cover the trigger rather than clip off-screen */
      } else {
        x = s === 'left' ? r.left - pw - gap : r.right + gap;
        y =
          align === 'start' ? r.top : align === 'end' ? r.bottom - ph : r.top + (r.height - ph) / 2;
        y = Math.min(Math.max(y, edge), vh - ph - edge);
        x = Math.max(Math.min(x, vw - pw - edge), edge); /* main-axis clamp (see vertical branch) */
      }
      p.style.left = Math.round(x) + 'px';
      p.style.top = Math.round(y) + 'px';
      p.setAttribute('data-side', s);
      p.setAttribute('data-align', align);
      if (arrow) {
        if (vertical)
          p.style.setProperty(
            '--overlay-arrow-x',
            Math.round(Math.min(Math.max(r.left + r.width / 2 - x, 12), pw - 12)) + 'px',
          );
        else
          p.style.setProperty(
            '--overlay-arrow-y',
            Math.round(Math.min(Math.max(r.top + r.height / 2 - y, 12), ph - 12)) + 'px',
          );
      }
    };
    place();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    const ro = new ResizeObserver(place);
    ro.observe(panelRef.current);
    return () => {
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      ro.disconnect();
    };
  }, [side, align, arrow]); // eslint-disable-line react-hooks/exhaustive-deps
}

/* ── chrome ───────────────────────────────────────────────────────────────*/

/* A per-instance host on <body>: escapes ancestor transforms/overflow, and is
   what useInertOutside skips. Persists across open/close (AnimatePresence
   needs to stay mounted to play exits); holds no layout box of its own. */
function OverlayPortal({ children }: { children: React.ReactNode }) {
  const hostRef = ovUseRef<HTMLDivElement | null>(null);
  // Guard document for SSR (this component is reached during server render even
  // when the overlay is closed). Hooks below stay unconditional.
  if (typeof document !== 'undefined' && !hostRef.current) {
    hostRef.current = document.createElement('div');
    hostRef.current.setAttribute('data-overlay-root', '');
  }
  ovUseLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    document.body.appendChild(el);
    return () => el.remove();
  }, []);
  if (!hostRef.current) return null; // server / pre-DOM: render nothing
  return createPortal(children, hostRef.current);
}

/* Scrim — a real motion.div (no ::backdrop). Two clocks: dialogs fade it via
   variant propagation from the shell; sheets pass `opacity` (a MotionValue
   derived from the panel's travel) so the scrim tracks entrance, drag and
   exit physically. Press must START and END on the scrim to dismiss, so a
   text-drag out of the panel can't close it. */
const ovScrimVariants = {
  closed: { opacity: 0, transition: { duration: ovSM.dur.base, ease: ovSM.ease.standard } },
  open: { opacity: 1, transition: { duration: ovSM.dur.slow, ease: ovSM.ease.entrance } },
};
function OverlayScrim({
  dismissible,
  onPress,
  opacity = null,
}: {
  dismissible: boolean;
  onPress: () => void;
  opacity?: any;
}) {
  const down = ovUseRef(false);
  return (
    <ovMotion.div
      className="overlay-scrim"
      aria-hidden="true"
      {...(opacity ? { style: { opacity } } : { variants: ovScrimVariants })}
      onPointerDown={(e) => {
        down.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (dismissible && down.current && e.target === e.currentTarget) onPress();
      }}
    ></ovMotion.div>
  );
}

/* Render a panel node. Default: our own motion.div wrapper around the
   consumer's children. `asChild`: NO extra wrapper — the consumer's single
   DOM-element child IS the panel: we re-render it as a motion component of
   the same tag with our mechanics merged in (classes + style + ref composed,
   consumer's own handlers kept unless ours collide — ours win; they carry
   dismiss/drag mechanics). Component children can't take a ref reliably in
   this buildless setup, so asChild requires a host element (<div>, <form>…). */
function ovPanelElement({
  asChild,
  children,
  prepend = null,
  nodeRef,
  className,
  motionProps,
}: {
  asChild: boolean;
  children: React.ReactNode;
  prepend?: React.ReactNode;
  nodeRef: React.RefObject<HTMLElement>;
  className: string;
  motionProps: Record<string, any>;
}): React.ReactElement {
  if (asChild) {
    const child = React.Children.only(children) as React.ReactElement<any>;
    if (typeof child.type === 'string') {
      const Tag = (ovMotion as any)[child.type];
      const composedRef = (node: HTMLElement | null) => {
        nodeRef.current = node;
        const r = (child as any).ref;
        if (typeof r === 'function') r(node);
        else if (r) r.current = node;
      };
      return (
        <Tag
          {...child.props}
          {...motionProps}
          ref={composedRef}
          className={child.props.className ? className + ' ' + child.props.className : className}
          style={{ ...motionProps.style, ...child.props.style }}
        >
          {prepend}
          {child.props.children}
        </Tag>
      );
    }
    console.warn('[Overlay] asChild requires a DOM-element child — falling back to a wrapper');
  }
  return (
    <ovMotion.div
      {...motionProps}
      ref={nodeRef as React.RefObject<HTMLDivElement>}
      className={className}
    >
      {prepend}
      {children}
    </ovMotion.div>
  );
}

/* The one modal shell behind dialog and sheet modes: fixed full-viewport
   layer > scrim + slot. Variant-blind — the caller passes classes and slot
   variants (plus, for sheets, a slotRef + drag slotProps + coupled scrim
   opacity). Sets NO role and NO label: the consumer's panel owns its own
   semantics (role="dialog" aria-modal="true" + a label). All modality hooks
   live here so they hold until the exit finishes. */
function ModalShell({
  layerClass,
  slotClass,
  slotVariants,
  panelId,
  dismissible,
  requestClose,
  asChild = false,
  slotRef: externalSlotRef = null,
  slotProps = {},
  scrimOpacity = null,
  children,
}: {
  layerClass: string;
  slotClass: string;
  slotVariants: any;
  panelId: string;
  dismissible: boolean;
  requestClose: () => void;
  asChild?: boolean;
  slotRef?: React.RefObject<HTMLElement> | null;
  slotProps?: Record<string, any>;
  scrimOpacity?: any;
  children: React.ReactNode;
}) {
  const layerRef = ovUseRef<HTMLDivElement>(null);
  const internalSlotRef = ovUseRef<HTMLElement>(null);
  const slotRef = externalSlotRef || internalSlotRef;
  const entry = useOverlayEntry({ nodeRef: layerRef, dismissible, requestClose });
  useScrollLock();
  useInertOutside();
  useReturnFocus(layerRef);
  useFocusTrap({ panelRef: slotRef, entry });
  return (
    <ovMotion.div
      ref={layerRef}
      className={'overlay-layer ' + layerClass}
      initial="closed"
      animate="open"
      exit="closed"
    >
      <OverlayScrim dismissible={dismissible} onPress={requestClose} opacity={scrimOpacity} />
      {ovPanelElement({
        asChild,
        children,
        nodeRef: slotRef,
        className: 'overlay-slot ' + slotClass,
        motionProps: { id: panelId, tabIndex: -1, variants: slotVariants, ...slotProps },
      })}
    </ovMotion.div>
  );
}

export {
  ovMotion,
  OvAnimatePresence,
  ovSM,
  useControllable,
  ovResolveChildren,
  ovCloneTrigger,
  useOverlayEntry,
  useOutsidePress,
  useReturnFocus,
  useAnchorPosition,
  OverlayPortal,
  OverlayScrim,
  ovPanelElement,
  ModalShell,
};
export type { OverlayEntry };
