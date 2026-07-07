'use client';

/* Roving-focus plumbing shared by the calendar panels: seed focus into the
   grid on mount (the panel portals to <body>, unreachable from the trigger),
   then chase focusKey across re-renders - but only for moves the caller armed
   (keyboard travel, today-jump), never on plain re-paints. Returns the arm(). */
import { useEffect, useRef, type RefObject } from 'react';

export function useDayFocus(
  daysRef: RefObject<HTMLDivElement | null>,
  focusKey: string,
  viewDep?: number,
  seedSelector?: string,
): () => void {
  const pending = useRef(false);

  useEffect(() => {
    const el = daysRef.current;
    if (!el) return;
    const btn =
      (seedSelector && el.querySelector(seedSelector)) ||
      el.querySelector('[data-key="' + focusKey + '"]:not(:disabled)') ||
      el.querySelector('.dtp__day:not(:disabled)');
    if (btn) (btn as HTMLElement).focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pending.current || !daysRef.current) return;
    pending.current = false;
    const btn = daysRef.current.querySelector('[data-key="' + focusKey + '"]');
    if (btn) (btn as HTMLElement).focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusKey, viewDep]);

  return () => {
    pending.current = true;
  };
}
