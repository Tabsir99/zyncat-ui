'use client';

import * as React from 'react';

export interface ScrollEdges {
  /** More content above / below / left / right of the viewport (1px tolerance). */
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
}

/* One scroll-edge watcher for the data-attr patterns (dialog header lift, table pin cast,
   tabs edge fades): syncs on scroll + element resize (+ first child with `content`, for
   scrollWidth/Height changes the box itself doesn't see), and hands the consumer the raw
   element so it can derive its own attributes. Returns the sync fn for imperative re-runs. */
export function useScrollEdges(
  ref: React.RefObject<HTMLElement | null>,
  onChange: (edges: ScrollEdges, el: HTMLElement) => void,
  { content = false }: { content?: boolean } = {},
): () => void {
  const cb = React.useRef(onChange);
  cb.current = onChange;
  const sync = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cb.current(
      {
        top: el.scrollTop > 1,
        bottom: el.scrollTop + el.clientHeight < el.scrollHeight - 1,
        left: el.scrollLeft > 1,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      },
      el,
    );
  }, [ref]);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    if (content && el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener('scroll', sync);
      ro.disconnect();
    };
  }, [sync, content]);
  return sync;
}
