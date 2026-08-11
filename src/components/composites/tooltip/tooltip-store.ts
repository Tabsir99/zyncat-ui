'use client';

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface ActivePayload {
  id: string;
  content: ReactNode;
  shortcut?: string | null;
  placement: Placement;
  rect: () => DOMRect;
}

export const OPEN_DELAY = 350;
export const CLOSE_GRACE = 140;
const WARM_WINDOW = 300;

export const store = {
  active: null as ActivePayload | null,
  closeTimer: 0 as ReturnType<typeof setTimeout> | 0,
  warmUntil: 0,
  listeners: new Set<() => void>(),
  get: () => store.active,
  subscribe(l: () => void) {
    store.listeners.add(l);
    return () => store.listeners.delete(l);
  },
  emit() {
    store.listeners.forEach((l) => l());
  },
  isWarm: () => store.active !== null || performance.now() < store.warmUntil,
  open(payload: ActivePayload) {
    clearTimeout(store.closeTimer);
    store.active = payload;
    store.emit();
  },
  close(id: string, grace = CLOSE_GRACE) {
    clearTimeout(store.closeTimer);
    store.closeTimer = setTimeout(() => {
      if (store.active && store.active.id === id) store.closeNow();
    }, grace);
  },
  closeNow() {
    clearTimeout(store.closeTimer);
    if (!store.active) return;
    store.warmUntil = performance.now() + WARM_WINDOW;
    store.active = null;
    store.emit();
  },
};

const hostReg = {
  keys: [] as symbol[],
  listeners: new Set<() => void>(),
  subscribe(l: () => void) {
    hostReg.listeners.add(l);
    return () => hostReg.listeners.delete(l);
  },
  register(k: symbol) {
    hostReg.keys.push(k);
    hostReg.listeners.forEach((l) => l());
    return () => {
      const i = hostReg.keys.indexOf(k);
      if (i >= 0) hostReg.keys.splice(i, 1);
      hostReg.listeners.forEach((l) => l());
    };
  },
};

export function useHostElection(): boolean {
  const keyRef = useRef<symbol | null>(null);
  if (!keyRef.current) keyRef.current = Symbol('tip-host');
  useEffect(() => hostReg.register(keyRef.current!), []);
  return useSyncExternalStore(
    hostReg.subscribe,
    () => hostReg.keys[0] === keyRef.current,
    () => false,
  );
}
