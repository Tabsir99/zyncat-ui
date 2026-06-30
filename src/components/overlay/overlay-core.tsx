'use client';

/* overlay-core — the headless mechanics under popover, dialog and sheet. */
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

/* Token length → px; parseFloat alone reads "0.5rem" as 0.5px, so convert rem. */
function ovReadPx(token: string): number {
  const root = document.documentElement;
  const v = getComputedStyle(root).getPropertyValue(token).trim();
  const n = parseFloat(v);
  if (Number.isNaN(n)) return 0;
  return v.endsWith('rem') ? n * parseFloat(getComputedStyle(root).fontSize) : n;
}

function ovResolveChildren(
  children: React.ReactNode | ((api: { close: () => void }) => React.ReactNode),
  close: () => void,
): React.ReactNode {
  return typeof children === 'function' ? children({ close }) : children;
}

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

/* The overlay stack: one Esc listener closes only the topmost dismissible, and defers to inner handlers that already consumed the key (defaultPrevented). */
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

/* true if `target` sits in an overlay opened after `entry` (a nested child owns it). */
function ovInOverlayAbove(entry: OverlayEntry, target: EventTarget | null) {
  const i = ovStack.indexOf(entry);
  return i >= 0 && ovStack.slice(i + 1).some((e) => e.contains(target));
}

/* Join the stack for the panel's lifetime; set z = --layer-overlay + depth. */
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

/* Light dismiss — close on a press outside the panel, trigger, and any overlay above. */
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

/* Restore focus to the opener on unmount, but only if it would otherwise be lost; a microtask dodges the inert-release ordering race. */
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

/* Hard focus trap: seed in, cycle Tab inside, recapture stray focus unless not topmost or it's in an overlay above. */
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

/* `inert` on every non-overlay <body> child (refcounted); content mounted while a modal is already up is not swept. */
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

/* Anchored placement: measure, place on the side, flip when cramped, clamp the cross axis; writes data-side/-align + arrow vars in a layout effect. */
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
        y = Math.max(
          Math.min(y, vh - ph - edge),
          edge,
        ); /* main-axis clamp: keep the leading edge on-screen (max last → may cover the trigger) */
      } else {
        x = s === 'left' ? r.left - pw - gap : r.right + gap;
        y =
          align === 'start' ? r.top : align === 'end' ? r.bottom - ph : r.top + (r.height - ph) / 2;
        y = Math.min(Math.max(y, edge), vh - ph - edge);
        x = Math.max(Math.min(x, vw - pw - edge), edge);
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

/* Per-instance <body> host (escapes ancestor transforms; skipped by inert); persists across open/close so AnimatePresence can play exits. */
function OverlayPortal({ children }: { children: React.ReactNode }) {
  const hostRef = ovUseRef<HTMLDivElement | null>(null);
  // SSR guard: reached during server render; hooks below stay unconditional.
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
  if (!hostRef.current) return null;
  return createPortal(children, hostRef.current);
}

/* Scrim (real motion.div): dialogs fade via variants, sheets via a travel-derived MotionValue; a press must start AND end on it to dismiss. */
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

/* Render the panel: a motion.div wrapper, or with asChild the child's own tag (host element required — component children can't take a ref here). */
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

/* Shared modal shell (dialog + sheet): layer > scrim + slot; sets no role/label (the consumer's panel owns semantics); modality hooks live here so they hold until exit. */
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
