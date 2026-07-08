'use client';

/* modal - the machinery that makes a surface modal, and the shell composing it:
   scroll lock, inert page, scrim, focus trap. Dialog and Sheet render through
   ModalShell; non-modal surfaces (Popover, select) never touch this file. */
import './overlay.css';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';
import { UIMotion } from '../../tokens/motion-tokens';
import { useOverlayEntry } from './layer';
import { useReturnFocus, useFocusTrap } from './focus';
import { ovPanelElement } from './panel';

const SM = UIMotion;

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

/* Shared modal shell (dialog + sheet): layer > scrim + slot; sets no role/label (the consumer's panel owns semantics); modality hooks live here so they hold until exit. */
export function ModalShell({
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
