'use client';

import './overlay.css';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { motion } from 'motion/react';
import { UIMotion } from '../../../tokens/motion-tokens';
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
      if (gutter > 0) body.style.paddingRight = (parseFloat(getComputedStyle(body).paddingRight) || 0) + gutter + 'px';
    }
    return () => {
      if (--ovLocks === 0) {
        document.body.style.overflow = ovSavedOverflow;
        document.body.style.paddingRight = ovSavedPad;
      }
    };
  }, []);
}

let ovInertCount = 0;
const ovInerted = new Set<HTMLElement>();
function useInertOutside() {
  useEffect(() => {
    if (++ovInertCount === 1) {
      for (const el of Array.from(document.body.children) as HTMLElement[]) {
        if (el.hasAttribute('data-overlay-root') || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.inert)
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
    <motion.div ref={layerRef} className={'overlay-layer ' + layerClass} initial="closed" animate="open" exit="closed">
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
