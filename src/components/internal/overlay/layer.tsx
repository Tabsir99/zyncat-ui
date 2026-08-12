'use client';

import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';

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

function ovInOverlayAbove(entry: OverlayEntry, target: EventTarget | null) {
  const i = ovStack.indexOf(entry);
  return i >= 0 && ovStack.slice(i + 1).some((e) => e.contains(target));
}

function useOverlayEntry({
  nodeRef,
  dismissible,
  requestClose,
}: {
  nodeRef: RefObject<HTMLElement>;
  dismissible: boolean;
  requestClose: () => void;
}): OverlayEntry {
  const ref = useRef<OverlayEntry>(null);
  if (!ref.current) {
    ref.current = {
      contains: (t) => Boolean(nodeRef.current && nodeRef.current.contains(t as Node)),
      isDismissible: () => ref.current._dismissible,
      requestClose: () => ref.current._close(),
    };
  }
  ref.current._dismissible = dismissible;
  ref.current._close = requestClose;

  useLayoutEffect(() => {
    const entry = ref.current;
    if (ovStack.length === 0) document.addEventListener('keydown', ovOnDocKeyDown);
    ovStack.push(entry);
    if (nodeRef.current) nodeRef.current.style.zIndex = 'calc(var(--layer-overlay) + ' + (ovStack.length - 1) + ')';
    return () => {
      const i = ovStack.indexOf(entry);
      if (i >= 0) ovStack.splice(i, 1);
      if (ovStack.length === 0) document.removeEventListener('keydown', ovOnDocKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref.current;
}

function useOutsidePress({
  entry,
  refs,
  enabled,
  onPress,
}: {
  entry: OverlayEntry;
  refs: RefObject<HTMLElement>[];
  enabled: boolean;
  onPress: () => void;
}) {
  const latest = useRef<{ enabled: boolean; onPress: () => void }>(null);
  latest.current = { enabled, onPress };
  useEffect(() => {
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

function ovCloneTrigger(
  trigger: ReactElement | null,
  {
    open,
    onPress,
    panelId,
    haspopup,
    triggerRef,
  }: { open: boolean; onPress: () => void; panelId: string; haspopup: string; triggerRef: RefObject<HTMLElement> },
): ReactElement | null {
  if (!trigger) return null;
  const own = trigger.props as { onClick?: (...args: unknown[]) => void };
  const ownRef = (trigger as ReactElement & { ref?: Ref<HTMLElement> }).ref;
  return cloneElement(trigger, {
    'aria-haspopup': haspopup,
    'aria-expanded': open,
    'aria-controls': open ? panelId : undefined,
    onClick: (...args: unknown[]) => {
      own.onClick?.(...args);
      onPress();
    },
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
      if (typeof ownRef === 'function') ownRef(node);
      else if (ownRef) ownRef.current = node;
    },
  } as Partial<typeof trigger.props>);
}

function OverlayPortal({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  if (typeof document !== 'undefined' && !hostRef.current) {
    hostRef.current = document.createElement('div');
    hostRef.current.setAttribute('data-overlay-root', '');
  }
  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    document.body.appendChild(el);
    return () => el.remove();
  }, []);
  if (!hostRef.current) return null;
  return createPortal(children, hostRef.current);
}

export { ovIsTop, ovInOverlayAbove, useOverlayEntry, useOutsidePress, ovCloneTrigger, OverlayPortal };
export type { OverlayEntry };
