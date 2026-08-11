'use client';

import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactElement,
  type ReactNode,
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

function cloneTrigger(
  child: ReactElement,
  props: Record<string, unknown>,
  setNode?: (node: HTMLElement | null) => void,
): ReactElement {
  const own = child.props as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...props };
  for (const key of Object.keys(props)) {
    const mine = props[key];
    const theirs = own[key];
    if (key.startsWith('on') && typeof mine === 'function' && typeof theirs === 'function') {
      merged[key] = (...args: unknown[]) => {
        (theirs as (...a: unknown[]) => void)(...args);
        (mine as (...a: unknown[]) => void)(...args);
      };
    }
  }
  if (setNode) {
    const childRef = (child as ReactElement & { ref?: unknown }).ref;
    merged.ref = (node: HTMLElement | null) => {
      setNode(node);
      if (typeof childRef === 'function') childRef(node);
      else if (childRef && typeof childRef === 'object') (childRef as { current: unknown }).current = node;
    };
  }
  return cloneElement(child, merged);
}

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
  }: { open: boolean; onPress: () => void; panelId: string; haspopup: string; triggerRef: RefObject<HTMLElement> },
): ReactElement | null {
  if (!trigger) return null;
  return cloneTrigger(
    trigger,
    { 'aria-haspopup': haspopup, 'aria-expanded': open, 'aria-controls': open ? panelId : undefined, onClick: onPress },
    (node) => {
      triggerRef.current = node;
    },
  );
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

export {
  ovIsTop,
  ovInOverlayAbove,
  useOverlayEntry,
  useOutsidePress,
  cloneTrigger,
  ovCloneTrigger,
  ovResolveChildren,
  OverlayPortal,
};
export type { OverlayEntry };
