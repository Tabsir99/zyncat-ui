const SLOTS = Symbol.for('zyncat.ui.shared-slots');

type SlotHost = { [SLOTS]?: Map<string, unknown> };

export function sharedSlot<T>(key: string, create: () => T): T {
  const host = globalThis as SlotHost;
  const slots = (host[SLOTS] ??= new Map<string, unknown>());
  if (!slots.has(key)) slots.set(key, create());
  return slots.get(key) as T;
}
