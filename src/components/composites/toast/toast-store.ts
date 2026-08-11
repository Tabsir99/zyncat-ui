// toast-store - the Toast machinery: queue, clocks, coalescing, imperative API (zero React).

export type ToastTone = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading' | 'custom';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string | number;
  duration?: number;
  description?: string | null;
  action?: ToastAction | null;
}

export interface ToastRecord {
  id: string;
  tone: ToastTone;
  message: string | null;
  description: string | null;
  action: ToastAction | null;
  duration: number;
  remaining: number;
  count: number;
  timerKey: number;
  node: unknown; // a React node, kept opaque so this module stays React-free
  dismissible: boolean;
  expiresAt?: number;
}

export interface ToastSnapshot {
  toasts: ToastRecord[];
  paused: boolean;
  expanded: boolean;
}

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

/* Root-level options - set once on <Toaster /> and read by the queue + host. */
export interface ToasterConfig {
  position: ToastPosition;
  duration: number; // default auto-dismiss ms for timed tones; 0 keeps the per-tone defaults
  visibleToasts: number; // cards shown before the rest recede behind
  gap: number; // px between cards; 0 reads --space-3 from the stylesheet
  offset: number; // px inset from the viewport edge; 0 reads --space-6
  expand: boolean; // start the stack fanned open instead of collapsed
}

export const DEFAULT_TOASTER_CONFIG: ToasterConfig = {
  position: 'bottom-right',
  duration: 0,
  visibleToasts: 3,
  gap: 0,
  offset: 0,
  expand: false,
};

const DURATION: Record<string, number> = {
  default: 5000,
  success: 5000,
  info: 5000,
  warning: 8000,
  error: 8000,
  loading: Infinity, // sticky until updated/dismissed
};

let uid = 0;
const timers = new Map<string, ReturnType<typeof setTimeout>>();

interface ToastStore {
  toasts: ToastRecord[];
  paused: boolean;
  expanded: boolean;
  mounted: boolean; // a <Toaster /> is live; toasts no-op until it is
  config: ToasterConfig;
  snap: ToastSnapshot;
  listeners: Set<() => void>;
  subscribe(l: () => void): () => void;
  get(): ToastSnapshot;
  emit(): void;
  add(t: ToastRecord): string;
  update(id: string, patch: Partial<ToastRecord>): string;
  dismiss(id?: string | null): void;
  schedule(t: ToastRecord): void;
  pause(): void;
  resume(): void;
  setExpanded(v: boolean): void;
}

/* Store - the queue; the API writes, the host renders. */
const store: ToastStore = {
  toasts: [],
  paused: false,
  expanded: false,
  mounted: false,
  config: { ...DEFAULT_TOASTER_CONFIG },
  snap: { toasts: [], paused: false, expanded: false },
  listeners: new Set(),
  subscribe(l) {
    store.listeners.add(l);
    return () => store.listeners.delete(l);
  },
  get: () => store.snap,
  emit() {
    store.snap = { toasts: store.toasts.slice(), paused: store.paused, expanded: store.expanded };
    store.listeners.forEach((l) => l());
  },

  add(t) {
    // coalesce: an identical visible toast becomes a xN counter instead of a duplicate
    const twin = store.toasts.find(
      (x) => !x.node && !t.node && x.tone === t.tone && x.message === t.message && x.description === t.description,
    );
    if (twin) return store.update(twin.id, { count: twin.count + 1 });
    store.toasts.push(t);
    store.schedule(t);
    store.emit();
    return t.id;
  },

  update(id, patch) {
    const t = store.toasts.find((x) => x.id === id);
    if (!t) return id;
    Object.assign(t, patch);
    if ('tone' in patch || 'duration' in patch || 'count' in patch) {
      t.remaining = t.duration;
      t.timerKey++; // re-key the ring so it re-fills
      store.schedule(t);
    }
    store.emit();
    return id;
  },

  dismiss(id) {
    const gone = id == null ? store.toasts : store.toasts.filter((t) => t.id === id);
    gone.forEach((t) => {
      clearTimeout(timers.get(t.id));
      timers.delete(t.id);
    });
    store.toasts = id == null ? [] : store.toasts.filter((t) => t.id !== id);
    store.emit();
  },

  schedule(t) {
    clearTimeout(timers.get(t.id));
    timers.delete(t.id);
    if (!isFinite(t.duration)) return;
    if (store.paused) return; // resume() picks it up with t.remaining
    t.expiresAt = performance.now() + t.remaining;
    timers.set(
      t.id,
      setTimeout(() => store.dismiss(t.id), t.remaining),
    );
  },

  pause() {
    // freeze every clock, remember what's left
    if (store.paused) return;
    store.paused = true;
    store.toasts.forEach((t) => {
      if (timers.has(t.id)) {
        clearTimeout(timers.get(t.id));
        timers.delete(t.id);
        t.remaining = Math.max(0, (t.expiresAt ?? performance.now()) - performance.now());
      }
    });
    store.emit();
  },

  resume() {
    if (!store.paused) return;
    store.paused = false;
    store.toasts.forEach((t) => store.schedule(t));
    store.emit();
  },

  setExpanded(v) {
    if (v === store.expanded) return;
    store.expanded = v;
    store.emit();
  },
};

let warned = false;
let warnScheduled = false;

/* A toast with no <Toaster /> mounted renders nothing. Warn once, deferred a tick so a
   toast fired during the same render that mounts <Toaster /> is not a false positive. */
function warnIfDetached(): void {
  if (store.mounted || warned || warnScheduled || typeof window === 'undefined') return;
  warnScheduled = true;
  setTimeout(() => {
    warnScheduled = false;
    if (store.mounted || warned) return;
    warned = true;
    console.warn(
      'zyncat-ui: a toast was triggered but no <Toaster /> is mounted, so nothing will render. Mount <Toaster /> once near your app root.',
    );
  });
}

/* Per-tone default unless the root sets a global duration; loading stays sticky (Infinity). */
function resolveDuration(tone: ToastTone, opt?: number): number {
  if (opt != null) return opt;
  const toneDefault = DURATION[tone];
  if (toneDefault === Infinity || store.config.duration <= 0) return toneDefault;
  return store.config.duration;
}

function make(tone: ToastTone, message: string | null, opts: ToastOptions = {}): string {
  warnIfDetached();
  const id = opts.id != null ? String(opts.id) : 'toast-' + ++uid;
  const duration = resolveDuration(tone, opts.duration);
  if (store.toasts.some((t) => t.id === id)) {
    return store.update(id, {
      tone,
      message,
      duration,
      description: opts.description != null ? opts.description : null,
      action: opts.action != null ? opts.action : null,
    });
  }
  return store.add({
    id,
    tone,
    message,
    description: opts.description != null ? opts.description : null,
    action: opts.action != null ? opts.action : null,
    duration,
    remaining: duration,
    count: 1,
    timerKey: 0,
    node: null,
    dismissible: true,
  });
}

type PromiseMsg<V> = string | ((v: V) => string);
export interface ToastPromiseMsgs<T> {
  loading?: string;
  success?: PromiseMsg<T>;
  error?: PromiseMsg<unknown>;
}

export interface ToastApi {
  (message: string, opts?: ToastOptions): string;
  success(m: string, o?: ToastOptions): string;
  error(m: string, o?: ToastOptions): string;
  warning(m: string, o?: ToastOptions): string;
  info(m: string, o?: ToastOptions): string;
  loading(m: string, o?: ToastOptions): string;
  dismiss(id?: string | null): void;
  update(id: string, patch?: Partial<ToastRecord>): string;
  promise<T>(promise: Promise<T>, msgs?: ToastPromiseMsgs<T>): Promise<T>;
  custom(node: unknown, opts?: { id?: string | number; duration?: number; dismissible?: boolean }): string;
}

const toast = ((message: string, opts?: ToastOptions) => make('default', message, opts)) as ToastApi;
toast.success = (m, o) => make('success', m, o);
toast.error = (m, o) => make('error', m, o);
toast.warning = (m, o) => make('warning', m, o);
toast.info = (m, o) => make('info', m, o);
toast.loading = (m, o) => make('loading', m, o);
toast.dismiss = (id) => store.dismiss(id);

toast.update = (id, patch = {}) => {
  // a tone change without an explicit duration adopts that tone's clock
  if (patch.tone && patch.duration == null) patch = { ...patch, duration: DURATION[patch.tone] };
  return store.update(id, patch);
};

toast.promise = function <T>(promise: Promise<T>, msgs: ToastPromiseMsgs<T> = {}): Promise<T> {
  const id = make('loading', msgs.loading != null ? msgs.loading : 'Working...');
  const text = <V>(m: PromiseMsg<V> | undefined, fallback: string, v: V): string =>
    typeof m === 'function' ? (m as (x: V) => string)(v) : m != null ? m : fallback;
  promise.then(
    (v) => toast.update(id, { tone: 'success', message: text(msgs.success, 'Done', v) }),
    (e) => toast.update(id, { tone: 'error', message: text(msgs.error, 'Something went wrong', e) }),
  );
  return promise;
};

toast.custom = (node, opts = {}) => {
  warnIfDetached();
  const id = opts.id != null ? String(opts.id) : 'toast-' + ++uid;
  const duration = opts.duration != null ? opts.duration : Infinity;
  if (store.toasts.some((t) => t.id === id)) return store.update(id, { node });
  return store.add({
    id,
    tone: 'custom',
    node,
    message: null,
    description: null,
    action: null,
    duration,
    remaining: duration,
    count: 1,
    timerKey: 0,
    dismissible: opts.dismissible === true,
  });
};

export { toast };
export const UIToast = store;
