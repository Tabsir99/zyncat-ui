'use client';

/* Tooltip - a transient, non-interactive hint on hover/focus (one shared bubble).
   This file is just the trigger: the shared bubble lives in tooltip-host, its state +
   host election in tooltip-store. */
import './tooltip.css';
import {
  Children,
  Fragment,
  useEffect,
  useId,
  useRef,
  type FocusEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cloneTrigger } from '../../internal/overlay/layer';
import { store, useHostElection, OPEN_DELAY, CLOSE_GRACE, type Placement } from './tooltip-store';
import { TooltipHost } from './tooltip-host';

/* Trigger - reports to the store; default wraps the child in a display:contents anchor (any element, no ref), asChild clones instead. */
export interface TooltipProps {
  /** The hint - a string or small node; never interactive content. */
  content: ReactNode;
  /** Optional keyboard hint, rendered as mono metadata ("⌘↩", "S"). */
  shortcut?: string | null;
  /** Preferred side; flips automatically when out of viewport room. */
  placement?: Placement;
  /** Suppress the tooltip entirely (trigger renders untouched). */
  disabled?: boolean;
  /** ms before a cold hover shows; warm hovers + focus are instant. Default 350. */
  openDelay?: number;
  /** ms the bubble lingers after leaving (bridges moving to a neighbour). Default 140. */
  closeDelay?: number;
  /** Skip the wrapper - clone the child and merge handlers + ref onto it (child must take a ref). Default false. */
  asChild?: boolean;
  /** Stable id for this trigger's store entry + `aria-describedby`. Auto-generated when omitted. */
  id?: string;
  /** Exactly one element; any element works by default, asChild requires one that accepts a ref. */
  children: ReactElement;
}

function Tooltip({
  content,
  shortcut = null,
  placement = 'top',
  disabled = false,
  openDelay = OPEN_DELAY,
  closeDelay = CLOSE_GRACE,
  asChild = false,
  id,
  children,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const myId = id || 'tip-' + useId();
  const isHost = useHostElection();

  // The element we anchor to + set aria-describedby on (clone, or the wrapper's child).
  const anchorEl = (): HTMLElement | null =>
    asChild ? triggerRef.current : ((wrapRef.current?.firstElementChild as HTMLElement) ?? null);

  useEffect(
    () => () => {
      clearTimeout(openTimer.current);
      store.close(myId, 0);
    },
    [],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  function show(immediate: boolean) {
    if (disabled) return;
    clearTimeout(openTimer.current);
    const el = anchorEl();
    if (!el) return;
    el.setAttribute('aria-describedby', 'pds-tooltip');
    const open = () =>
      store.open({ id: myId, content, shortcut, placement, rect: () => anchorEl()!.getBoundingClientRect() });
    if (immediate || store.isWarm()) open();
    else openTimer.current = setTimeout(open, openDelay);
  }
  function hide() {
    clearTimeout(openTimer.current);
    const el = anchorEl();
    if (el) el.removeAttribute('aria-describedby');
    store.close(myId, closeDelay);
  }

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== 'touch') show(false);
  };
  const onFocusIn = (e: FocusEvent) => {
    if ((e.target as HTMLElement).matches(':focus-visible')) show(true);
  };

  // Default: a display:contents wrapper carries the listeners + rect; the child needs no ref.
  // The elected host mounts as a SIBLING - portal events bubble through the React tree, so
  // nesting it inside the anchor would feed the bubble's own pointer events back into show/hide.
  if (!asChild) {
    return (
      <Fragment>
        <span
          ref={wrapRef}
          className="tooltip-anchor"
          onPointerEnter={onEnter}
          onPointerLeave={hide}
          onPointerDown={hide}
          onFocus={onFocusIn}
          onBlur={hide}
        >
          {children}
        </span>
        {isHost && <TooltipHost />}
      </Fragment>
    );
  }

  // asChild: clone the child, merging our handlers + ref (a press dismisses: activating != hinting).
  return (
    <Fragment>
      {cloneTrigger(
        Children.only(children),
        { onPointerEnter: onEnter, onPointerLeave: hide, onPointerDown: hide, onFocus: onFocusIn, onBlur: hide },
        (node) => {
          triggerRef.current = node;
        },
      )}
      {isHost && <TooltipHost />}
    </Fragment>
  );
}

export { Tooltip };
