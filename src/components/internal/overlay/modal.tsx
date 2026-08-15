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

interface OvScopeLock {
  depth: number;
  overflow: string;
  paddingRight: string;
  inerted: HTMLElement[];
}

const ovScopeLocks = new Map<HTMLElement, OvScopeLock>();

function ovGutter(scope: HTMLElement, cs: CSSStyleDeclaration): number {
  if (scope === document.body) return window.innerWidth - document.documentElement.clientWidth;
  return scope.offsetWidth - scope.clientWidth - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
}

function useScopeLock(container?: HTMLElement | null) {
  useEffect(() => {
    const scope = container ?? document.body;
    const lock: OvScopeLock = ovScopeLocks.get(scope) ?? {
      depth: 0,
      overflow: scope.style.overflow,
      paddingRight: scope.style.paddingRight,
      inerted: [],
    };
    ovScopeLocks.set(scope, lock);

    if (++lock.depth === 1) {
      const cs = getComputedStyle(scope);
      const gutter = ovGutter(scope, cs);
      scope.style.overflow = 'hidden';
      if (gutter > 0) scope.style.paddingRight = (parseFloat(cs.paddingRight) || 0) + gutter + 'px';
      for (const el of Array.from(scope.children) as HTMLElement[]) {
        if (el.hasAttribute('data-overlay-root') || el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.inert)
          continue;
        el.inert = true;
        lock.inerted.push(el);
      }
    }
    return () => {
      if (--lock.depth > 0) return;
      scope.style.overflow = lock.overflow;
      scope.style.paddingRight = lock.paddingRight;
      for (const el of lock.inerted) el.inert = false;
      ovScopeLocks.delete(scope);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
  container,
  panelRef: externalPanelRef = null,
  panelProps = {},
  layerProps = {},
  animate: animateSpec,
  exit,
  children,
}: {
  layerClass: string;
  panelClass: string;
  panelId: string;
  dismissible: boolean;
  requestClose: () => void;
  container?: HTMLElement | null;
  panelRef?: RefObject<HTMLElement> | null;
  panelProps?: Record<string, any>;
  layerProps?: Record<string, any>;
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
  useScopeLock(container);
  useReturnFocus(layerRef);
  useFocusTrap({ panelRef, entry, scoped: !!container });
  return (
    <div
      {...layerProps}
      ref={layerRef}
      className={cx('overlay-layer', container && 'overlay-layer--scoped', layerClass, layerProps.className)}
    >
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
