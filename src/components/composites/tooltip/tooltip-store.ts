'use client';

import { type ReactNode } from 'react';

import { sharedSlot } from '../../../shared-slot';
import { hostRegistry, useElectedHost } from '../../internal/hooks/use-host-election';

export type Placement = 'top' | 'bottom' | 'left' | 'right';

export interface ActivePayload {
  id: string;
  content: ReactNode;
  shortcut?: string | null;
  placement: Placement;
  anchor: () => HTMLElement | null;
  dismiss: () => void;
}

export const OPEN_DELAY = 350;
export const CLOSE_GRACE = 140;
export const TOOLTIP_DOM_ID = 'pds-tooltip';
const WARM_WINDOW = 300;

export const store = sharedSlot('tooltip.store@1', () => ({
  stack: [] as ActivePayload[],
  described: null as HTMLElement | null,
  timers: new Map<string, ReturnType<typeof setTimeout>>(),
  warmUntil: 0,
  listeners: new Set<() => void>(),
  get: (): ActivePayload | null => store.stack[store.stack.length - 1] ?? null,
  subscribe(l: () => void) {
    store.listeners.add(l);
    return () => store.listeners.delete(l);
  },
  emit() {
    const el = store.get()?.anchor() ?? null;
    if (el !== store.described) {
      store.described?.removeAttribute('aria-describedby');
      store.described = el;
      el?.setAttribute('aria-describedby', TOOLTIP_DOM_ID);
    }
    store.listeners.forEach((l) => l());
  },
  isWarm: () => store.stack.length > 0 || performance.now() < store.warmUntil,
  open(payload: ActivePayload) {
    clearTimeout(store.timers.get(payload.id));
    const at = store.stack.findIndex((entry) => entry.id === payload.id);
    if (at < 0) store.stack.push(payload);
    else store.stack[at] = payload;
    store.emit();
  },
  close(id: string, grace = CLOSE_GRACE) {
    clearTimeout(store.timers.get(id));
    const drop = () => {
      store.timers.delete(id);
      const at = store.stack.findIndex((entry) => entry.id === id);
      if (at < 0) return;
      store.stack.splice(at, 1);
      if (!store.stack.length) store.warmUntil = performance.now() + WARM_WINDOW;
      store.emit();
    };
    if (grace > 0) store.timers.set(id, setTimeout(drop, grace));
    else drop();
  },
  dismiss() {
    for (const entry of store.stack.slice()) entry.dismiss();
  },
}));

const hostReg = hostRegistry('tooltip.host@1');

export function useHostElection(): boolean {
  return useElectedHost(hostReg, 'tip-host');
}
