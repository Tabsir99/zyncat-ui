'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

import { sharedSlot } from '../../../shared-slot';

export interface HostRegistry {
  keys: symbol[];
  listeners: Set<() => void>;
  subscribe(l: () => void): () => void;
  register(k: symbol): () => void;
}

export function hostRegistry(slot: string): HostRegistry {
  return sharedSlot(slot, () => {
    const reg: HostRegistry = {
      keys: [],
      listeners: new Set(),
      subscribe(l) {
        reg.listeners.add(l);
        return () => reg.listeners.delete(l);
      },
      register(k) {
        reg.keys.push(k);
        reg.listeners.forEach((l) => l());
        return () => {
          const at = reg.keys.indexOf(k);
          if (at >= 0) reg.keys.splice(at, 1);
          reg.listeners.forEach((l) => l());
        };
      },
    };
    return reg;
  });
}

export function useElectedHost(reg: HostRegistry, label: string): boolean {
  const keyRef = useRef<symbol | null>(null);
  if (!keyRef.current) keyRef.current = Symbol(label);
  useEffect(() => reg.register(keyRef.current!), [reg]);
  return useSyncExternalStore(
    reg.subscribe,
    () => reg.keys[0] === keyRef.current,
    () => false,
  );
}
