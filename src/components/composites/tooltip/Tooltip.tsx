'use client';

import './tooltip.css';
import {
  Children,
  Fragment,
  useEffect,
  useId,
  useRef,
  type FocusEvent,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cloneTrigger } from '../../internal/overlay/layer';
import { store, useHostElection, OPEN_DELAY, CLOSE_GRACE, type Placement } from './tooltip-store';
import { TooltipHost } from './tooltip-host';
import type { DataAttributes } from '../../../dom-props';

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
  /** Standard <span> attributes forwarded to the anchor wrapper (default mode only; ignored with `asChild`, which has no wrapper). */
  htmlProps?: HTMLAttributes<HTMLSpanElement> & DataAttributes;
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
  htmlProps,
}: TooltipProps) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | 0>(0);
  const myId = id || 'tip-' + useId();
  const isHost = useHostElection();

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

  if (!asChild) {
    return (
      <Fragment>
        <span
          {...htmlProps}
          ref={wrapRef}
          className={htmlProps?.className ? 'tooltip-anchor ' + htmlProps.className : 'tooltip-anchor'}
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
