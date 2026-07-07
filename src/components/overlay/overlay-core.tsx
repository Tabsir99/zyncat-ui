'use client';

/* overlay-core - the headless mechanics under popover, dialog and sheet.
   The portal + stack + light-dismiss primitives live in layer.tsx (shared with
   select-core); this file adds the modal machinery on top. */
import './overlay.css';
import {
  Children,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type ReactNode,
  type RefObject,
} from 'react';
import { motion } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { tokenPx } from '../token-px';
import {
  type OverlayEntry,
  ovIsTop,
  ovInOverlayAbove,
  useOverlayEntry,
  useOutsidePress,
  cloneTrigger,
  OverlayPortal,
} from './layer';

const SM = UIMotion;

function ovResolveChildren(
  children: ReactNode | ((api: { close: () => void }) => ReactNode),
  close: () => void,
): ReactNode {
  return typeof children === 'function' ? children({ close }) : children;
}

function ovCloneTrigger(
  trigger: ReactElement | null,
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
    triggerRef: RefObject<HTMLElement>;
  },
): ReactElement | null {
  if (!trigger) return null;
  return cloneTrigger(
    trigger,
    {
      onClick: onPress,
      'aria-haspopup': haspopup,
      'aria-expanded': open,
      'aria-controls': open ? panelId : undefined,
    },
    (node) => {
      triggerRef.current = node;
    },
  );
}

/* Restore focus to the opener on unmount, but only if it would otherwise be lost; a microtask dodges the inert-release ordering race. */
function useReturnFocus(nodeRef: RefObject<HTMLElement>) {
  useEffect(() => {
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
  panelRef: RefObject<HTMLElement>;
  entry: OverlayEntry;
}) {
  useEffect(() => {
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
  useEffect(() => {
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
  useEffect(() => {
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
  triggerRef: RefObject<HTMLElement>;
  panelRef: RefObject<HTMLElement>;
}) {
  useLayoutEffect(() => {
    const place = () => {
      const t = triggerRef.current;
      const p = panelRef.current;
      if (!t || !p) return;
      const r = t.getBoundingClientRect();
      const pw = p.offsetWidth,
        ph = p.offsetHeight;
      const edge = tokenPx('--space-2');
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
        ); /* main-axis clamp: keep the leading edge on-screen (max last - may cover the trigger) */
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

/* Scrim (real motion.div): dialogs fade via variants, sheets via a travel-derived MotionValue; a press must start AND end on it to dismiss. */
const ovScrimVariants = {
  closed: { opacity: 0, transition: { duration: SM.dur.base, ease: SM.ease.standard } },
  open: { opacity: 1, transition: { duration: SM.dur.slow, ease: SM.ease.entrance } },
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
  const down = useRef(false);
  return (
    <motion.div
      className="overlay-scrim"
      aria-hidden="true"
      {...(opacity ? { style: { opacity } } : { variants: ovScrimVariants })}
      onPointerDown={(e) => {
        down.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (dismissible && down.current && e.target === e.currentTarget) onPress();
      }}
    ></motion.div>
  );
}

/* Render the panel: a motion.div wrapper, or with asChild the child's own tag (host element required - component children can't take a ref here). */
function ovPanelElement({
  asChild,
  children,
  prepend = null,
  nodeRef,
  className,
  motionProps,
}: {
  asChild: boolean;
  children: ReactNode;
  prepend?: ReactNode;
  nodeRef: RefObject<HTMLElement>;
  className: string;
  motionProps: Record<string, any>;
}): ReactElement {
  if (asChild) {
    const child = Children.only(children) as ReactElement<any>;
    if (typeof child.type === 'string') {
      const Tag = (motion as any)[child.type];
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
    console.warn('[Overlay] asChild requires a DOM-element child - falling back to a wrapper');
  }
  return (
    <motion.div {...motionProps} ref={nodeRef as RefObject<HTMLDivElement>} className={className}>
      {prepend}
      {children}
    </motion.div>
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
  slotRef?: RefObject<HTMLElement> | null;
  slotProps?: Record<string, any>;
  scrimOpacity?: any;
  children: ReactNode;
}) {
  const layerRef = useRef<HTMLDivElement>(null);
  const internalSlotRef = useRef<HTMLElement>(null);
  const slotRef = externalSlotRef || internalSlotRef;
  const entry = useOverlayEntry({ nodeRef: layerRef, dismissible, requestClose });
  useScrollLock();
  useInertOutside();
  useReturnFocus(layerRef);
  useFocusTrap({ panelRef: slotRef, entry });
  return (
    <motion.div
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
    </motion.div>
  );
}

export {
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
