'use client';

import { createElement, useCallback, useRef, type ReactNode, type Ref } from 'react';
import { useSelfFlip, useSharedFlip, type FlipTuning } from './flip';
import { useMotion, type MotionSpecs } from './use-motion';

export interface MotionProps extends MotionSpecs {
  /** Tag for the element this renders. @default 'div' */
  as?: string;
  /** FLIP this element from its previous box on every render; an object tunes the timing. */
  layout?: boolean | FlipTuning;
  /** FLIP from whatever element last held this id, so the box travels between nodes. */
  layoutId?: string;
  ref?: Ref<HTMLElement | null>;
  children?: ReactNode;
  [prop: string]: unknown;
}

export function Motion({
  as = 'div',
  animate,
  exit,
  initial,
  deps,
  layout,
  layoutId,
  ref,
  children,
  ...rest
}: MotionProps) {
  const tuning = typeof layout === 'object' ? layout : {};
  const selfRef = useSelfFlip<HTMLElement>(tuning, !!layout && !layoutId);
  const sharedRef = useSharedFlip<HTMLElement>(layoutId ?? '', tuning, !!layoutId);
  const host = useRef<HTMLElement | null>(null);
  const forwarded = useRef(ref);
  forwarded.current = ref;

  useMotion(host, { animate, exit, initial, deps });

  const attach = useCallback(
    (el: HTMLElement | null) => {
      host.current = el;
      selfRef.current = el;
      sharedRef.current = el;
      const outer = forwarded.current;
      if (typeof outer === 'function') outer(el);
      else if (outer) outer.current = el;
    },
    [selfRef, sharedRef],
  );

  return createElement(as, { ...rest, ref: attach }, children);
}
