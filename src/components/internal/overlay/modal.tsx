'use client';

import './overlay.css';
import { useEffect, useRef, type ReactNode, type RefObject } from 'react';
import { animate, type Layer, type Playback } from '../../../engine';
import { useMotion, run, type MotionSpec, type MotionSpecs } from '../../../motion/use-motion';
import { UIMotion } from '../../../tokens/motion-tokens';
import { useOverlayEntry } from './layer';
import { useReturnFocus, useFocusTrap } from './focus';
import { cx } from '../utils/cx';

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

const ovScrimTiming = {
  open: { duration: SM.dur.slow, ease: SM.ease.entrance },
  close: { duration: SM.dur.base, ease: SM.ease.standard },
};

function OverlayScrim({
  dismissible,
  onPress,
  scrimRef,
}: {
  dismissible: boolean;
  onPress: () => void;
  scrimRef: RefObject<HTMLDivElement | null>;
}) {
  const down = useRef(false);
  return (
    <div
      ref={scrimRef}
      className="overlay-scrim"
      aria-hidden="true"
      onPointerDown={(e) => {
        down.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (dismissible && down.current && e.target === e.currentTarget) onPress();
      }}
    ></div>
  );
}

export function ModalShell({
  layerClass,
  panelClass,
  panelId,
  dismissible,
  requestClose,
  panelRef: externalPanelRef = null,
  panelProps = {},
  animate: animateSpec,
  exit,
  children,
}: {
  layerClass: string;
  panelClass: string;
  panelId: string;
  dismissible: boolean;
  requestClose: () => void;
  panelRef?: RefObject<HTMLElement> | null;
  panelProps?: Record<string, any>;
  children: ReactNode;
} & MotionSpecs) {
  const layerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const internalPanelRef = useRef<HTMLElement>(null);
  const panelRef = externalPanelRef || internalPanelRef;
  const entry = useOverlayEntry({ nodeRef: layerRef, dismissible, requestClose });

  const withScrim = (dir: 'open' | 'close', panelSpec: MotionSpec | undefined) => (): Playback[] => {
    const fade: Layer = { opacity: dir === 'open' ? [0, 1] : [0], timing: ovScrimTiming[dir] };
    const plays = scrimRef.current ? [animate(scrimRef.current, fade)] : [];
    return panelRef.current ? plays.concat(run(panelSpec, panelRef.current)) : plays;
  };

  useMotion(layerRef, { animate: withScrim('open', animateSpec), exit: withScrim('close', exit) });
  useScrollLock();
  useInertOutside();
  useReturnFocus(layerRef);
  useFocusTrap({ panelRef, entry });
  return (
    <div ref={layerRef} className={'overlay-layer ' + layerClass}>
      <OverlayScrim dismissible={dismissible} onPress={requestClose} scrimRef={scrimRef} />
      <div
        id={panelId}
        tabIndex={-1}
        {...panelProps}
        ref={panelRef as RefObject<HTMLDivElement>}
        className={cx('overlay-panel', panelClass, panelProps.className)}
      >
        {children}
      </div>
    </div>
  );
}
