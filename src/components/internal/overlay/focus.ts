'use client';

/* focus - how floating surfaces treat keyboard focus: return it to the opener
   when a surface closes (every surface), trap it inside while open (modals). */
import { useEffect, type RefObject } from 'react';
import { type OverlayEntry, ovIsTop, ovInOverlayAbove } from './layer';

/* Restore focus to the opener on unmount, but only if it would otherwise be lost; a microtask dodges the inert-release ordering race. */
export function useReturnFocus(nodeRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    return () => {
      const a = document.activeElement;
      const orphaned = !a || a === document.body || (nodeRef.current && nodeRef.current.contains(a));
      if (orphaned && prev && prev.isConnected && typeof prev.focus === 'function') {
        queueMicrotask(() => {
          if (prev.isConnected) prev.focus({ preventScroll: true });
        });
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

const OV_FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/* Hard focus trap: seed in, cycle Tab inside, recapture stray focus unless not topmost or it's in an overlay above. */
export function useFocusTrap({ panelRef, entry }: { panelRef: RefObject<HTMLElement>; entry: OverlayEntry }) {
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(OV_FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

    const seed = panel.querySelector<HTMLElement>('[autofocus], [data-autofocus]') || focusables()[0] || panel;
    seed.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const f = focusables();
      if (f.length === 0) {
        e.preventDefault();
        return;
      }
      const cur = document.activeElement;
      if (e.shiftKey) {
        if (cur === f[0] || cur === panel) {
          e.preventDefault();
          f[f.length - 1].focus();
        }
      } else if (cur === f[f.length - 1]) {
        e.preventDefault();
        f[0].focus();
      }
    };
    const onFocusIn = (e: FocusEvent) => {
      if (panel.contains(e.target as Node)) return;
      if (!ovIsTop(entry) || ovInOverlayAbove(entry, e.target)) return;
      (focusables()[0] || panel).focus({ preventScroll: true });
    };

    panel.addEventListener('keydown', onKeyDown);
    document.addEventListener('focusin', onFocusIn);
    return () => {
      panel.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
