'use client';

/* layer - the css-free layering primitives every floating surface shares:
   a body-portal host, the overlay stack (Escape + focus-trap deference), light
   dismiss, and the trigger/children contracts. Popover, Sheet and Dialog build
   on top; select/core mounts its menu through here so ancestor transforms
   can't hijack its coords. */
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

/* The overlay stack: one Esc listener closes only the topmost dismissible, and defers to inner handlers that already consumed the key (defaultPrevented). */
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

/* true if `target` sits in an overlay opened after `entry` (a nested child owns it). */
function ovInOverlayAbove(entry: OverlayEntry, target: EventTarget | null) {
  const i = ovStack.indexOf(entry);
  return i >= 0 && ovStack.slice(i + 1).some((e) => e.contains(target));
}

/* Join the stack for the panel's lifetime; set z = --layer-overlay + depth. */
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
    if (nodeRef.current)
      nodeRef.current.style.zIndex = 'calc(var(--layer-overlay) + ' + (ovStack.length - 1) + ')';
    return () => {
      const i = ovStack.indexOf(entry);
      if (i >= 0) ovStack.splice(i, 1);
      if (ovStack.length === 0) document.removeEventListener('keydown', ovOnDocKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref.current;
}

/* Light dismiss - close on a press outside the panel, trigger, and any overlay above. */
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

/* Clone a trigger element, merging handlers/aria onto it: `on*` props chain AFTER the
   child's own, everything else overrides, and `setNode` composes with the child's ref
   (fn or object, incl. React 19 ref-as-prop). Overlay and Tooltip both clone through here. */
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
      else if (childRef && typeof childRef === 'object')
        (childRef as { current: unknown }).current = node;
    };
  }
  return cloneElement(child, merged);
}

/* Children can be a node or a { close } render-prop - the contract every triggered surface shares. */
function ovResolveChildren(
  children: ReactNode | ((api: { close: () => void }) => ReactNode),
  close: () => void,
): ReactNode {
  return typeof children === 'function' ? children({ close }) : children;
}

/* The popup-trigger contract on top of cloneTrigger: press-to-open plus aria-haspopup/-expanded/-controls, with the node captured for anchoring. */
function ovCloneTrigger(
  trigger: ReactElement | null,
  {
    open,
    onPress,
    panelId,
    haspopup,
    triggerRef,
  }: {
    open: boolean;
    onPress: () => void;
    panelId: string;
    haspopup: string;
    triggerRef: RefObject<HTMLElement>;
  },
): ReactElement | null {
  if (!trigger) return null;
  return cloneTrigger(
    trigger,
    {
      onClick: onPress,
      'aria-haspopup': haspopup,
      'aria-expanded': open,
      'aria-controls': open ? panelId : undefined,
    },
    (node) => {
      triggerRef.current = node;
    },
  );
}

/* Per-instance <body> host (escapes ancestor transforms; skipped by inert); persists across open/close so AnimatePresence can play exits. */
function OverlayPortal({ children }: { children: ReactNode }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  // SSR guard: reached during server render; hooks below stay unconditional.
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
